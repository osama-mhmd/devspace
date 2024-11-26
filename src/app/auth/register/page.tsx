"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import signup from "@/db/actions/users/create";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerFields, type RegisterFields } from "./schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { toast } from "sonner";
import { Error } from "../login/page";
import * as m from "@/paraglide/messages";

export default function Register() {
  const {
    register,
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
  } = useForm<RegisterFields>({ resolver: valibotResolver(registerFields) });

  const onSumbit: SubmitHandler<RegisterFields> = async (
    data: RegisterFields,
  ) => {
    if (data.password != data.password_repeat) {
      setError("password_repeat", {
        message: "passwordsMustMatch",
      });
    } else {
      const result = await signup(data);

      if (!result.ok) {
        if (
          result.message == "users_email_unique" ||
          result.message == "users_username_unique"
        )
          setError("user_name", { message: result.message });
        if (result.message == "timeout") toast.error("Connection time out");
      }
    }
  };

  return (
    <section className="mt-6 sm:mt-12">
      <div className="container flex items-center justify-center">
        <form
          onSubmit={handleSubmit(async (data) => await onSumbit(data))}
          className="flex flex-col gap-2 w-96"
        >
          <h2 className="text-center mb-3">{m.register()}</h2>
          <Input
            type="text"
            placeholder={m.firstName()}
            {...register("first_name")}
          />
          <Error error={errors.first_name} />
          <Input
            type="text"
            placeholder={m.lastName()}
            {...register("last_name")}
          />
          <Error error={errors.last_name} />
          <Input
            type="text"
            placeholder={m.username()}
            {...register("user_name")}
          />
          <Error error={errors.user_name} />
          <Input type="email" placeholder={m.email()} {...register("email")} />
          <Error error={errors.email} />
          <Input
            type="password"
            placeholder={m.password()}
            {...register("password")}
          />
          <Error error={errors.password} />
          <Input
            type="password"
            placeholder={m.repeatPassword()}
            {...register("password_repeat")}
          />
          <Error error={errors.password_repeat} />
          <Button type="submit" loading={isSubmitting}>
            {m.register()}
          </Button>
          <Link href="/auth/login" className="link">
            {m.alreadyHaveAnAccount()}
          </Link>
        </form>
      </div>
    </section>
  );
}
