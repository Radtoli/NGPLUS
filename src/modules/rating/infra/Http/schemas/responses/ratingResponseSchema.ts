import { Type } from "@sinclair/typebox";

export const ratingResponseSchema = Type.Object({
  rating_id: Type.String({ format: 'uuid' }),
  user_id: Type.String({ format: 'uuid' }),
  media_id: Type.String({ format: 'uuid' }),
  stars: Type.Integer({ minimum: 1, maximum: 5 }),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' })
});

export const paginatedRatingResponseSchema = Type.Object({
  data: Type.Array(ratingResponseSchema),
  pagination: Type.Object({
    page: Type.Integer(),
    limit: Type.Integer(),
    total: Type.Integer(),
    totalPages: Type.Integer()
  })
});
