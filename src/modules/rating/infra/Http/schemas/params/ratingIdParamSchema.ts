import { Static, Type } from "@sinclair/typebox";

export const ratingIdParamSchema = Type.Object({
  id: Type.String({ format: 'uuid' })
});

export type RatingIdParamType = Static<typeof ratingIdParamSchema>;
