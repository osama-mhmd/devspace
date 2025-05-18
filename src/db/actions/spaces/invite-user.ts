"use server";

import db from "../..";
import { spacesPermissions, userTable } from "../../schemas";
import { eq } from "drizzle-orm";
import $user from "./permission";

export default async function inviteUser(
  spaceId: string,
  role: "member" | "admin",
  usernameToInvite: string,
): Promise<boolean> {
  const user = await $user(spaceId);

  if (user.permission == "no-access" || user.permission == "member") {
    return false;
  }

  const [userToInvite] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, usernameToInvite))
    .limit(1);

  await db.insert(spacesPermissions).values({
    invited_by: user.id,
    role,
    space_id: spaceId,
    user_id: userToInvite.id,
  });

  return true;
}
