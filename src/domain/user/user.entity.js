class User {
  constructor(id = null, name = null, email, password) {
    if (!email || !password) {
      throw new Error('User must have an email and password');
    }
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
  }

  // Domain methods related to User

  updateName(newName) {
    if (!newName) {
      throw new Error('User name cannot be empty');
    }
    this.name = newName;
  }
}

module.exports = User;
