"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { registerFields } from "../register/schema";
import { InferInput, pick } from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { newPassword } from "@/db/actions/users/new-password";
import { NewPasswordResult as Result } from "@/types/result";
import { toast } from "sonner";
import * as m from "@/paraglide/messages";
import { Error } from "../login/page";

const forgetPasswordFields = pick(registerFields, ["user_name"]);
export type ForgetPasswordFields = InferInput<typeof forgetPasswordFields>;

export default function UsernameForm({
  stater,
}: {
  stater: (username: string) => void;
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ForgetPasswordFields>({
    resolver: valibotResolver(forgetPasswordFields),
  });

  async function onsubmit(data: ForgetPasswordFields) {
    const result = await newPassword(data.user_name);

    if (result == Result.UserNotFound) {
      toast.error(m.userNotFound());

      return;
    }
    if (result == Result.Success) {
      toast.success(m.emailSent());
    }
    if (result == Result.SentAnotherOne) {
      toast.success(m.sentAnotherEmail());
    }
    if (result == Result.AlreadySent) {
      toast.success(m.alreadySentAnEmail());
    }

    stater(data.user_name);
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => await onsubmit(data))}
      className="flex flex-col gap-2 w-full max-w-96"
    >
      <h2 className="text-center mb-3">{m.resetPassword()}</h2>
      <Input
        type="text"
        placeholder={m.username()}
        {...register("user_name")}
      />
      <Error error={errors.user_name} />
      <Button type="submit" loading={isSubmitting}>
        {m.reset()}
      </Button>
    </form>
  );
}
