const User = require("@src/domain/user/user.entity");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(name, email, password) {
    let user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new Error("User already exists");
    }
    user = new User(null, name, email, password);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await this.userRepository.comparePassword(email, password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
  }

  async whoami(userId) {
    const user = await this.userRepository.findById(userId, { password: 0 });

    if (!user) {
      throw new Error("User not found");
    }

    // user is already a plain object, and password is excluded by projection
    const { _id, ...userWithoutId } = user;
    return { id: _id.toString(), ...userWithoutId };
  }
}

module.exports = AuthService;
