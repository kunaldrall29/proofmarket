"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Doctor = { id: string; name: string };
type Appointment = {
  id: string;
  title: string;
  startsAt: string;
  location: string | null;
  status: string;
  doctor: Doctor | null;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  async function load() {
    const [a, d] = await Promise.all([fetch("/api/appointments"), fetch("/api/doctors")]);
    const aj = await a.json();
    const dj = await d.json();
    if (a.ok) setAppointments(aj.appointments);
    if (d.ok) setDoctors(dj.doctors);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        doctorId: fd.get("doctorId") || null,
        startsAt: fd.get("startsAt"),
        location: fd.get("location"),
        notes: fd.get("notes"),
        status: "UPCOMING",
      }),
    });
    e.currentTarget.reset();
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="font-display text-3xl">Appointments</h1>
        <p className="mt-2 text-muted-foreground">Upcoming and past visits, optionally linked to Consult.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-[1.25rem] border bg-card p-5">
        <label className="space-y-2 text-sm">
          <span>Title</span>
          <Input name="title" required placeholder="Follow-up with cardiologist" />
        </label>
        <label className="space-y-2 text-sm">
          <span>Doctor</span>
          <Select name="doctorId" defaultValue="">
            <option value="">None</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Starts at</span>
          <Input name="startsAt" type="datetime-local" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Location</span>
          <Input name="location" />
        </label>
        <label className="space-y-2 text-sm">
          <span>Notes</span>
          <Textarea name="notes" />
        </label>
        <Button type="submit">Add appointment</Button>
      </form>
      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a.id} className="rounded-[1.25rem] border bg-card px-5 py-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium">{a.title}</p>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{a.status}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(a.startsAt).toLocaleString()}
              {a.doctor ? ` · ${a.doctor.name}` : ""}
              {a.location ? ` · ${a.location}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
