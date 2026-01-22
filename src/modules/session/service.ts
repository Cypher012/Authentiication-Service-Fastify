import type { Session } from "../../db/schema.ts";
import { type SessionInterface } from "../../interfaces/index.ts";
import type { UserAgentService } from "../../services/user-agent.service.ts";
import type { SessionRequestType, SessionResponseType } from "./schema.ts";

function toSessionResponse(session: Session): SessionResponseType {
  const { refreshTokenHash, ...rest } = session;
  return rest;
}

export class SessionService {
  private readonly sessions: SessionInterface;
  private readonly uaParser: UserAgentService;

  constructor(sessions: SessionInterface, uaParser: UserAgentService) {
    this.sessions = sessions;
    this.uaParser = uaParser;
  }

  async CreateSession(
    arg: SessionRequestType,
  ): Promise<SessionResponseType | Error> {
    const ua = this.uaParser.parse();
    const { deviceType, deviceOS, deviceBrowser } = ua;
    const newSession: Omit<Session, "id"> = {
      ...arg,
      deviceBrowser: deviceBrowser ?? null,
      deviceOS: deviceOS ?? null,
      deviceType: deviceType ?? null,
      createdAt: new Date(),
      lastUsedAt: null,
      revokedAt: null,
    };
    const session = await this.sessions.CreateSession(newSession);
    if (session instanceof Error) {
      return session;
    }
    return toSessionResponse(session);
  }

  async ListActiveSessions(userId: string): Promise<SessionResponseType[] | Error> {
    const sessions = await this.sessions.ListActiveSessions(userId);
    if (sessions instanceof Error) {
      return sessions;
    }
    return sessions.map(toSessionResponse);
  }

  async GetSessionById(sessionId: string): Promise<SessionResponseType | Error> {
    const session = await this.sessions.GetSessionById(sessionId);
    if (session instanceof Error) {
      return session;
    }
    return toSessionResponse(session);
  }

  async GetSessionByRefreshToken(refreshTokenHash: string): Promise<SessionResponseType | Error> {
    const session = await this.sessions.GetSessionByRefreshToken(refreshTokenHash);
    if (session instanceof Error) {
      return session;
    }
    return toSessionResponse(session);
  }

  async UpdateSessionLastUsed(sessionId: string): Promise<Error | null> {
    return await this.sessions.UpdateSessionLastUsed(sessionId);
  }

  async RotateSessionToken(sessionId: string, refreshTokenHash: string): Promise<Error | null> {
    return await this.sessions.RotateSessionToken(sessionId, refreshTokenHash);
  }

  async RevokeSession(sessionId: string): Promise<Error | null> {
    return await this.sessions.RevokeSession(sessionId);
  }

  async RevokeAllUserSessions(userId: string): Promise<Error | null> {
    return await this.sessions.RevokeAllUserSessions(userId);
  }
}
