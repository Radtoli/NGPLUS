import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { userRouter } from '@modules/users/infra/http/routes/users.routes';
import { mediaRouter } from '@modules/media/infra/Http/routes/media.routes';
import { ratingRouter } from '@modules/rating/infra/Http/routes/rating.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-password'],
  });

  await app.register(swagger, {
    swagger: {
      info: {
        title: 'NGPlusTest API',
        description: 'API Documentation',
        version: '1.0.0',
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Users', description: 'User management and authentication endpoints' },
        { name: 'Media', description: 'Media content management endpoints' },
        { name: 'Rating', description: 'Rating management endpoints' },
        { name: 'health', description: 'Health check endpoints' },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) { next(); },
      preHandler: function (_request, _reply, next) { next(); }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecificationClone: true,
  });

  app.get('/swagger.json', async (request, reply) => {
    const swaggerObject: any = app.swagger();
    const protocol = request.headers['x-forwarded-proto'] || request.protocol;
    const host = request.headers['x-forwarded-host'] || request.hostname;

    swaggerObject.host = host;
    swaggerObject.schemes = protocol === 'https' ? ['https', 'http'] : ['http', 'https'];

    return reply.send(swaggerObject);
  });

  app.get('/', {
    schema: {
      summary: 'Redirect to API documentation',
      description: 'Redirects to the Swagger API documentation',
    }
  }, async (_request, reply) => {
    return reply.redirect('/docs');
  });

  app.register(userRouter, { prefix: '/users' });
  app.register(mediaRouter, { prefix: '/media' });
  app.register(ratingRouter, { prefix: '/ratings' });

  app.get('/health', {
    schema: {
      tags: ['health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async (_request, reply) => {
    return reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });


  return app;
}
