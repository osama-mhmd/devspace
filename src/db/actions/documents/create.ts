"use server";

import db from "@/db";
import $user from "../spaces/permission";
import { documentsTable } from "@/db/schemas";
import { generateIdFromEntropySize } from "lucia";
import { Document } from "./get";
import { MakeNullableFieldsOptional } from "@/types";

export default async function createDocument(
  doc: Omit<MakeNullableFieldsOptional<Document>, "id" | "created_at">,
): Promise<Document> {
  const user = await $user(doc.space_id);

  if (user.permission == "no-access") throw new Error("Unauthorized request");

  const id = generateIdFromEntropySize(16);

  const [document] = await db
    .insert(documentsTable)
    .values({ id, ...doc })
    .returning();

  return document;
}
