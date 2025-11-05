import { ListRatingService } from '../ListRatingService';
import { IRatingRepository } from '../../Repositories/model/IRatingRepository';

describe('ListRatingService', () => {
  let listRatingService: ListRatingService;
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

    listRatingService = new ListRatingService(mockRatingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should list ratings with pagination', async () => {
      const filters = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [
          {
            rating_id: '1',
            user_id: '123',
            media_id: '456',
            stars: 5,
          },
          {
            rating_id: '2',
            user_id: '124',
            media_id: '457',
            stars: 4,
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockRatingRepository.findAll.mockResolvedValue(mockResponse as any);

      const result = await listRatingService.execute(filters);

      expect(mockRatingRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });

    it('should list ratings with filters', async () => {
      const filters = {
        page: 1,
        limit: 10,
        user_id: '123',
        media_id: '456',
      };

      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockRatingRepository.findAll.mockResolvedValue(mockResponse as any);

      const result = await listRatingService.execute(filters);

      expect(mockRatingRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });
  });
});
