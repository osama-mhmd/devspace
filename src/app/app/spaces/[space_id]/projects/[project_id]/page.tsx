import { getProject } from "@/db/actions/projects/get";
import permissionLayer from "../../permission-layer";
import { AlertCircle } from "lucide-react";
import { getProjectTasks } from "@/db/actions/tasks/get";
import TasksTable from "./tasks-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getSpace } from "@/db/actions/spaces/get";

export default async function Project({
  params,
}: {
  params: Promise<{ space_id: string; project_id: string }>;
}) {
  const { space_id, project_id } = await params;

  return permissionLayer(space_id, async () => {
    const project = await getProject(project_id);
    const projectTasks = await getProjectTasks(space_id, project_id);
    const space = await getSpace(space_id);

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

    return (
      <section>
        <div className="container my-16">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/app/spaces/${space.id}`}>{space.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{project.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TasksTable
            tasks={projectTasks}
            project_id={project_id}
            space_id={space_id}
          />
        </div>
      </section>
    );
  });
}
