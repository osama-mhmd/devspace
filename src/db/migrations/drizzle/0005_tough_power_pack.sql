ALTER TABLE "projects" ADD COLUMN "repo_owner" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "repo_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "github_link";