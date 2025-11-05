import { Static, Type } from "@sinclair/typebox";

export const listRatingQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  sortBy: Type.Optional(Type.String({ default: 'created_at' })),
  sortOrder: Type.Optional(Type.Union([Type.Literal('ASC'), Type.Literal('DESC')], { default: 'DESC' })),
  media_id: Type.Optional(Type.String({ format: 'uuid' })),
  user_id: Type.Optional(Type.String({ format: 'uuid' })),
  stars: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 }))
});

export type ListRatingQueryType = Static<typeof listRatingQuerySchema>;
