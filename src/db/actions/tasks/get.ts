"use server";

import db from "@/db";
import { projectsTable, tasksTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import $user from "../spaces/permission";
import { Task } from "./create";

export async function getTask(id: string, space_id: string) {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  try {
    return await db
      .select()
      .from(tasksTable)
      .innerJoin(projectsTable, eq(tasksTable.project_id, projectsTable.id))
      .where(and(eq(tasksTable.id, id), eq(projectsTable.space_id, space_id)))
      .limit(1);
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch task");
  }
}

export async function getProjectTasks(
  space_id: string,
  project_id: string,
): Promise<Task[]> {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  try {
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.project_id, project_id))
      .orderBy(tasksTable.created_at);

    return tasks;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw new Error("Failed to fetch project tasks");
  }
}
