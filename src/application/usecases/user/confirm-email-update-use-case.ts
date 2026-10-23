import User from '../../../domain/user/user.entity';
import IUserRepository from '../../../domain/user/user.repository';
import { NotFoundError, BadRequestError } from '../../../shared/errors';

export default class ConfirmEmailUpdateUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string, token: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User', userId);
        }

        if (!user.pendingEmailUpdate || user.pendingEmailUpdate.token !== token) {
            throw new BadRequestError('Invalid or expired confirmation token');
        }

        user.updateEmail(user.pendingEmailUpdate.newEmail);
        user.clearPendingEmailUpdate();
        await this.userRepository.save(user);

        return user;
    }
}
