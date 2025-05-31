"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createSpace from "@/db/actions/spaces/create";
import { Controller, useForm } from "react-hook-form";
import * as m from "@/paraglide/messages";
import Error from "@/app/auth/error-field";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, Sparkles, Plus } from "lucide-react";
import Link from "next/link";

interface FormData {
  name: string;
  description: string;
  type: "personal" | "organization";
}

const options = [
  {
    value: "personal",
    label: "Personal",
    description: "For individual use",
    icon: User,
  },
  {
    value: "organization",
    label: "Organization",
    description: "For teams & groups",
    icon: Building2,
  },
];

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<FormData>();

  const onsubmit = async (data: FormData) => {
    if (!data.name.trim()) {
      setError("name", {
        message: "plzEnterName",
      });

      return;
    }

    const err = await createSpace(data);

    if (err) {
      if (err.message == "invalid-code") {
        setError("name", {
          message: err.message,
        });
      }
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/80 to-primary/70 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {m.createSpace()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Set up your new workspace in just a few steps
          </p>
        </div>

        {/* Form Card */}
        <Card className="pt-4 shadow-xl border-0 backdrop-blur-sm">
          <CardContent className="space-y-6">
            <form
              onSubmit={handleSubmit(async (data) => await onsubmit(data))}
              className="space-y-4"
            >
              {/* Space Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Space Name
                </Label>
                <Input
                  id="name"
                  placeholder={m.name()}
                  className="h-12"
                  {...register("name", {
                    required: "plzEnterName",
                  })}
                />
                <Error error={errors.name} />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Description
                  <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={m.descriptionAsPlaceholder()}
                  className="min-h-[100px] resize-none"
                  {...register("description")}
                />
              </div>

              {/* Space Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Space Type
                </Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "plzSelectType" }}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Personal Option */}
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            field.value === option.value
                              ? "border-primary bg-primary/10 dark:border-primary dark:bg-primary/20"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-700/50"
                          }`}
                          onClick={() => field.onChange(option.value)}
                        >
                          <div className="flex flex-col items-center text-center">
                            <option.icon
                              className={`w-6 h-6 mb-2 ${
                                field.value === option.value
                                  ? "text-primary"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                field.value === option.value
                                  ? "text-primary"
                                  : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {option.description}
                            </span>
                          </div>
                          {field.value === option.value && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Error error={errors.type} />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Space...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {m.create()}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Check out our
            <Button className="px-1" variant="link" asChild>
              <Link href="#">documentation</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
