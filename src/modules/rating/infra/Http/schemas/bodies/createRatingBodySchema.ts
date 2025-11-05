import { Static, Type } from "@sinclair/typebox";

export const createRatingBodySchema = Type.Object({
  media_id: Type.String({ format: 'uuid' }),
  stars: Type.Integer({ minimum: 1, maximum: 5 })
});

export type CreateRatingBodyType = Static<typeof createRatingBodySchema>;
