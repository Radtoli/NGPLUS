import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMediaBodyType } from "../schemas/bodies/createMediaBodySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: CreateMediaBodyType;
}

export async function createMediaHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const createMediaService = container.resolve('createMediaService');
  const { body, user } = request;

  if (!user) {
    reply.status(401).send({ message: 'User not authenticated' });
    return;
  }

  try {
    const media = await createMediaService.execute(body, user.user_id);

    reply.status(201).send(media);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
