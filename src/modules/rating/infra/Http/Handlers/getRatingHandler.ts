import { FastifyReply, FastifyRequest } from "fastify";
import { RatingIdParamType } from "../schemas/params/ratingIdParamSchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  params: RatingIdParamType;
}

export async function getRatingHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const getRatingService = container.resolve('getRatingService');
  const { params } = request;

  try {
    const rating = await getRatingService.execute(params.id);

    reply.status(200).send(rating);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
