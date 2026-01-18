import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../../shared/errors/AppError';

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    throw new AppError('No token, authorization denied', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('No token, authorization denied', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError('Token is not valid', 401);
  }
};

export default authMiddleware;
