import { Router } from 'express';
import UserController from './user.controller';
import authMiddleware from '../auth/auth.middleware';

const createUserRoutes = (userController: UserController): Router => {
  const router = Router();
  router.put('/:id/name', authMiddleware as any, userController.updateUserName);
  router.put('/:id/email/request-update', authMiddleware as any, userController.requestEmailUpdate);
  router.put('/:id/email/confirm-update', authMiddleware as any, userController.confirmEmailUpdate);
  router.put('/:id/password', authMiddleware as any, userController.updatePassword);
  return router;
};

export default createUserRoutes;
