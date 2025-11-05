import { createContainer } from "awilix";
import { registerDataSources } from "./registerDataSources";
import { registerRepositories } from "./registerRepositories";
import { registerServices } from "./registerServices";

const container = createContainer({ injectionMode: 'CLASSIC' });

registerDataSources(container);

registerRepositories(container);

registerServices(container);

export { container };