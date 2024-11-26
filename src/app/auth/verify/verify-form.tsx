"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verify } from "@/db/actions/users/verify-email";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as m from "@/paraglide/messages";
import { Error } from "../login/page";

export default function VerifyForm({ text }: { text: string | ReactNode }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<{ code: string }>();

  const onsubmit = async (data: { code: string }) => {
    const err = await verify(data.code);

    if (err) {
      if (err.message == "invalid-code")
        setError("code", {
          message: "invalidCode",
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => await onsubmit(data))}
      className="flex flex-col gap-2 w-96"
    >
      <span className="text-muted-foreground mb-2">{text}</span>
      <Input
        placeholder={m.code()}
        {...register("code", {
          required: "plzEnterCode",
          minLength: {
            value: 8,
            message: "codeMustBe8Digits",
          },
          maxLength: {
            value: 8,
            message: "codeMustBe8Digits",
          },
        })}
      />
      <Error error={errors.code} />
      <Button loading={isSubmitting}>{m.verify()}</Button>
    </form>
  );
}
