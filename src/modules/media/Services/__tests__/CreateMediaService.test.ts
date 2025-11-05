import { CreateMediaService } from '../CreateMediaService';
import { IMediaRepository } from '../../Repositories/model/IMediaRepository';
import { IUserRepository } from '@modules/users/Repositories/model/IUserRepository';
import { AppError } from '@shared/errors/AppError';

describe('CreateMediaService', () => {
  let createMediaService: CreateMediaService;
  let mockMediaRepository: jest.Mocked<IMediaRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockMediaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    createMediaService = new CreateMediaService(mockMediaRepository, mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create media successfully', async () => {
      const userId = '123';
      const mediaData = {
        title: 'Test Media',
        description: 'Test Description',
        category: 'test' as any,
        thumbnail_url: 'http://example.com/thumb.jpg',
        content_url: 'http://example.com/content.jpg',
      };

      const mockUser = {
        user_id: userId,
        rating_count: 5,
      };

      const mockMedia = {
        media_id: '1',
        ...mediaData,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      mockMediaRepository.create.mockResolvedValue(mockMedia as any);

      const result = await createMediaService.execute(mediaData, userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockMediaRepository.create).toHaveBeenCalledWith(mediaData);
      expect(mockUserRepository.update).toHaveBeenCalledWith({
        ...mockUser,
        rating_count: 6,
      });
      expect(result).toEqual(mockMedia);
    });

    it('should throw an error if user not found', async () => {
      const userId = '123';
      const mediaData = {
        title: 'Test Media',
        description: 'Test Description',
        category: 'test' as any,
        thumbnail_url: 'http://example.com/thumb.jpg',
        content_url: 'http://example.com/content.jpg',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(createMediaService.execute(mediaData, userId)).rejects.toMatchObject({
        message: 'User not found',
        statusCode: 404,
      });

      expect(mockMediaRepository.create).not.toHaveBeenCalled();
    });

    it('should handle rating_count as 0 if null', async () => {
      const userId = '123';
      const mediaData = {
        title: 'Test Media',
        description: 'Test Description',
        category: 'test' as any,
        thumbnail_url: 'http://example.com/thumb.jpg',
        content_url: 'http://example.com/content.jpg',
      };

      const mockUser = {
        user_id: userId,
        rating_count: null,
      };

      const mockMedia = {
        media_id: '1',
        ...mediaData,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      mockMediaRepository.create.mockResolvedValue(mockMedia as any);

      await createMediaService.execute(mediaData, userId);

      expect(mockUserRepository.update).toHaveBeenCalledWith({
        ...mockUser,
        rating_count: 1,
      });
    });
  });
});
