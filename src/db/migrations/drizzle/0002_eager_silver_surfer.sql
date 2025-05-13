CREATE TABLE IF NOT EXISTS "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"survey_code" text NOT NULL,
	"data" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "surveys" ADD CONSTRAINT "surveys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
