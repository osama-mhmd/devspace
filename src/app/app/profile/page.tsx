import { validateRequest } from "@/db/auth";
import SignOut from "./sign-out";
import { redirect } from "next/navigation";
import { Metadata } from "next";
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
    <section>
      <div className="container">
        <div className="rounded-md bg-muted my-3 p-3 flex items-center gap-1">
          {m.username()}: {user.username}
        </div>
        <div className="rounded-md bg-muted my-3 p-3 flex items-center gap-1">
          {m.name()}: {user.name}
        </div>
        <div className="rounded-md bg-muted my-2 p-3 flex items-center gap-1">
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
                  <DialogTitle>Danger Action</DialogTitle>
                </DialogHeader>
                <p>{m.signOutConfirmation()}</p>
                <DialogFooter className="flex gap-1">
                  <DialogClose asChild>
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
                  <DialogTitle>Danger Action</DialogTitle>
                </DialogHeader>
                <p>{m.deleteAccountConfirmation()}</p>
                <DialogFooter className="flex gap-1">
                  <DialogClose asChild>
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
