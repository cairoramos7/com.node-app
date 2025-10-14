const AuthService = require("../../application/auth.service");
const UserRepository = require("../../infrastructure/user/user.repository");

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.whoami = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const user = await authService.whoami(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
