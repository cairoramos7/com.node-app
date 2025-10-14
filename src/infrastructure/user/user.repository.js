const UserModel = require('./user.model');
const IUserRepository = require('../../domain/user/user.repository');
const User = require('../../domain/user/user.entity');
const bcrypt = require('bcryptjs');

class UserRepository extends IUserRepository {
  constructor() {
    super();
  }

  async save(userEntity) {
    if (userEntity.id) { // If userEntity has an ID, it's an update
      const existingUser = await UserModel.findById(userEntity.id);
      if (!existingUser) {
        throw new Error("User not found for update");
      }
      existingUser.name = userEntity.name;
      existingUser.email = userEntity.email;
      // Password should not be updated here directly, usually has a separate flow
      await existingUser.save();
      return new User(existingUser._id.toString(), existingUser.name, existingUser.email, existingUser.password);
    } else { // Otherwise, it's a new user
      const newUser = new UserModel({
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
      });
      await newUser.save();
      return new User(newUser._id.toString(), newUser.name, newUser.email, newUser.password);
    }
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user ? new User(user._id.toString(), user.name, user.email, user.password) : null;
  }

  async findById(id, projection = {}) {
    const user = await UserModel.findById(id, projection);
    if (!user) return null;
    if (Object.keys(projection).length > 0) {
      return user.toObject(); // Return raw object if projection is used
    }
    return new User(user._id.toString(), user.name, user.email, user.password);
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