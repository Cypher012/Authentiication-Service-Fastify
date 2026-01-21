// services/jwt.service.ts
import type { FastifyInstance } from "fastify";

export type AccessTokenPayload = {
  userId: string;
};

type FastifyJwt = FastifyInstance["jwt"];

export class JwtService {
  private readonly jwt: FastifyJwt;

  constructor(jwt: FastifyJwt) {
    this.jwt = jwt;
  }

  signAccessToken(payload: AccessTokenPayload): string {
    return this.jwt.sign(payload, { expiresIn: "15m" });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwt.verify<AccessTokenPayload>(token);
  }
}
