import type { UserInterface } from "../../interfaces/user.interface.ts";
import type { User } from "../../db/schema.ts";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { users } from "../../db/schema.ts";

export class AuthRepository implements UserInterface {
  async CreateUser(email: string, passwordHash: string): Promise<User | Error> {
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning();
    if (!user) {
      return new Error("failed to create user");
    }
    return user;
  }

  async GetUserByEmail(email: string): Promise<User | Error> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) {
      return new Error("user not found");
    }
    return user;
  }

  async GetUserByID(id: string): Promise<User | Error> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return new Error("user not found");
    }
    return user;
  }

  async SetUserEmailVerified(id: string): Promise<Error | null> {
    const [updated] = await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (!updated) {
      return new Error("user not found");
    }
    return null;
  }

  async UpdateUserPassword(
    id: string,
    passwordHash: string,
  ): Promise<Error | null> {
    const [updated] = await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (!updated) {
      return new Error("user not found");
    }
    return null;
  }
}
