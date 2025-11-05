import { Static, Type } from "@sinclair/typebox";

export const updateRatingBodySchema = Type.Object({
  stars: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 }))
});

export type UpdateRatingBodyType = Static<typeof updateRatingBodySchema>;
