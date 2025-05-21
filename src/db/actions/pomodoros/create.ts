"use server";

import db from "@/db";
import { validateRequest } from "@/db/auth";
import { pomodorosTable } from "@/db/schemas";
import { generateIdFromEntropySize } from "lucia";

export default async function createPomodoro() {
  const { user } = await validateRequest();

  if (!user) return false;

  const id = generateIdFromEntropySize(16);

  await db
    .insert(pomodorosTable)
    .values({
      user_id: user.id,
      id,
    })
    .catch((e) => {
      console.log(e);
      return false;
    });

  return id;
}
