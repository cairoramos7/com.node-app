class AuthController {
  constructor(registerUserUseCase, loginUserUseCase, whoamiUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.whoamiUseCase = whoamiUseCase;
  }

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUserUseCase.execute(name, email, password);
      res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await this.loginUserUseCase.execute(email, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  whoami = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const user = await this.whoamiUseCase.execute(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = AuthController;
