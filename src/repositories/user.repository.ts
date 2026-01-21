import { eq } from "drizzle-orm";
import type { UserInterface } from "../interfaces/user.interface.ts";
import { db } from "../db/index.ts";
import { users, type User } from "../db/schema.ts";

export class DrizzleUserRepository implements UserInterface {
  async CreateUser(email: string, passwordHash: string): Promise<User | null> {
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning();
    return user ?? null;
  }

  async GetUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user ?? null;
  }

  async GetUserByID(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
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
