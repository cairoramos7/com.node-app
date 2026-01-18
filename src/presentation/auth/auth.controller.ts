import { Request, Response, NextFunction } from 'express';
import RegisterUserUseCase from '../../application/usecases/auth/RegisterUserUseCase';
import LoginUserUseCase from '../../application/usecases/auth/LoginUserUseCase';
import WhoamiUseCase from '../../application/usecases/auth/WhoamiUseCase';

// Define strict interface for Request with user attached
interface AuthRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

export default class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private whoamiUseCase: WhoamiUseCase;

  constructor(
    registerUserUseCase: RegisterUserUseCase,
    loginUserUseCase: LoginUserUseCase,
    whoamiUseCase: WhoamiUseCase
  ) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.whoamiUseCase = whoamiUseCase;
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUserUseCase.execute(name, email, password);
      res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.loginUserUseCase.execute(email, password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  whoami = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated.' });
        return;
      }
      const user = await this.whoamiUseCase.execute(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
