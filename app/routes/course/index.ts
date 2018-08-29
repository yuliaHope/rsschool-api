import * as Router from 'koa-router';
import { CourseModel } from '../../models';
import { createGetRoute, createPostRoute } from '../generic';

import { courseAssignMentorsRoute } from './assignMentors';
import { courseEnrollRoute } from './enroll';
import { courseEventsRoute } from './events';
import { courseStagesRoute } from './stages';
import { courseStudentsRoute } from './students';
import { courseImportMentorsRoute, courseImportStudentsRoute } from './import';
import { courseAssignmentGetRoute, courseAssignmentPatchRoute } from './assignment';

export function courseRouter(adminGuard: Router.IMiddleware) {
    const router = new Router({ prefix: '/course' });

    router.get('/:id', createGetRoute(CourseModel, { useObjectId: false }));
    router.post('/', createPostRoute(CourseModel));

    router.post('/:id/enroll', courseEnrollRoute);
    router.get('/:id/events', courseEventsRoute);
    router.get('/:id/stages', courseStagesRoute);

    router.get('/:id/students', adminGuard, courseStudentsRoute);
    router.post('/:id/mentors/assign', adminGuard, courseAssignMentorsRoute);
    router.post('/:id/import/mentors', adminGuard, courseImportMentorsRoute);
    router.post('/:id/import/studens', adminGuard, courseImportStudentsRoute);

    router.get('/:courseId/assignment/', courseAssignmentGetRoute);
    router.patch('/:courseId/assignment/', courseAssignmentPatchRoute);

    return router;
}
