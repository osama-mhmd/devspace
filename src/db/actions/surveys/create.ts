"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { surveysTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export default async function createSurvey(data: string) {
  const { user } = await validateRequest();

  if (!user)
    return {
      ok: false,
      message: "unauthorized",
    };

  const rows = await db
    .select()
    .from(surveysTable)
    .where(eq(surveysTable.user_id, user.id));

  if (rows.length > 0)
    return {
      ok: false,
      message: "survey-already-exists",
    };

  await db.insert(surveysTable).values({
    data,
    survey_code: "1", // mocked code FIX THIS
    user_id: user.id,
  });

  return {
    ok: true,
    message: "created",
  };
}
