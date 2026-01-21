import type { FastifyInstance } from "fastify";
import { AuthController } from "./controller.ts";
import { AuthService } from "./service.ts";
import { AuthRepository } from "./repository.ts";
import { JwtService } from "../../services/jwt.service.ts";
import { BcryptService } from "../../services/bcrypt.service.ts";
import { signupRouteSchema, loginRouteSchema } from "./schema.ts";

export async function authRoutes(fastify: FastifyInstance) {
  const jwtService = new JwtService(fastify.jwt);
  const bcryptService = new BcryptService();

  const authRepository = new AuthRepository();
  const authService = new AuthService(
    authRepository,
    jwtService,
    bcryptService,
  );
  const authController = new AuthController(authService);

  fastify.post("/signup", { schema: signupRouteSchema }, authController.signup);
  fastify.post("/login", { schema: loginRouteSchema }, authController.login);
}
