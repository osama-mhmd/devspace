"use server";

import db from "@/db";
import { documentsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import $user from "../spaces/permission";

export interface Document {
  id: string;
  title: string | null;
  content: string | null;
  space_id: string;
  for: "task" | "capture" | null;
  for_id: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export default async function getDocument<T extends keyof Document>(
  key: T,
  value: NonNullable<Document[T]>,
  space_id: string,
): Promise<Document | undefined> {
  const user = await $user(space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized request");

  const [document] = await db
    .select()
    .from(documentsTable)
    .where(
      and(
        eq(documentsTable[key], value),
        eq(documentsTable.space_id, space_id),
      ),
    )
    .limit(1);

  return document;
}
