import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/home");

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(160deg, var(--hero-from), var(--hero-to)), radial-gradient(circle at 70% 30%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 45%)",
          }}
        />
        <div className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-primary mb-4">
              MED-Health Locker
            </p>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground max-w-xl">
              Your records. Clear insights. One calm place for care.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Upload lab reports, get plain-language AI analysis, and keep a living health summary —
              with consult, pharmacy, and wellness nearby when you need them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg">Create your locker</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Log in
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground max-w-md">
              AI never replaces your clinician. Every analysis includes a clear medical disclaimer.
            </p>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.12s" }}>
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] border bg-[linear-gradient(145deg,#0f6b5c_0%,#1a3d36_45%,#c4a574_120%)] shadow-[var(--shadow-soft)]">
              <div className="flex h-full flex-col justify-between p-8 text-primary-foreground">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] opacity-80">Flow</p>
                  <p className="mt-4 font-display text-3xl leading-snug">
                    Report uploaded → AI analysis → Health summary
                  </p>
                </div>
                <div className="space-y-3 text-sm opacity-95">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">Structured lab values</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">Trend-aware follow-ups</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">Private by design</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
