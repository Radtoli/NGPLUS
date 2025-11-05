import { FastifyReply, FastifyRequest } from "fastify";
import { MediaIdParamType } from "../schemas/params/mediaIdParamSchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  params: MediaIdParamType;
}

export async function deleteMediaHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const deleteMediaService = container.resolve('deleteMediaService');
  const { params } = request;

  try {
    await deleteMediaService.execute(params.id);

    reply.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
