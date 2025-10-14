class User {
  constructor(id = null, name = null, email, password) {
    if (!email || !password) {
      throw new Error('User must have an email and password');
    }
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.pendingEmailUpdate = null; // { newEmail: string, token: string, expires: Date }
  }

  // Domain methods related to User

  updateName(newName) {
    if (!newName) {
      throw new Error('User name cannot be empty');
    }
    this.name = newName;
  }

  setPendingEmailUpdate(newEmail, token) {
    this.pendingEmailUpdate = {
      newEmail,
      token,
      expires: new Date(Date.now() + 3600000) // 1 hour expiration
    };
  }

  clearPendingEmailUpdate() {
    this.pendingEmailUpdate = null;
  }

  updateEmail(newEmail) {
    if (!newEmail) {
      throw new Error('Email cannot be empty');
    }
    this.email = newEmail;
  }

  /**
   * Initiates an email update request by setting pending email update details.
   * @param {string} newEmail - The new email address.
   * @param {string} token - The confirmation token for the email update.
   */
  requestEmailUpdate(newEmail, token) {
    if (!newEmail) {
      throw new Error('New email is required for update request');
    }
    if (!token) {
      throw new Error('Token is required for email update request');
    }
    this.setPendingEmailUpdate(newEmail, token);
  }

  /**
   * Updates the user's password.
   * @param {string} newPassword - The new password for the user.
   * @throws {Error} If the new password is empty.
   */
  updatePassword(newPassword) {
    if (!newPassword) {
      throw new Error('Password cannot be empty');
    }
    this.password = newPassword;
  }
}

module.exports = User;
