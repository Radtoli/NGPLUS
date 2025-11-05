import { asValue, AwilixContainer } from "awilix";
import { postgresDataSource } from "../databases/postgresDataSource";

export function registerDataSources(container: AwilixContainer): void {
  container.register('postgresDataSource', asValue(postgresDataSource))
}