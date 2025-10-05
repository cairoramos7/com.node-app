class User {
  constructor(id = null, email, password) {
    if (!email || !password) {
      throw new Error('User must have an email and password');
    }
    this.id = id;
    this.email = email;
    this.password = password;
  }

  // Domain methods related to User
}

module.exports = User;
