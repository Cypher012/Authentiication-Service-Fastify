import type { AccessTokenPayload } from "../services/jwt.service.ts";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AccessTokenPayload;
    user: AccessTokenPayload;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: AccessTokenPayload;
  }
}
