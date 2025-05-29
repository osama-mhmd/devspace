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
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Profile() {
  const { user, session } = await validateRequest();

  if (!session) redirect("/auth/login");

  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-muted/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-6 mb-8 relative">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <LogOut strokeWidth={1.5} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-red-600">
                  <DialogTitle>Sign out</DialogTitle>
                </DialogHeader>
                <p className="text-gray-700 dark:text-gray-300">
                  {m.signOutConfirmation()}
                </p>
                <DialogFooter className="flex gap-1 mt-2">
                  <DialogClose asChild>
                    <Button variant="outline">{m.close()}</Button>
                  </DialogClose>
                  <SignOut />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <div className="profile-field">
              {m.username()}: {user.username}
            </div>
            <div className="profile-field">
              {m.name()}: {user.name}
            </div>
            <div className="profile-field">
              {m.email()}: {user.email}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              {m.dangerZone()}
            </h2>
            <div className="danger-zone-action-slot">
              <p>{m.deleteAccountDescription()}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">{m.deleteAccount()}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="text-red-600">
                    <DialogTitle>Danger Action</DialogTitle>
                  </DialogHeader>
                  <p className="text-gray-700 dark:text-gray-300">
                    {m.deleteAccountConfirmation()}
                  </p>
                  <DialogFooter className="flex gap-3 mt-4">
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
      </div>
    </section>
  );
}
