import { IMediaRepository } from "../Repositories/model/IMediaRepository";
import { MediaContent } from "../infra/typeorm/MediaContent";
import { AppError } from "@shared/errors/AppError";

export class GetMediaService {
  constructor(private mediaRepository: IMediaRepository) { }

  async execute(mediaId: string): Promise<MediaContent> {
    const media = await this.mediaRepository.findById(mediaId);

    if (!media) {
      throw new AppError('Media content not found', 404);
    }

    return media;
  }
}
