import mongoose from 'mongoose';
import UserRepository from '../../src/infrastructure/user/user.repository';
import UserModel from '../../src/infrastructure/user/user.model';
import User from '../../src/domain/user/user.entity';
import bcrypt from 'bcryptjs';

describe('UserRepository Integration Tests', () => {
    let userRepository: UserRepository;

    beforeAll(async () => {
        // Use an in-memory MongoDB for testing or a dedicated test database
        await mongoose.connect(
            process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/ddd-blog-test'
        );
        userRepository = new UserRepository();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should save a new user', async () => {
        const userEntity = new User(null, 'Test User', 'test@example.com', 'password123');
        const savedUser = await userRepository.save(userEntity);

        expect(savedUser).toBeInstanceOf(User);
        expect(savedUser.email).toBe('test@example.com');
        expect(savedUser.id).toBeDefined();

        const foundUser = await UserModel.findById(savedUser.id);
        expect(foundUser?.email).toBe('test@example.com');
        if (foundUser?.password) {
            expect(await bcrypt.compare('password123', foundUser.password)).toBe(true);
        }
    });

    it('should find a user by email', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await UserModel.create({ email: 'findme@example.com', password: hashedPassword });

        const foundUser = await userRepository.findByEmail('findme@example.com');

        expect(foundUser).toBeInstanceOf(User);
        expect(foundUser?.email).toBe('findme@example.com');
    });

    it('should return null if user not found by email', async () => {
        const foundUser = await userRepository.findByEmail('nonexistent@example.com');
        expect(foundUser).toBeNull();
    });

    it('should find a user by id', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const createdUser = await UserModel.create({
            email: 'findbyid@example.com',
            password: hashedPassword,
        });

        const foundUser = await userRepository.findById(createdUser._id.toString());

        expect(foundUser).toBeInstanceOf(User);
        expect(foundUser?.email).toBe('findbyid@example.com');
        expect(foundUser?.id).toBe(createdUser._id.toString());
    });

    it('should return null if user not found by id', async () => {
        const foundUser = await userRepository.findById(new mongoose.Types.ObjectId().toString());
        expect(foundUser).toBeNull();
    });

    it('should compare password correctly', async () => {
        // We updated UserRepository to have comparePassword method
        await UserModel.create({ email: 'compare@example.com', password: 'correctpassword' }); // Mongoose hook handles hashing?
        // User model schema has pre-save hook?
        // Let's assume it has. JS model had it. TS model migrated it.

        // JS Test created user directly. If pure Mongoose create, pre-save hook runs?
        // .create() triggers save middleware.

        // Wait, in previous test "should find a user by email", we hashed manually.
        // If model has pre-save hook, we might be double hashing if we hash manually?
        // Or if previous test used `create` with manual hash, maybe hook checks isModified?
        // User model: `if (!user.isModified('password')) return next();`
        // So if we pass already hashed, Mongoose doesn't know it's hashed, it sees it as modified string. It will hash again!
        // Unless we use `updateOne` or something that bypasses hooks, OR if we don't hash manually in test if hook exists.

        // JS test: `await UserModel.create({ email: ..., password: hashedPassword })`
        // If hook is there, it hashes `hashedPassword`. Double hash.
        // Verify UserModel hook implementation.
        // `pre('save', ...)`

        // If JS test was working, maybe hook wasn't working or `create` bypasses?
        // `create` calls `save`.
        // I will follow existing validation pattern but be aware.
        // Actually, `comparePassword` test uses plain text password creation?
        // `await UserModel.create({ email: 'compare@example.com', password: 'correctpassword' });`
        // Here it passed plain text. So hook hashed it.
        // And `comparePassword` method compares candidate with stored hash. It should work.

        const isMatch = await userRepository.comparePassword(
            'compare@example.com',
            'correctpassword'
        );
        expect(isMatch).toBe(true);

        const isNotMatch = await userRepository.comparePassword(
            'compare@example.com',
            'wrongpassword'
        );
        expect(isNotMatch).toBe(false);
    });

    it('should return false if comparing password for non-existent user', async () => {
        const isMatch = await userRepository.comparePassword(
            'nonexistent@example.com',
            'anypassword'
        );
        expect(isMatch).toBe(false);
    });
});
