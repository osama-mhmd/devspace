"use server";

import { User } from "lucia";
import db from "../..";
import { validateRequest } from "../../auth";
import { spacesPermissions } from "../../schemas";
import { and, eq } from "drizzle-orm";

export type Permission = "owner" | "admin" | "member" | "no-access";

/**
 * @param spaceId
 * @returns the user with his permission
 */
export default async function $user(
  spaceId: string,
): Promise<(User & { permission: Permission }) | { permission: "no-access" }> {
  const { user } = await validateRequest();

  if (!user) {
    return {
      permission: "no-access",
    };
  }

  const [permission] = await db
    .select()
    .from(spacesPermissions)
    .where(
      and(
        eq(spacesPermissions.space_id, spaceId),
        eq(spacesPermissions.user_id, user.id),
      ),
    )
    .limit(1);

  return {
    ...user,
    permission: permission ? permission.role : "no-access",
  };
}
