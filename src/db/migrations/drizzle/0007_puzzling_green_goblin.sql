CREATE TYPE "public"."for" AS ENUM('task', 'capture');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"space_id" text NOT NULL,
	"for" "for",
	"for_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "for_id exists if for" CHECK (("documents"."for" IS NULL AND "documents"."for_id" IS NULL) OR ("documents"."for" IS NOT NULL AND "documents"."for_id" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE no action ON UPDATE no action;