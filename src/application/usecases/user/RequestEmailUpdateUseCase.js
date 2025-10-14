const User = require("../../../domain/user/user.entity");
const IUserRepository = require("../../../domain/user/user.repository");
const IEmailService = require("../../../domain/services/email.service");
const crypto = require("crypto");

class RequestEmailUpdateUseCase {
  /**
   * @param {IUserRepository} userRepository - The user repository.
   * @param {IEmailService} emailService - The email service.
   */
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService; // Assuming EmailService is also an interface or a concrete class injected
  }

  async execute(userId, newEmail) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.email === newEmail) {
      throw new Error("New email is the same as the current email.");
    }

    // Generate a confirmation token
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.requestEmailUpdate(newEmail, confirmationToken, tokenExpiry);
    await this.userRepository.save(user);

    const subject = 'Confirmação de Atualização de E-mail';
    const html = `<p>Por favor, clique no link a seguir para confirmar a atualização do seu e-mail: <a href="${process.env.FRONTEND_URL}/confirm-email-update?token=${confirmationToken}">Confirmar E-mail</a></p>`;

    await this.emailService.sendEmail(newEmail, subject, html);

    return { success: true, message: "Email confirmation sent." };
  }
}

module.exports = RequestEmailUpdateUseCase;