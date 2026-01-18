import User from '../../../domain/user/user.entity';
import IUserRepository from '../../../domain/user/user.repository';
import IEmailService from '../../../domain/services/email.service';
import bcrypt from 'bcryptjs';

interface Response {
  user: User;
  notificationSent: boolean;
  error?: string;
}

export default class UpdatePasswordUseCase {
  private userRepository: IUserRepository;
  private emailService: IEmailService;

  constructor(userRepository: IUserRepository, emailService: IEmailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute(userId: string, oldPassword: string, newPassword: string): Promise<Response> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password || '');
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    user.password = newPassword;
    const updatedUser = await this.userRepository.save(user);

    const updateDate = new Date().toISOString();
    const emailSubject = 'Atualização de senha confirmada';
    const emailBody = `
      <p>Sua senha foi atualizada com sucesso em ${updateDate}.</p>
      <p>Se você não solicitou essa alteração, contate nosso suporte imediatamente.</p>
      <p>Para sua segurança, recomendamos revisar as atividades da sua conta.</p>
    `;

    try {
      await this.emailService.sendEmail(updatedUser.email, emailSubject, emailBody);
      return { user: updatedUser, notificationSent: true };
    } catch (error: any) {
      console.error(`Failed to send password update email to ${updatedUser.email}:`, error);
      return { user: updatedUser, notificationSent: false, error: error.message };
    }
  }
}
