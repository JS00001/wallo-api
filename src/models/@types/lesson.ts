import { HydratedDocument, Types } from 'mongoose';

export enum QuestionType {
  // Single correct answer, single selection
  Single = 'single',
  // Multiple correct answers, multiple selection
  Multiple = 'multiple',
}

/**
 * All internal fields stored about a lesson
 */
export interface ILesson {
  /** SYSTEM DATA */
  /** The id of the lesson */
  _id: Types.ObjectId;
  /** The course that the lesson belongs to */
  course: Types.ObjectId;
  /** The name of the lesson */
  name: string;
  /** The description of the lesson */
  description: string;
  /** The order of the lesson in the course, will sort by this when querying */
  order: number;

  /** LESSON CONTENT */
  /** The content of the lesson */
  content: string[];
  /** The questions of the lesson */
  questions: {
    /** The question */
    question: string;
    /** The type of question */
    type: QuestionType;
    /** The possible answers and whether they are correct */
    answers: {
      /** The answer */
      answer: string;
      /** Whether the answer is correct */
      correct: boolean;
    };
  }[];

  /** METADATA */
  /** The date the lesson was created */
  createdAt: Date;
  /** The date the lesson was last updated */
  updatedAt: Date;
}

/**
 * The lesson once populated and aggregated for a user
 */
export interface IPopulatedLesson extends ILesson {
  /** Whether the user has completed the lesson */
  completed: boolean;
  /** Whether the lesson is locked from starting */
  locked: boolean;
  /** The progress of the user in that lesson */
  progress: number;
  /** The total progress possible in that lesson */
  total: number;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type ILessonSchema = HydratedDocument<ILesson>;
