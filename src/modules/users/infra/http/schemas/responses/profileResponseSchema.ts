import { Static, Type } from "@sinclair/typebox";

export const profileResponseSchema = Type.Object({
  message: Type.String(),
  user: Type.Object({
    user_id: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' })
  })
});

export type ProfileResponseType = Static<typeof profileResponseSchema>;
