import Task from '../../../domain/task/task.entity';
import ITaskRepository from '../../../domain/task/task.repository';

export default class GetTaskByIdUseCase {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: string): Promise<Task | null> {
        return await this.taskRepository.findById(id);
    }
}
