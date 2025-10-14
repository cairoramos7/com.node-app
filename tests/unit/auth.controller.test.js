const { whoami } = require('../../src/presentation/auth/auth.controller');
const AuthService = require('../../src/application/auth.service');

let mockWhoami;

jest.mock('../../src/application/auth.service', () => {
  const MockAuthService = jest.fn().mockImplementation(() => {
    return {
      whoami: jest.fn(),
    };
  });
  return MockAuthService;
});

describe('Auth Controller - whoami', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockWhoami = AuthService.mock.results[0].value.whoami;
    mockWhoami.mockClear();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 401 if req.user is not defined', () => {
    whoami(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not authenticated.' });
  });

  it('should return 200 and user data if req.user is defined', async () => {
    const userData = { id: '123', email: 'test@example.com' };
    mockRequest.user = { id: userData.id };
    mockWhoami.mockResolvedValue(userData);

    await whoami(mockRequest, mockResponse);

    expect(mockWhoami).toHaveBeenCalledWith(userData.id);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(userData);
  });
});