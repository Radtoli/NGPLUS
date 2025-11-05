import { Static, Type } from "@sinclair/typebox";

export const mediaIdParamSchema = Type.Object({
  id: Type.String({ format: 'uuid' })
});

export type MediaIdParamType = Static<typeof mediaIdParamSchema>;
