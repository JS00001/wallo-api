import { RootFilterQuery } from 'mongoose';

import Course from '@/models/course';
import { ICourse, IPopulatedCourse, IUserSchema } from '@/models/@types';

/**
 * Query from a user's courses. Include lessons, their progress
 * and the number of completed lessons.
 */
const queryCourses = async (
  query: RootFilterQuery<ICourse>,
  user: IUserSchema,
) => {
  const preferredCourses = user.preferredCourses;

  const courses = await Course.aggregate<IPopulatedCourse>([
    // #region Match the courses
    {
      $match: query,
    },
    // #region Get all lessons for this course
    {
      $lookup: {
        from: 'lessons',
        as: 'lessons',
        localField: '_id',
        foreignField: 'course',
      },
    },
    // #endregion
    // #region Get the number of completed lessons for this course
    {
      $lookup: {
        from: 'lessonprogress',
        as: 'completedLessons',
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$course', '$_id'] },
                  { $eq: ['$user', user._id] },
                  { $eq: ['$completed', true] },
                ],
              },
            },
          },
        ],
      },
    },
    // #endregion
    // #region Add the number of completed lessons and total lessons to the course object
    {
      $addFields: {
        totalLessons: { $size: '$lessons' },
        completedLessons: { $size: '$completedLessons' },
        priorityLesson: {
          $cond: { if: { $in: ['$_id', preferredCourses] }, then: 1, else: 0 },
        },
      },
    },
    // #endregion
    // #region Sort the responses
    {
      $sort: {
        priorityLesson: -1,
        title: 1,
      },
    },
    // #endregion
    // #region Remove the priorityLesson field that was used for sorting and lessons
    {
      $project: {
        lessons: 0,
        priorityLesson: 0,
      },
    },
    // #endregion
  ]);

  return courses;
};

const CourseAggregation = {
  queryCourses,
};

export default CourseAggregation;
