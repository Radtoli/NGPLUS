import { ListMediaService } from '../ListMediaService';
import { IMediaRepository } from '../../Repositories/model/IMediaRepository';

describe('ListMediaService', () => {
  let listMediaService: ListMediaService;
  let mockMediaRepository: jest.Mocked<IMediaRepository>;

  beforeEach(() => {
    mockMediaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    listMediaService = new ListMediaService(mockMediaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should list media with pagination', async () => {
      const filters = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [
          {
            media_id: '1',
            title: 'Media 1',
            description: 'Description 1',
          },
          {
            media_id: '2',
            title: 'Media 2',
            description: 'Description 2',
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockMediaRepository.findAll.mockResolvedValue(mockResponse as any);

      const result = await listMediaService.execute(filters);

      expect(mockMediaRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });

    it('should list media with filters', async () => {
      const filters = {
        page: 1,
        limit: 10,
        category: 'test' as any,
        title: 'search term',
      };

      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockMediaRepository.findAll.mockResolvedValue(mockResponse as any);

      const result = await listMediaService.execute(filters);

      expect(mockMediaRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });
  });
});
