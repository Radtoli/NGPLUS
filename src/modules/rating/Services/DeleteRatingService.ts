import { IRatingRepository } from "../Repositories/model/IRatingRepository";
import { AppError } from "@shared/errors/AppError";

export class DeleteRatingService {
  constructor(private ratingRepository: IRatingRepository) { }

  async execute(ratingId: string, userId: string): Promise<void> {
    const rating = await this.ratingRepository.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.user_id !== userId) {
      throw new AppError('You can only delete your own ratings', 403);
    }

    await this.ratingRepository.delete(ratingId);
  }
}
