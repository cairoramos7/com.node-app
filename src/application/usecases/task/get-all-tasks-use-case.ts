import Task from '../../../domain/task/task.entity';
import ITaskRepository from '../../../domain/task/task.repository';

export default class GetAllTasksUseCase {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(): Promise<Task[]> {
        return await this.taskRepository.findAll();
    }
}
