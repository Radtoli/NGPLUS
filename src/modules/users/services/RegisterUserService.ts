import { RegisterUserDTO } from "../Dtos/registerUserDTO";
import { User } from "../infra/typeorm/User";
import { IUserRepository } from "../Repositories/model/IUserRepository";
import { hashPassword } from "@shared/utils/password";
import { AppError } from "@shared/errors/AppError";

export class RegisterUserService {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: RegisterUserDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    if (data.password !== data.password_confirmation) {
      throw new AppError('Password confirmation does not match', 400);
    }

    const password_hash = await hashPassword(data.password);

    const userData: Partial<User> = {
      username: data.username,
      email: data.email,
      password_hash,
    };

    await this.userRepository.create(userData);
  }
}