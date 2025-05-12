CREATE TABLE IF NOT EXISTS "pomodoros" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"tag" text NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reset_password_tokens" (
	"user_id" text NOT NULL,
	"token_code" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_permissions" (
	"user_id" text NOT NULL,
	"workpsace_id" text NOT NULL,
	"permission" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_documents" (
	"workspace_id" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT '',
	"content" text DEFAULT '',
	"comments" text,
	"parent_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"visibility" text NOT NULL,
	"viewed_by" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habits_records" (
	"habit_id" text NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habits" (
	"id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"quote" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"frequency" text NOT NULL
);
