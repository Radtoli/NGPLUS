import { GetMediaService } from '../GetMediaService';
import { IMediaRepository } from '../../Repositories/model/IMediaRepository';
import { AppError } from '@shared/errors/AppError';

describe('GetMediaService', () => {
  let getMediaService: GetMediaService;
  let mockMediaRepository: jest.Mocked<IMediaRepository>;

  beforeEach(() => {
    mockMediaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    getMediaService = new GetMediaService(mockMediaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should get media successfully', async () => {
      const mediaId = '123';
      const mockMedia = {
        media_id: mediaId,
        title: 'Test Media',
        description: 'Test Description',
        category: 'test',
      };

      mockMediaRepository.findById.mockResolvedValue(mockMedia as any);

      const result = await getMediaService.execute(mediaId);

      expect(mockMediaRepository.findById).toHaveBeenCalledWith(mediaId);
      expect(result).toEqual(mockMedia);
    });

    it('should throw an error if media not found', async () => {
      const mediaId = '123';

      mockMediaRepository.findById.mockResolvedValue(null);

      await expect(getMediaService.execute(mediaId)).rejects.toMatchObject({
        message: 'Media content not found',
        statusCode: 404,
      });
    });
  });
});
