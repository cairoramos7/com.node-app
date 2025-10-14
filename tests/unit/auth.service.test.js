const AuthService = require('../../src/application/auth.service');
const UserRepository = require('../../src/infrastructure/user/user.repository');
const User = require('../../src/domain/user/user.entity');

jest.mock('../../src/infrastructure/user/user.repository');

describe('Auth Service', () => {
  let authService;
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    authService = new AuthService(userRepository);
  });

  it('should register a user', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue({ id: '123', name: 'Test User', email: 'test@example.com' });

    const result = await authService.register('Test User', 'test@example.com', 'password123');
    expect(result).toHaveProperty('id');
  });

  it('should throw error if user exists', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: '123' });
    await expect(authService.register('Test User', 'test@example.com', 'password123')).rejects.toThrow('User already exists');
  });

  it('should login a user', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: '123', email: 'test@example.com', password: 'hashedPassword' });
    userRepository.comparePassword.mockResolvedValue(true);
    jest.spyOn(require('jsonwebtoken'), 'sign').mockReturnValue('token');

    const token = await authService.login('test@example.com', 'password123');
    expect(token).toBe('token');
  });
});
