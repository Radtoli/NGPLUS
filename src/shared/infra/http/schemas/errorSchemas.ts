import { Type } from "@sinclair/typebox";

export const errorResponseSchema = Type.Object({
  message: Type.String()
});

export const unauthorizedResponseSchema = Type.Object({
  message: Type.String({
    examples: ['Token not provided', 'Invalid token', 'Invalid credentials']
  })
});

export const notFoundResponseSchema = Type.Object({
  message: Type.String({
    examples: ['User not found']
  })
});

export const conflictResponseSchema = Type.Object({
  message: Type.String({
    examples: ['Email already in use']
  })
});

export const badRequestResponseSchema = Type.Object({
  message: Type.String({
    examples: ['Password confirmation does not match', 'Invalid input']
  })
});

export const forbiddenResponseSchema = Type.Object({
  message: Type.String({
    examples: ['You can only update your own ratings', 'You can only delete your own ratings', 'Access denied']
  })
});

export const internalServerErrorResponseSchema = Type.Object({
  message: Type.String({
    examples: ['Internal server error', 'JWT secret not configured']
  })
});
