import User from '../../../domain/user/user.entity';
import IUserRepository from '../../../domain/user/user.repository';
import { NotFoundError } from '../../../shared/errors';

export default class UpdateUserNameUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string, newName: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User', userId);
        }
        user.updateName(newName);
        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
    }
}
