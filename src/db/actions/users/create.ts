"use server";

import db from "../..";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "../../lucia";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { userTable } from "../../schemas";
import { RegisterFields } from "@/app/auth/register/schema";
import { Result } from "./login";

export default async function signup(
  data: RegisterFields,
  autoRedirect = true,
): Promise<Result> {
  const defaultResponse = {
    ok: false,
    message: "Invalid username",
  };

  const userName = data.user_name;

  if (
    typeof userName !== "string" ||
    userName.length < 3 ||
    userName.length > 31 ||
    !/^[a-z0-9_-]+$/.test(userName)
  ) {
    return defaultResponse;
  }

  const password = data.password;
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      ...defaultResponse,
      message: "Invalid password",
    };
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10);

  const email = data.email;

  const first_name = data.first_name;
  const last_name = data.last_name;

  const fullName = `${first_name} ${last_name}`;

  try {
    await db.insert(userTable).values({
      id: userId,
      fullName,
      userName,
      email,
      hashedPassword: passwordHash,
      /**
       * instead of making a seperate table, we are going to make a slot in the users table
       * which value is equal to `${Date expires_at}=${Number code}` or "true" or "false"
       * "false" is assigned cause it will be redirected to /auth/verify and there the email will
       * be sent.
       * "=" is used to be clear in spliting it again
       */
      emailVerified: "false",
    });
  } catch (err: any) {
    return {
      ...defaultResponse,
      message: err.constraint_name || "timeout",
    };
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  if (autoRedirect) redirect("/auth/verify");

  return {
    ok: true,
    message: "User created",
  };
}
