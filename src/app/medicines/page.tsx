"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  notes: string | null;
  isActive: boolean;
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  async function load() {
    const res = await fetch("/api/medicines");
    const data = await res.json();
    if (res.ok) setMedicines(data.medicines);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        dosage: fd.get("dosage"),
        frequency: fd.get("frequency"),
        notes: fd.get("notes"),
        isActive: true,
      }),
    });
    e.currentTarget.reset();
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/medicines/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="font-display text-3xl">Medicines</h1>
        <p className="mt-2 text-muted-foreground">Log current medicines and prescriptions.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-[1.25rem] border bg-card p-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Name</span>
          <Input name="name" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Dosage</span>
          <Input name="dosage" placeholder="e.g. 500mg" />
        </label>
        <label className="space-y-2 text-sm sm:col-span-2">
          <span>Frequency</span>
          <Input name="frequency" placeholder="e.g. Twice daily" />
        </label>
        <label className="space-y-2 text-sm sm:col-span-2">
          <span>Notes</span>
          <Textarea name="notes" />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Add medicine</Button>
        </div>
      </form>
      <div className="space-y-3">
        {medicines.map((m) => (
          <div key={m.id} className="flex items-start justify-between gap-4 rounded-[1.25rem] border bg-card px-5 py-4">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">
                {[m.dosage, m.frequency].filter(Boolean).join(" · ") || "No dosage set"}
              </p>
              {m.notes ? <p className="mt-2 text-sm text-muted-foreground">{m.notes}</p> : null}
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(m.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
