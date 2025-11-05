import { FastifyInstance } from "fastify";
import { CreateRatingBodyType, createRatingBodySchema } from "../schemas/bodies/createRatingBodySchema";
import { UpdateRatingBodyType, updateRatingBodySchema } from "../schemas/bodies/updateRatingBodySchema";
import { ListRatingQueryType, listRatingQuerySchema } from "../schemas/queryParams/listRatingQuerySchema";
import { RatingIdParamType, ratingIdParamSchema } from "../schemas/params/ratingIdParamSchema";
import { ratingResponseSchema, paginatedRatingResponseSchema } from "../schemas/responses/ratingResponseSchema";
import { AuthHeaderType, authHeaderSchema } from "@modules/users/infra/http/schemas/headers/authHeaderSchema";
import { createRatingHandler } from "../Handlers/createRatingHandler";
import { updateRatingHandler } from "../Handlers/updateRatingHandler";
import { deleteRatingHandler } from "../Handlers/deleteRatingHandler";
import { listRatingHandler } from "../Handlers/listRatingHandler";
import { getRatingHandler } from "../Handlers/getRatingHandler";
import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";
import {
  unauthorizedResponseSchema,
  badRequestResponseSchema,
  internalServerErrorResponseSchema,
  notFoundResponseSchema,
  forbiddenResponseSchema
} from "@shared/infra/http/schemas/errorSchemas";

export async function ratingRouter(app: FastifyInstance): Promise<void> {
  app.post<{ Body: CreateRatingBodyType, Headers: AuthHeaderType }>("/", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Rating"],
      summary: "Create new rating",
      description: "Creates a new rating for a media content. Requires JWT authentication. Users can only rate each media once.",
      body: createRatingBodySchema,
      headers: authHeaderSchema,
      response: {
        201: ratingResponseSchema,
        400: badRequestResponseSchema,
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, createRatingHandler);

  app.get<{ Querystring: ListRatingQueryType, Headers: AuthHeaderType }>("/", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Rating"],
      summary: "List all ratings",
      description: "Lists all ratings with pagination, filtering and sorting. Requires JWT authentication.",
      querystring: listRatingQuerySchema,
      headers: authHeaderSchema,
      response: {
        200: paginatedRatingResponseSchema,
        401: unauthorizedResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, listRatingHandler);

  app.get<{ Params: RatingIdParamType, Headers: AuthHeaderType }>("/:id", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Rating"],
      summary: "Get rating by ID",
      description: "Retrieves a specific rating by its ID. Requires JWT authentication.",
      params: ratingIdParamSchema,
      headers: authHeaderSchema,
      response: {
        200: ratingResponseSchema,
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, getRatingHandler);

  app.put<{ Params: RatingIdParamType, Body: UpdateRatingBodyType, Headers: AuthHeaderType }>("/:id", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Rating"],
      summary: "Update rating",
      description: "Updates a rating by its ID. Users can only update their own ratings. Requires JWT authentication.",
      params: ratingIdParamSchema,
      body: updateRatingBodySchema,
      headers: authHeaderSchema,
      response: {
        200: ratingResponseSchema,
        400: badRequestResponseSchema,
        401: unauthorizedResponseSchema,
        403: forbiddenResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, updateRatingHandler);

  app.delete<{ Params: RatingIdParamType, Headers: AuthHeaderType }>("/:id", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Rating"],
      summary: "Delete rating",
      description: "Deletes a rating by its ID. Users can only delete their own ratings. Requires JWT authentication.",
      params: ratingIdParamSchema,
      headers: authHeaderSchema,
      response: {
        204: {
          description: 'Rating deleted successfully',
          type: 'null'
        },
        401: unauthorizedResponseSchema,
        403: forbiddenResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, deleteRatingHandler);
}
