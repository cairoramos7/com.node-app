import jwt from 'jsonwebtoken';
import IUserRepository from '../../../domain/user/user.repository';
import AppError from '../../../shared/errors/AppError';

export default class LoginUserUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw AppError.unauthorized('Invalid credentials');
        }

        const isMatch = await this.userRepository.comparePassword(email, password);
        if (!isMatch) {
            throw AppError.unauthorized('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });
        return token;
    }
}
