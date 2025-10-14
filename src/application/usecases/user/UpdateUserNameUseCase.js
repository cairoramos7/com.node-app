/**
 * @file UpdateUserNameUseCase
 * @description Use case for updating a user's name.
 */

const User = require("@src/domain/user/user.entity");
const UserRepository = require("@src/infrastructure/user/user.repository");

class UpdateUserNameUseCase {
  /**
   * @param {UserRepository} userRepository - The user repository.
   */
  constructor(userRepository) {
    if (!(userRepository instanceof UserRepository)) {
      throw new Error("userRepository must be an instance of UserRepository");
    }
    this.userRepository = userRepository;
  }

  /**
   * @param {string} userId - The ID of the user to update.
   * @param {string} newName - The new name for the user.
   * @returns {Promise<User>} The updated user entity.
   * @throws {Error} If the user is not found.
   */
  async execute(userId, newName) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.updateName(newName);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}

module.exports = UpdateUserNameUseCase;