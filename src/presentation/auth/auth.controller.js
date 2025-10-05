const AuthService = require("../../application/auth.service");
const UserRepository = require("../../infrastructure/user/user.repository");

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
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
