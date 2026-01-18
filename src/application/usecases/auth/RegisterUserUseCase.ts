import User from '../../../domain/user/user.entity';
import IUserRepository from '../../../domain/user/user.repository';
import AppError from '../../../shared/errors/AppError';

export default class RegisterUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw AppError.badRequest('User already exists');
    }
    const user = new User(null, name, email, password);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
