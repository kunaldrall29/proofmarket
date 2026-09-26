import Link from "next/link";
import {
  Activity,
  Apple,
  FlaskConical,
  HeartPulse,
  Pill,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  flask: FlaskConical,
  pill: Pill,
  apple: Apple,
  activity: Activity,
  "heart-pulse": HeartPulse,
};

type Props = {
  href: string;
  name: string;
  description: string;
  iconKey: string;
  badge?: string;
  className?: string;
};

export function ServiceCard({ href, name, description, iconKey, badge, className }: Props) {
  const Icon = ICONS[iconKey] ?? HeartPulse;
  return (
    <Link
      href={href}
      className={cn(
        "group relative block rounded-[1.25rem] border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary/40 focus-ring",
        className,
      )}
    >
      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
          {badge}
        </span>
      ) : null}
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-display text-xl">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-primary group-hover:underline">
        Open →
      </span>
    </Link>
  );
}
