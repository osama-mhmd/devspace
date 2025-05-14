"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "../../auth";
import { lucia } from "../../lucia";
import { eq } from "drizzle-orm";
import db from "../..";
import { userTable } from "../../schemas";

export async function deleteUser() {
  const { user, session } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateUserSessions(user.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  await db.delete(userTable).where(eq(userTable.id, user.id));

  redirect("/app");
}
