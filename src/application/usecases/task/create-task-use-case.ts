import Task from '../../../domain/task/task.entity';
import ITaskRepository from '../../../domain/task/task.repository';

export default class CreateTaskUseCase {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(
        title: string,
        description: string,
        tags: string[],
        authorId: string
    ): Promise<Task> {
        const newTask = new Task(
            null,
            title,
            description,
            false, // isCompleted default
            tags,
            authorId
        );
        return await this.taskRepository.save(newTask);
    }
}
