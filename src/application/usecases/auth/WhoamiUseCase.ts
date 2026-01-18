import IUserRepository from '../../../domain/user/user.repository';

interface UserResponse {
  id: string | null;
  name: string | null;
  email: string;
}

export default class WhoamiUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Manually construct the user object to exclude the password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
