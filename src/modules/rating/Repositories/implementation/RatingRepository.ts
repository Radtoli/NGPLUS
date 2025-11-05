import { Rating } from "@modules/rating/infra/typeorm/Rating";
import { DataSource, Repository } from "typeorm";
import { IRatingRepository } from "../model/IRatingRepository";
import { CreateRatingDTO } from "@modules/rating/Dtos/createRatingDTO";
import { ListRatingDTO, PaginatedResponse } from "@modules/rating/Dtos/listRatingDTO";

export class RatingRepository implements IRatingRepository {
  private ormRepository: Repository<Rating>;

  constructor(postgresDataSource: DataSource) {
    this.ormRepository = postgresDataSource.getRepository(Rating);
  }

  async create(data: CreateRatingDTO, userId: string): Promise<Rating> {
    const rating = this.ormRepository.create({
      ...data,
      user_id: userId,
    });
    await this.ormRepository.save(rating);
    return rating;
  }

  async update(rating: Rating): Promise<Rating> {
    return this.ormRepository.save(rating);
  }

  async delete(ratingId: string): Promise<void> {
    await this.ormRepository.delete(ratingId);
  }

  async findById(ratingId: string): Promise<Rating | null> {
    const rating = await this.ormRepository.findOne({
      where: { rating_id: ratingId },
      relations: ['user', 'mediaContent'],
    });
    return rating || null;
  }

  async findByUserAndMedia(userId: string, mediaId: string): Promise<Rating | null> {
    const rating = await this.ormRepository.findOne({
      where: {
        user_id: userId,
        media_id: mediaId,
      },
    });
    return rating || null;
  }

  async findAll(filters: ListRatingDTO): Promise<PaginatedResponse<Rating>> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.media_id) {
      where.media_id = filters.media_id;
    }

    if (filters.user_id) {
      where.user_id = filters.user_id;
    }

    if (filters.stars) {
      where.stars = filters.stars;
    }

    const [data, total] = await this.ormRepository.findAndCount({
      where,
      order: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      relations: ['user', 'mediaContent'],
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
