const UserModel = require('./user.model');
const IUserRepository = require('../../domain/user/user.repository');
const User = require('../../domain/user/user.entity');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs'); // Import fs module
const path = require('path'); // Import path module

const debugLogPath = path.join(__dirname, '..', '..', '..', 'debug.log');

function writeDebugLog(message) {
  fs.appendFileSync(debugLogPath, message + '\n');
}

class UserRepository extends IUserRepository {
  constructor() {
    super();
  }

  async save(userEntity) {
    if (userEntity.id) { // If userEntity has an ID, it's an an update
      writeDebugLog(`UserRepository.save: Updating existing user with ID: ${userEntity.id}`);
      const userDoc = await UserModel.findById(userEntity.id);
      writeDebugLog(`UserRepository.save: Result of findById in save: ${JSON.stringify(userDoc)}`);
      if (!userDoc) {
        throw new Error("User not found for update");
      }

      userDoc.name = userEntity.name;
      userDoc.email = userEntity.email;
      if (userEntity.pendingEmailUpdate === null) {
        userDoc.pendingEmailUpdate = undefined;
      } else {
        userDoc.pendingEmailUpdate = userEntity.pendingEmailUpdate;
      }
      // Do NOT assign userDoc.password = userEntity.password here.
      // The pre('save') hook handles password hashing only when it's explicitly modified.
      // If userEntity.password is assigned here, it might re-hash an already hashed password.
      userDoc.pendingEmailUpdate = userEntity.pendingEmailUpdate;

      const updatedUserDoc = await userDoc.save();

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

  async findById(id) {
    writeDebugLog(`UserRepository.findById: Searching for ID: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      writeDebugLog(`UserRepository.findById: Invalid ObjectId: ${id}`);
      return null;
    }
    const user = await UserModel.findById(id);
    writeDebugLog(`UserRepository.findById: Result for ID ${id}: ${JSON.stringify(user)}`);
    if (!user) return null;

    const userEntity = new User(user._id.toString(), user.name, user.email, user.password);
    if (user.pendingEmailUpdate && user.pendingEmailUpdate.newEmail && user.pendingEmailUpdate.token) {
      userEntity.setPendingEmailUpdate(user.pendingEmailUpdate.newEmail, user.pendingEmailUpdate.token);
    } else if (user.pendingEmailUpdate === null || user.pendingEmailUpdate === undefined) {
      userEntity.clearPendingEmailUpdate();
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