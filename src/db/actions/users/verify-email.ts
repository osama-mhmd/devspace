"use server";

import { redirect } from "next/navigation";
import { lucia } from "../../lucia";
import db from "../..";
import { userTable } from "../../schemas";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { validateRequest } from "../../auth";
import { verifyVerificationCode } from "@/db/utils/verification-code";

export async function verify(code: string) {
  const { user } = await validateRequest();

  if (!user) {
    return {
      message: "unauthorized",
    };
  }

  if (typeof code !== "string") {
    return {
      message: "invalid-code",
    };
  }

  const validCode = verifyVerificationCode(user, code);

  if (!validCode) {
    return {
      message: "invalid-code",
    };
  }

  await lucia.invalidateUserSessions(user.id);

  await db
    .update(userTable)
    .set({ emailVerified: "true" })
    .where(eq(userTable.id, user.id));

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/app");
}
