const UserRepository = require("@src/domain/user/user.repository");
const IEmailService = require("@src/domain/services/email.service");
const bcrypt = require("bcryptjs");

/**
 * Use case for updating user password and triggering email notification.
 */
class UpdatePasswordUseCase {
  /**
   * Create a new UpdatePasswordUseCase instance.
   * @param {UserRepository} userRepository - The user repository.
   * @param {IEmailService} emailService - The email service.
   */
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  /**
   * Execute the password update process.
   * @param {string} userId - The ID of the user.
   * @param {string} oldPassword - The current password for verification.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<Object>} The updated user and notification status.
   * @throws {Error} If user not found, invalid password, or update fails.
   */
  async execute(userId, oldPassword, newPassword) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid old password");
    }

    user.password = newPassword;
    const updatedUser = await this.userRepository.save(user);

    const updateDate = new Date().toISOString();
    const emailSubject = "Atualização de senha confirmada";
    const emailBody = `
      <p>Sua senha foi atualizada com sucesso em ${updateDate}.</p>
      <p>Se você não solicitou essa alteração, contate nosso suporte imediatamente.</p>
      <p>Para sua segurança, recomendamos revisar as atividades da sua conta.</p>
    `;

    try {
      await this.emailService.sendEmail(updatedUser.email, emailSubject, emailBody);
      return { user: updatedUser, notificationSent: true };
    } catch (error) {
      console.error(`Failed to send password update email to ${updatedUser.email}:`, error);
      // Optionally, you could re-throw the error, or return a different status
      return { user: updatedUser, notificationSent: false, error: error.message };
    }
  }
}

module.exports = UpdatePasswordUseCase;