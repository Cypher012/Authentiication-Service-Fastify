import { type FastifyInstance } from "fastify";
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";

async function FastifySwaggerPlugin(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyZodOpenApiPlugin);

  await app.register(import("@fastify/swagger"), {
    openapi: {
      info: {
        title: "API",
        version: "1.0.0",
      },
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });

  await app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });
}

export default FastifySwaggerPlugin;
