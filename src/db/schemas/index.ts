import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

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

export const spacesTable = pgTable("spaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  type: text("type").$type<"personal" | "organization">().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  shared: boolean("shared"),
});

export const spacesPermissions = pgTable(
  "spaces_permissions",
  {
    user_id: text("user_id")
      .references(() => userTable.id)
      .notNull(),
    space_id: text("space_id")
      .references(() => spacesTable.id)
      .notNull(),
    role: text("role").$type<"owner" | "admin" | "member">().notNull(),
    invited_by: text("invited_by").references(() => userTable.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    last_visit: timestamp("last_visit"),
  },
  (tb) => ({
    userSpaceUnique: unique().on(tb.user_id, tb.space_id),
    invitedByCheck: check(
      "invited_by_check",
      sql`${tb.role} = 'owner' OR ${tb.invited_by} IS NOT NULL`,
    ),
  }),
);

export const projectsTable = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  space_id: text("space_id")
    .references(() => spacesTable.id)
    .notNull(),
  github_link: text("github_link")
    .$type<`https://github.com/${string}/${string}`>()
    .notNull(),
  preview_link: text("preview_link"),
  imported_by: text("imported_by")
    .references(() => userTable.id)
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
});

export const pomodorosTable = pgTable("pomodoros", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .references(() => userTable.id)
    .notNull(),
  project_id: text("project_id").references(() => projectsTable.id),
  space_id: text("space_id").references(() => spacesTable.id),
  duration: integer("duration").notNull().default(0), // in seconds
  created_at: timestamp("date").notNull().defaultNow(),
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
