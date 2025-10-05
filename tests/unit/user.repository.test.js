const mongoose = require("mongoose");
const UserRepository = require("@src/infrastructure/user/user.repository");
const UserModel = require("@src/infrastructure/user/user.model");
const User = require("@src/domain/user/user.entity");
const bcrypt = require("bcryptjs");

describe("UserRepository Integration Tests", () => {
  let userRepository;

  beforeAll(async () => {
    // Use an in-memory MongoDB for testing or a dedicated test database
    await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/ddd-blog-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    userRepository = new UserRepository();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should save a new user", async () => {
    const userEntity = new User("dummyId", "test@example.com", "password123");
    const savedUser = await userRepository.save(userEntity);

    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.email).toBe("test@example.com");
    expect(savedUser.id).toBeDefined();

    const foundUser = await UserModel.findById(savedUser.id);
    expect(foundUser.email).toBe("test@example.com");
    expect(await bcrypt.compare("password123", foundUser.password)).toBe(true);
  });

  it("should find a user by email", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await UserModel.create({ email: "findme@example.com", password: hashedPassword });

    const foundUser = await userRepository.findByEmail("findme@example.com");

    expect(foundUser).toBeInstanceOf(User);
    expect(foundUser.email).toBe("findme@example.com");
  });

  it("should return null if user not found by email", async () => {
    const foundUser = await userRepository.findByEmail("nonexistent@example.com");
    expect(foundUser).toBeNull();
  });

  it("should find a user by id", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const createdUser = await UserModel.create({ email: "findbyid@example.com", password: hashedPassword });

    const foundUser = await userRepository.findById(createdUser._id.toString());

    expect(foundUser).toBeInstanceOf(User);
    expect(foundUser.email).toBe("findbyid@example.com");
    expect(foundUser.id).toBe(createdUser._id.toString());
  });

  it("should return null if user not found by id", async () => {
    const foundUser = await userRepository.findById(new mongoose.Types.ObjectId().toString());
    expect(foundUser).toBeNull();
  });

  it("should compare password correctly", async () => {
    await UserModel.create({ email: "compare@example.com", password: "correctpassword" });

    const isMatch = await userRepository.comparePassword("compare@example.com", "correctpassword");
    expect(isMatch).toBe(true);

    const isNotMatch = await userRepository.comparePassword("compare@example.com", "wrongpassword");
    expect(isNotMatch).toBe(false);
  });

  it("should return false if comparing password for non-existent user", async () => {
    const isMatch = await userRepository.comparePassword("nonexistent@example.com", "anypassword");
    expect(isMatch).toBe(false);
  });
});
