class IUserRepository {
  async findByEmail(_email) {
    throw new Error("Method 'findByEmail()' must be implemented.");
  }

  async save(_user) {
    throw new Error("Method 'save()' must be implemented.");
  }

  async findById(_id) {
    throw new Error("Method 'findById()' must be implemented.");
  }
}

module.exports = IUserRepository;
