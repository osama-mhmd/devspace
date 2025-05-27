"use server";

import db from "@/db";
import { tasksTable } from "@/db/schemas";
import $user from "../spaces/permission";
import { Task } from "./create";
import { eq } from "drizzle-orm";

export async function updateTask(
  input_id: string,
  input: Partial<Task>,
  space_id: string,
) {
  try {
    const user = await $user(space_id);

    if (user.permission == "no-access") throw new Error("Unauthorized Request");

    const [existingTask] = await db
      .select({ project_id: tasksTable.project_id })
      .from(tasksTable)
      .where(eq(tasksTable.id, input_id))
      .limit(1);

    if (existingTask) {
      throw new Error("Task not found");
    }

    const [result] = await db
      .update(tasksTable)
      .set({ ...input, updated_at: new Date() })
      .where(eq(tasksTable.id, input_id))
      .returning();

    return result;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}
