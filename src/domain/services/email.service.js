class IEmailService {
  /**
   * @param {string} to
   * @param {string} subject
   * @param {string} html
   * @returns {Promise<void>}
   */
  async sendEmail(to, subject, html) {
    throw new Error("Method 'sendEmail()' must be implemented.");
  }
}

module.exports = IEmailService;