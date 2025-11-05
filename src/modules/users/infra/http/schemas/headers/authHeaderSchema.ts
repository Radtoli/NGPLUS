import { Static, Type } from "@sinclair/typebox";

export const authHeaderSchema = Type.Object({
  authorization: Type.String({
    description: 'JWT token in format: Bearer <token>',
    pattern: '^Bearer\\s+.+$',
    examples: ['Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...']
  })
});

export type AuthHeaderType = Static<typeof authHeaderSchema>;
