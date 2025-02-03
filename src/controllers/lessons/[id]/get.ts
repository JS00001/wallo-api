import { z } from 'zod';
import { Request } from 'express';

import Lesson from '@/models/lesson';
import validators from '@/lib/validators';
import { IResponse } from '@/lib/request';
import fileCache from '@/lib/cache/file-cache';
import { APIError, errorWrapper } from '@/lib/error';
import LessonProgress from '@/models/lesson-progress';
import { ILesson, ILessonProgress } from '@/models/@types';

type Response = IResponse<{
  lesson: ILesson;
  progress: ILessonProgress;
}>;

/**
 * Endpoint:     GET /api/v1/lessons/:id
 * Description:  Get a specific lesson's content
 */
export default async (req: Request): Promise<Response> => {
  const user = req.user!;
  const schema = z.object({
    id: validators.objectId,
  });

  const params = schema.safeParse(req.params);

  if (params.success === false) {
    throw new APIError({
      type: 'INVALID_FIELDS',
      traceback: 1,
      error: params.error,
    });
  }

  const { id } = params.data;

  // Check if lesson exists, and get the user's progress
  let [lesson, progress] = await errorWrapper(2, () => {
    return Promise.all([
      Lesson.findById(id),
      LessonProgress.findOne({ lesson: id, user: user._id }),
    ]);
  });

  if (!lesson) {
    throw new APIError({
      type: 'NOT_FOUND',
      traceback: 3,
      humanMessage: 'Lesson not found',
    });
  }

  // If the user has not started the lesson, create a new progress object
  // for tracking their progress
  if (!progress) {
    progress = await LessonProgress.create({
      course: lesson.course,
      lesson: lesson._id,
      user: user._id,
    });
  }

  // Fetch all of the ACTUAL content files for the lesson and add them to the lesson object
  const lessonContent = lesson.content.map((fileName) => {
    const fileContents = fileCache.get(`${lesson.course}-${fileName}`);

    if (!fileContents) {
      throw new APIError({
        type: 'INTERNAL_SERVER_ERROR',
        traceback: 4,
        humanMessage: `Could not fetch content file: ${fileName}`,
      });
    }

    return fileContents;
  });

  lesson.content = lessonContent;

  const response: Response = {
    data: {
      lesson,
      progress,
    },
  };

  return response;
};
