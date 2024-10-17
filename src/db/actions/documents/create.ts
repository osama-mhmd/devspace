"use server";

import { generateIdFromEntropySize } from "lucia";
import db from "../..";
import { workspaceDocuments } from "../../schemas";
import permission from "../workspaces/permission";

type Process =
  | {
      ok: false;
      message: string;
    }
  | {
      ok: true;
      message: string;
      id: string;
    };

export default async function createDocument(
  workspace_id: string,
  parent_id = "",
  content: string | null = null,
  title: string | null = null,
): Promise<Process> {
  const userPermission = await permission(workspace_id);

  const documentId = generateIdFromEntropySize(10);

  if (userPermission !== "owner")
    return {
      ok: false,
      message: "need-permission",
    };

  const document = await db
    .insert(workspaceDocuments)
    .values({
      id: documentId,
      title,
      content,
      workspace_id,
      parent_id,
    })
    .catch((err) => {
      return {
        message: err.constraint_name,
      };
    });

  if ((document as Process).message)
    return {
      ok: false,
      message: (document as Process).message,
    };

  return {
    ok: true,
    message: "done",
    id: documentId,
  };
}
