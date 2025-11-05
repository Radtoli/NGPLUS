import { RegisterUserService } from '../RegisterUserService';
import { IUserRepository } from '../../Repositories/model/IUserRepository';
import { AppError } from '@shared/errors/AppError';
import * as passwordUtils from '@shared/utils/password';

jest.mock('@shared/utils/password');

describe('RegisterUserService', () => {
  let registerUserService: RegisterUserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    registerUserService = new RegisterUserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');

      await registerUserService.execute(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith(userData.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: userData.username,
        email: userData.email,
        password_hash: 'hashed_password',
      });
    });

    it('should throw an error if email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue({ user_id: '1' } as any);

      await expect(registerUserService.execute(userData)).rejects.toMatchObject({
        message: 'Email already in use',
        statusCode: 409,
      });

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if passwords do not match', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'different_password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(registerUserService.execute(userData)).rejects.toMatchObject({
        message: 'Password confirmation does not match',
        statusCode: 400,
      });

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
