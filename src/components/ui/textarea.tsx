import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full rounded-2xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-ring",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
