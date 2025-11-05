import { CreateMediaDTO } from "../Dtos/createMediaDTO";
import { MediaContent } from "../infra/typeorm/MediaContent";
import { IMediaRepository } from "../Repositories/model/IMediaRepository";
import { IUserRepository } from "@modules/users/Repositories/model/IUserRepository";
import { AppError } from "@shared/errors/AppError";

export class CreateMediaService {
  constructor(
    private mediaRepository: IMediaRepository,
    private userRepository: IUserRepository
  ) { }

  async execute(data: CreateMediaDTO, userId: string): Promise<MediaContent> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const media = await this.mediaRepository.create(data);

    user.rating_count = (user.rating_count || 0) + 1;
    await this.userRepository.update(user);

    return media;
  }
}
