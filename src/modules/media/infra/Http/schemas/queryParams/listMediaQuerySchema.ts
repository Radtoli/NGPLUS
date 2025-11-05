import { Static, Type } from "@sinclair/typebox";

export const listMediaQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  sortBy: Type.Optional(Type.String({ default: 'created_at' })),
  sortOrder: Type.Optional(Type.Union([Type.Literal('ASC'), Type.Literal('DESC')], { default: 'DESC' })),
  category: Type.Optional(Type.Union([
    Type.Literal('game'),
    Type.Literal('video'),
    Type.Literal('artwork'),
    Type.Literal('music')
  ])),
  title: Type.Optional(Type.String())
});

export type ListMediaQueryType = Static<typeof listMediaQuerySchema>;
