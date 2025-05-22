"use client";

import {
  ReactNode,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { Button } from "./button";
import { HaveChild } from "./panel";
import { cn } from "@/lib/utils";

interface StepContext {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const StepContext = createContext<StepContext>({ step: 0, setStep: () => {} });

export interface StepProps extends HTMLMotionProps<"div"> {
  children?: ReactNode;
  nextString?: string;
  nextAction?: () => void;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  step: number;
}

export function Step({
  children,
  nextString = "Next",
  nextAction,
  nextDisabled = false,
  nextLoading,
  className,
  ...props
}: StepProps) {
  const { step, setStep } = useStep();

  if (!nextAction) {
    nextAction = () => setStep((prev) => prev + 1);
  }

  return (
    props.step === step && (
      <motion.div
        initial={{ opacity: 0.5, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0.5, x: 5 }}
        transition={{ duration: 0.2 }}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
        <div className="flex justify-end gap-2 mt-2">
          {step !== 0 && (
            <Button
              variant="secondary"
              onClick={() => setStep((prev) => prev - 1)}
            >
              Back
            </Button>
          )}
          <Button
            disabled={nextDisabled}
            onClick={() => nextAction()}
            loading={nextLoading}
          >
            {nextString}
          </Button>
        </div>
      </motion.div>
    )
  );
}

export function Steps({
  children,
  defaultStep = 0,
}: HaveChild & { defaultStep?: number }) {
  const [step, setStep] = useState(defaultStep);

  return (
    <StepContext.Provider value={{ step, setStep }}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </StepContext.Provider>
  );
}

const useStep = () => {
  const stepContext = useContext(StepContext);

  return stepContext;
};

/**
 * Anatomy:
 * <Panel>
 *  <PanelTrigger><Button>Show Settings</Button></PanelTrigger>
 *  <PanelBody>
 *    <PanelHeader>Settings</PanelHeader>
 *    <PanelContent>{// here is your content \\}</PanelContent>
 *  </PanelBody>
 * </Panel>
 */
