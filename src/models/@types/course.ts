import { HydratedDocument, Types } from 'mongoose';

/**
 * All internal fields stored about a course
 */
export interface ICourse {
  /** The id of the course */
  _id: Types.ObjectId;
  /** Whether the course is published or not */
  published: boolean;
  /** The name of the course */
  name: string;
  /** The description of the course */
  description: string;
  /** The date the course was created */
  createdAt: Date;
  /** The date the course was last updated */
  updatedAt: Date;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type ICourseSchema = HydratedDocument<ICourse>;
