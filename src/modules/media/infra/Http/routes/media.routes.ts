import { FastifyInstance } from "fastify";
import { CreateMediaBodyType, createMediaBodySchema } from "../schemas/bodies/createMediaBodySchema";
import { UpdateMediaBodyType, updateMediaBodySchema } from "../schemas/bodies/updateMediaBodySchema";
import { ListMediaQueryType, listMediaQuerySchema } from "../schemas/queryParams/listMediaQuerySchema";
import { MediaIdParamType, mediaIdParamSchema } from "../schemas/params/mediaIdParamSchema";
import { mediaResponseSchema, paginatedMediaResponseSchema } from "../schemas/responses/mediaResponseSchema";
import { AuthHeaderType, authHeaderSchema } from "@modules/users/infra/http/schemas/headers/authHeaderSchema";
import { createMediaHandler } from "../Handlers/createMediaHandler";
import { updateMediaHandler } from "../Handlers/updateMediaHandler";
import { deleteMediaHandler } from "../Handlers/deleteMediaHandler";
import { listMediaHandler } from "../Handlers/listMediaHandler";
import { getMediaHandler } from "../Handlers/getMediaHandler";
import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";
import {
  unauthorizedResponseSchema,
  badRequestResponseSchema,
  internalServerErrorResponseSchema,
  notFoundResponseSchema
} from "@shared/infra/http/schemas/errorSchemas";

export async function mediaRouter(app: FastifyInstance): Promise<void> {
  app.post<{ Body: CreateMediaBodyType, Headers: AuthHeaderType }>("/", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Media"],
      summary: "Create new media content",
      description: "Creates a new media content. Requires JWT authentication. Increments user's rating_count.",
      body: createMediaBodySchema,
      headers: authHeaderSchema,
      response: {
        201: mediaResponseSchema,
        400: badRequestResponseSchema,
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, createMediaHandler);

  app.get<{ Querystring: ListMediaQueryType, Headers: AuthHeaderType }>("/", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Media"],
      summary: "List all media contents",
      description: "Lists all media contents with pagination, filtering and sorting. Requires JWT authentication.",
      querystring: listMediaQuerySchema,
      headers: authHeaderSchema,
      response: {
        200: paginatedMediaResponseSchema,
        401: unauthorizedResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, listMediaHandler);

  app.get<{ Params: MediaIdParamType, Headers: AuthHeaderType }>("/:id", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Media"],
      summary: "Get media content by ID",
      description: "Retrieves a specific media content by its ID. Requires JWT authentication.",
      params: mediaIdParamSchema,
      headers: authHeaderSchema,
      response: {
        200: mediaResponseSchema,
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, getMediaHandler);

  app.put<{ Params: MediaIdParamType, Body: UpdateMediaBodyType, Headers: AuthHeaderType }>("/:id", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Media"],
      summary: "Update media content",
      description: "Updates a media content by its ID. Requires JWT authentication.",
      params: mediaIdParamSchema,
      body: updateMediaBodySchema,
      headers: authHeaderSchema,
      response: {
        200: mediaResponseSchema,
        400: badRequestResponseSchema,
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, updateMediaHandler);

  app.delete<{ Params: MediaIdParamType, Headers: AuthHeaderType }>("/:id", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Media"],
      summary: "Delete media content",
      description: "Deletes a media content by its ID. Requires JWT authentication.",
      params: mediaIdParamSchema,
      headers: authHeaderSchema,
      response: {
        204: {
          description: 'Media content deleted successfully',
          type: 'null'
        },
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, deleteMediaHandler);
}
