import Router from '@koa/router';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { getRepository } from 'typeorm';
import { ILogger } from '../../../logger';
import { TaskSolutionChecker } from '../../../models';
import { createCrossCheckPairs } from '../../../rules/distribution';
import { courseService, taskService } from '../../../services';
import { setResponse } from '../../utils';

const defaultPairsCount = 4;

export const createDistribution = (_: ILogger) => async (ctx: Router.RouterContext) => {
  const { courseTaskId } = ctx.params;

  const courseTask = await taskService.getCourseTask(courseTaskId);
  if (courseTask == null) {
    setResponse(ctx, BAD_REQUEST);
    return;
  }

  const solutions = await courseService.getTaskSolutionsWithoutChecker(courseTaskId);
  const solutionsMap = new Map<number, number>();
  for (const solution of solutions) {
    solutionsMap.set(solution.studentId, solution.id);
  }

  const students = Array.from(solutionsMap.keys());
  const pairs = createCrossCheckPairs(students, courseTask.pairsCount ?? defaultPairsCount);

  const crossCheckPairs = pairs
    .filter(pair => solutionsMap.has(pair.studentId))
    .map(pair => ({
      ...pair,
      courseTaskId,
      taskSolutionId: solutionsMap.get(pair.studentId),
    }));

  await getRepository(TaskSolutionChecker).save(crossCheckPairs);
  setResponse(ctx, OK, { crossCheckPairs });
};
