import { HydratedDocument, Types } from 'mongoose';

import { ILesson } from './lesson';

/**
 * All internal fields stored about a course
 */
export interface ICourse {
  /** The id of the course */
  _id: Types.ObjectId;
  /** The name of the course */
  name: string;
  /** The description of the course */
  description: string;
}

/**
 * The course once populated and aggregated for a user
 */
export interface IPopulatedCourse extends ICourse {
  /** The lessons in the course */
  lessons: ILesson[];
  /** The number of total lessons in the course */
  totalLessons: number;
  /** The number of completed lessons in the course */
  completedLessons: number;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type ICourseSchema = HydratedDocument<ICourse>;
