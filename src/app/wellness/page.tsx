"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Entry = {
  id: string;
  mood: number | null;
  journalText: string | null;
  entryDate: string;
};

const RESOURCES = [
  {
    title: "Breathing reset (2 minutes)",
    body: "Inhale for 4, hold for 4, exhale for 6. Repeat gently — no force.",
  },
  {
    title: "When to seek support",
    body: "If mood stays low for weeks, or you feel unsafe, contact a clinician or local crisis line.",
  },
];

export default function WellnessPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mood, setMood] = useState(3);

  async function load() {
    const res = await fetch("/api/wellness");
    const data = await res.json();
    if (res.ok) setEntries(data.entries);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/wellness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood,
        journalText: fd.get("journalText"),
      }),
    });
    e.currentTarget.reset();
    setMood(3);
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="font-display text-3xl">Mental wellness</h1>
        <p className="mt-2 text-muted-foreground">
          A lightweight space for mood check-ins and journaling — not clinical care.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-[1.25rem] border bg-card p-5">
        <label className="block space-y-2 text-sm">
          <span>Mood today: {mood}/5</span>
          <input
            type="range"
            min={1}
            max={5}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Journal</span>
          <Textarea name="journalText" placeholder="What’s on your mind?" />
        </label>
        <Button type="submit">Save check-in</Button>
      </form>
      <section className="grid gap-3 sm:grid-cols-2">
        {RESOURCES.map((r) => (
          <article key={r.title} className="rounded-[1.25rem] border bg-card p-5">
            <h2 className="font-display text-lg">{r.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
          </article>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-xl">Recent entries</h2>
        {entries.map((e) => (
          <div key={e.id} className="rounded-2xl border bg-card px-4 py-3 text-sm">
            <p className="font-medium">
              Mood {e.mood ?? "—"} · {new Date(e.entryDate).toLocaleDateString()}
            </p>
            {e.journalText ? <p className="mt-1 text-muted-foreground">{e.journalText}</p> : null}
          </div>
        ))}
      </section>
    </div>
  );
}
