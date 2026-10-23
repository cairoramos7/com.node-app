import { Request, Response, NextFunction } from 'express';
import CreateTaskUseCase from '../../application/usecases/task/create-task-use-case';
import GetTaskByIdUseCase from '../../application/usecases/task/get-task-by-id-use-case';
import GetAllTasksUseCase from '../../application/usecases/task/get-all-tasks-use-case';
import UpdateTaskUseCase from '../../application/usecases/task/update-task-use-case';
import DeleteTaskUseCase from '../../application/usecases/task/delete-task-use-case';

// Define request with user property
interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

export default class TaskController {
    private createTaskUseCase: CreateTaskUseCase;
    private getTaskByIdUseCase: GetTaskByIdUseCase;
    private getAllTasksUseCase: GetAllTasksUseCase;
    private updateTaskUseCase: UpdateTaskUseCase;
    private deleteTaskUseCase: DeleteTaskUseCase;

    constructor(
        createTaskUseCase: CreateTaskUseCase,
        getTaskByIdUseCase: GetTaskByIdUseCase,
        getAllTasksUseCase: GetAllTasksUseCase,
        updateTaskUseCase: UpdateTaskUseCase,
        deleteTaskUseCase: DeleteTaskUseCase
    ) {
        this.createTaskUseCase = createTaskUseCase;
        this.getTaskByIdUseCase = getTaskByIdUseCase;
        this.getAllTasksUseCase = getAllTasksUseCase;
        this.updateTaskUseCase = updateTaskUseCase;
        this.deleteTaskUseCase = deleteTaskUseCase;
    }

    createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const { title, description, tags } = req.body;
            const authorId = req.user.id;
            const task = await this.createTaskUseCase.execute(title, description, tags, authorId);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    };

    getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const tasks = await this.getAllTasksUseCase.execute();
            res.status(200).json(tasks);
        } catch (error) {
            next(error);
        }
    };

    getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const task = await this.getTaskByIdUseCase.execute(id as string);
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    };

    updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, description, isCompleted, tags } = req.body;
            const updatedTask = await this.updateTaskUseCase.execute(
                id as string,
                title,
                description,
                isCompleted,
                tags
            );
            res.status(200).json(updatedTask);
        } catch (error) {
            next(error);
        }
    };

    deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.deleteTaskUseCase.execute(id as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
