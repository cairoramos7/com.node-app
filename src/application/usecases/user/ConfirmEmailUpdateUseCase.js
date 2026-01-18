/**
 * @file ConfirmEmailUpdateUseCase
 * @description Use case for confirming a user's email update.
 */

const UserRepository = require('@src/infrastructure/user/user.repository');

class ConfirmEmailUpdateUseCase {
  /**
   * @param {UserRepository} userRepository - The user repository.
   */
  constructor(userRepository) {
    if (!(userRepository instanceof UserRepository)) {
      throw new Error('userRepository must be an instance of UserRepository');
    }
    this.userRepository = userRepository;
  }

  /**
   * @param {string} userId - The ID of the user.
   * @param {string} token - The confirmation token.
   * @returns {Promise<Object>} The updated user entity.
   * @throws {Error} If the user is not found or the token is invalid/expired.
   */
  async execute(userId, token) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.pendingEmailUpdate || user.pendingEmailUpdate.token !== token) {
      throw new Error('Invalid or expired confirmation token.');
    }

    user.updateEmail(user.pendingEmailUpdate.newEmail);
    user.clearPendingEmailUpdate(); // Clear temporary data
    await this.userRepository.save(user);

    return user;
  }
}

module.exports = ConfirmEmailUpdateUseCase;
