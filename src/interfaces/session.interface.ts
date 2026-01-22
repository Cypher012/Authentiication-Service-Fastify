import type { Session } from "../db/schema.ts";

export interface SessionInterface {
  GetSessionById(sessionId: string): Promise<Session | Error>;
  CreateSession(req: Omit<Session, "id">): Promise<Session | Error>;
  ListActiveSessions(userId: string): Promise<Session[] | Error>;
  GetSessionByRefreshToken(refreshTokenHash: string): Promise<Session | Error>;
  UpdateSessionLastUsed(sessionId: string): Promise<Error | null>;
  RotateSessionToken(
    sessionId: string,
    refreshTokenHash: string,
  ): Promise<Error | null>;
  RevokeSession(sessionId: string): Promise<Error | null>;
  RevokeAllUserSessions(userId: string): Promise<Error | null>;
  RevokeAllSessions(): Promise<Error | null>;
}
