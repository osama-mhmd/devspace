"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createSpace from "@/db/actions/spaces/create";
import { Controller, useForm } from "react-hook-form";
import * as m from "@/paraglide/messages";
import Error from "@/app/auth/error-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<{
    name: string;
    description: string;
    type: "personal" | "organization";
  }>();

  const onsubmit = async (data: { name: string; description: string }) => {
    const err = await createSpace(data, "personal");

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
          <h3 className="text-center mb-3">{m.createSpace()}</h3>
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
          <Controller
            name="type"
            control={control}
            rules={{ required: "plzSelectType" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Error error={errors.type} />
          <Button loading={isSubmitting}>{m.create()}</Button>
        </form>
      </div>
    </section>
  );
}
