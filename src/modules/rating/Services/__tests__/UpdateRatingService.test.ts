import { UpdateRatingService } from '../UpdateRatingService';
import { IRatingRepository } from '../../Repositories/model/IRatingRepository';
import { AppError } from '@shared/errors/AppError';

describe('UpdateRatingService', () => {
  let updateRatingService: UpdateRatingService;
  let mockRatingRepository: jest.Mocked<IRatingRepository>;

  beforeEach(() => {
    mockRatingRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUserAndMedia: jest.fn(),
    } as any;

    updateRatingService = new UpdateRatingService(mockRatingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update rating successfully', async () => {
      const ratingId = '123';
      const userId = '456';
      const updateData = {
        stars: 5,
      };

      const mockRating = {
        rating_id: ratingId,
        user_id: userId,
        media_id: '789',
        stars: 3,
      };

      const updatedRating = {
        ...mockRating,
        stars: updateData.stars,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);
      mockRatingRepository.update.mockResolvedValue(updatedRating as any);

      const result = await updateRatingService.execute(ratingId, userId, updateData);

      expect(mockRatingRepository.findById).toHaveBeenCalledWith(ratingId);
      expect(mockRatingRepository.update).toHaveBeenCalledWith({
        ...mockRating,
        stars: updateData.stars,
      });
      expect(result).toEqual(updatedRating);
    });

    it('should throw an error if rating not found', async () => {
      const ratingId = '123';
      const userId = '456';
      const updateData = {
        stars: 5,
      };

      mockRatingRepository.findById.mockResolvedValue(null);

      await expect(updateRatingService.execute(ratingId, userId, updateData)).rejects.toMatchObject({
        message: 'Rating not found',
        statusCode: 404,
      });

      expect(mockRatingRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not the owner', async () => {
      const ratingId = '123';
      const userId = '456';
      const updateData = {
        stars: 5,
      };

      const mockRating = {
        rating_id: ratingId,
        user_id: '999', // different user
        media_id: '789',
        stars: 3,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);

      await expect(updateRatingService.execute(ratingId, userId, updateData)).rejects.toMatchObject({
        message: 'You can only update your own ratings',
        statusCode: 403,
      });

      expect(mockRatingRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if stars is less than 1', async () => {
      const ratingId = '123';
      const userId = '456';
      const updateData = {
        stars: 0,
      };

      const mockRating = {
        rating_id: ratingId,
        user_id: userId,
        media_id: '789',
        stars: 3,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);

      await expect(updateRatingService.execute(ratingId, userId, updateData)).rejects.toMatchObject({
        message: 'Stars must be between 1 and 5',
        statusCode: 400,
      });

      expect(mockRatingRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if stars is greater than 5', async () => {
      const ratingId = '123';
      const userId = '456';
      const updateData = {
        stars: 6,
      };

      const mockRating = {
        rating_id: ratingId,
        user_id: userId,
        media_id: '789',
        stars: 3,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);

      await expect(updateRatingService.execute(ratingId, userId, updateData)).rejects.toMatchObject({
        message: 'Stars must be between 1 and 5',
        statusCode: 400,
      });

      expect(mockRatingRepository.update).not.toHaveBeenCalled();
    });
  });
});
