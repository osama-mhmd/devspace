"use server";

import { isWithinExpirationDate, createExpirationDate } from "@/db/utils/utils";
import db from "..";
import { resetPasswordTokens, userTable } from "../schemas";
import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase as encodeHex } from "@oslojs/encoding";
import { generateIdFromEntropySize } from "lucia";

export async function createResetPasswordToken(
  userId: string,
): Promise<string> {
  await db
    .delete(resetPasswordTokens)
    .where(eq(resetPasswordTokens.user_id, userId));

  const code = generate8DigitsRandomString();

  const tokenId = generateIdFromEntropySize(25); // 40 character

  // THE NEXT LINE WAS `AWAITED`, AND I REMOVED IT, MAKE SURE THE BEHAVIOUR NOT CHANGED
  const tokenHash = encodeHex(sha256(new TextEncoder().encode(tokenId)));

  await db.insert(resetPasswordTokens).values({
    token_code: code,
    token_hash: tokenHash,
    user_id: userId,
    expires_at: createExpirationDate(60), // expires after two hours
  });

  return code;
}

import Result from "../../types/result";
import { generate8DigitsRandomString } from "./utils";

export async function verifyResetPasswordTokenCode(
  inputCode: string,
  username: string,
): Promise<Result> {
  // selecting user
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.userName, username));

  if (!user) return Result.UserNotFound;

  // selecting password token
  const resetPasswordToken = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.user_id, user[0].id));

  if (!resetPasswordToken) return Result.InvalidCode;

  const expiresAtDate = new Date(resetPasswordToken[0].expires_at);

  if (inputCode !== resetPasswordToken[0].token_code) return Result.InvalidCode;

  if (!isWithinExpirationDate(expiresAtDate)) return Result.ExpiredCode;

  return Result.Success;
}

export async function getTokenHash(
  tokenCode: string,
): Promise<"invalid-code" | string> {
  const resetPasswordToken = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.token_code, tokenCode));

  if (!resetPasswordToken) return "invalid-code";

  return resetPasswordToken[0].token_hash;
}

export async function verifyTokenHash(tokenHash: string): Promise<boolean> {
  const resetPasswordToken = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.token_hash, tokenHash));

  if (!resetPasswordToken.length) return false;

  return true;
}
