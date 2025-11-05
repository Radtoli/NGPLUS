import { Static, Type } from "@sinclair/typebox";

export const updateUsersBodySchema = Type.Object({
  username: Type.Optional(Type.String({ minLength: 3, maxLength: 30 })),
  email: Type.Optional(Type.String({ format: 'email' })),
  password: Type.Optional(Type.String({ minLength: 6 })),
  password_confirmation: Type.Optional(Type.String({ minLength: 6 }))
});

export type UpdateUserBodyType = Static<typeof updateUsersBodySchema>;
