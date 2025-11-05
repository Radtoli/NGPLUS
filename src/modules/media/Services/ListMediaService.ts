import { IMediaRepository } from "../Repositories/model/IMediaRepository";
import { ListMediaDTO, PaginatedResponse } from "../Dtos/listMediaDTO";
import { MediaContent } from "../infra/typeorm/MediaContent";

export class ListMediaService {
  constructor(private mediaRepository: IMediaRepository) { }

  async execute(filters: ListMediaDTO): Promise<PaginatedResponse<MediaContent>> {
    return this.mediaRepository.findAll(filters);
  }
}
