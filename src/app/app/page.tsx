import { Button } from "@/components/ui/button";
import { validateRequest } from "@/db/auth";
import {
  getWorkspaces,
  getWorkspacesPerUser,
} from "@/db/actions/workspaces/get-workspaces";
import { Bolt, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function App() {
  let Workspaces;

  const workpsacesIds = await getWorkspacesPerUser();

  const ids = workpsacesIds.map((workspace) => workspace.workspace_id);

  const workspaces = await getWorkspaces(ids);

  if (workspaces.length == 0) {
    Workspaces = (
      <div className="text-center">
        <h3 className="text-2xl mb-3">No workspaces yet 😞</h3>
        <Button asChild>
          <Link
            href="/app/workspace/create"
            className="flex items-center gap-2"
          >
            Create your first one <PlusCircle />
          </Link>
        </Button>
      </div>
    );
  } else {
    Workspaces = (
      <div>
        <h3>Workspaces</h3>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 my-2">
          {workspaces.map((workspace, index) => {
            return (
              <Link
                href={`/app/workspace/${workspace.id}`}
                key={index}
                className="rounded-md border border-border"
              >
                <div
                  className="rounded-tr-md rounded-tl-md h-48"
                  style={{
                    backgroundImage:
                      workspace.image ??
                      "linear-gradient(to right, #eee, #eee)",
                  }}
                ></div>
                <h3 className="text-lg px-6 py-2 mb-0">{workspace.name}</h3>
                <p className="px-6 pb-6">
                  {workspace?.description ?? <i>No description</i>}
                </p>
              </Link>
            );
          })}
        </div>
        <Link
          href="/app/workspace/create"
          className="flex h-16 justify-center items-center px-4 rounded-md bg-muted border border-border"
        >
          <PlusCircle />
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <div className="container">{Workspaces}</div>
    </section>
  );
}
