import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  high: "bg-[color-mix(in_oklab,var(--danger)_16%,transparent)] text-danger",
  low: "bg-[color-mix(in_oklab,var(--warning)_16%,transparent)] text-warning",
  normal: "bg-[color-mix(in_oklab,var(--success)_16%,transparent)] text-success",
  unknown: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex animate-reveal rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        STYLES[key] ?? STYLES.unknown,
      )}
    >
      {status}
    </span>
  );
}
