import { validateRequest } from "@/db/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import AppNavbar from "./app-navbar";

export const metadata: Metadata = {
  title: "App",
};

export default function Layout({ children }: { children: ReactNode }) {
  // const { user, session } = await validateRequest();

  // if (!session || !user) redirect("/auth/login");

  return (
    <>
      <AppNavbar />
      {children}
    </>
  );
}
