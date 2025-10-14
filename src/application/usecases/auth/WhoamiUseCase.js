class WhoamiUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId, { password: 0 });

    if (!user) {
      throw new Error("User not found");
    }

    // user is already a plain object, and password is excluded by projection
    const { _id, ...userWithoutId } = user;
    return { id: _id.toString(), ...userWithoutId };
  }
}

module.exports = WhoamiUseCase;