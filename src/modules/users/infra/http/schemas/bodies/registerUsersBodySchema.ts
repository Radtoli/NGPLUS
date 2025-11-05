import { Static, Type } from "@sinclair/typebox";

export const createUsersBodySchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 30 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  password_confirmation: Type.String({ minLength: 6 })
})


export type CreateUserBodyType = Static<typeof createUsersBodySchema>;