import { getLastVisitedSpace } from "@/db/actions/spaces/get";
import { redirect } from "next/navigation";

export default async function App() {
  const lastVisitedSpace = await getLastVisitedSpace();

  if (!lastVisitedSpace) redirect("/app/spaces");

  redirect(`/app/spaces/${lastVisitedSpace}`);
}
