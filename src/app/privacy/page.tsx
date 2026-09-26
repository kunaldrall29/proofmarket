export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose-like space-y-4">
      <h1 className="font-display text-3xl">Privacy</h1>
      <p className="text-muted-foreground leading-relaxed">
        MED-Health Locker stores your health profile, uploaded reports, and AI analyses to provide
        the product you signed up for. We do not sell your health data. Access is limited to your
        account (and server-side processing needed to generate analysis).
      </p>
      <p className="text-muted-foreground leading-relaxed">
        You can export or permanently delete your account and associated data from Profile at any
        time. AI outputs are informational only and are not medical advice.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Admin usage dashboards use anonymized event counts without attaching report content or
        personal identifiers to aggregate charts.
      </p>
    </div>
  );
}
