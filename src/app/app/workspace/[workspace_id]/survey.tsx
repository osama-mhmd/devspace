"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import checkSurveyFilledOrNot from "@/db/actions/surveys/check";
import createSurvey from "@/db/actions/surveys/create";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function Survey() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data, isPending } = useQuery({
    queryKey: ["filled-state"],
    queryFn: async () => await checkSurveyFilledOrNot(),
  });

  if (isPending) return null;
  if (data) return null;

  const submitServey = async () => {
    const data = textareaRef.current?.value ?? "";

    if (!data) return;

    const result = await createSurvey(data);

    if (!result.ok) toast.error("Error occured while creating survey");
    else
      toast.success(
        "Survey created successfully. We appreciate your feedback!",
      );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MessageCircleMore
          className="fixed bottom-6 end-6 flex items-center gap-2 cursor-pointer bg-blue-400 p-4 rounded-3xl"
          size={60}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mt-0">Survey</DialogTitle>
        </DialogHeader>
        <p>What do you feel about DevSpace? and the text editor?</p>
        <textarea
          className="p-2 px-4 rounded-md bg-input"
          name="feedback"
          id="feedback"
          cols={30}
          rows={4}
          ref={textareaRef}
          required
        ></textarea>
        <DialogFooter className="flex gap-1">
          <DialogClose asChild>
            <Button type="submit" onClick={submitServey}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
