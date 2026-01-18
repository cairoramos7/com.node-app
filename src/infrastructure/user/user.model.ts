import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
  name?: string;
  email: string;
  password?: string;
  pendingEmailUpdate?: {
    newEmail?: string;
    token?: string;
    expires?: Date;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUserDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pendingEmailUpdate: {
    newEmail: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
    expires: {
      type: Date,
      required: false,
    },
    _id: false,
  },
});

UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password || '');
};

export default mongoose.model<IUserDocument>('User', UserSchema);
