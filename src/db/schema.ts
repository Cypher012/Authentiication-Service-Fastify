// src/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  deviceName: varchar("device_name", { length: 255 }).notNull(),
  deviceInfo: varchar("device_info", { length: 512 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const userGenderEnum = pgEnum("user_gender", [
  "unspecified",
  "male",
  "female",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  role: userRoleEnum("role").default("user"),
  gender: userGenderEnum("gender").default("unspecified"),
  aboutMe: text("about_me"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// User schemas
export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users, {
  email: z.string().email(),
  passwordHash: z.string().min(1),
});

// Session schemas
export const sessionSelectSchema = createSelectSchema(sessions);
export const sessionInsertSchema = createInsertSchema(sessions);

// Profile schemas
export const profileSelectSchema = createSelectSchema(profile);
export const profileInsertSchema = createInsertSchema(profile, {
  name: z.string().min(1).max(255),
  phoneNumber: z.string().max(20).optional(),
});

// Export types
export type User = z.infer<typeof userSelectSchema>;
export type NewUser = z.infer<typeof userInsertSchema>;
export type UserResponse = Omit<User, "passwordHash">;
export type Session = z.infer<typeof sessionSelectSchema>;
export type NewSession = z.infer<typeof sessionInsertSchema>;
export type Profile = z.infer<typeof profileSelectSchema>;
export type NewProfile = z.infer<typeof profileInsertSchema>;
