/**
 * @file RequestEmailUpdateUseCase
 * @description Use case for requesting an email update for a user.
 */

const User = require("@src/domain/user/user.entity");
const UserRepository = require("@src/domain/user/user.repository");
const EmailService = require("@src/infrastructure/email.service");

class RequestEmailUpdateUseCase {
  /**
   * @param {UserRepository} userRepository - The user repository.
   * @param {EmailService} emailService - The email service.
   */
  constructor(userRepository, emailService) {
    if (!(userRepository instanceof UserRepository)) {
      throw new Error("userRepository must be an instance of UserRepository");
    }
    this.userRepository = userRepository;
    this.emailService = emailService; // Assuming EmailService is also an interface or a concrete class injected
  }

  /**
   * @param {string} userId - The ID of the user.
   * @param {string} newEmail - The new email address.
   * @returns {Promise<object>} A message indicating the request was sent.
   * @throws {Error} If the user is not found or email format is invalid.
   */
  async execute(userId, newEmail) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Basic email validation
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      throw new Error("Invalid email format.");
    }

    // Generate a confirmation token (placeholder)
    const confirmationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Store new email and token temporarily (e.g., in user object or a temporary collection)
    user.setPendingEmailUpdate(newEmail, confirmationToken);
    await this.userRepository.save(user);

    // Send confirmation email
    await this.emailService.sendConfirmationEmail(newEmail, confirmationToken);

    return { message: 'Email update requested. Please check your new email for confirmation.' };
  }
}

module.exports = RequestEmailUpdateUseCase;