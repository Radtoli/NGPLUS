import { CreateRatingDTO } from "../Dtos/createRatingDTO";
import { Rating } from "../infra/typeorm/Rating";
import { IRatingRepository } from "../Repositories/model/IRatingRepository";
import { IUserRepository } from "@modules/users/Repositories/model/IUserRepository";
import { IMediaRepository } from "@modules/media/Repositories/model/IMediaRepository";
import { AppError } from "@shared/errors/AppError";

export class CreateRatingService {
  constructor(
    private ratingRepository: IRatingRepository,
    private userRepository: IUserRepository,
    private mediaRepository: IMediaRepository
  ) { }

  async execute(data: CreateRatingDTO, userId: string): Promise<Rating> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const media = await this.mediaRepository.findById(data.media_id);

    if (!media) {
      throw new AppError('Media content not found', 404);
    }

    if (data.stars < 1 || data.stars > 5) {
      throw new AppError('Stars must be between 1 and 5', 400);
    }


    await this.userRepository.create({ ...user, rating_count: (user.rating_count || 0) + 1 });

    const rating = await this.ratingRepository.create(data, userId);

    return rating;
  }
}
