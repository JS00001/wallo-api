import mongoose from 'mongoose';

import { ILesson, QuestionType } from './@types';

const lessonSchema = new mongoose.Schema<ILesson>(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    content: { type: [String], required: true },
    questions: [
      {
        question: { type: String, required: true },
        type: { type: String, enum: QuestionType, required: true },
        answers: [
          {
            answer: { type: String, required: true },
            correct: { type: Boolean, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);
