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
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleMore, Smile as SmileFace } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Smile = motion(SmileFace);

export default function Survey() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<"success" | "can" | "loading" | "hidden">(
    "can",
  );
  const { data: surveyFilled, isPending } = useQuery({
    queryKey: ["filled-state"],
    queryFn: async () => await checkSurveyFilledOrNot(),
  });

  if (isPending || surveyFilled) return null;

  const submitServey = async () => {
    const data = textareaRef.current?.value ?? "";

    if (!data) return;

    setState("loading");

    const result = await createSurvey(data);

    if (!result.ok) toast.error("Error occured while creating survey");
    else {
      toast("Thanks, you appreciate filling out the survey. :)");
      setState("success");
      setTimeout(() => setState("hidden"), 2000);
    }
  };

  const props = {
    className:
      "fixed bottom-6 end-6 flex items-center gap-2 cursor-pointer bg-blue-400 p-4 rounded-3xl",
    size: 60,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <AnimatePresence>
            {(() => {
              switch (state) {
                case "success":
                  return (
                    <Smile
                      className={cn("animate-bounce", props.className)}
                      size={props.size}
                      exit={{ opacity: 0 }}
                    />
                  );
                case "can":
                  return <MessageCircleMore {...props} />;
                case "loading":
                  return (
                    <p {...props} style={{ width: 60, height: 60 }}>
                      <span className="spinner w-full h-full"></span>
                    </p>
                  );
                default:
                  return null;
              }
            })()}
          </AnimatePresence>
        </div>
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
