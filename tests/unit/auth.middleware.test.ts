import jwt from 'jsonwebtoken';
import authenticate from '../../src/presentation/auth/auth.middleware';
import { Request, Response, NextFunction } from 'express';

// Mock the jwt module
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    mockNext = jest.fn();

    // Mock process.env.JWT_SECRET
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw Error if no Authorization header is provided (handled by global handler)', () => {
    (mockRequest.header as jest.Mock).mockReturnValue(undefined);

    // Middleware throws AppError, so we expect it to throw
    expect(() => {
        authenticate(mockRequest as Request, mockResponse as Response, mockNext);
    }).toThrow('No token, authorization denied');

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw Error if Authorization header does not contain a token', () => {
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer ');

    expect(() => {
        authenticate(mockRequest as Request, mockResponse as Response, mockNext);
    }).toThrow('No token, authorization denied');

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw Error if the token is not valid', () => {
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer invalidtoken');
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    expect(() => {
        authenticate(mockRequest as Request, mockResponse as Response, mockNext);
    }).toThrow('Token is not valid');

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should set req.user and call next if the token is valid', () => {
    const decodedUser = { id: '123', email: 'test@example.com' };
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer validtoken');
    (jwt.verify as jest.Mock).mockReturnValue(decodedUser);

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test_jwt_secret');
    expect((mockRequest as any).user).toEqual(decodedUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
