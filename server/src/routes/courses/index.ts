import { OK } from 'http-status-codes';
import Router from '@koa/router';
import { getRepository } from 'typeorm';
import { ILogger } from '../../logger';
import { Course } from '../../models';
import { guard } from '../guards';
import { setResponse } from '../utils';

const getCourses = (_: ILogger) => async (ctx: Router.RouterContext) => {
  const courses = await getRepository(Course)
    .createQueryBuilder('course')
    .leftJoinAndSelect('course.discordServer', 'discordServer')
    .orderBy('course."startDate"', 'DESC')
    .getMany();
  setResponse(ctx, OK, courses);
};

export function coursesRoute(logger: ILogger) {
  const router = new Router<any, any>({ prefix: '/courses' });
  router.get('/', guard, getCourses(logger));

  return router;
}
