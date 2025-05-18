import { Button } from "@/components/ui/button";
import $user, { Permission } from "@/db/actions/spaces/permission";
import Link from "next/link";

function NoAccess() {
  return (
    <div className="text-center mt-24">
      <h3>You have no access for this workspace 😞</h3>
      <Button className="me-2 mb-2" variant="outline" asChild>
        <Link href="/app">Back to App</Link>
      </Button>
      <Button asChild>
        <Link href="/app/workspace/create">Create workspace</Link>
      </Button>
    </div>
  );
}

export default async function permissionLayer(
  space_id: string,
  callback: (permission: Permission) => Promise<JSX.Element | string>,
): Promise<JSX.Element | string> {
  const { permission } = await $user(space_id);

  if (permission == "no-access") {
    return <NoAccess />;
  }

  return callback(permission);
}
