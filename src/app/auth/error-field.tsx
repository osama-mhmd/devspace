import type { FieldError } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import * as m from "@/paraglide/messages";

interface ErrorProps {
  error: FieldError | undefined;
  className?: string;
}

export default function Error({ error, className = "" }: ErrorProps) {
  if (!error) return;

  return (
    <div
      className={`
        animate-in slide-in-from-top-1 duration-200 
        flex items-start gap-2 p-3 rounded-lg border
        bg-red-50 border-red-200 text-red-800
        dark:bg-red-950/50 dark:border-red-800/50 dark:text-red-200
        ${className}
      `}
    >
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">
          {/* @ts-expect-error error message is not predictable */}
          {m[error.message]()}
        </p>
      </div>
    </div>
  );
}
