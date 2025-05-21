"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { pomodorosTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

interface Pomodoro {
  id: string;
  user_id: string;
  project_id: string | null;
  space_id: string | null;
  duration: number;
  created_at: Date;
}

export default async function getPomodoros(): Promise<false | Pomodoro[]> {
  const { user } = await validateRequest();

  if (!user) return false;

  const rows = await db
    .select()
    .from(pomodorosTable)
    .where(eq(pomodorosTable.user_id, user.id));

  return rows;
}
