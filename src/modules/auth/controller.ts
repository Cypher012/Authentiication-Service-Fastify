import type { FastifyRequest, FastifyReply } from "fastify";
import type { AuthService } from "./service.ts";
import { z } from "zod";
import {
  loginRequestSchema,
  signupRequestSchema,
  type AuthResponse,
} from "./schema.ts";
import type { SessionService } from "../session/service.ts";

export class AuthController {
  private readonly authService: AuthService;
  private readonly sessionService: SessionService;

  constructor(authService: AuthService, sessionService: SessionService) {
    this.authService = authService;
    this.sessionService = sessionService;
  }

  signup = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = signupRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: z.treeifyError(parsed.error),
      });
    }

    const { email, password } = parsed.data;
    const result = await this.authService.createUser(email, password);

    if (result instanceof Error) {
      return reply.status(400).send({ error: result.message });
    }

    await this.sessionService.CreateSession({
      userId: result.user.id,
      refreshTokenHash: result.accessToken,
      ipAddress: request.ip,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    const payload: AuthResponse = {
      user: {
        id: result.user.id,
        email: result.user.email,
        isVerified: result.user.isVerified,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt,
      },
      accessToken: result.accessToken,
    };

    return reply.status(201).send(payload);
  };

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: z.treeifyError(parsed.error),
      });
    }

    const { email, password } = parsed.data;
    const result = await this.authService.login(email, password);

    if (result instanceof Error) {
      return reply.status(401).send({ error: result.message });
    }

    const payload: AuthResponse = {
      user: {
        id: result.user.id,
        email: result.user.email,
        isVerified: result.user.isVerified,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt,
      },
      accessToken: result.accessToken,
    };

    return reply.send(payload);
  };
}
