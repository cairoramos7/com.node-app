import User from './user.entity';

export default interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    comparePassword(email: string, candidatePassword: string): Promise<boolean>;
}
