import { MediaContent } from "@modules/media/infra/typeorm/MediaContent";
import { CreateMediaDTO } from "@modules/media/Dtos/createMediaDTO";
import { ListMediaDTO, PaginatedResponse } from "@modules/media/Dtos/listMediaDTO";

export interface IMediaRepository {
  create(data: CreateMediaDTO): Promise<MediaContent>;
  update(media: MediaContent): Promise<MediaContent>;
  delete(mediaId: string): Promise<void>;
  findById(mediaId: string): Promise<MediaContent | null>;
  findAll(filters: ListMediaDTO): Promise<PaginatedResponse<MediaContent>>;
}
