import ITaskRepository from '../../../domain/task/task.repository';
import { NotFoundError } from '../../../shared/errors';

export default class DeleteTaskUseCase {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(id: string): Promise<void> {
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw new NotFoundError('Task', id);
        }
        await this.taskRepository.delete(id);
    }
}
