const User = require("@src/domain/user/user.entity");
const EmailService = require("@src/infrastructure/email.service");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.emailService = new EmailService();
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

  async requestEmailUpdate(userId, newEmail) {
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

    // console.log(`Email for user ${user.id} updated to ${newEmail}`);

    return { message: 'Email update requested. Please check your new email for confirmation.' };
  }

  async confirmEmailUpdate(userId, token) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.pendingEmailUpdate || user.pendingEmailUpdate.token !== token) {
      throw new Error("Invalid or expired confirmation token.");
    }

    user.updateEmail(user.pendingEmailUpdate.newEmail);
    user.clearPendingEmailUpdate(); // Clear temporary data
    await this.userRepository.save(user);

    // Notify user (placeholder)
    // console.log(`Email for user ${userId} updated to ${user.email}`);

    return user;
  }
}

module.exports = UserService;