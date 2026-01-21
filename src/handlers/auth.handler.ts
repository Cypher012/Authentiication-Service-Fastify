import type { FastifyRequest, FastifyReply } from "fastify";
import type { AuthControllers } from "../contollers/auth.controllers.ts";
import { z } from "zod";
import type { AuthResponse } from "../schema/auth.schema.ts";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthHandler {
  private readonly authControllers: AuthControllers;

  constructor(authControllers: AuthControllers) {
    this.authControllers = authControllers;
  }

  signup = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: z.treeifyError(parsed.error),
      });
    }

    const { email, password } = parsed.data;
    const result = await this.authControllers.createUser(email, password);

    if (result instanceof Error) {
      return reply.status(400).send({ error: result.message });
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

    return reply.status(201).send(payload);
  };

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: z.treeifyError(parsed.error),
      });
    }

    const { email, password } = parsed.data;
    const result = await this.authControllers.login(email, password);

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
