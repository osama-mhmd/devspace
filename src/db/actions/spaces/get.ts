"use server";

import db from "../..";
import { validateRequest } from "../../auth";
import { spacesPermissions, spacesTable } from "../../schemas";
import { desc, eq, inArray } from "drizzle-orm";

export type Space = {
  id: string;
  type: "personal" | "organization";
  name: string;
  description: string | null;
  image: string | null;
  created_at: Date;
  shared: boolean | null;
};

export type UserSpace = {
  space_id: string;
  role: string;
};

export async function getSpacesPerUser(): Promise<UserSpace[]> {
  const { user } = await validateRequest();

  if (!user) throw new Error("not authorized");

  const spaces = await db
    .select({
      space_id: spacesPermissions.space_id,
      role: spacesPermissions.role,
    })
    .from(spacesPermissions)
    .where(eq(spacesPermissions.user_id, user.id));

  return spaces;
}

export async function getSpace(id: string): Promise<Space> {
  const { user } = await validateRequest();

  if (!user) throw new Error("not authorized");

  const [space] = await db
    .select()
    .from(spacesTable)
    .where(eq(spacesTable.id, id));

  return space;
}

export async function getSpaces(ids: string[]): Promise<Space[]> {
  const { user } = await validateRequest();

  if (!user) throw new Error("not authorized");

  const workspaces = await db
    .select()
    .from(spacesTable)
    .where(inArray(spacesTable.id, ids));

  return workspaces;
}

export async function getLastVisitedSpace(): Promise<string | null> {
  const { user } = await validateRequest();

  if (!user) throw new Error("not authorized");

  const [lastVisitedSpace] = await db
    .select({ id: spacesPermissions.space_id })
    .from(spacesPermissions)
    .where(eq(spacesPermissions.user_id, user.id))
    .orderBy(desc(spacesPermissions.last_visit))
    .limit(1);

  if (!lastVisitedSpace) return null;

  return lastVisitedSpace.id;
}
