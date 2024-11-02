CREATE TABLE IF NOT EXISTS "pomodoros" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"tag" text NOT NULL
);
