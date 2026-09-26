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
        <div className="mx-auto grid min-h-[min(78vh,900px)] max-w-6xl items-center gap-8 px-4 py-10 sm:gap-10 sm:py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <p className="font-display text-3xl text-primary mb-3 sm:mb-4 sm:text-5xl lg:text-6xl">
              MED-Health Locker
            </p>
            <h1 className="font-display text-2xl leading-tight text-foreground max-w-xl sm:text-4xl">
              Your records. Clear insights. One calm place for care.
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed sm:mt-5 sm:text-lg">
              Upload lab reports, get plain-language AI analysis, and keep a living health summary —
              with consult, pharmacy, and wellness nearby when you need them.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full min-h-12 sm:w-auto">
                  Create your locker
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full min-h-12 sm:w-auto">
                  Log in
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground max-w-md sm:mt-6">
              AI never replaces your clinician. Every analysis includes a clear medical disclaimer.
            </p>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.12s" }}>
            <div className="aspect-[5/4] sm:aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border bg-[linear-gradient(145deg,#0f6b5c_0%,#1a3d36_45%,#c4a574_120%)] shadow-[var(--shadow-soft)]">
              <div className="flex h-full flex-col justify-between p-5 text-primary-foreground sm:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80 sm:text-sm">Flow</p>
                  <p className="mt-3 font-display text-2xl leading-snug sm:mt-4 sm:text-3xl">
                    Report uploaded → AI analysis → Health summary
                  </p>
                </div>
                <div className="space-y-2 text-sm opacity-95 sm:space-y-3">
                  <div className="rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3">
                    Structured lab values
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3">
                    Trend-aware follow-ups
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3">
                    Private by design
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
