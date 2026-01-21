import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.ts";
import { serveIndex } from "../handlers/static.handler.ts";

export async function registerRoutes(fastify: FastifyInstance) {
  // Static routes
  fastify.get("/", serveIndex);

  // Health check
  fastify.get("/health", async () => {
    return { status: "ok" };
  });

  // API routes
  fastify.register(authRoutes, { prefix: "/api/v1/auth" });
}
