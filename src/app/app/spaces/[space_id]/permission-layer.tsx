import $user, { Permission } from "@/db/actions/spaces/permission";
import { notFound } from "next/navigation";

export default async function permissionLayer(
  space_id: string,
  callback: (permission: Permission) => Promise<JSX.Element | string>,
): Promise<JSX.Element | string> {
  const { permission } = await $user(space_id);

  if (permission == "no-access") return notFound();

  return callback(permission);
}
