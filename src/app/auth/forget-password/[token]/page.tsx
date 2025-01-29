"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { InferInput, pick } from "valibot";
import { registerFields } from "../../register/schema";
import { changePassword } from "@/db/actions/users/new-password";
import { ChangePasswordResult } from "@/types/result";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const resetPasswordFields = pick(registerFields, [
  "password",
  "password_repeat",
]);
export type ResetPasswordFields = InferInput<typeof resetPasswordFields>;

export default function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ResetPasswordFields>({
    resolver: valibotResolver(resetPasswordFields),
  });
  const router = useRouter();

  async function onsubmit(data: ResetPasswordFields) {
    if (data.password !== data.password_repeat) {
      toast.error("Passwords don't match");
      return;
    }

    const result = await changePassword((await params).token, data.password);

    if (result == ChangePasswordResult.InvalidPassword) {
      toast.error("Invalid password");

      return;
    }

    if (result == ChangePasswordResult.InvalidTokenHash) {
      toast.error("Invalid token hash");

      return;
    }

    // not possible, but just in case
    if (result == ChangePasswordResult.NoUser) {
      toast.error("User not found");

      return;
    }

    if (result == ChangePasswordResult.Success) {
      toast.success("Password changed successfully");

      router.push("/auth/login");
    }
  }

  return (
    <section className="mt-6 sm:mt-12">
      <div className="container flex items-center flex-col gap-6 justify-center">
        <form
          onSubmit={handleSubmit(async (data) => await onsubmit(data))}
          className="flex flex-col gap-2 w-full max-w-96"
        >
          <h2 className="text-center mb-3">Reset Password</h2>
          <Input
            type="password"
            placeholder="New password"
            {...register("password")}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
          <Input
            type="password"
            placeholder="Repeat password"
            {...register("password_repeat")}
          />
          {errors.password_repeat && (
            <p className="error">{errors.password_repeat.message}</p>
          )}
          <Button type="submit" loading={isSubmitting}>
            Reset
          </Button>
        </form>
      </div>
    </section>
  );
}
