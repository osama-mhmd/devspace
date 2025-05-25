"use server";

import { cookies } from "next/headers";

export default async function languageTag() {
  const lang = (await cookies()).get("lang")?.value;

  return lang;
}
