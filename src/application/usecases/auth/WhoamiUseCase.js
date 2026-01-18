class WhoamiUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Manually construct the user object to exclude the password and ensure id is a string
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      // Do not include password
    };
  }
}

module.exports = WhoamiUseCase;
