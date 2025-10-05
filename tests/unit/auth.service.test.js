const AuthService = require("@src/application/auth.service");
const User = require("@src/domain/user/user.entity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock UserRepository
const mockUserRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
  comparePassword: jest.fn(),
};

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService(mockUserRepository);
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret"; // Set a test secret for JWT
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(new User("newUserId", "test@example.com", "hashedpassword"));

      const user = await authService.register("test@example.com", "password123");

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe("test@example.com");
    });

    it("should throw an error if user already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(new User("existingId", "test@example.com", "hashedpassword"));

      await expect(authService.register("test@example.com", "password123")).rejects.toThrow("User already exists");
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user successfully and return a token", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(new User("userId123", "test@example.com", "hashedpassword"));
      mockUserRepository.comparePassword.mockResolvedValue(true);

      const token = await authService.login("test@example.com", "password123");

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUserRepository.comparePassword).toHaveBeenCalledWith("test@example.com", "password123");
      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe("userId123");
    });

    it("should throw an error for invalid credentials (user not found)", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login("nonexistent@example.com", "password123")).rejects.toThrow("Invalid credentials");
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("nonexistent@example.com");
      expect(mockUserRepository.comparePassword).not.toHaveBeenCalled();
    });

    it("should throw an error for invalid credentials (wrong password)", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(new User("userId123", "test@example.com", "hashedpassword"));
      mockUserRepository.comparePassword.mockResolvedValue(false);

      await expect(authService.login("test@example.com", "wrongpassword")).rejects.toThrow("Invalid credentials");
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUserRepository.comparePassword).toHaveBeenCalledWith("test@example.com", "wrongpassword");
    });
  });
});
