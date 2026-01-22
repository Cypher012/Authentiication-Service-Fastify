import type { FastifyInstance } from "fastify";
import { AuthController } from "./controller.ts";
import { AuthService } from "./service.ts";
import { AuthRepository } from "./repository.ts";
import { JwtService } from "../../services/jwt.service.ts";
import { BcryptService } from "../../services/bcrypt.service.ts";
import { signupRouteSchema, loginRouteSchema } from "./schema.ts";
import { UserAgentService } from "../../services/user-agent.service.ts";
import { SessionService } from "../session/service.ts";
import { UAParser } from "ua-parser-js";
import { SessionRepository } from "../session/repository.ts";

export async function authRoutes(fastify: FastifyInstance) {
  const jwtService = new JwtService(fastify.jwt);
  const bcryptService = new BcryptService();
  const userAgentService = new UserAgentService(new UAParser());
  const sessionRepository = new SessionRepository();
  const sessionService = new SessionService(sessionRepository, userAgentService);
  const authRepository = new AuthRepository();
  const authService = new AuthService(
    authRepository,
    jwtService,
    bcryptService,
  );
  const authController = new AuthController(authService, sessionService);

  fastify.post("/signup", { schema: signupRouteSchema }, authController.signup);
  fastify.post("/login", { schema: loginRouteSchema }, authController.login);
}
