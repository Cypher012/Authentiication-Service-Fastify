import "dotenv/config";
import Fastify from "fastify";
import { jwtPlugin } from "./plugins/index.ts";
import { registerRoutes } from "./routes/index.ts";
import { env } from "./config/env.ts";
import FastifySwaggerPlugin from "./plugins/swagger.pluggin.ts";

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === "production",
  });

  // Swagger plugin (must be registered before routes)
  await FastifySwaggerPlugin(app);

  // Register plugins
  await app.register(jwtPlugin);

  // Register routes
  await app.register(registerRoutes);

  return app;
}

// Only run if this is the entry point
buildApp()
  .then((app) => app.listen({ port: env.PORT, host: "0.0.0.0" }))
  .then(() => {
    console.log(`Server ready at http://localhost:${env.PORT}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
