import { RegisterUserService } from "@modules/users/services/RegisterUserService";
import { LoginUserService } from "@modules/users/services/LoginUserService";
import { UpdateUserService } from "@modules/users/services/UpdateUserService";
import { DeleteUserService } from "@modules/users/services/DeleteUserService";
import { asClass, AwilixContainer } from "awilix";
import { CreateMediaService } from "@modules/media/Services/CreateMediaService";
import { DeleteMediaService } from "@modules/media/Services/DeleteMediaService";
import { GetMediaService } from "@modules/media/Services/GetMediaService";
import { ListMediaService } from "@modules/media/Services/ListMediaService";
import { UpdateMediaService } from "@modules/media/Services/UpdateMediaService";
import { CreateRatingService } from "@modules/rating/Services/CreateRatingService";
import { DeleteRatingService } from "@modules/rating/Services/DeleteRatingService";
import { GetRatingService } from "@modules/rating/Services/GetRatingService";
import { ListRatingService } from "@modules/rating/Services/ListRatingService";
import { UpdateRatingService } from "@modules/rating/Services/UpdateRatingService";

export function registerServices(container: AwilixContainer): void {
  container.register('registerUserService', asClass(RegisterUserService, { lifetime: 'SINGLETON' }));

  container.register('loginUserService', asClass(LoginUserService, { lifetime: 'SINGLETON' }));

  container.register('updateUserService', asClass(UpdateUserService, { lifetime: 'SINGLETON' }));

  container.register('deleteUserService', asClass(DeleteUserService, { lifetime: 'SINGLETON' }));

  container.register('createMediaService', asClass(CreateMediaService, { lifetime: 'SINGLETON' }));

  container.register('updateMediaService', asClass(UpdateMediaService, { lifetime: 'SINGLETON' }));

  container.register('deleteMediaService', asClass(DeleteMediaService, { lifetime: 'SINGLETON' }));

  container.register('listMediaService', asClass(ListMediaService, { lifetime: 'SINGLETON' }));

  container.register('getMediaService', asClass(GetMediaService, { lifetime: 'SINGLETON' }));

  container.register('createRatingService', asClass(CreateRatingService, { lifetime: 'SINGLETON' }));

  container.register('updateRatingService', asClass(UpdateRatingService, { lifetime: 'SINGLETON' }));

  container.register('deleteRatingService', asClass(DeleteRatingService, { lifetime: 'SINGLETON' }));

  container.register('listRatingService', asClass(ListRatingService, { lifetime: 'SINGLETON' }));

  container.register('getRatingService', asClass(GetRatingService, { lifetime: 'SINGLETON' }));
}