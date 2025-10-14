const User = require("@src/domain/user/user.entity");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async updateUserName(userId, newName) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.updateName(newName);
    await this.userRepository.save(user);
    return user;
  }
}

module.exports = UserService;