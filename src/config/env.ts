import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // JWT
  JWT_SECRET: z.string().min(32),
  EMAIL_TOKEN_SECRET: z.string().min(32),

  // Database
  DATABASE_URL: z.string().url(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),

  // API
  API_BASE_URL: z.string().url().default("http://localhost:8080"),

  // SMTP
  BREVO_SMTP_HOST: z.string().optional(),
  BREVO_SMTP_PORT: z.coerce.number().optional(),
  BREVO_SMTP_USERNAME: z.string().optional(),
  BREVO_SMTP_PASS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
