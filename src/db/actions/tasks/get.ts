"use server";

import db from "@/db";
import { tasksTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import $user from "../spaces/permission";
import { Task } from "./create";

export async function getTask(id: string, space_id: string) {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  return db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, id))
    .orderBy(tasksTable.created_at)
    .then((result) => result[0]);
}

export async function getProjectTasks(
  space_id: string,
  project_id: string,
): Promise<Task[]> {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  return db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.project_id, project_id)) as unknown as Task[];
}
