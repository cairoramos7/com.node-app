const User = require('@src/domain/user/user.entity');

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(name, email, password) {
    let user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new Error('User already exists');
    }
    user = new User(null, name, email, password);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}

module.exports = RegisterUserUseCase;
