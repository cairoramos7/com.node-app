const jwt = require('jsonwebtoken');
const authenticate = require('../../src/presentation/auth/auth.middleware');

// Mock the jwt module
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Mock process.env.JWT_SECRET
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header is provided', () => {
    mockRequest.header.mockReturnValue(undefined);

    authenticate(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header does not contain a token', () => {
    mockRequest.header.mockReturnValue('Bearer ');

    authenticate(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is not valid', () => {
    mockRequest.header.mockReturnValue('Bearer invalidtoken');
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    authenticate(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should set req.user and call next if the token is valid', () => {
    const decodedUser = { id: '123', email: 'test@example.com' };
    mockRequest.header.mockReturnValue('Bearer validtoken');
    jwt.verify.mockReturnValue(decodedUser);

    authenticate(mockRequest, mockResponse, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test_jwt_secret');
    expect(mockRequest.user).toEqual(decodedUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});