import { z } from "zod";
import { userResponseSchema } from "../db/schemas/user.schema.ts";

export const signupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authResponseSchema = z.object({
  user: userResponseSchema,
  accessToken: z.string(),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;

// Route schemas
export const signupRouteSchema = {
  body: signupRequestSchema,
  response: {
    201: authResponseSchema,
  },
};

export const loginRouteSchema = {
  body: loginRequestSchema,
  response: {
    200: authResponseSchema,
  },
};
