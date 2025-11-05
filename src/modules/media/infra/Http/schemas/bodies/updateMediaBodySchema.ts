import { Static, Type } from "@sinclair/typebox";

export const updateMediaBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  description: Type.Optional(Type.String({ minLength: 1 })),
  category: Type.Optional(Type.Union([
    Type.Literal('game'),
    Type.Literal('video'),
    Type.Literal('artwork'),
    Type.Literal('music')
  ])),
  thumbnail_url: Type.Optional(Type.String({ format: 'uri' })),
  content_url: Type.Optional(Type.String({ format: 'uri' }))
});

export type UpdateMediaBodyType = Static<typeof updateMediaBodySchema>;
