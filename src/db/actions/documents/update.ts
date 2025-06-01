"use server";

import db from "@/db";
import { documentsTable } from "@/db/schemas";
import $user from "../spaces/permission";
import { Document } from "./get";
import { eq } from "drizzle-orm";

export default async function updateDocument(
  document_id: string,
  data: Partial<Document>,
  space_id: string,
) {
  try {
    const user = await $user(space_id);

    if (user.permission == "no-access") throw new Error("Unauthorized Request");

    const [result] = await db
      .update(documentsTable)
      .set({ ...data, updated_at: new Date() })
      .where(eq(documentsTable.id, document_id))
      .returning();

    return result;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}
