import Task from '../../../domain/task/task.entity';
import ITaskRepository from '../../../domain/task/task.repository';
import { NotFoundError } from '../../../shared/errors';

export default class UpdateTaskUseCase {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute(
        id: string,
        title?: string,
        description?: string,
        isCompleted?: boolean,
        tags?: string[]
    ): Promise<Task> {
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw new NotFoundError('Task', id);
        }

        if (title) existingTask.updateTitle(title);
        if (description !== undefined) existingTask.updateDescription(description);
        if (isCompleted !== undefined) {
            if (isCompleted) {
                existingTask.complete();
            } else {
                existingTask.uncomplete();
            }
        }
        if (tags) existingTask.setTags(tags);

        return await this.taskRepository.update(existingTask);
    }
}
