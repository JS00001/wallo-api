import { HydratedDocument, Types } from 'mongoose';

/**
 * All internal fields stored about a lesson's progress by a user
 */
export interface ILessonProgress {
  /** SYSTEM DATA */
  /** The id of the lesson */
  _id: Types.ObjectId;
  /** The course that the lesson belongs to */
  course: Types.ObjectId;
  /** The lesson that the progress belongs to */
  lesson: Types.ObjectId;
  /** The user that the progress belongs to */
  user: Types.ObjectId;

  /** PROGRESS DATA */
  /** Whether the user has completed the lesson */
  completed: boolean;
  /** Whether the lesson is locked */
  locked: boolean;
  contentProgress: {
    /** The index of the content that the user has reached */
    index: number;
    /** The time that the user reached the content */
    time: Date;
  };
  questionProgress: {
    /** The index of the question that the user has reached */
    index: number;
    /** The time that the user reached the question */
    time: Date;
    /** The number of correct answers the user has given */
    correct: number;
    /** The number of incorrect answers the user has given */
    incorrect: number;
  };

  /** METADATA */
  /** The date the lesson was created */
  createdAt: Date;
  /** The date the lesson was last updated */
  updatedAt: Date;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type ILessonProgressSchema = HydratedDocument<ILessonProgress>;
