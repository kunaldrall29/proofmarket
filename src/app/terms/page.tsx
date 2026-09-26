export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-4">
      <h1 className="font-display text-3xl">Terms</h1>
      <p className="text-muted-foreground leading-relaxed">
        MED-Health Locker is a personal health information and literacy tool. It does not provide
        medical diagnosis, emergency services, or clinician-supervised care. Always seek advice from
        a qualified healthcare professional for medical decisions.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        You are responsible for the accuracy of information you upload and for safeguarding your
        login credentials. Misuse of the service, attempts to access other users&apos; data, or
        bypassing role restrictions is prohibited.
      </p>
    </div>
  );
}
