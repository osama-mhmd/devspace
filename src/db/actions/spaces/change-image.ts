"use server";

import db from "../..";
import { spacesTable } from "../../schemas";
import { eq } from "drizzle-orm";
import $user from "./permission";

export default async function changeWorkspaceImage(
  image: string,
  spaceId: string,
): Promise<boolean> {
  const { permission } = await $user(spaceId);

  if (permission !== "admin") return false;

  await db
    .update(spacesTable)
    .set({ image })
    .where(eq(spacesTable.id, spaceId));

  return true;
}
