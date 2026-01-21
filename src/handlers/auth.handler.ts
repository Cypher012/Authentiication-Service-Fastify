import type { FastifyRequest, FastifyReply } from "fastify";
import type { AuthControllers } from "../contollers/auth.controllers.ts";
import { z } from "zod";

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

  async register(request: FastifyRequest, reply: FastifyReply) {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;
    const result = await this.authControllers.register(email, password);

    if (result instanceof Error) {
      return reply.status(400).send({ error: result.message });
    }

    return reply.status(201).send({
      user: {
        id: result.user.id,
        email: result.user.email,
        isVerified: result.user.isVerified,
      },
      accessToken: result.accessToken,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;
    const result = await this.authControllers.login(email, password);

    if (result instanceof Error) {
      return reply.status(401).send({ error: result.message });
    }

    return reply.send({
      user: {
        id: result.user.id,
        email: result.user.email,
        isVerified: result.user.isVerified,
      },
      accessToken: result.accessToken,
    });
  }
}
