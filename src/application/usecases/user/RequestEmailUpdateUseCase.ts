import crypto from 'crypto';
import IUserRepository from '../../../domain/user/user.repository';
import IEmailService from '../../../domain/services/email.service';

interface Response {
  success: boolean;
  message: string;
}

export default class RequestEmailUpdateUseCase {
  private userRepository: IUserRepository;
  private emailService: IEmailService;

  constructor(userRepository: IUserRepository, emailService: IEmailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute(userId: string, newEmail: string): Promise<Response> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new Error('Invalid email format.');
    }

    if (user.email === newEmail) {
      throw new Error('New email is the same as the current email.');
    }

    const confirmationToken = crypto.randomBytes(32).toString('hex');

    user.requestEmailUpdate(newEmail, confirmationToken);
    await this.userRepository.save(user);

    const subject = 'Confirmação de Atualização de E-mail';
    const html = `<p>Por favor, clique no link a seguir para confirmar a atualização do seu e-mail: <a href="${process.env.FRONTEND_URL}/confirm-email-update?token=${confirmationToken}">Confirmar E-mail</a></p>`;

    await this.emailService.sendEmail(newEmail, subject, html);

    return { success: true, message: 'Email confirmation sent.' };
  }
}
