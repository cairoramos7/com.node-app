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
      const updateData = {
        name: userEntity.name,
        email: userEntity.email,
      };

      if (userEntity.pendingEmailUpdate === null) {
        updateData.pendingEmailUpdate = null;
      } else {
        updateData.pendingEmailUpdate = userEntity.pendingEmailUpdate;
      }

      const updatedUserDoc = await UserModel.findByIdAndUpdate(userEntity.id, updateData, { new: true });
      if (!updatedUserDoc) {
        throw new Error("User not found for update");
      }
      const updatedUserEntity = new User(updatedUserDoc._id.toString(), updatedUserDoc.name, updatedUserDoc.email, updatedUserDoc.password);

      if (updatedUserDoc.pendingEmailUpdate === null) {
        updatedUserEntity.clearPendingEmailUpdate();
      } else if (updatedUserDoc.pendingEmailUpdate && updatedUserDoc.pendingEmailUpdate.newEmail && updatedUserDoc.pendingEmailUpdate.token) {
        updatedUserEntity.setPendingEmailUpdate(updatedUserDoc.pendingEmailUpdate.newEmail, updatedUserDoc.pendingEmailUpdate.token);
      }
      return updatedUserEntity;
    } else { // Otherwise, it's a new user
      const newUser = new UserModel({
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
        pendingEmailUpdate: userEntity.pendingEmailUpdate,
      });
      await newUser.save();
      const createdUserEntity = new User(newUser._id.toString(), newUser.name, newUser.email, newUser.password);
      if (newUser.pendingEmailUpdate && newUser.pendingEmailUpdate.newEmail && newUser.pendingEmailUpdate.token) {
        createdUserEntity.setPendingEmailUpdate(newUser.pendingEmailUpdate.newEmail, newUser.pendingEmailUpdate.token);
      }
      return createdUserEntity;
    }
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    const userEntity = new User(user._id.toString(), user.name, user.email, user.password);
    if (user.pendingEmailUpdate && user.pendingEmailUpdate.newEmail && user.pendingEmailUpdate.token) {
      userEntity.setPendingEmailUpdate(user.pendingEmailUpdate.newEmail, user.pendingEmailUpdate.token);
    }
    return userEntity;
  }

  async findById(id, projection = {}) {
    const user = await UserModel.findById(id, projection);
    if (!user) return null;
    if (Object.keys(projection).length > 0) {
      return user.toObject(); // Return raw object if projection is used
    }
    const userEntity = new User(user._id.toString(), user.name, user.email, user.password);
    if (user.pendingEmailUpdate && user.pendingEmailUpdate.newEmail && user.pendingEmailUpdate.token) {
      userEntity.setPendingEmailUpdate(user.pendingEmailUpdate.newEmail, user.pendingEmailUpdate.token);
    }
    return userEntity;
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