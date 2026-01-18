import AuthController from '../../src/presentation/auth/auth.controller';
import WhoamiUseCase from '../../src/application/usecases/auth/WhoamiUseCase';
import { Request, Response } from 'express';

// Mock dependencies
jest.mock('../../src/application/usecases/auth/WhoamiUseCase');

describe('Auth Controller - whoami', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockWhoamiUseCaseInstance: any;
    let authController: AuthController;

    beforeEach(() => {
        // Clear mocks
        const MockWhoamiUseCase = WhoamiUseCase as jest.Mock;
        mockWhoamiUseCaseInstance = new MockWhoamiUseCase();
        mockWhoamiUseCaseInstance.execute = jest.fn();

        // Instantiate controller with mocks (pass null for others as we only test whoami)
        authController = new AuthController(null as any, null as any, mockWhoamiUseCaseInstance);

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
    });

    it('should return 401 if req.user is not defined', async () => {
        await authController.whoami(mockRequest as Request, mockResponse as Response, jest.fn());

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not authenticated.' });
    });

    it('should return 200 and user data if req.user is defined', async () => {
        const userData = { id: '123', email: 'test@example.com' };
        (mockRequest as any).user = { id: userData.id };
        mockWhoamiUseCaseInstance.execute.mockResolvedValue(userData);

        await authController.whoami(mockRequest as Request, mockResponse as Response, jest.fn());

        expect(mockWhoamiUseCaseInstance.execute).toHaveBeenCalledWith(userData.id);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(userData);
    });
});
