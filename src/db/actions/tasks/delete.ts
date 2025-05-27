"use server";

import db from "@/db";
import { tasksTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import $user from "../spaces/permission";

export async function deleteTask(id: string, space_id: string) {
  if (!id || !space_id) throw new Error("ID and space_id should be provided");

  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized Request");

  return await db.delete(tasksTable).where(eq(tasksTable.id, id));
}
