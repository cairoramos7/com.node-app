const UserService = require("../../application/user.service");
const UserRepository = require("../../infrastructure/user/user.repository");

const userRepository = new UserRepository();
const userService = new UserService(userRepository);



exports.updateUserName = async (req, res) => {
    try {
        const userId = req.params.id;
        const newName = req.body.name;
        const updatedUser = await userService.updateUserName(
            userId,
            newName
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.requestEmailUpdate = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user.id is set by auth middleware
        const newEmail = req.body.email;

        if (!newEmail) {
            return res.status(400).json({ message: "New email is required." });
        }

        await userService.requestEmailUpdate(userId, newEmail);
        res.status(200).json({ message: "Confirmation email sent. Please check your inbox." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.confirmEmailUpdate = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user.id is set by auth middleware
        const token = req.body.token;

        if (!token) {
            return res.status(400).json({ message: "Confirmation token is required." });
        }

        await userService.confirmEmailUpdate(userId, token);
        res.status(200).json({ message: "Email updated successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
