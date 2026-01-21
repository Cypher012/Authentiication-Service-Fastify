import type { Session } from "../../db/schema.ts";
import { type SessionInterface } from "../../interfaces/index.ts";
import type { SessionRequestType, SessionResponseType } from "./schema.ts";
import type { UAParser } from "ua-parser-js";

function toSesionResponse(session: Session): SessionResponseType {
  const { refreshTokenHash, ...rest } = session;
  return rest;
}

export class SessionService {
  private readonly sessions: SessionInterface;
  private readonly uaParser: UAParser;

  constructor(sessions: SessionInterface, uaParser: UAParser) {
    this.sessions = sessions;
    this.uaParser = uaParser;
  }

  async createSession(
    arg: SessionRequestType,
  ): Promise<SessionResponseType | Error> {
    
    const ua = this.uaParser.getResult()
    
    const session = await this.sessions.CreateSession(arg);
    if (session instanceof Error) {
      return session;
    }
    return toSesionResponse(session);
  }
}
