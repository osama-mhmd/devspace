"use server";

import { generateIdFromEntropySize } from "lucia";
import db from "../..";
import { validateRequest } from "../../auth";
import { spacesPermissions, spacesTable } from "../../schemas";
import { redirect } from "next/navigation";

export type Err = {
  message: string;
};

export default async function createSpace(
  data: {
    name: string;
    description: string;
  },
  type: "personal" | "organization",
): Promise<Err | never> {
  const { user } = await validateRequest();

  if (!user)
    return {
      message: "unauthorized",
    };

  const spaceId = generateIdFromEntropySize(10);

  const space = await db
    .insert(spacesTable)
    .values({
      id: spaceId,
      name: data.name ?? "workspace",
      description: data.description,
      type,
    })
    .catch((err) => {
      return {
        message: err.constraint_name,
      };
    });

  if ((space as Err).message) {
    return {
      message: (space as Err).message,
    };
  }

  await db.insert(spacesPermissions).values({
    space_id: spaceId,
    user_id: user.id,
    role: "owner",
  });

  redirect(`/app/spaces/${spaceId}`);
}
