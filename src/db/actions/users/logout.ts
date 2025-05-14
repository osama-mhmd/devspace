"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "../../auth";
import { lucia } from "../../lucia";

export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/");
}
