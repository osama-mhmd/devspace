import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const workspaceTable = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  // "public-comment" | "public-edit" | "public-view" | "private"
  visibility: text("visibility").notNull(),
  viewed_by: text("viewed_by").array().notNull().default([]),
  created_at: timestamp("created_at").notNull().defaultNow(),
  last_updated_at: timestamp("last_updated_at").notNull().defaultNow(),
});

export const usersPermissions = pgTable("users_permissions", {
  user_id: text("user_id").notNull(),
  workpsace_id: text("workpsace_id").notNull(),
  permission: text("permission").notNull(),
});

export const workspaceDocuments = pgTable("workspace_documents", {
  workspace_id: text("workspace_id").notNull(),
  id: text("id").primaryKey().notNull(),
  title: text("title").default(""),
  content: text("content").default(""),
  comments: text("comments"),
  parent_id: text("parent_id").notNull(), // why this is not null?
});

export const resetPasswordTokens = pgTable("reset_password_tokens", {
  user_id: text("user_id").notNull(),
  token_code: text("token_code").primaryKey().notNull(),
  token_hash: text("token_hash").notNull(),
  expires_at: timestamp("expires_at").notNull(),
});

export const pomodorosTable = pgTable("pomodoros", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  duration: integer("duration").notNull().default(0), // in seconds
  tag: text("tag").notNull(), // e.g. work, study
  date: timestamp("date").notNull(),
});

export const surveysTable = pgTable("surveys", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .references(() => userTable.id)
    .notNull(),
  survey_code: text("survey_code").notNull(),
  data: text("data").notNull(),
  submitted_at: timestamp("submitted_at").notNull().defaultNow(),
});
