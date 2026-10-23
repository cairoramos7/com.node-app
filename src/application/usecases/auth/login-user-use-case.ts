import jwt from 'jsonwebtoken';
import IUserRepository from '../../../domain/user/user.repository';
import { UnauthorizedError } from '../../../shared/errors';
import { Logger } from '../../../infrastructure/logger/logger';

export default class LoginUserUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(email: string, password: string): Promise<string> {
        Logger.info(`Login attempt for email: ${email}`);

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            Logger.warn(`Login failed for email: ${email} - User not found`);
            throw new UnauthorizedError('Invalid credentials');
        }

        const isMatch = await this.userRepository.comparePassword(email, password);
        if (!isMatch) {
            Logger.warn(`Login failed for email: ${email} - Invalid password`);
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });
        Logger.info(`Login successful for user: ${user.id}`);
        return token;
    }
}
