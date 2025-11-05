import { UpdateUserService } from '../UpdateUserService';
import { IUserRepository } from '../../Repositories/model/IUserRepository';
import { AppError } from '@shared/errors/AppError';
import * as passwordUtils from '@shared/utils/password';

jest.mock('@shared/utils/password');

describe('UpdateUserService', () => {
  let updateUserService: UpdateUserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    updateUserService = new UpdateUserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update user username successfully', async () => {
      const userId = '123';
      const updateData = {
        username: 'newusername',
      };

      const mockUser = {
        user_id: userId,
        username: 'oldusername',
        email: 'test@example.com',
        password_hash: 'hashed_password',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);

      await updateUserService.execute(userId, updateData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith({
        ...mockUser,
        username: updateData.username,
      });
    });

    it('should update user email successfully', async () => {
      const userId = '123';
      const updateData = {
        email: 'newemail@example.com',
      };

      const mockUser = {
        user_id: userId,
        username: 'testuser',
        email: 'old@example.com',
        password_hash: 'hashed_password',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await updateUserService.execute(userId, updateData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(updateData.email);
      expect(mockUserRepository.update).toHaveBeenCalledWith({
        ...mockUser,
        email: updateData.email,
      });
    });

    it('should update user password successfully', async () => {
      const userId = '123';
      const updateData = {
        password: 'newpassword123',
        password_confirmation: 'newpassword123',
      };

      const mockUser = {
        user_id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'old_hashed_password',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue('new_hashed_password');

      await updateUserService.execute(userId, updateData);

      expect(passwordUtils.hashPassword).toHaveBeenCalledWith(updateData.password);
      expect(mockUserRepository.update).toHaveBeenCalledWith({
        ...mockUser,
        password_hash: 'new_hashed_password',
      });
    });

    it('should throw an error if user not found', async () => {
      const userId = '123';
      const updateData = { username: 'newusername' };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(updateUserService.execute(userId, updateData)).rejects.toMatchObject({
        message: 'User not found',
        statusCode: 404,
      });
    });

    it('should throw an error if email already in use', async () => {
      const userId = '123';
      const updateData = { email: 'existing@example.com' };

      const mockUser = {
        user_id: userId,
        email: 'old@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      mockUserRepository.findByEmail.mockResolvedValue({ user_id: '456' } as any);

      await expect(updateUserService.execute(userId, updateData)).rejects.toMatchObject({
        message: 'Email already in use',
        statusCode: 409,
      });
    });

    it('should throw an error if password confirmation is missing', async () => {
      const userId = '123';
      const updateData = {
        password: 'newpassword123',
      };

      const mockUser = {
        user_id: userId,
        email: 'test@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);

      await expect(updateUserService.execute(userId, updateData)).rejects.toMatchObject({
        message: 'Password confirmation is required',
        statusCode: 400,
      });
    });

    it('should throw an error if passwords do not match', async () => {
      const userId = '123';
      const updateData = {
        password: 'newpassword123',
        password_confirmation: 'different_password',
      };

      const mockUser = {
        user_id: userId,
        email: 'test@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);

      await expect(updateUserService.execute(userId, updateData)).rejects.toMatchObject({
        message: 'Passwords do not match',
        statusCode: 400,
      });
    });
  });
});
