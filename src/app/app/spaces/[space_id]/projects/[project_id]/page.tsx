import { getProject } from "@/db/actions/projects/get";
import permissionLayer from "../../permission-layer";
import { AlertCircle } from "lucide-react";

export default async function Project({
  params,
}: {
  params: Promise<{ space_id: string; project_id: string }>;
}) {
  const { space_id, project_id } = await params;

  return permissionLayer(space_id, async () => {
    const project = await getProject(project_id);

    if (!project) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground">
              The requested project could not be found.
            </p>
          </div>
        </div>
      );
    }

    return <div>Project: {project.name}</div>;
  });
}
