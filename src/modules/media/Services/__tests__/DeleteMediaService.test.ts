import { DeleteMediaService } from '../DeleteMediaService';
import { IMediaRepository } from '../../Repositories/model/IMediaRepository';
import { AppError } from '@shared/errors/AppError';

describe('DeleteMediaService', () => {
  let deleteMediaService: DeleteMediaService;
  let mockMediaRepository: jest.Mocked<IMediaRepository>;

  beforeEach(() => {
    mockMediaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    deleteMediaService = new DeleteMediaService(mockMediaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete media successfully', async () => {
      const mediaId = '123';
      const mockMedia = {
        media_id: mediaId,
        title: 'Test Media',
        description: 'Test Description',
      };

      mockMediaRepository.findById.mockResolvedValue(mockMedia as any);

      await deleteMediaService.execute(mediaId);

      expect(mockMediaRepository.findById).toHaveBeenCalledWith(mediaId);
      expect(mockMediaRepository.delete).toHaveBeenCalledWith(mediaId);
    });

    it('should throw an error if media not found', async () => {
      const mediaId = '123';

      mockMediaRepository.findById.mockResolvedValue(null);

      await expect(deleteMediaService.execute(mediaId)).rejects.toMatchObject({
        message: 'Media content not found',
        statusCode: 404,
      });

      expect(mockMediaRepository.delete).not.toHaveBeenCalled();
    });
  });
});
