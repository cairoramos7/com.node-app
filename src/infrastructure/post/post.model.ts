import mongoose, { Document, Schema } from 'mongoose';

export interface IPostDocument extends Document {
  title: string;
  content: string;
  tags: string[];
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema: Schema<IPostDocument> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPostDocument>('Post', PostSchema);
