import { UpdateMediaService } from '../UpdateMediaService';
import { IMediaRepository } from '../../Repositories/model/IMediaRepository';
import { AppError } from '@shared/errors/AppError';

describe('UpdateMediaService', () => {
  let updateMediaService: UpdateMediaService;
  let mockMediaRepository: jest.Mocked<IMediaRepository>;

  beforeEach(() => {
    mockMediaRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    updateMediaService = new UpdateMediaService(mockMediaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update media successfully', async () => {
      const mediaId = '123';
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const mockMedia = {
        media_id: mediaId,
        title: 'Old Title',
        description: 'Old Description',
        category: 'test',
      };

      const updatedMedia = {
        ...mockMedia,
        ...updateData,
      };

      mockMediaRepository.findById.mockResolvedValue(mockMedia as any);
      mockMediaRepository.update.mockResolvedValue(updatedMedia as any);

      const result = await updateMediaService.execute(mediaId, updateData);

      expect(mockMediaRepository.findById).toHaveBeenCalledWith(mediaId);
      expect(mockMediaRepository.update).toHaveBeenCalledWith({
        ...mockMedia,
        title: updateData.title,
        description: updateData.description,
      });
      expect(result).toEqual(updatedMedia);
    });

    it('should update only provided fields', async () => {
      const mediaId = '123';
      const updateData = {
        title: 'Updated Title',
      };

      const mockMedia = {
        media_id: mediaId,
        title: 'Old Title',
        description: 'Old Description',
        category: 'test',
      };

      mockMediaRepository.findById.mockResolvedValue(mockMedia as any);
      mockMediaRepository.update.mockResolvedValue({ ...mockMedia, ...updateData } as any);

      await updateMediaService.execute(mediaId, updateData);

      expect(mockMediaRepository.update).toHaveBeenCalledWith({
        ...mockMedia,
        title: updateData.title,
      });
    });

    it('should throw an error if media not found', async () => {
      const mediaId = '123';
      const updateData = {
        title: 'Updated Title',
      };

      mockMediaRepository.findById.mockResolvedValue(null);

      await expect(updateMediaService.execute(mediaId, updateData)).rejects.toMatchObject({
        message: 'Media content not found',
        statusCode: 404,
      });

      expect(mockMediaRepository.update).not.toHaveBeenCalled();
    });
  });
});
