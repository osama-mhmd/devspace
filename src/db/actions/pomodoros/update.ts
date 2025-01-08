"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { pomodorosTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

export default async function updatePomodoro(id: string, duration: number) {
  const { user } = await validateRequest();

  if (!user) return false;

  await db
    .update(pomodorosTable)
    .set({
      duration,
    })
    .where(and(eq(pomodorosTable.user_id, user.id), eq(pomodorosTable.id, id)))
    .catch((e) => {
      console.log(e);
      return false;
    });

  return true;
}
