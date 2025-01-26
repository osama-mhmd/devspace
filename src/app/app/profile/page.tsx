import { validateRequest } from "@/db/auth";
import SignOut from "./sign-out";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { CircleAlert, CircleCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import DeleteAccount from "./delete-account";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as m from "@/paraglide/messages";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Profile() {
  const { user, session } = await validateRequest();

  if (!session) redirect("/auth/login");

  return (
    <section className="mt-20">
      <div className="container">
        <div className="rounded-md bg-muted my-3 p-3 flex items-center gap-1">
          {m.username()}: {user.username}
        </div>
        <div className="rounded-md bg-muted my-3 p-3 flex items-center gap-1">
          {m.name()}: {user.fullname}
        </div>
        <div className="rounded-md bg-muted my-2 p-3 flex items-center gap-1">
          {m.email()}:{" "}
          {user.isVerified ? (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  <CircleCheck fill="hsl(var(--primary))" stroke="white" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your account is verified</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip open={true} delayDuration={300}>
                <TooltipTrigger>
                  <CircleAlert fill="hsl(var(--destructive))" stroke="white" />
                </TooltipTrigger>
                <TooltipContent>
                  <Link href="/auth/verify" className="underline text-blue-600">
                    {m.pleaseVerifyYourAccount()}
                  </Link>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}{" "}
          {user.email}
        </div>
        <div className="px-6 mt-4 pb-6 py-2 border-2 border-red-400 rounded-lg flex flex-col gap-3">
          <h3>{m.dangerZone()}</h3>
          <div className="danger-zone-action-slot">
            {m.signOutConfirmation()}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">{m.signOut()}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-red-600">
                  <DialogTitle className="mt-0">Danger Action</DialogTitle>
                </DialogHeader>
                <p>{m.signOutConfirmation()}</p>
                <DialogFooter className="flex gap-1">
                  <DialogClose>
                    <Button variant="outline">{m.close()}</Button>
                  </DialogClose>
                  <SignOut />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="danger-zone-action-slot">
            {m.deleteAccountDescription()}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">{m.deleteAccount()}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-red-600">
                  <DialogTitle className="mt-0">Danger Action</DialogTitle>
                </DialogHeader>
                <p>{m.deleteAccountConfirmation()}</p>
                <DialogFooter className="flex gap-1">
                  <DialogClose>
                    <Button variant="outline">{m.close()}</Button>
                  </DialogClose>
                  <DeleteAccount />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}
