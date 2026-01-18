const nodemailer = require('nodemailer');
const IEmailService = require('../../domain/services/email.service');

class EmailService extends IEmailService {
  constructor(config) {
    super();
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = EmailService;
