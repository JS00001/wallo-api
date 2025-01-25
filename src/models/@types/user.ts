import { Model, HydratedDocument, Types } from 'mongoose';

export enum SystemRole {
  Admin = 'admin',
  User = 'user',
}

export enum Reward {
  Daily = 'Daily',
  OneLesson = 'OneLesson',
  ThreeLessons = 'ThreeLessons',
}

/**
 * All internal fields stored about a user
 */
export interface IUser {
  /** SYSTEM DATA */
  /** The id of the user */
  _id: Types.ObjectId;
  /** The first name of the user */
  firstName: string;
  /** The last name of the user */
  lastName: string;
  /** The email of the user */
  email: string;
  /** The age of the user */
  age?: number;
  /** The system role of the user */
  systemRole: SystemRole;
  /** The client version that the user is currently on */
  clientVersion: string;
  /** The timezone of the user */
  timezone?: string;
  /** The refresh token of the user */
  refreshToken?: string;
  /** Whether the user has been onboarded or not */
  onboarded: boolean;
  /** All of the information about the user's notifications */
  notifications: {
    /** The Expo push notification tokens of the user */
    pushTokens: string[];
    /** Whether the user has enabled push notifications or not */
    enabled: boolean;
  };

  /** GAME DATA */
  /** The length of the user's streak */
  streak: number;
  /** The week's data for streaks */
  weekData: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  /** How much virtual currency the user has */
  virtualCurrency: number;
  /** How many lives the user has */
  lives: number;
  /** The preferred courses the user wants to take */
  preferredCourses: Types.ObjectId[];
  /** Whether they claimed the daily reward */
  claimedDailyRewards: Reward[];
  /** The number of lessons that a user has completed for the day */
  dailyLessonCount: number;

  /** METADATA */
  /** The date that the user last completed a streak */
  lastStreakAt: Date;
  /** The date the user got their lives refilled at */
  lastLivesAt: Date;
  /** The date the user was last online (Last time they hit the API) */
  lastOnlineAt: Date;
  /** The date the user was created */
  createdAt: Date;
  /** The date the user was last updated */
  updatedAt: Date;
}

/**
 * All fields that are sanitized and sent to the client about a user
 */
export interface ISanitizedUser {
  /** SYSTEM DATA */
  /** The id of the user */
  _id: string;
  /** The first name of the user's user */
  firstName: string;
  /** The last name of the user's user */
  lastName: string;
  /** The email of the user's user */
  email: string;
  /** The system role of the user */
  systemRole: SystemRole;
  /** The client version that the user is currently on */
  clientVersion: string;
  /** Whether the user has been onboarded or not */
  onboarded: boolean;
  /** Notifications information for the user */
  notifications: {
    /** Whether the user has enabled push notifications or not */
    enabled: boolean;
  };

  /** GAME DATA */
  /** The length of the user's streak */
  streak: number;
  /** The week's data for streaks */
  weekData: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  /** How much virtual currency the user has */
  virtualCurrency: number;
  /** How many lives the user has */
  lives: number;
  /** Whether they claimed the daily reward */
  claimedDailyRewards: Reward[];
  /** The number of lessons that a user has completed for the day */
  dailyLessonCount: number;

  /** METADATA */
  /** The date that the user last completed a streak */
  lastStreakAt: Date;
  /** The date the user got their lives refilled at */
  lastLivesAt: Date;
  /** The date the user was last online (Last time they hit the API) */
  lastOnlineAt: Date;
  /** The date the user was created */
  createdAt: Date;
  /** The date the user was last updated */
  updatedAt: Date;
}

/**
 * All methods that can be called on a users schema
 */
export interface IUserMethods {
  /** Sanitize fields of the user and return an object that can be sent to the client */
  sanitize: () => ISanitizedUser;
  /** Create an access token for the user */
  createAccessToken: () => Promise<string>;
  /** Create a refresh token for the user */
  createRefreshToken: () => Promise<string>;
  /** Check if the passed refresh token is a valid session for the user */
  validateRefreshToken: (refreshTokenId: string) => Promise<boolean>;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type IUserSchema = HydratedDocument<IUser, IUserMethods>;

// How we interact with the database: IE what methods we can call on the schema (create, find, etc)
// This is NOT the methods or properties that we can call on a fetched document
export type UserModel = Model<IUser, {}, IUserMethods>;
