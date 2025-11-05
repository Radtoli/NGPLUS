import { RegisterUserDTO } from "@modules/users/Dtos/registerUserDTO";
import { User } from "@modules/users/infra/typeorm/User";

export interface IUserRepository {
  create(data: RegisterUserDTO | Partial<User>): Promise<User>;
  update(user: User): Promise<User>;
  delete(userId: string): Promise<void>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}