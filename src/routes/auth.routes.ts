import type { FastifyInstance } from "fastify";
import { AuthHandler } from "../handlers/auth.handler.ts";
import { AuthControllers } from "../contollers/auth.controllers.ts";
import { DrizzleUserRepository } from "../repositories/user.repository.ts";
import { JwtService } from "../services/jwt.service.ts";
import { BcryptService } from "../services/bcrypt.service.ts";

export async function authRoutes(fastify: FastifyInstance) {
  const userRepository = new DrizzleUserRepository();

  const jwtService = new JwtService(fastify.jwt);

  const bcryptService = new BcryptService();

  const authControllers = new AuthControllers(
    userRepository,
    jwtService,
    bcryptService,
  );

  const authHandler = new AuthHandler(authControllers);

  fastify.post("/register", authHandler.register);
  fastify.post("/login", authHandler.login);
}
