import { GetRatingService } from '../GetRatingService';
import { IRatingRepository } from '../../Repositories/model/IRatingRepository';
import { AppError } from '@shared/errors/AppError';

describe('GetRatingService', () => {
  let getRatingService: GetRatingService;
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

    getRatingService = new GetRatingService(mockRatingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should get rating successfully', async () => {
      const ratingId = '123';
      const mockRating = {
        rating_id: ratingId,
        user_id: '456',
        media_id: '789',
        stars: 4,
      };

      mockRatingRepository.findById.mockResolvedValue(mockRating as any);

      const result = await getRatingService.execute(ratingId);

      expect(mockRatingRepository.findById).toHaveBeenCalledWith(ratingId);
      expect(result).toEqual(mockRating);
    });

    it('should throw an error if rating not found', async () => {
      const ratingId = '123';

      mockRatingRepository.findById.mockResolvedValue(null);

      await expect(getRatingService.execute(ratingId)).rejects.toMatchObject({
        message: 'Rating not found',
        statusCode: 404,
      });
    });
  });
});
