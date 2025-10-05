class IUserRepository {
  async findByEmail(email) {
    throw new Error("Method 'findByEmail()' must be implemented.");
  }

  async save(user) {
    throw new Error("Method 'save()' must be implemented.");
  }

  async findById(id) {
    throw new Error("Method 'findById()' must be implemented.");
  }
}

module.exports = IUserRepository;
