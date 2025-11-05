import { CreateRatingService } from '../CreateRatingService';
import { IRatingRepository } from '../../Repositories/model/IRatingRepository';
import { IUserRepository } from '@modules/users/Repositories/model/IUserRepository';
import { IMediaRepository } from '@modules/media/Repositories/model/IMediaRepository';
import { AppError } from '@shared/errors/AppError';

describe('CreateRatingService', () => {
  let createRatingService: CreateRatingService;
  let mockRatingRepository: jest.Mocked<IRatingRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockMediaRepository: jest.Mocked<IMediaRepository>;

  beforeEach(() => {
    mockRatingRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUserAndMedia: jest.fn(),
    } as any;

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockMediaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    createRatingService = new CreateRatingService(
      mockRatingRepository,
      mockUserRepository,
      mockMediaRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create rating successfully', async () => {
      const userId = '123';
      const ratingData = {
        media_id: '456',
        stars: 4,
      };

      const mockUser = { user_id: userId };
      const mockMedia = { media_id: ratingData.media_id };
      const mockRating = {
        rating_id: '789',
        ...ratingData,
        user_id: userId,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      mockMediaRepository.findById.mockResolvedValue(mockMedia as any);
      mockRatingRepository.findByUserAndMedia.mockResolvedValue(null);
      mockRatingRepository.create.mockResolvedValue(mockRating as any);

      const result = await createRatingService.execute(ratingData, userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockMediaRepository.findById).toHaveBeenCalledWith(ratingData.media_id);
      expect(mockRatingRepository.findByUserAndMedia).toHaveBeenCalledWith(userId, ratingData.media_id);
      expect(mockRatingRepository.create).toHaveBeenCalledWith(ratingData, userId);
      expect(result).toEqual(mockRating);
    });

    it('should throw an error if user not found', async () => {
      const userId = '123';
      const ratingData = {
        media_id: '456',
        stars: 4,
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(createRatingService.execute(ratingData, userId)).rejects.toMatchObject({
        message: 'User not found',
        statusCode: 404,
      });

      expect(mockMediaRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw an error if media not found', async () => {
      const userId = '123';
      const ratingData = {
        media_id: '456',
        stars: 4,
      };

      mockUserRepository.findById.mockResolvedValue({ user_id: userId } as any);
      mockMediaRepository.findById.mockResolvedValue(null);

      await expect(createRatingService.execute(ratingData, userId)).rejects.toMatchObject({
        message: 'Media content not found',
        statusCode: 404,
      });

      expect(mockRatingRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if stars is less than 1', async () => {
      const userId = '123';
      const ratingData = {
        media_id: '456',
        stars: 0,
      };

      mockUserRepository.findById.mockResolvedValue({ user_id: userId } as any);
      mockMediaRepository.findById.mockResolvedValue({ media_id: ratingData.media_id } as any);

      await expect(createRatingService.execute(ratingData, userId)).rejects.toMatchObject({
        message: 'Stars must be between 1 and 5',
        statusCode: 400,
      });

      expect(mockRatingRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if stars is greater than 5', async () => {
      const userId = '123';
      const ratingData = {
        media_id: '456',
        stars: 6,
      };

      mockUserRepository.findById.mockResolvedValue({ user_id: userId } as any);
      mockMediaRepository.findById.mockResolvedValue({ media_id: ratingData.media_id } as any);

      await expect(createRatingService.execute(ratingData, userId)).rejects.toMatchObject({
        message: 'Stars must be between 1 and 5',
        statusCode: 400,
      });

      expect(mockRatingRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if user already rated this media', async () => {
      const userId = '123';
      const ratingData = {
        media_id: '456',
        stars: 4,
      };

      const existingRating = {
        rating_id: '789',
        user_id: userId,
        media_id: ratingData.media_id,
        stars: 3,
      };

      mockUserRepository.findById.mockResolvedValue({ user_id: userId } as any);
      mockMediaRepository.findById.mockResolvedValue({ media_id: ratingData.media_id } as any);
      mockRatingRepository.findByUserAndMedia.mockResolvedValue(existingRating as any);

      await expect(createRatingService.execute(ratingData, userId)).rejects.toMatchObject({
        message: 'User has already rated this media content',
        statusCode: 400,
      });

      expect(mockRatingRepository.create).not.toHaveBeenCalled();
    });
  });
});
