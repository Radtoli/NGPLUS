import { FastifyReply, FastifyRequest } from "fastify";
import { MediaIdParamType } from "../schemas/params/mediaIdParamSchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  params: MediaIdParamType;
}

export async function getMediaHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const getMediaService = container.resolve('getMediaService');
  const { params } = request;

  try {
    const media = await getMediaService.execute(params.id);

    reply.status(200).send(media);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
