import { UserRepository } from "@modules/users/Repositories/implementation/UserRepository";
import { MediaRepository } from "@modules/media/Repositories/implementation/MediaRepository";
import { RatingRepository } from "@modules/rating/Repositories/implementation/RatingRepository";
import { asClass, AwilixContainer } from "awilix";

export function registerRepositories(container: AwilixContainer): void {
  container.register('userRepository', asClass(UserRepository, { lifetime: 'SINGLETON' }));
  container.register('mediaRepository', asClass(MediaRepository, { lifetime: 'SINGLETON' }));
  container.register('ratingRepository', asClass(RatingRepository, { lifetime: 'SINGLETON' }));
}