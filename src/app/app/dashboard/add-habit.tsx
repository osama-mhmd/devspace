"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { habitFields, HabitFields } from "./schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createHabit from "@/db/actions/habits/create";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import * as m from "@/paraglide/messages";
import dir, { Direction } from "@/lib/dir";

export default function AddHabit() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
  } = useForm<HabitFields>({
    resolver: valibotResolver(habitFields),
  });

  async function onsubmit(data: HabitFields) {
    const result = await createHabit(data);

    if (!result) {
      toast.error(m.somethingWentWrong());
    } else {
      toast.success(m.habitCreatedSuccessfully());
      window.location.reload(); // TODO: delete this and make it instead a live preview
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="p-4 border-2 cursor-pointer border-green-400 dark:border-green-700/30 dark:hover:bg-green-700/20 hover:bg-green-300/50 transition rounded-md">
          <PlusCircle className="mx-auto" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.createAHabit()}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => await onsubmit(data))}
          className="flex flex-col gap-2 w-full"
        >
          <Input type="text" placeholder={m.name()} {...register("name")} />
          {errors.name && <p className="error">{errors.name.message}</p>}
          <Input type="text" placeholder={m.quote()} {...register("quote")} />
          {errors.quote && <p className="error">{errors.quote.message}</p>}
          <Select
            dir={dir() as Direction}
            onValueChange={
              (val) =>
                setValue("frequency", val as "daily" | "weakly" | "monthly") // I Know This is weird
            }
            {...register("frequency")}
          >
            <SelectTrigger>
              <SelectValue placeholder={m.selectTheFrequency()} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="daily">{m.daily()}</SelectItem>
                <SelectItem value="weakly">{m.weekly()}</SelectItem>
                <SelectItem value="monthly">{m.monthly()}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="error">{errors.frequency.message}</p>
          )}
          <Button type="submit" loading={isSubmitting}>
            {m.add()}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
