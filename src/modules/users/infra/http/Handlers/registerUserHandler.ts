import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBodyType } from "../schemas/bodies/registerUsersBodySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: CreateUserBodyType
}

export async function registerUserHandler({ body }: IRequest, reply: FastifyReply): Promise<void> {
  const registerUserService = container.resolve('registerUserService');

  try {
    await registerUserService.execute(body);

    reply.status(201).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });

      return;
    }

    reply.status(500).send({ message: 'Internal server error' });

  }

}

