"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm({ serviceSlug }: { serviceSlug: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        serviceSlug,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not join waitlist.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input name="email" type="email" required placeholder="you@email.com" className="flex-1" />
        <Button type="submit">Join waitlist</Button>
      </form>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
