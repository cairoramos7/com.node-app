const User = require("@src/domain/user/user.entity");

describe("User Entity", () => {
  it("should create a new user with valid properties", () => {
    const user = new User("123", "test@example.com", "password123");
    expect(user.id).toBe("123");
    expect(user.email).toBe("test@example.com");
    expect(user.password).toBe("password123");
  });

  it("should throw an error if email is missing", () => {
    expect(() => new User("123", null, "password123")).toThrow("User must have an email and password");
  });

  it("should throw an error if password is missing", () => {
    expect(() => new User("123", "test@example.com", null)).toThrow("User must have an email and password");
  });
});
