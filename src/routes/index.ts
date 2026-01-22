import type { FastifyInstance, FastifyRequest } from "fastify";
import { authRoutes } from "../modules/auth/route.ts";
import { serveIndex } from "../handlers/static.handler.ts";
import { UAParser } from "ua-parser-js";

export async function registerRoutes(fastify: FastifyInstance) {
  // Static routes
  fastify.get("/", serveIndex);

  // Health check
  fastify.get("/health", async (request: FastifyRequest) => {
    const parser = new UAParser(request.headers["user-agent"]);
    const ua = parser.getResult();

    // Determine device type
    let deviceType = "Desktop";
    if (ua.device.type === "mobile") {
      deviceType = "Mobile";
    } else if (ua.device.type === "tablet") {
      deviceType = "Tablet";
    }

    const deviceOS = ua.os.name;
    const deviceBrowser = ua.browser.name;

    return {
      status: "ok",
      ipAddress: request.ip,
      deviceType,
      deviceOS,
      deviceBrowser,
    };
  });

  // API routes
  fastify.register(authRoutes, { prefix: "/api/v1/auth" });
}
