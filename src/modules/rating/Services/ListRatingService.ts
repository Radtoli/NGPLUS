import { IRatingRepository } from "../Repositories/model/IRatingRepository";
import { ListRatingDTO, PaginatedResponse } from "../Dtos/listRatingDTO";
import { Rating } from "../infra/typeorm/Rating";

export class ListRatingService {
  constructor(private ratingRepository: IRatingRepository) { }

  async execute(filters: ListRatingDTO): Promise<PaginatedResponse<Rating>> {
    return this.ratingRepository.findAll(filters);
  }
}
