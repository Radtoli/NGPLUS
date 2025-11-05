import { Static, Type } from "@sinclair/typebox";

export const loginResponseSchema = Type.Object({
  token: Type.String(),
  user: Type.Object({
    user_id: Type.String(),
    username: Type.String(),
    email: Type.String({ format: 'email' })
  })
});

export type LoginResponseType = Static<typeof loginResponseSchema>;
