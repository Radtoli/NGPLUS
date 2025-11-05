import { LoginUserService } from '../LoginUserService';
import { IUserRepository } from '../../Repositories/model/IUserRepository';
import { AppError } from '@shared/errors/AppError';
import * as passwordUtils from '@shared/utils/password';
import * as jwt from 'jsonwebtoken';

jest.mock('@shared/utils/password');
jest.mock('jsonwebtoken');

describe('LoginUserService', () => {
  let loginUserService: LoginUserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '1d'
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    loginUserService = new LoginUserService(mockUserRepository);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should login user successfully and return token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        last_login: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('test-token');

      const result = await loginUserService.execute(loginData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(passwordUtils.verifyPassword).toHaveBeenCalledWith(loginData.password, mockUser.password_hash);
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(result).toEqual({
        token: 'test-token',
        user: {
          user_id: mockUser.user_id,
          username: mockUser.username,
          email: mockUser.email,
        },
      });
    });

    it('should throw an error if user does not exist', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(loginUserService.execute(loginData)).rejects.toMatchObject({
        message: 'Invalid credentials',
        statusCode: 401,
      });

      expect(passwordUtils.verifyPassword).not.toHaveBeenCalled();
    });

    it('should throw an error if password is invalid', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
        password_hash: 'hashed_password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(loginUserService.execute(loginData)).rejects.toMatchObject({
        message: 'Invalid credentials',
        statusCode: 401,
      });

      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if JWT_SECRET is not configured', async () => {
      delete process.env.JWT_SECRET;

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
        password_hash: 'hashed_password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(true);

      await expect(loginUserService.execute(loginData)).rejects.toMatchObject({
        message: 'JWT secret not configured',
        statusCode: 500,
      });
    });
  });
});
