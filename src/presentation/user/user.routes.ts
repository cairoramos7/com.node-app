import { Router } from 'express';
import UserController from './user.controller';
import authMiddleware from '../auth/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
    updateNameSchema,
    updateEmailSchema,
    confirmEmailSchema,
    updatePasswordSchema,
} from './user.schemas';

const createUserRoutes = (userController: UserController): Router => {
    const router = Router();
    router.put(
        '/:id/name',
        authMiddleware as any,
        validate(updateNameSchema),
        userController.updateUserName
    );
    router.put(
        '/:id/email/request-update',
        authMiddleware as any,
        validate(updateEmailSchema),
        userController.requestEmailUpdate
    );
    router.put(
        '/:id/email/confirm-update',
        authMiddleware as any,
        validate(confirmEmailSchema),
        userController.confirmEmailUpdate
    );
    router.put(
        '/:id/password',
        authMiddleware as any,
        validate(updatePasswordSchema),
        userController.updatePassword
    );
    return router;
};

export default createUserRoutes;
