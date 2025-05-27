"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { projectsTable } from "@/db/schemas";
import { generateIdFromEntropySize } from "lucia";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  space_id: string;
  repo_owner: string;
  repo_name: string;
  preview_link: string | null;
  imported_by: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface ProjectToCreate
  extends Omit<Project, "id" | "created_at" | "imported_by"> {
  id?: string;
  created_at?: Date;
  imported_by?: string;
}

export default async function createProject(project: ProjectToCreate) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized request");

  const id = generateIdFromEntropySize(14);

  await db.insert(projectsTable).values({
    ...project,
    imported_by: user.id,
    id,
  });
}
