import { FastifyReply, FastifyRequest } from "fastify";
import { LoginUserBodyType } from "../schemas/bodies/loginUsersBodySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: LoginUserBodyType
}

export async function loginUserHandler({ body }: IRequest, reply: FastifyReply): Promise<void> {
  const loginUserService = container.resolve('loginUserService');

  try {
    const result = await loginUserService.execute(body);

    reply.status(200).send(result);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });

      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
