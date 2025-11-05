import { IMediaRepository } from "../Repositories/model/IMediaRepository";
import { AppError } from "@shared/errors/AppError";

export class DeleteMediaService {
  constructor(private mediaRepository: IMediaRepository) { }

  async execute(mediaId: string): Promise<void> {
    const media = await this.mediaRepository.findById(mediaId);

    if (!media) {
      throw new AppError('Media content not found', 404);
    }

    await this.mediaRepository.delete(mediaId);
  }
}
