import Task from './task.entity';

export default interface ITaskRepository {
    findById(id: string): Promise<Task | null>;
    findAll(): Promise<Task[]>;
    findByAuthorId(authorId: string): Promise<Task[]>;
    save(task: Task): Promise<Task>;
    update(task: Task): Promise<Task>;
    delete(id: string): Promise<void>;
}
