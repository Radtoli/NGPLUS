import { container } from "@shared/infra/containers";
import { DataSource } from "typeorm";

export async function startEnvironment() {
  const postgreDataSource = container.resolve<DataSource>('postgresDataSource');

  postgreDataSource.initialize()
}
