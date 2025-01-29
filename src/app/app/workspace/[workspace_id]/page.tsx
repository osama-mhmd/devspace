import { getRootDocument } from "@/db/actions/documents/get-document";
import permissionLayer from "./permission-layer";
import Editor from "@/editor";
import createDocument from "@/db/actions/documents/create";
import AppLayout from "./app-layout";
import { validateRequest } from "@/db/auth";

const Space = async ({
  params,
}: {
  params: Promise<{ workspace_id: string }>;
}) => {
  const workspace_id = (await params).workspace_id;

  return permissionLayer(workspace_id, async (permission) => {
    const rootDocument = await getRootDocument(workspace_id);

    if (!rootDocument) {
      await createDocument(workspace_id);
      // if (!process.ok) alert(process.message);

      return <p>We are so sorry, please refresh the page</p>;
    }

    const { user } = await validateRequest();

    return (
      <AppLayout permission={permission} workspace_id={workspace_id}>
        <Editor
          permission={permission}
          document={rootDocument}
          workspace_id={workspace_id}
          user={user!}
        />
      </AppLayout>
    );
  });
};

export default Space;
