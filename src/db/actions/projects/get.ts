"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { projectsTable } from "@/db/schemas";
import { eq, asc } from "drizzle-orm";

export async function getSpaceProjects(spaceId: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized request");

  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.space_id, spaceId))
    .orderBy(asc(projectsTable.updated_at));

  return projects;
}
