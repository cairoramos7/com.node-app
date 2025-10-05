const UserModel = require('./user.model');
const IUserRepository = require('../../domain/user/user.repository');
const User = require('../../domain/user/user.entity');
const bcrypt = require('bcryptjs');

class UserRepository extends IUserRepository {
  constructor() {
    super();
  }

  async save(userEntity) {
    const newUser = new UserModel({
      email: userEntity.email,
      password: userEntity.password,
    });
    await newUser.save();
    return new User(newUser._id.toString(), newUser.email, newUser.password);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user ? new User(user._id.toString(), user.email, user.password) : null;
  }

  async findById(id) {
    const user = await UserModel.findById(id);
    return user ? new User(user._id.toString(), user.email, user.password) : null;
  }

  async comparePassword(email, candidatePassword) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    return await bcrypt.compare(candidatePassword, user.password);
  }
}

module.exports = UserRepository;