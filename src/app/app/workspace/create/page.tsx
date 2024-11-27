"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createWorkspace from "@/db/actions/workspaces/create";
import { useForm } from "react-hook-form";
import * as m from "@/paraglide/messages";
import { Error } from "@/app/auth/login/page";
import { languageTag } from "@/paraglide/runtime";

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<{ name: string; description: string }>();

  const onsubmit = async (data: { name: string; description: string }) => {
    const err = await createWorkspace(data, languageTag());

    if (err) {
      if (err.message == "invalid-code")
        setError("name", {
          message: err.message,
        });
    }
  };

  return (
    <section className="mt-4">
      <div className="container flex items-center justify-center">
        <form
          onSubmit={handleSubmit(async (data) => await onsubmit(data))}
          className="flex flex-col gap-2 w-96"
        >
          <h3 className="text-center mb-3">{m.createWorkspace()}</h3>
          <Input
            placeholder={m.name()}
            {...register("name", {
              required: "plzEnterName",
            })}
          />
          <Error error={errors.name} />
          <Input
            placeholder={m.descriptionAsPlaceholder()}
            {...register("description")}
          />
          <Button loading={isSubmitting}>{m.create()}</Button>
        </form>
      </div>
    </section>
  );
}
