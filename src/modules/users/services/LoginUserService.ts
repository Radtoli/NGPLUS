import { LoginUserDTO } from "../Dtos/loginUserDTO";
import { IUserRepository } from "../Repositories/model/IUserRepository";
import { verifyPassword } from "@shared/utils/password";
import { AppError } from "@shared/errors/AppError";
import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    username: string;
    email: string;

  };
}

export class LoginUserService {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: LoginUserDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await verifyPassword(data.password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError('JWT secret not configured', 500);
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as string;

    const signOptions: SignOptions = {
      expiresIn: expiresIn as any,
      subject: user.user_id
    };

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email
      },
      secret,
      signOptions
    );

    const userToUpdate = { ...user, last_login: new Date() };

    await this.userRepository.update(userToUpdate);

    return {
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email
      }
    };
  }
}
