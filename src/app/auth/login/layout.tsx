import { validateRequest } from "@/db/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login",
};

export default async function NotAuthedLayer({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = await validateRequest();

  if (session) redirect("/app");

  return children;
}
