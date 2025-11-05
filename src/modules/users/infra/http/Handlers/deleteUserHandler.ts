import { FastifyReply, FastifyRequest } from "fastify";
import { container } from "@shared/infra/containers";
import { DeleteUserService } from "@modules/users/services/DeleteUserService";
import { AdminPasswordHeaderType } from "../schemas/headers/adminPasswordHeaderSchema";

type DeleteUserRequest = FastifyRequest<{
  Headers: AdminPasswordHeaderType;
}>;

export async function deleteUserHandler(
  request: DeleteUserRequest,
  reply: FastifyReply
): Promise<void> {
  const deleteUserService = container.resolve<DeleteUserService>('deleteUserService');

  const { user_id } = request.user!;
  const adminPassword = request.headers['x-admin-password'];

  await deleteUserService.execute({
    userId: user_id,
    adminPassword
  });

  reply.status(204).send();
}
