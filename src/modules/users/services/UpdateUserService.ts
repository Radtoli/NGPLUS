import { UpdateUserDTO } from "../Dtos/updateUserDTO";
import { IUserRepository } from "../Repositories/model/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { hashPassword } from "@shared/utils/password";

export class UpdateUserService {
  constructor(private userRepository: IUserRepository) { }

  async execute(userId: string, data: UpdateUserDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);

      if (emailExists) {
        throw new AppError("Email already in use", 409);
      }

      user.email = data.email;
    }

    if (data.username && data.username !== user.username) {
      user.username = data.username;
    }

    if (data.password) {
      if (!data.password_confirmation) {
        throw new AppError("Password confirmation is required", 400);
      }

      if (data.password !== data.password_confirmation) {
        throw new AppError("Passwords do not match", 400);
      }

      user.password_hash = await hashPassword(data.password);
    }

    await this.userRepository.update(user);
  }
}
