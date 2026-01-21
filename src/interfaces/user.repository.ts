import type { User } from "../db/schema.ts";

export interface UserRepository {
  GetUserByEmail(email: string): Promise<User | null>;
  CreateUser(email: string, passwordHash: string): Promise<User | null>;
  GetUserByID(id: string): Promise<User | null>;
  SetUserEmailVerified(id: string): Promise<Error | null>;
  UpdateUserPassword(id: string, passwordHash: string): Promise<Error | null>;
}
