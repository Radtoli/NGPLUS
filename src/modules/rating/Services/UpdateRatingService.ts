import { UpdateRatingDTO } from "../Dtos/updateRatingDTO";
import { Rating } from "../infra/typeorm/Rating";
import { IRatingRepository } from "../Repositories/model/IRatingRepository";
import { AppError } from "@shared/errors/AppError";

export class UpdateRatingService {
  constructor(private ratingRepository: IRatingRepository) { }

  async execute(ratingId: string, userId: string, data: UpdateRatingDTO): Promise<Rating> {
    const rating = await this.ratingRepository.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.user_id !== userId) {
      throw new AppError('You can only update your own ratings', 403);
    }

    if (data.stars !== undefined && (data.stars < 1 || data.stars > 5)) {
      throw new AppError('Stars must be between 1 and 5', 400);
    }

    if (data.stars !== undefined) rating.stars = data.stars;

    const updatedRating = await this.ratingRepository.update(rating);

    return updatedRating;
  }
}
