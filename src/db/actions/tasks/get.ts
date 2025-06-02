"use server";

import db from "@/db";
import { documentsTable, projectsTable, tasksTable } from "@/db/schemas";
import { and, eq, getTableColumns } from "drizzle-orm";
import $user from "../spaces/permission";
import { Task } from "./create";
import { Document } from "../documents/get";

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

export interface FullTask extends Task {
  document?: Document | null;
}

export async function getProjectTasks(
  space_id: string,
  project_id: string,
): Promise<FullTask[]> {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  try {
    const tasks = await db
      .select({
        ...getTableColumns(tasksTable),
        document: {
          ...getTableColumns(documentsTable),
        },
      })
      .from(tasksTable)
      .leftJoin(documentsTable, eq(tasksTable.id, documentsTable.for_id))
      .where(eq(tasksTable.project_id, project_id))
      .orderBy(tasksTable.created_at);

    return tasks;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw new Error("Failed to fetch project tasks");
  }
}
