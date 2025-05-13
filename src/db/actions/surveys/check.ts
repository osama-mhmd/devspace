"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { surveysTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export default async function checkSurveyFilledOrNot() {
  const { user } = await validateRequest();

  if (!user) return false;

  const rows = await db
    .select()
    .from(surveysTable)
    .where(eq(surveysTable.user_id, user.id));

  if (rows.length == 0) return false;

  return true;
}
