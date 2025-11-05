import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserBodyType } from "../schemas/bodies/updateUsersBodySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: UpdateUserBodyType;
}

export async function updateUserHandler({ body, user }: IRequest, reply: FastifyReply): Promise<void> {
  const updateUserService = container.resolve('updateUserService');

  try {
    if (!user) {
      reply.status(401).send({ message: 'Unauthorized' });

      return;
    }

    await updateUserService.execute(user.user_id, body);

    reply.status(200).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });

      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
