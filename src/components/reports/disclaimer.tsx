import { cn } from "@/lib/utils";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <aside
      role="note"
      className={cn(
        "rounded-2xl border border-warning/30 bg-[color-mix(in_oklab,var(--warning)_10%,var(--card))] px-4 py-3 text-sm text-foreground/90",
        className,
      )}
    >
      <p className="font-medium text-warning mb-1">Important</p>
      <p>{MEDICAL_DISCLAIMER}</p>
    </aside>
  );
}
