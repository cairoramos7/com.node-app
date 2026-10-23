/**
 * @file task.repository.ts
 * @description Concrete implementation of Task Repository using Mongoose.
 */

import ITaskRepository from '../../domain/task/task.repository';
import Task from '../../domain/task/task.entity';
import TaskModel, { ITaskDocument } from './task.model';

export default class TaskRepository implements ITaskRepository {
    async findById(id: string): Promise<Task | null> {
        const taskDoc = await TaskModel.findById(id);
        if (!taskDoc) return null;
        return this.toEntity(taskDoc);
    }

    async findAll(): Promise<Task[]> {
        const taskDocs = await TaskModel.find().sort({ createdAt: -1 });
        return taskDocs.map(this.toEntity);
    }

    async findByAuthorId(authorId: string): Promise<Task[]> {
        const taskDocs = await TaskModel.find({ authorId }).sort({ createdAt: -1 });
        return taskDocs.map(this.toEntity);
    }

    async save(task: Task): Promise<Task> {
        const newTask = new TaskModel({
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
            tags: task.tags,
            authorId: task.authorId,
        });

        const savedTask = await newTask.save();
        return this.toEntity(savedTask);
    }

    async update(task: Task): Promise<Task> {
        if (!task.id) {
            throw new Error('Task ID is required for update');
        }

        const uniqueTags = [...new Set(task.tags)];

        const updatedTaskDoc = await TaskModel.findByIdAndUpdate(
            task.id,
            {
                title: task.title,
                description: task.description,
                isCompleted: task.isCompleted,
                tags: uniqueTags,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedTaskDoc) {
            throw new Error('Task not found');
        }

        return this.toEntity(updatedTaskDoc);
    }

    async delete(id: string): Promise<void> {
        await TaskModel.findByIdAndDelete(id);
    }

    private toEntity(doc: ITaskDocument): Task {
        return new Task(
            doc._id.toString(),
            doc.title,
            doc.description,
            doc.isCompleted,
            doc.tags,
            doc.authorId,
            doc.createdAt,
            doc.updatedAt
        );
    }
}
