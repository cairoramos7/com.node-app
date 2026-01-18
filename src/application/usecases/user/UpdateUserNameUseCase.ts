import User from '../../../domain/user/user.entity';
import IUserRepository from '../../../domain/user/user.repository';

export default class UpdateUserNameUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string, newName: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.updateName(newName);
        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
    }
}
