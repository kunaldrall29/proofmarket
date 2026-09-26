"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  contactEmail: string | null;
  contactPhone: string | null;
  notes: string | null;
};

export default function ConsultPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/doctors");
    const data = await res.json();
    if (res.ok) setDoctors(data.doctors);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        specialty: fd.get("specialty"),
        contactEmail: fd.get("contactEmail"),
        contactPhone: fd.get("contactPhone"),
        notes: fd.get("notes"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save doctor.");
      return;
    }
    e.currentTarget.reset();
    load();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="font-display text-3xl">Consult</h1>
        <p className="mt-2 text-muted-foreground">
          Your personal doctor directory — save clinicians you trust for later consultation. This is
          not a live booking marketplace.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-[1.25rem] border bg-card p-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm sm:col-span-1">
          <span>Doctor name</span>
          <Input name="name" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Specialty</span>
          <Input name="specialty" required placeholder="e.g. Endocrinology" />
        </label>
        <label className="space-y-2 text-sm">
          <span>Email</span>
          <Input name="contactEmail" type="email" />
        </label>
        <label className="space-y-2 text-sm">
          <span>Phone</span>
          <Input name="contactPhone" />
        </label>
        <label className="space-y-2 text-sm sm:col-span-2">
          <span>Notes</span>
          <Textarea name="notes" placeholder="Clinic address, preferred times, history…" />
        </label>
        {error ? <p className="text-sm text-danger sm:col-span-2">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button type="submit">Save doctor</Button>
        </div>
      </form>

      <div className="space-y-3">
        {doctors.length === 0 ? (
          <p className="text-muted-foreground">No doctors saved yet.</p>
        ) : (
          doctors.map((d) => (
            <Link
              key={d.id}
              href={`/consult/${d.id}`}
              className="block rounded-[1.25rem] border bg-card px-5 py-4 hover:border-primary/40 focus-ring"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl">{d.name}</h2>
                <span className="text-sm text-primary">{d.specialty}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {[d.contactEmail, d.contactPhone].filter(Boolean).join(" · ") || "No contact yet"}
              </p>
            </Link>
          ))
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Tip: link visits from{" "}
        <Link href="/appointments" className="text-primary underline-offset-2 hover:underline">
          Appointments
        </Link>
        .
      </p>
    </div>
  );
}
