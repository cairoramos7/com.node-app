const crypto = require('crypto');

class RequestEmailUpdateUseCase {
  /**
   * @param {Object} userRepository - The user repository.
   * @param {Object} emailService - The email service.
   */
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute(userId, newEmail) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new Error('Invalid email format.');
    }

    if (user.email === newEmail) {
      throw new Error('New email is the same as the current email.');
    }

    // Generate a confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    user.requestEmailUpdate(newEmail, confirmationToken);
    await this.userRepository.save(user);

    const subject = 'Confirmação de Atualização de E-mail';
    const html = `<p>Por favor, clique no link a seguir para confirmar a atualização do seu e-mail: <a href="${process.env.FRONTEND_URL}/confirm-email-update?token=${confirmationToken}">Confirmar E-mail</a></p>`;

    await this.emailService.sendEmail(newEmail, subject, html);

    return { success: true, message: 'Email confirmation sent.' };
  }
}

module.exports = RequestEmailUpdateUseCase;
