import { Router } from 'express';
import AuthController from './auth.controller';
import authMiddleware from './auth.middleware';

const createAuthRoutes = (authController: AuthController): Router => {
    const router = Router();

    router.post('/register', authController.register);

    router.post('/login', authController.login);

    // We need to cast authController.whoami to expected handler type because of the custom Request interface
    // or just depend on Express's loose typing compatibility.
    // Generally, Express handlers expect (req, res, next).

    router.get('/whoami', authMiddleware, authController.whoami as any);

    return router;
};

export default createAuthRoutes;
