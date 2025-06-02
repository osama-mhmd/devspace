import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  integer,
  pgEnum,
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
  githubAccessToken: text("github_access_token").notNull(),
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
  (tb) => [
    unique().on(tb.user_id, tb.space_id),
    check(
      "invited_by_check",
      sql`${tb.role} = 'owner' OR ${tb.invited_by} IS NOT NULL`,
    ),
  ],
);

export type GithubAPILink = `https://api.github.com/repos/${string}/${string}`;
export type GithubLink = `https://github.com/${string}/${string}`;

export const projectsTable = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  space_id: text("space_id")
    .references(() => spacesTable.id)
    .notNull(),
  repo_owner: text("repo_owner").notNull(),
  repo_name: text("repo_name").notNull(),
  preview_link: text("preview_link"),
  imported_by: text("imported_by")
    .references(() => userTable.id)
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
});

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
]);

export const tasksTable = pgTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    project_id: text("project_id")
      .references(() => projectsTable.id)
      .notNull(),
    importance: integer("importance"),
    points: integer("points"),
    status: taskStatusEnum("status").default("todo"),
    parent: text("parent"),
    assigned_to: text("assigned_to").references(() => userTable.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    due_to: timestamp("due_to"),
    updated_at: timestamp("updated_at"),
  },
  (tb) => [
    foreignKey({
      columns: [tb.parent],
      foreignColumns: [tb.id],
    }),
  ],
);

export const documentForEnum = pgEnum("for", ["task", "capture"]);

export const documentsTable = pgTable(
  "documents",
  {
    id: text("id").primaryKey(),
    title: text("title"),
    content: text("content"),
    space_id: text("space_id")
      .notNull()
      .references(() => spacesTable.id),
    for: documentForEnum(),
    for_id: text("for_id"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at"),
  },
  (tb) => [
    check(
      "for_id exists if for",
      sql`(${tb.for} IS NULL AND ${tb.for_id} IS NULL) OR (${tb.for} IS NOT NULL AND ${tb.for_id} IS NOT NULL)`,
    ),
  ],
);

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
