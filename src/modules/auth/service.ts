import type { UserInterface } from "../../interfaces/index.ts";
import type { JwtService } from "../../services/jwt.service.ts";
import type { User, UserResponse } from "../../db/schema.ts";
import type { BcryptService } from "../../services/bcrypt.service.ts";

function toUserResponse(user: User): UserResponse {
  const { passwordHash, ...rest } = user;
  return rest;
}

export class AuthService {
  private readonly users: UserInterface;
  private readonly jwt: JwtService;
  private readonly bcrypt: BcryptService;

  constructor(users: UserInterface, jwt: JwtService, bcrypt: BcryptService) {
    this.users = users;
    this.jwt = jwt;
    this.bcrypt = bcrypt;
  }

  async createUser(
    email: string,
    password: string,
  ): Promise<{ user: UserResponse; accessToken: string } | Error> {
    const existing = await this.users.GetUserByEmail(email);
    if (!(existing instanceof Error)) {
      return new Error("email already exists");
    }

    const passwordHash = await this.bcrypt.hashPassword(password);
    const user = await this.users.CreateUser(email, passwordHash);
    if (user instanceof Error) {
      return user;
    }

    const accessToken = this.jwt.signAccessToken({ userId: user.id });
    return { user: toUserResponse(user), accessToken };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserResponse; accessToken: string } | Error> {
    const user = await this.users.GetUserByEmail(email);
    if (user instanceof Error) {
      return new Error("invalid credentials");
    }

    const valid = await this.bcrypt.comparePassword(
      password,
      user.passwordHash,
    );
    if (!valid) {
      return new Error("invalid credentials");
    }

    const accessToken = this.jwt.signAccessToken({ userId: user.id });
    return { user: toUserResponse(user), accessToken };
  }

  async verifyEmail(userId: string): Promise<Error | null> {
    return this.users.SetUserEmailVerified(userId);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<Error | null> {
    const user = await this.users.GetUserByID(userId);
    if (user instanceof Error) {
      return user;
    }

    const valid = await this.bcrypt.comparePassword(
      oldPassword,
      user.passwordHash,
    );
    if (!valid) {
      return new Error("invalid password");
    }

    const passwordHash = await this.bcrypt.hashPassword(newPassword);
    return this.users.UpdateUserPassword(userId, passwordHash);
  }
}
