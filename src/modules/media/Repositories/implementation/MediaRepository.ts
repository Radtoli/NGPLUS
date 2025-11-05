import { MediaContent } from "@modules/media/infra/typeorm/MediaContent";
import { DataSource, Repository, ILike } from "typeorm";
import { IMediaRepository } from "../model/IMediaRepository";
import { CreateMediaDTO } from "@modules/media/Dtos/createMediaDTO";
import { ListMediaDTO, PaginatedResponse } from "@modules/media/Dtos/listMediaDTO";

export class MediaRepository implements IMediaRepository {
  private ormRepository: Repository<MediaContent>;

  constructor(postgresDataSource: DataSource) {
    this.ormRepository = postgresDataSource.getRepository(MediaContent);
  }

  async create(data: CreateMediaDTO): Promise<MediaContent> {
    const media = this.ormRepository.create(data);
    await this.ormRepository.save(media);
    return media;
  }

  async update(media: MediaContent): Promise<MediaContent> {
    return this.ormRepository.save(media);
  }

  async delete(mediaId: string): Promise<void> {
    await this.ormRepository.delete(mediaId);
  }

  async findById(mediaId: string): Promise<MediaContent | null> {
    const media = await this.ormRepository.findOneBy({ media_id: mediaId });
    return media || null;
  } async findAll(filters: ListMediaDTO): Promise<PaginatedResponse<MediaContent>> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.category) {
      where.category = ILike(`%${filters.category}%`);
    }

    if (filters.title) {
      where.title = ILike(`%${filters.title}%`);
    }

    const [data, total] = await this.ormRepository.findAndCount({
      where,
      order: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
