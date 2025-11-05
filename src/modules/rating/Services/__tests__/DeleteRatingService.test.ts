import { DeleteRatingService } from '../DeleteRatingService';
import { IRatingRepository } from '../../Repositories/model/IRatingRepository';
import { AppError } from '@shared/errors/AppError';

describe('DeleteRatingService', () => {
  let deleteRatingService: DeleteRatingService;
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

    deleteRatingService = new DeleteRatingService(mockRatingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete rating successfully', async () => {
      const ratingId = '123';
      const userId = '456';

      const mockRating = {
        rating_id: ratingId,
        user_id: userId,
        media_id: '789',
        stars: 4,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);

      await deleteRatingService.execute(ratingId, userId);

      expect(mockRatingRepository.findById).toHaveBeenCalledWith(ratingId);
      expect(mockRatingRepository.delete).toHaveBeenCalledWith(ratingId);
    });

    it('should throw an error if rating not found', async () => {
      const ratingId = '123';
      const userId = '456';

      mockRatingRepository.findById.mockResolvedValue(null);

      await expect(deleteRatingService.execute(ratingId, userId)).rejects.toMatchObject({
        message: 'Rating not found',
        statusCode: 404,
      });

      expect(mockRatingRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not the owner', async () => {
      const ratingId = '123';
      const userId = '456';

      const mockRating = {
        rating_id: ratingId,
        user_id: '999', // different user
        media_id: '789',
        stars: 4,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);

      await expect(deleteRatingService.execute(ratingId, userId)).rejects.toMatchObject({
        message: 'You can only delete your own ratings',
        statusCode: 403,
      });

      expect(mockRatingRepository.delete).not.toHaveBeenCalled();
    });
  });
});
