import { getDocument } from "@/db/actions/documents/get-document";
import permissionLayer from "../permission-layer";
import Editor from "@/editor";
import createDocument from "@/db/actions/documents/create";
import AppLayout from "../app-layout";
import { validateRequest } from "@/db/auth";
import { headers } from "next/headers";

const Space = async ({
  params,
}: {
  params: Promise<{ workspace_id: string; document_id: string }>;
}) => {
  const { workspace_id, document_id } = await params;

  return permissionLayer(workspace_id, async (permission) => {
    const headerList = headers();
    const referer = (await headerList).get("referer");

    const parentDocumentRegex = /(.+)\/workspace\/(.+)\/(.+)/;

    let doc = await getDocument(workspace_id, document_id);

    if (!doc) {
      if (!referer) return "You cannot create a document like this";
      const parent_id = referer.match(parentDocumentRegex)![2];

      const process = await createDocument(
        workspace_id,
        parent_id,
        null,
        `<h1>${document_id}</h1>`,
      );

      console.log(process);

      if (!process.ok) return "Something went wrong";

      doc = await getDocument(workspace_id, process.id);

      if (!doc) return "Something went wrong";
    }

    const { user } = await validateRequest();

    return (
      <AppLayout permission={permission} workspace_id={workspace_id}>
        <Editor
          permission={permission}
          document={doc}
          workspace_id={workspace_id}
          user={user!}
        />
      </AppLayout>
    );
  });
};

export default Space;
