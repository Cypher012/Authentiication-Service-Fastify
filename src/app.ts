import "dotenv/config";
import Fastify from "fastify";
import { jwtPlugin } from "./plugins/index.ts";
import { registerRoutes } from "./routes/index.ts";
import { env } from "./config/env.ts";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Register plugins
  app.register(jwtPlugin);

  // Register routes
  app.register(registerRoutes);

  return app;
}

// Only run if this is the entry point
const app = buildApp();

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server ready at http://localhost:${env.PORT}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
