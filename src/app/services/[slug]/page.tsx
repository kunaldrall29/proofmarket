import { notFound, redirect } from "next/navigation";
import { SERVICE_DEFS } from "@/lib/constants";
import { WaitlistForm } from "@/components/services/waitlist-form";
import {
  Activity,
  Apple,
  FlaskConical,
  HeartPulse,
  Pill,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  flask: FlaskConical,
  pill: Pill,
  apple: Apple,
  activity: Activity,
  "heart-pulse": HeartPulse,
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_DEFS.filter((s) => s.isPlaceholder).map((s) => ({ slug: s.slug }));
}

export default async function ServicePlaceholderPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "consult") redirect("/consult");

  const service = SERVICE_DEFS.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = ICONS[service.iconKey] ?? HeartPulse;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-[2rem] border bg-card p-6 sm:p-10 shadow-[var(--shadow-soft)] animate-fade-up">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {service.isPlaceholder ? "Coming soon" : "Available"}
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">{service.name}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">{service.description}</p>
        {service.isPlaceholder ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              We&apos;re designing this experience to plug into your health locker without a redesign.
              Join the waitlist and we&apos;ll notify you when booking opens.
            </p>
            <div className="mt-6">
              <WaitlistForm serviceSlug={service.slug} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
