import { FastifyInstance } from "fastify";
import { CreateUserBodyType, createUsersBodySchema } from "../schemas/bodies/registerUsersBodySchema";
import { LoginUserBodyType, loginUsersBodySchema } from "../schemas/bodies/loginUsersBodySchema";
import { UpdateUserBodyType, updateUsersBodySchema } from "../schemas/bodies/updateUsersBodySchema";
import { loginResponseSchema } from "../schemas/responses/loginResponseSchema";
import { profileResponseSchema } from "../schemas/responses/profileResponseSchema";
import { AuthHeaderType, authHeaderSchema } from "../schemas/headers/authHeaderSchema";
import { AdminPasswordHeaderType, adminPasswordHeaderSchema } from "../schemas/headers/adminPasswordHeaderSchema";
import { registerUserHandler } from "../Handlers/registerUserHandler";
import { loginUserHandler } from "../Handlers/loginUserHandler";
import { updateUserHandler } from "../Handlers/updateUserHandler";
import { deleteUserHandler } from "../Handlers/deleteUserHandler";
import { authenticateJWT } from "@shared/infra/http/middlewares/authenticateJWT";
import {
  unauthorizedResponseSchema,
  conflictResponseSchema,
  badRequestResponseSchema,
  internalServerErrorResponseSchema,
  notFoundResponseSchema
} from "@shared/infra/http/schemas/errorSchemas";

export async function userRouter(app: FastifyInstance): Promise<void> {
  app.post<{ Body: CreateUserBodyType }>("/register", {
    schema: {
      tags: ["Users"],
      summary: "Register a new user",
      description: "Creates a new user account with username, email and password",
      body: createUsersBodySchema,
      response: {
        201: {
          description: 'User created successfully',
          type: 'null'
        },
        400: badRequestResponseSchema,
        409: conflictResponseSchema,
        500: internalServerErrorResponseSchema
      }
    }
  }, registerUserHandler)

  app.post<{ Body: LoginUserBodyType }>("/login", {
    schema: {
      tags: ["Users"],
      summary: "Login user",
      description: "Authenticates a user and returns a JWT token",
      body: loginUsersBodySchema,
      response: {
        200: loginResponseSchema,
        401: unauthorizedResponseSchema,
        500: internalServerErrorResponseSchema
      }
    }
  }, loginUserHandler)

  app.put<{ Body: UpdateUserBodyType, Headers: AuthHeaderType }>("/update", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Users"],
      summary: "Update user",
      description: "Updates the authenticated user information (username, email, password). Requires JWT token.",
      body: updateUsersBodySchema,
      headers: authHeaderSchema,
      response: {
        200: {
          description: 'User updated successfully',
          type: 'null'
        },
        400: badRequestResponseSchema,
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        409: conflictResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, updateUserHandler)

  app.delete<{ Headers: AdminPasswordHeaderType }>("/delete", {
    preHandler: authenticateJWT,
    schema: {
      tags: ["Users"],
      summary: "Delete user",
      description: "Deletes the authenticated user account. Requires JWT token and admin password in headers.",
      headers: adminPasswordHeaderSchema,
      response: {
        204: {
          description: 'User deleted successfully',
          type: 'null'
        },
        401: unauthorizedResponseSchema,
        404: notFoundResponseSchema,
        500: internalServerErrorResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }
  }, deleteUserHandler);
}