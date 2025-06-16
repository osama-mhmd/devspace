"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import BackDrop from "./backdrop";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisibilityContext {
  visible: boolean;
  setVisibility: (arg0: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContext | undefined>(
  undefined,
);

export interface HaveChild {
  children?: ReactNode;
}

export function PanelTrigger({
  children,
  className,
}: HaveChild & { className?: string }) {
  const visibilityContext = useContext(VisibilityContext);

  return (
    <div
      onClick={() => visibilityContext?.setVisibility(true)}
      className={className}
    >
      {children}
    </div>
  );
}

export function PanelClose({
  children,
  className,
}: HaveChild & { className?: string }) {
  const visibilityContext = useContext(VisibilityContext);

  return (
    <div
      onClick={() => visibilityContext?.setVisibility(false)}
      className={className}
    >
      {children}
    </div>
  );
}

export function PanelBody({
  children,
  className,
}: HaveChild & { className?: string }) {
  const visibilityContext = useContext(VisibilityContext);

  return (
    <AnimatePresence>
      {visibilityContext?.visible && (
        <BackDrop closePanel={() => visibilityContext?.setVisibility(false)}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-card rounded-md p-4 w-full max-w-2xl border",
              className,
            )}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">{children}</div>
          </motion.div>
        </BackDrop>
      )}
    </AnimatePresence>
  );
}

export function PanelHeader({ children }: HaveChild) {
  const visibilityContext = useContext(VisibilityContext);

  return (
    <div className="flex justify-between items-center">
      {children}
      <X
        size={35}
        onClick={() => visibilityContext?.setVisibility(false)}
        className="cursor-pointer p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition duration-100"
      />
    </div>
  );
}

export function Panel({
  children,
  defaultValue = false,
}: HaveChild & { defaultValue?: boolean }) {
  const [visible, setVisibility] = useState(defaultValue);

  return (
    <VisibilityContext.Provider
      value={{
        visible,
        setVisibility,
      }}
    >
      {children}
    </VisibilityContext.Provider>
  );
}

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
