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
