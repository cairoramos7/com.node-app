class UserController {
  constructor(updateUserNameUseCase, requestEmailUpdateUseCase, confirmEmailUpdateUseCase) {
    this.updateUserNameUseCase = updateUserNameUseCase;
    this.requestEmailUpdateUseCase = requestEmailUpdateUseCase;
    this.confirmEmailUpdateUseCase = confirmEmailUpdateUseCase;
  }

  updateUserName = async (req, res) => {
    try {
      const userId = req.params.id;
      const newName = req.body.name;
      const updatedUser = await this.updateUserNameUseCase.execute(
        userId,
        newName
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  requestEmailUpdate = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming req.user.id is set by auth middleware
      const newEmail = req.body.email;

      if (!newEmail) {
        return res.status(400).json({ message: "New email is required." });
      }

      await this.requestEmailUpdateUseCase.execute(userId, newEmail);
      res.status(200).json({ message: "Confirmation email sent. Please check your inbox." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  confirmEmailUpdate = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming req.user.id is set by auth middleware
      const token = req.body.token;

      if (!token) {
        return res.status(400).json({ message: "Confirmation token is required." });
      }

      await this.confirmEmailUpdateUseCase.execute(userId, token);
      res.status(200).json({ message: "Email updated successfully." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = UserController;
