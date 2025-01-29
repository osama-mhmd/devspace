"use server";

import db from "../..";
import { resetPasswordTokens, userTable } from "../../schemas";
import { eq } from "drizzle-orm";
import { createResetPasswordToken } from "../../utils/password-token";
import { isWithinExpirationDate } from "@/db/utils/utils";
import sendMail from "../../utils/send-mail";
import { NewPasswordResult as Result } from "../../../types/result";
import { hash } from "@node-rs/argon2";

export async function newPassword(username: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.userName, username));

  if (!user.length) return Result.UserNotFound;

  const resetPasswordToken = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.user_id, user[0].id));

  if (!resetPasswordToken.length) {
    const result = await newTokenAndSendMail(username);

    return Result.Success;
  } else {
    const expiresAtDate = new Date(resetPasswordToken[0].expires_at);
    if (!isWithinExpirationDate(expiresAtDate)) {
      const code = await createResetPasswordToken(user[0].id);

      await sendMail(
        user[0].email,
        "Reset Password",
        `Your reset password code is ${code}`,
      );

      return Result.SentAnotherOne;
    } else {
      return Result.AlreadySent;
    }
  }
}

import { ChangePasswordResult } from "../../../types/result";
import { lucia } from "../../lucia";
import { cookies } from "next/headers";

export async function changePassword(
  token_hash: string,
  password: string,
): Promise<ChangePasswordResult> {
  const token = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.token_hash, token_hash));

  if (!token) return ChangePasswordResult.InvalidTokenHash;

  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, token[0].user_id));

  if (!user) return ChangePasswordResult.NoUser;

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return ChangePasswordResult.InvalidPassword;
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await db
    .update(userTable)
    .set({ hashedPassword: passwordHash })
    .where(eq(userTable.id, user[0].id));

  // deleting the token
  await db
    .delete(resetPasswordTokens)
    .where(eq(resetPasswordTokens.user_id, user[0].id));

  // revoking all other sessions
  await lucia.invalidateUserSessions(user[0].id);
  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return ChangePasswordResult.Success;
}

export async function newTokenAndSendMail(username: string): Promise<boolean> {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.userName, username));

  if (!user.length) return false;

  const code = await createResetPasswordToken(user[0].id);

  await sendMail(
    user[0].email,
    "Reset Password",
    `Your reset password code is ${code}`,
  );

  return true;
}
