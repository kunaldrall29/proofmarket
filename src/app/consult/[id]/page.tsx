"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  contactEmail: string | null;
  contactPhone: string | null;
  notes: string | null;
  appointments: Array<{
    id: string;
    title: string;
    startsAt: string;
    status: string;
  }>;
};

export default function DoctorDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    fetch(`/api/doctors/${params.id}`)
      .then((r) => r.json())
      .then((d) => setDoctor(d.doctor));
  }, [params.id]);

  async function remove() {
    if (!confirm("Remove this doctor from your directory?")) return;
    await fetch(`/api/doctors/${params.id}`, { method: "DELETE" });
    router.push("/consult");
  }

  if (!doctor) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
      <Link href="/consult" className="text-sm text-primary hover:underline">
        ← Back to directory
      </Link>
      <div className="rounded-[1.25rem] border bg-card p-6">
        <h1 className="font-display text-3xl">{doctor.name}</h1>
        <p className="mt-1 text-primary">{doctor.specialty}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{doctor.contactEmail || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd>{doctor.contactPhone || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Notes</dt>
            <dd className="whitespace-pre-wrap">{doctor.notes || "—"}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Button variant="danger" onClick={remove}>
            Remove doctor
          </Button>
        </div>
      </div>
      <section>
        <h2 className="font-display text-xl">Linked appointments</h2>
        <div className="mt-3 space-y-2">
          {doctor.appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              None yet.{" "}
              <Link href="/appointments" className="text-primary hover:underline">
                Add an appointment
              </Link>
            </p>
          ) : (
            doctor.appointments.map((a) => (
              <div key={a.id} className="rounded-2xl border bg-card px-4 py-3 text-sm">
                <p className="font-medium">{a.title}</p>
                <p className="text-muted-foreground">
                  {new Date(a.startsAt).toLocaleString()} · {a.status}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
