import mongoose from 'mongoose';

import { ILessonProgress } from './@types';

const lessonProgressSchema = new mongoose.Schema<ILessonProgress>(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentProgress: {
      index: { type: Number, default: 0 },
      time: { type: Date, default: Date.now },
    },
    questionProgress: {
      index: { type: Number, default: 0 },
      time: { type: Date, default: Date.now },
      correct: { type: Number, default: 0 },
      incorrect: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILessonProgress>(
  'LessonProgress',
  lessonProgressSchema,
);
