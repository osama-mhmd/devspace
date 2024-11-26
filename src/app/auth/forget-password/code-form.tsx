"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  getTokenHash,
  verifyResetPasswordTokenCode,
} from "@/db/utils/password-token";
import Result from "@/types/result";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as m from "@/paraglide/messages";
import { Error } from "../login/page";

const forgetPasswordFields = v.object({
  code: v.pipe(
    v.string(),
    v.nonEmpty("plzEnterCode"),
    v.minLength(8, "codeMustBe8Digits"),
    v.maxLength(8, "codeMustBe8Digits"),
  ),
});
export type ForgetPasswordFields = v.InferInput<typeof forgetPasswordFields>;

export default function CodeForm({ username }: { username: string }) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ForgetPasswordFields>({
    resolver: valibotResolver(forgetPasswordFields),
  });
  const router = useRouter();

  async function onsubmit(data: ForgetPasswordFields) {
    const result = await verifyResetPasswordTokenCode(data.code, username);

    if (result == Result.Success) {
      const token = await getTokenHash(data.code);

      if (token == "invalid-code") {
        toast.error(m.invalidCode());

        return;
      }

      router.push("/auth/forget-password/" + token);
    }
    if (result == Result.InvalidCode) {
      toast.error(m.invalidCode());
    }
    if (result == Result.ExpiredCode) {
      toast.error(m.expiredCode());
    }
    if (result == Result.UserNotFound) {
      // this will not happen, but just in case
      toast.error(m.userNotFound());
    }
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => await onsubmit(data))}
      className="flex flex-col gap-2 w-full max-w-96"
    >
      <h2 className="text-center mb-3">{m.resetPassword()}</h2>
      <Input type="text" placeholder={m.username()} disabled value={username} />
      <Input type="text" placeholder={m.code()} {...register("code")} />
      <Error error={errors.code} />
      <Button type="submit" loading={isSubmitting}>
        {m.reset()}
      </Button>
    </form>
  );
}
