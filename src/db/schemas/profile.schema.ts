import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./user.schema.ts";

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

export const profileSelectSchema = createSelectSchema(profile);
export const profileInsertSchema = createInsertSchema(profile, {
  name: z.string().min(1).max(255),
  phoneNumber: z.string().max(20).optional(),
});

export type Profile = z.infer<typeof profileSelectSchema>;
export type NewProfile = z.infer<typeof profileInsertSchema>;
