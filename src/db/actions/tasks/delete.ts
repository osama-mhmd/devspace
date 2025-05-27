"use server";

import db from "@/db";
import { tasksTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import $user from "../spaces/permission";

export async function deleteTask(id: string, space_id: string) {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  return await db.delete(tasksTable).where(eq(tasksTable.id, id));
}
