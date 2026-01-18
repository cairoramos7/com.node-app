import { Request, Response, NextFunction } from 'express';
import UpdateUserNameUseCase from '../../application/usecases/user/UpdateUserNameUseCase';
import RequestEmailUpdateUseCase from '../../application/usecases/user/RequestEmailUpdateUseCase';
import ConfirmEmailUpdateUseCase from '../../application/usecases/user/ConfirmEmailUpdateUseCase';
import UpdatePasswordUseCase from '../../application/usecases/user/UpdatePasswordUseCase';

export default class UserController {
    private updateUserNameUseCase: UpdateUserNameUseCase;
    private requestEmailUpdateUseCase: RequestEmailUpdateUseCase;
    private confirmEmailUpdateUseCase: ConfirmEmailUpdateUseCase;
    private updatePasswordUseCase: UpdatePasswordUseCase;

    constructor(
        updateUserNameUseCase: UpdateUserNameUseCase,
        requestEmailUpdateUseCase: RequestEmailUpdateUseCase,
        confirmEmailUpdateUseCase: ConfirmEmailUpdateUseCase,
        updatePasswordUseCase: UpdatePasswordUseCase
    ) {
        this.updateUserNameUseCase = updateUserNameUseCase;
        this.requestEmailUpdateUseCase = requestEmailUpdateUseCase;
        this.confirmEmailUpdateUseCase = confirmEmailUpdateUseCase;
        this.updatePasswordUseCase = updatePasswordUseCase;
    }

    updateUserName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id as string;
            const newName = req.body.name;
            const updatedUser = await this.updateUserNameUseCase.execute(userId, newName);
            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    requestEmailUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id as string;
            const newEmail = req.body.email;

            if (!newEmail) {
                res.status(400).json({ message: 'New email is required.' });
                return;
            }

            await this.requestEmailUpdateUseCase.execute(userId, newEmail);
            res.status(200).json({ message: 'Confirmation email sent. Please check your inbox.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    confirmEmailUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id as string;
            const token = req.body.token;

            if (!token) {
                res.status(400).json({ message: 'Confirmation token is required.' });
                return;
            }

            await this.confirmEmailUpdateUseCase.execute(userId, token);
            res.status(200).json({ message: 'Email updated successfully.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id as string;
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                res.status(400).json({ message: 'Old password and new password are required.' });
                return;
            }

            await this.updatePasswordUseCase.execute(userId, oldPassword, newPassword);
            res.status(200).json({ message: 'Password updated successfully.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };
}
