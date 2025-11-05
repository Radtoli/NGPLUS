import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateMediaBodyType } from "../schemas/bodies/updateMediaBodySchema";
import { MediaIdParamType } from "../schemas/params/mediaIdParamSchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  body: UpdateMediaBodyType;
  params: MediaIdParamType;
}

export async function updateMediaHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const updateMediaService = container.resolve('updateMediaService');
  const { body, params } = request;

  try {
    const media = await updateMediaService.execute(params.id, body);

    reply.status(200).send(media);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
