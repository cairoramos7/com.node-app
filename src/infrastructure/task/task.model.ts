/**
 * @file task.model.ts
 * @description Mongoose model for Task (Todo List).
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskDocument extends Document {
    title: string;
    description: string;
    isCompleted: boolean;
    tags: string[];
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        isCompleted: { type: Boolean, default: false },
        tags: { type: [String], default: [] },
        authorId: { type: String, required: true, ref: 'User' },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
TaskSchema.index({ authorId: 1 });
TaskSchema.index({ tags: 1 });
TaskSchema.index({ isCompleted: 1 });

export default mongoose.model<ITaskDocument>('Task', TaskSchema);
