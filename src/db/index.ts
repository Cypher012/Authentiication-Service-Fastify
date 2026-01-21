// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "./client.ts";

export const db = drizzle(pool);
export type DB = typeof db;
