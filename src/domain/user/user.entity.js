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
  }}

module.exports = User;
