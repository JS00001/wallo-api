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

  /** METADATA */
  /** The date the lesson was created */
  createdAt: Date;
  /** The date the lesson was last updated */
  updatedAt: Date;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type ILessonSchema = HydratedDocument<ILessonProgress>;
