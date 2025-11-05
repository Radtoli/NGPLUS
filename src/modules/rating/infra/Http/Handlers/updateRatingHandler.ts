import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateRatingBodyType } from "../schemas/bodies/updateRatingBodySchema";
import { RatingIdParamType } from "../schemas/params/ratingIdParamSchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: UpdateRatingBodyType;
  params: RatingIdParamType;
}

export async function updateRatingHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const updateRatingService = container.resolve('updateRatingService');
  const { body, params, user } = request;

  if (!user) {
    reply.status(401).send({ message: 'User not authenticated' });
    return;
  }

  try {
    const rating = await updateRatingService.execute(params.id, user.user_id, body);

    reply.status(200).send(rating);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
