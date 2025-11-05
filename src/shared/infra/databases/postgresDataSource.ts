import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export const postgresDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrationsTableName: 'migration',
  entities: process.env.NODE_ENV === 'prod'
    ? ['dist/modules/**/infra/typeorm/*.js']
    : ['src/modules/**/infra/typeorm/*.ts'],
  migrations:
    process.env.NODE_ENV === 'prod'
      ? ['dist/shared/infra/databases/migrations/*.js']
      : ['src/shared/infra/databases/migrations/*.ts'],
});