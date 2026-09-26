import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-ring disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-primary text-primary-foreground hover:brightness-110 shadow-[var(--shadow-soft)]",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:brightness-95",
          variant === "ghost" && "bg-transparent hover:bg-muted text-foreground",
          variant === "danger" && "bg-danger text-white hover:brightness-110",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
