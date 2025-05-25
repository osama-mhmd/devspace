import $user, { Permission } from "@/db/actions/spaces/permission";
import { notFound } from "next/navigation";

export default async function permissionLayer(
  space_id: string,
  callback: (
    permission: Permission,
  ) => Promise<React.ReactNode> | React.ReactNode,
): Promise<React.ReactNode> {
  const { permission } = await $user(space_id);

  if (permission == "no-access") return notFound();

  return callback(permission);
}
