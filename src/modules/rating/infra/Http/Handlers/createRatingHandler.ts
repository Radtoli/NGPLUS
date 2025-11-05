import { FastifyReply, FastifyRequest } from "fastify";
import { CreateRatingBodyType } from "../schemas/bodies/createRatingBodySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: CreateRatingBodyType;
}

export async function createRatingHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const createRatingService = container.resolve('createRatingService');
  const { body, user } = request;

  if (!user) {
    reply.status(401).send({ message: 'User not authenticated' });
    return;
  }

  try {
    const rating = await createRatingService.execute(body, user.user_id);

    reply.status(201).send(rating);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
