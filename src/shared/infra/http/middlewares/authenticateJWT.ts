import { FastifyRequest, FastifyReply } from "fastify";
import * as jwt from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";

interface JWTPayload {
  user_id: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export async function authenticateJWT(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.status(401).send({ message: 'Token not provided' });
    return;
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    reply.status(401).send({ message: 'Token not provided' });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    reply.status(500).send({ message: 'JWT secret not configured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    request.user = decoded;
  } catch (error) {
    reply.status(401).send({ message: 'Invalid token' });
    return;
  }
}
