"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GithubIcon from "@/components/icons/github";
import Link from "next/link";

import { FieldError, useForm } from "react-hook-form";
import { registerFields } from "../register/schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { InferInput, pick } from "valibot";
import { login } from "@/db/actions/users/login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as m from "@/paraglide/messages";

const loginFields = pick(registerFields, ["user_name", "password"]);
export type LoginFields = InferInput<typeof loginFields>;

export default function Login({
  searchParams: { redirectTo },
}: {
  searchParams: { redirectTo: string };
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<LoginFields>({ resolver: valibotResolver(loginFields) });
  const router = useRouter();

  async function onsubmit(data: LoginFields) {
    const result = await login(data);

    // TODO: please make good API
    if (result.ok) {
      router.push(redirectTo ?? "/app");
    } else {
      // @ts-ignore <- TODO: Fix this
      toast.error(m[result.message]());
    }
  }

  return (
    <section className="mt-6 sm:mt-12">
      <div className="container flex items-center flex-col gap-6 justify-center">
        <form
          onSubmit={handleSubmit(async (data) => await onsubmit(data))}
          className="flex flex-col gap-2 w-full max-w-96"
        >
          <h2 className="text-center mb-3">{m.login()}</h2>
          <Input
            type="text"
            placeholder={m.username()}
            {...register("user_name")}
          />
          <Error error={errors.user_name} />
          <Input
            type="password"
            placeholder={m.password()}
            {...register("password")}
          />
          <Error error={errors.password} />
          <Link href="/auth/forget-password" className="mb-2 link">
            {m.forgetPassword()}
          </Link>
          <Button type="submit" loading={isSubmitting}>
            {m.login()}
          </Button>
          <Link
            href={"/auth/register" + `?redirectTo=${redirectTo ?? ""}`}
            className="link"
          >
            {m.dontHaveAnAccount()}
          </Link>
        </form>
        <div className="grid w-full max-w-96 [&>*>svg]:me-1">
          <Button variant="outline">
            <GithubIcon /> {m.signInWithGithub()}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Error({ error }: { error: FieldError | undefined }) {
  // TODO: make this better
  if (!error) return;
  // @ts-ignore
  return <p className="error">{m[error.message]()}</p>;
}
