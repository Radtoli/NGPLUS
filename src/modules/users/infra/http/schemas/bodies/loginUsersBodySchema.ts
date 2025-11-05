import { Static, Type } from "@sinclair/typebox";

export const loginUsersBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
})


export type LoginUserBodyType = Static<typeof loginUsersBodySchema>;
