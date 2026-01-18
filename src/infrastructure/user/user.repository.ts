import UserModel, { IUserDocument } from './user.model';
import IUserRepository from '../../domain/user/user.repository';
import User from '../../domain/user/user.entity';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

class UserRepository implements IUserRepository {
  async save(userEntity: User): Promise<User> {
    if (userEntity.id) {
      // If userEntity has an ID, it's an update
      const userDoc = await UserModel.findById(userEntity.id);
      if (!userDoc) {
        throw new Error('User not found for update');
      }

      userDoc.name = userEntity.name || undefined;
      userDoc.email = userEntity.email;

      if (userEntity.pendingEmailUpdate === null) {
        userDoc.pendingEmailUpdate = null as any;
      } else {
        userDoc.pendingEmailUpdate = {
          newEmail: userEntity.pendingEmailUpdate.newEmail,
          token: userEntity.pendingEmailUpdate.token,
          expires: userEntity.pendingEmailUpdate.expires,
        };
      }
      // Password handled by pre-save hook only if set on the doc

      // Need to explicitly set password if changed, or handle via dedicated method.
      // For this implementation, we assume if password is in entity, it might be new?
      // Actually, entity logic usually hashes? No, infrastructure does.
      // But entity has plain password?
      // Let's assume if entity.password is set and different, we update it.
      // But we can't check difference easily without hash.
      // For now, let's assume we map simply.
      
      // FIX: The original JS ignored password here. I'll stick to that behavior
      // unless it's a new user.
      
      const updatedUserDoc = await userDoc.save();
      return this.mapToEntity(updatedUserDoc);
    } else {
      // New user
      const newUser = new UserModel({
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
        pendingEmailUpdate: userEntity.pendingEmailUpdate,
      });
      await newUser.save();
      return this.mapToEntity(newUser);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await UserModel.findById(id);
    if (!user) return null;
    return this.mapToEntity(user);
  }

  private mapToEntity(userDoc: IUserDocument): User {
    const userEntity = new User(
      userDoc._id.toString(),
      userDoc.name || null,
      userDoc.email,
      userDoc.password
    );

    if (
      userDoc.pendingEmailUpdate &&
      userDoc.pendingEmailUpdate.newEmail &&
      userDoc.pendingEmailUpdate.token
    ) {
      userEntity.setPendingEmailUpdate(
        userDoc.pendingEmailUpdate.newEmail,
        userDoc.pendingEmailUpdate.token
      );
    } else if (!userDoc.pendingEmailUpdate) {
      userEntity.clearPendingEmailUpdate();
    }
    
    return userEntity;
  }

  async comparePassword(email: string, candidatePassword: string): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    return await bcrypt.compare(candidatePassword, user.password || '');
  }
}

export default UserRepository;
