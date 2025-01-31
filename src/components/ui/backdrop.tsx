import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const variants = {
  centered: "justify-center",
  default: "pt-48",
};
const styles = {
  blur: "backdrop-blur-sm",
  default: "bg-black/50",
};

export default function BackDrop({
  children,
  closePanel,
  variant,
  style,
}: {
  children: ReactNode;
  closePanel: () => void;
  variant?: keyof typeof variants;
  style?: keyof typeof styles;
}) {
  return (
    <div
      className={cn(
        "animate-fadeIn fixed px-3 top-0 left-0 w-screen h-screen z-[25] flex flex-col items-center",
        variants[variant ?? "default"],
        styles[style ?? "default"],
      )}
      onClick={closePanel}
    >
      {children}
    </div>
  );
}
