"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { projectsTable } from "@/db/schemas";
import { eq, asc } from "drizzle-orm";
import { Project } from "./create";
import $user from "../spaces/permission";

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

export async function getProject(
  projectId: string,
): Promise<Project | undefined> {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized request");

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project) return undefined;

  const { permission } = await $user(project.space_id);

  if (permission == "no-access") throw new Error("Unauthorized request");

  return project;
}
