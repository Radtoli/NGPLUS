import { FastifyReply, FastifyRequest } from "fastify";
import { ListMediaQueryType } from "../schemas/queryParams/listMediaQuerySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  query: ListMediaQueryType;
}

export async function listMediaHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const listMediaService = container.resolve('listMediaService');
  const { query } = request;

  try {
    const result = await listMediaService.execute(query);

    reply.status(200).send(result);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
