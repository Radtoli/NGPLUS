import { Static, Type } from "@sinclair/typebox";

export const createMediaBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.String({ minLength: 1 }),
  category: Type.Union([
    Type.Literal('game'),
    Type.Literal('video'),
    Type.Literal('artwork'),
    Type.Literal('music')
  ]),
  thumbnail_url: Type.String({ format: 'uri' }),
  content_url: Type.String({ format: 'uri' })
});

export type CreateMediaBodyType = Static<typeof createMediaBodySchema>;
