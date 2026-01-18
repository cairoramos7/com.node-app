class IEmailService {
  /**
   * @param {string} _to
   * @param {string} _subject
   * @param {string} _html
   * @returns {Promise<void>}
   */
  async sendEmail(_to, _subject, _html) {
    throw new Error("Method 'sendEmail()' must be implemented.");
  }
}

module.exports = IEmailService;
