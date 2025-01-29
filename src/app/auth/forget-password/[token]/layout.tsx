import { verifyTokenHash } from "@/db/utils/password-token";
import { ReactNode } from "react";

export default async function ForgetPasswordLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ token: string }>;
}) {
  const isCorrectToken = await verifyTokenHash((await params).token);

  if (!isCorrectToken) {
    return (
      <div className="flex mt-12 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid token</h1>
          <p className="mt-2 text-sm text-gray-500">
            The token you are trying to use is invalid. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
