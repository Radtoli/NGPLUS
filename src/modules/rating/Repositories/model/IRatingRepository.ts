import { Rating } from "@modules/rating/infra/typeorm/Rating";
import { CreateRatingDTO } from "@modules/rating/Dtos/createRatingDTO";
import { ListRatingDTO, PaginatedResponse } from "@modules/rating/Dtos/listRatingDTO";

export interface IRatingRepository {
  create(data: CreateRatingDTO, userId: string): Promise<Rating>;
  update(rating: Rating): Promise<Rating>;
  delete(ratingId: string): Promise<void>;
  findById(ratingId: string): Promise<Rating | null>;
  findAll(filters: ListRatingDTO): Promise<PaginatedResponse<Rating>>;
  findByUserAndMedia(userId: string, mediaId: string): Promise<Rating | null>;
}
