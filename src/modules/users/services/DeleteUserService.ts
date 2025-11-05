import { IUserRepository } from "../Repositories/model/IUserRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  userId: string;
  adminPassword: string;
}

export class DeleteUserService {
  constructor(
    private userRepository: IUserRepository
  ) { }

  async execute({ userId, adminPassword }: IRequest): Promise<void> {
    const adminPasswordEnv = process.env.ADMIN_DELETE_PASSWORD;

    if (!adminPasswordEnv) {
      throw new AppError("Admin password not configured", 500);
    }

    if (adminPassword !== adminPasswordEnv) {
      throw new AppError("Invalid admin password", 401);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepository.delete(userId);
  }
}
