import { DeleteUserService } from '../DeleteUserService';
import { IUserRepository } from '../../Repositories/model/IUserRepository';
import { AppError } from '@shared/errors/AppError';

describe('DeleteUserService', () => {
  let deleteUserService: DeleteUserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      ADMIN_DELETE_PASSWORD: 'admin123'
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    deleteUserService = new DeleteUserService(mockUserRepository);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete user successfully with valid admin password', async () => {
      const userId = '123';
      const adminPassword = 'admin123';

      const mockUser = {
        user_id: userId,
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);

      await deleteUserService.execute({ userId, adminPassword });

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if admin password is not configured', async () => {
      delete process.env.ADMIN_DELETE_PASSWORD;

      const userId = '123';
      const adminPassword = 'admin123';

      await expect(deleteUserService.execute({ userId, adminPassword })).rejects.toMatchObject({
        message: 'Admin password not configured',
        statusCode: 500,
      });
    });

    it('should throw an error if admin password is invalid', async () => {
      const userId = '123';
      const adminPassword = 'wrong_password';

      await expect(deleteUserService.execute({ userId, adminPassword })).rejects.toMatchObject({
        message: 'Invalid admin password',
        statusCode: 401,
      });

      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      const userId = '123';
      const adminPassword = 'admin123';

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(deleteUserService.execute({ userId, adminPassword })).rejects.toMatchObject({
        message: 'User not found',
        statusCode: 404,
      });

      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });
});
