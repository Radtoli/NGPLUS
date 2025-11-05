import "reflect-metadata";
import { buildApp } from "@shared/infra/http/app";
import { startEnvironment } from "@shared/utils/startEnv";
import dotenv from "dotenv";

dotenv.config();


startEnvironment().then(async () => {
  const app = await buildApp();

  app.listen({ port: Number(process.env.PORT), host: '0.0.0.0' });
});