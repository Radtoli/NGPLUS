import { FastifyReply, FastifyRequest } from "fastify";
import { RatingIdParamType } from "../schemas/params/ratingIdParamSchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  params: RatingIdParamType;
}

export async function deleteRatingHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const deleteRatingService = container.resolve('deleteRatingService');
  const { params, user } = request;

  if (!user) {
    reply.status(401).send({ message: 'User not authenticated' });
    return;
  }

  try {
    await deleteRatingService.execute(params.id, user.user_id);

    reply.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
