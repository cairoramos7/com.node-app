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

            // Handle pending email update
            if (userEntity.pendingEmailUpdate === null) {
                userDoc.pendingEmailUpdate = null as any;
            } else if (userEntity.pendingEmailUpdate) {
                userDoc.pendingEmailUpdate = {
                    newEmail: userEntity.pendingEmailUpdate.newEmail,
                    token: userEntity.pendingEmailUpdate.token,
                    expires: userEntity.pendingEmailUpdate.expires,
                };
            }

            // Handle password update explicitly
            // Only update if password was set on entity (indicates intentional password change)
            if (userEntity.password && userEntity.password !== userDoc.password) {
                // Password will be hashed by the pre-save hook in the model
                userDoc.password = userEntity.password;
            }

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
