import { eq, and, gt } from "drizzle-orm";
import type { SessionInterface } from "../../interfaces/session.interface.ts";
import { db } from "../../db/index.ts";
import { sessions, type Session } from "../../db/schema.ts";

export class DrizzleSessionRepository implements SessionInterface {
  async CreateSession(req: {
    userId: string;
    refreshTokenHash: string;
    deviceName: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: Date;
  }): Promise<Session | Error> {
    const [session] = await db.insert(sessions).values(req).returning();

    if (!session) {
      return new Error("failed to create session");
    }

    return session;
  }

  async GetSessionById(sessionId: string): Promise<Session | Error> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session) {
      return new Error("session not found");
    }

    return session;
  }

  async GetSessionByRefreshToken(
    refreshTokenHash: string,
  ): Promise<Session | Error> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshTokenHash, refreshTokenHash))
      .limit(1);

    if (!session) {
      return new Error("session not found");
    }

    return session;
  }

  async ListActiveSessions(userId: string): Promise<Session[] | Error> {
    const now = new Date();

    const activeSessions = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, now)));

    return activeSessions;
  }

  async UpdateSessionLastUsed(sessionId: string): Promise<Error | null> {
    const [updated] = await db
      .update(sessions)
      .set({ lastUsedAt: new Date() })
      .where(eq(sessions.id, sessionId))
      .returning({ id: sessions.id });

    if (!updated) {
      return new Error("session not found");
    }

    return null;
  }

  async RotateSessionToken(
    sessionId: string,
    refreshTokenHash: string,
  ): Promise<Error | null> {
    const [updated] = await db
      .update(sessions)
      .set({
        refreshTokenHash,
        lastUsedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId))
      .returning({ id: sessions.id });

    if (!updated) {
      return new Error("session not found");
    }

    return null;
  }

  async RevokeSession(sessionId: string): Promise<Error | null> {
    const deletedRows = await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId))
      .returning({ id: sessions.id });

    if (deletedRows.length === 0) {
      return new Error("session not found");
    }

    return null;
  }

  async RevokeAllUserSessions(userId: string): Promise<Error | null> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
    return null;
  }

  async RevokeAllSessions(): Promise<Error | null> {
    await db.delete(sessions);
    return null;
  }
}
