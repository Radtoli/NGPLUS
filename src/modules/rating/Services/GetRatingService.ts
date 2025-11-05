import { IRatingRepository } from "../Repositories/model/IRatingRepository";
import { Rating } from "../infra/typeorm/Rating";
import { AppError } from "@shared/errors/AppError";

export class GetRatingService {
  constructor(private ratingRepository: IRatingRepository) { }

  async execute(ratingId: string): Promise<Rating> {
    const rating = await this.ratingRepository.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    return rating;
  }
}
