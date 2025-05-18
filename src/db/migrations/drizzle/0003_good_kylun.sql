CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"space_id" text NOT NULL,
	"github_link" text NOT NULL,
	"preview_link" text,
	"imported_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "spaces_permissions" (
	"user_id" text NOT NULL,
	"space_id" text NOT NULL,
	"role" text NOT NULL,
	"invited_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_visit" timestamp,
	CONSTRAINT "spaces_permissions_user_id_space_id_unique" UNIQUE("user_id","space_id"),
	CONSTRAINT "invited_by_check" CHECK ("spaces_permissions"."role" = 'owner' OR "spaces_permissions"."invited_by" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "spaces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"shared" boolean
);
--> statement-breakpoint
ALTER TABLE "reset_password_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workspace_documents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workspaces" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "reset_password_tokens" CASCADE;--> statement-breakpoint
DROP TABLE "users_permissions" CASCADE;--> statement-breakpoint
DROP TABLE "workspace_documents" CASCADE;--> statement-breakpoint
DROP TABLE "workspaces" CASCADE;--> statement-breakpoint
ALTER TABLE "pomodoros" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pomodoros" ADD COLUMN "project_id" text;--> statement-breakpoint
ALTER TABLE "pomodoros" ADD COLUMN "space_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_imported_by_users_id_fk" FOREIGN KEY ("imported_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spaces_permissions" ADD CONSTRAINT "spaces_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spaces_permissions" ADD CONSTRAINT "spaces_permissions_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spaces_permissions" ADD CONSTRAINT "spaces_permissions_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoros" ADD CONSTRAINT "pomodoros_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoros" ADD CONSTRAINT "pomodoros_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoros" ADD CONSTRAINT "pomodoros_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoros" DROP COLUMN "tag";