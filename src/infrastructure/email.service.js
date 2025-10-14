const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendConfirmationEmail(to, token) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Confirmação de Atualização de E-mail',
      html: `<p>Por favor, clique no link a seguir para confirmar a atualização do seu e-mail: <a href="${process.env.FRONTEND_URL}/confirm-email-update?token=${token}">Confirmar E-mail</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;