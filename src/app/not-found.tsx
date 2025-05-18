import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { validateRequest } from "@/db/auth";
import NotFoundImage from "@/components/not-found-image";

export const metadata: Metadata = {
  title: "Not found",
};

export default async function NotFound() {
  const { user } = await validateRequest();

  return (
    <div className="flex flex-col items-center gap-3 mt-24">
      <NotFoundImage />
      <h3 className="mt-6">
        Sorry{user ? <span className="text-blue-400"> {user.name}</span> : ""},
        page doesn{"'"}t exist
      </h3>
      <Button asChild variant="outline">
        {user ? (
          <Link href="/app">Back to App</Link>
        ) : (
          <Link href="/">Back to home</Link>
        )}
      </Button>
    </div>
  );
}
