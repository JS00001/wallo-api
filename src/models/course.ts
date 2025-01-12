import mongoose from 'mongoose';

import { ICourse } from './@types';

const courseSchema = new mongoose.Schema<ICourse>(
  {
    published: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICourse>('Course', courseSchema);
