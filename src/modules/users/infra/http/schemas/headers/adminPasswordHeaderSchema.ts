import { Static, Type } from "@sinclair/typebox";

export const adminPasswordHeaderSchema = Type.Object({
  authorization: Type.String({
    description: 'JWT token in format: Bearer <token>',
    pattern: '^Bearer .+$',
    examples: ['Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...']
  }),
  'x-admin-password': Type.String({
    description: 'Admin password for user deletion authorization',
    examples: ['admin_secret_password']
  })
});

export type AdminPasswordHeaderType = Static<typeof adminPasswordHeaderSchema>;
