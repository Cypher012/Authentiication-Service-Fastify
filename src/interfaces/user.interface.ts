import type { User } from "../db/schema.ts";

export interface UserInterface {
  GetUserByEmail(email: string): Promise<User | Error>;
  CreateUser(email: string, passwordHash: string): Promise<User | Error>;
  GetUserByID(id: string): Promise<User | Error>;
  SetUserEmailVerified(id: string): Promise<Error | null>;
  UpdateUserPassword(id: string, passwordHash: string): Promise<Error | null>;
}
