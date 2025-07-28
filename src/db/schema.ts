import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey(),
  type: text("type", { length: 100 }).default("request"),
  requestId: text("request_id", { length: 100 }),
  content: text("content", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});
