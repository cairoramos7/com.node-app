class IPostRepository {
  async findById(_id) {
    throw new Error("Method 'findById()' must be implemented.");
  }

  async findAll() {
    throw new Error("Method 'findAll()' must be implemented.");
  }

  async save(_post) {
    throw new Error("Method 'save()' must be implemented.");
  }

  async update(_post) {
    throw new Error("Method 'update()' must be implemented.");
  }

  async delete(_id) {
    throw new Error("Method 'delete()' must be implemented.");
  }
}

module.exports = IPostRepository;
