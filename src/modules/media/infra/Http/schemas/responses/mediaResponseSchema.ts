import { Type } from "@sinclair/typebox";

export const mediaResponseSchema = Type.Object({
  media_id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  description: Type.String(),
  category: Type.Union([
    Type.Literal('game'),
    Type.Literal('video'),
    Type.Literal('artwork'),
    Type.Literal('music')
  ]),
  thumbnail_url: Type.String(),
  content_url: Type.String(),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' })
});

export const paginatedMediaResponseSchema = Type.Object({
  data: Type.Array(mediaResponseSchema),
  pagination: Type.Object({
    page: Type.Integer(),
    limit: Type.Integer(),
    total: Type.Integer(),
    totalPages: Type.Integer()
  })
});
