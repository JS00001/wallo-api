import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import type {
  IUserMethods,
  UserModel,
  IUser,
  IUserSchema,
} from './@types/user';

import config from '@/constants';
import metadata from '@/constants/metadata';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    /** System Data */
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    systemRole: { type: String, enum: ['admin', 'user'], required: true },
    clientVersion: { type: String, required: false },
    refreshToken: { type: String, required: false },

    /** Notifications */
    notifications: {
      pushTokens: { type: [String], required: false, default: [] },
      enabled: { type: Boolean, required: false },
    },

    /** Game Data */
    streak: { type: Number, required: false, default: 0 },
    virtualCurrency: { type: Number, required: false, default: 0 },
    lives: { type: Number, required: false, default: metadata.defaultLives },
    weekData: {
      type: [Boolean],
      required: false,
      default: [false, false, false, false, false, false, false],
    },

    /** Metadata */
    lastStreakAt: { type: Date, required: false },
    lastLivesAt: { type: Date, required: false },
    lastOnlineAt: { type: Date, required: false, default: Date.now },
  },
  { timestamps: true },
);

/**
 * Refresh token hashing
 * This is a pre-save hook that hashes the refresh token before saving it to the database
 */
userSchema.pre<IUserSchema>('save', function (next) {
  if (!this.isModified('refreshToken')) return next();

  bcrypt.hash(this.refreshToken, config.SaltFactor, (err, hash) => {
    if (err) return next(err);
    this.refreshToken = hash;
    next();
  });
});

/**
 * Compare Refresh Token
 * This is a method that compares the refresh token to a hashed version
 */
userSchema.methods.validateRefreshToken = async function (
  this: IUserSchema,
  refreshToken: string,
) {
  const isEqual = await bcrypt.compare(refreshToken, this.refreshToken);
  return isEqual;
};

/**
 * Sanitize
 * Remove sensitive information from user object before using it
 * Used for client-side responses
 */
userSchema.methods.sanitize = function (this: IUserSchema) {
  return {
    _id: this.id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    systemRole: this.systemRole,
    clientVersion: this.clientVersion,
    notifications: { enabled: this.notifications.enabled },
    streak: this.streak,
    virtualCurrency: this.virtualCurrency,
    lives: this.lives,
    weekData: this.weekData,
    lastStreakAt: this.lastStreakAt,
    lastLivesAt: this.lastLivesAt,
    lastOnlineAt: this.lastOnlineAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model<IUser, UserModel>('User', userSchema);
