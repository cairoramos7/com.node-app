const AuthController = require('../../src/presentation/auth/auth.controller');
const WhoamiUseCase = require('../../src/application/usecases/auth/WhoamiUseCase');

let mockWhoamiUseCaseInstance;
let authController;

jest.mock('../../src/application/usecases/auth/WhoamiUseCase');

describe('Auth Controller - whoami', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockWhoamiUseCaseInstance = new WhoamiUseCase();
    mockWhoamiUseCaseInstance.execute.mockClear();
    authController = new AuthController(null, null, mockWhoamiUseCaseInstance);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 401 if req.user is not defined', () => {
    authController.whoami(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not authenticated.' });
  });

  it('should return 200 and user data if req.user is defined', async () => {
    const userData = { id: '123', email: 'test@example.com' };
    mockRequest.user = { id: userData.id };
    mockWhoamiUseCaseInstance.execute.mockResolvedValue(userData);

    await authController.whoami(mockRequest, mockResponse);

    expect(mockWhoamiUseCaseInstance.execute).toHaveBeenCalledWith(userData.id);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(userData);
  });
});