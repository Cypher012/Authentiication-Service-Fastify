import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./user.schema.ts";

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  refreshTokenHash: varchar("refresh_token_hash", { length: 255 }).notNull(),
  deviceType: varchar("device_type", { length: 50 }),
  deviceOS: varchar("device_os", { length: 50 }),
  deviceBrowser: varchar("device_browser", { length: 50 }),
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

export const sessionSelectSchema = createSelectSchema(sessions);
export const sessionInsertSchema = createInsertSchema(sessions);

export type Session = z.infer<typeof sessionSelectSchema>;
export type NewSession = z.infer<typeof sessionInsertSchema>;
