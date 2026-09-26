import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus-ring",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
