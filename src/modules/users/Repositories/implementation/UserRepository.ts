import { User } from "@modules/users/infra/typeorm/User";
import { DataSource, Repository } from "typeorm";
import { IUserRepository } from "../model/IUserRepository";

export class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor(postgresDataSource: DataSource) {
    this.ormRepository = postgresDataSource.getRepository(User);
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  async update(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  async delete(userId: string): Promise<void> {
    await this.ormRepository.delete(userId);
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.ormRepository.findOneBy({ user_id: userId });

    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {

    try {
      const user = await this.ormRepository.findOneBy({ email });

      return user || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
    }

    return null;
  }

}