"use server";

import { cookies } from "next/headers";

export default function languageTag() {
  const lang = cookies().get("lang")?.value;
}
