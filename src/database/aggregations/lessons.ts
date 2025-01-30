import { RootFilterQuery } from 'mongoose';

import Lesson from '@/models/lesson';
import { ILesson, IPopulatedLesson, IUserSchema } from '@/models/@types';

/**
 * Query from a user's lessons. Include each lesson for a course, along
 * with the user's progress, and how far the user has progressed in the course.
 */
const queryLessons = async (
  query: RootFilterQuery<ILesson>,
  user: IUserSchema,
) => {
  // prettier-ignore
  const lessons = await Lesson.aggregate<IPopulatedLesson>([
    // #region Match the lessons
    {
      $match: query,
    },
    // #endregion
    // #region Sort the results by their order
    {
      $sort: { order: 1 },
    },
    // #endregion
    // #region Get the user's progress for each lesson by matching the lesson id and user id,
    {
      $lookup: {
        from: 'lessonprogress',
        as: 'lessonprogress',
        let: { lessonId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', user._id] },
                  { $eq: ['$lesson', '$$lessonId'] },
                ],
              },
            },
          },
        ],
      },
    },
    // #endregion
    // #region Add both types of progress (content & quiz), and store as 'progress'
    {
      $addFields: {
        progress: {
          $cond: {
            if: { $ifNull: ['$lessonprogress', false] },
            then: {
              $add: [
                { $ifNull: [{ $arrayElemAt: ['$lessonprogress.contentProgress.index', 0] }, 0] },
                { $ifNull: [{ $arrayElemAt: ['$lessonprogress.questionProgress.index', 0] }, 0] },
              ],
            },
            else: 0,
          },
        },
      },
    },
    // #endregion
    // #region Add a field of 'total' to store the total content + total questions
    {
      $addFields: {
        total: {
          $add: [
            { $size: '$content'
            },
            { $size: '$questions' },
          ],
        },
      },
    },
    // #endregion
    // #region Add the 'completed' field to the lesson if progress == total content + total questions
    {
      $addFields: {
        completed: {
          $eq: [
            '$progress',
            {
              $add: [
                { $size: '$content' }, 
                { $size: '$questions' }
              ],
            },
          ],
        },
      },
    },
    // #endregion
    // #region Check if the previous lesson is completed to unlock the current lesson
    {
      $setWindowFields: {
        sortBy: { _id: 1 },
        output: {
          prevLessonCompleted: {
            $shift: { by: -1, output: '$completed' },
          },
        },
      },
    },
    // #endregion
    // #region Add the 'locked' field to the lesson if the previous lesson is not completed
    {
      $addFields: {
        locked: {
          $cond: {
            if: { $eq: ['$prevLessonCompleted', false] },
            then: true,
            else: false,
          },
        },
      },
    },
    // #endregion
    // #region Remove the lessonprogress and prevLessonCompleted fields
    {
      $project: {
        lessonprogress: 0,
        prevLessonCompleted: 0,
      },
    },
    // #endregion
  ]);

  return lessons;
};

const LessonsAggregation = {
  queryLessons,
};

export default LessonsAggregation;
