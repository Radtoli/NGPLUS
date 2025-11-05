import { FastifyReply, FastifyRequest } from "fastify";
import { ListRatingQueryType } from "../schemas/queryParams/listRatingQuerySchema";
import { container } from "@shared/infra/containers";
import { AppError } from "@shared/errors/AppError";

interface IRequest extends FastifyRequest {
  query: ListRatingQueryType;
}

export async function listRatingHandler(request: IRequest, reply: FastifyReply): Promise<void> {
  const listRatingService = container.resolve('listRatingService');
  const { query } = request;

  try {
    const result = await listRatingService.execute(query);

    reply.status(200).send(result);
  } catch (error: any) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}
