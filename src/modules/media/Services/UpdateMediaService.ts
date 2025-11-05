import { UpdateMediaDTO } from "../Dtos/updateMediaDTO";
import { MediaContent } from "../infra/typeorm/MediaContent";
import { IMediaRepository } from "../Repositories/model/IMediaRepository";
import { AppError } from "@shared/errors/AppError";

export class UpdateMediaService {
  constructor(private mediaRepository: IMediaRepository) { }

  async execute(mediaId: string, data: UpdateMediaDTO): Promise<MediaContent> {
    const media = await this.mediaRepository.findById(mediaId);

    if (!media) {
      throw new AppError('Media content not found', 404);
    }

    if (data.title !== undefined) media.title = data.title;
    if (data.description !== undefined) media.description = data.description;
    if (data.category !== undefined) media.category = data.category;
    if (data.thumbnail_url !== undefined) media.thumbnail_url = data.thumbnail_url;
    if (data.content_url !== undefined) media.content_url = data.content_url;

    const updatedMedia = await this.mediaRepository.update(media);

    return updatedMedia;
  }
}
