"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Profile = {
  name: string | null;
  email: string;
  age: number | null;
  sex: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.user))
      .catch(() => setError("Could not load profile."));
  }, []);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        age: fd.get("age") ? Number(fd.get("age")) : null,
        sex: fd.get("sex") || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Save failed.");
      return;
    }
    setProfile(data.user);
    setMessage("Profile updated.");
  }

  async function exportData() {
    const res = await fetch("/api/account");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "med-health-locker-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount() {
    if (!confirm("Permanently delete your account and all health data? This cannot be undone.")) {
      return;
    }
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Could not delete account.");
    }
  }

  if (!profile) {
    return <div className="mx-auto max-w-lg px-4 py-12 text-muted-foreground">Loading profile…</div>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 space-y-10">
      <div>
        <h1 className="font-display text-3xl">Profile</h1>
        <p className="mt-2 text-muted-foreground">Keep your basics current for personalized analysis.</p>
      </div>
      <form onSubmit={onSave} className="space-y-4 rounded-[1.25rem] border bg-card p-5">
        <label className="block space-y-2 text-sm">
          <span>Name</span>
          <Input name="name" defaultValue={profile.name ?? ""} required />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <Input value={profile.email} disabled />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2 text-sm">
            <span>Age</span>
            <Input name="age" type="number" defaultValue={profile.age ?? ""} min={1} max={120} />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Sex</span>
            <Select name="sex" defaultValue={profile.sex ?? ""}>
              <option value="">Prefer not</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT">Prefer not to say</option>
            </Select>
          </label>
        </div>
        {message ? <p className="text-sm text-success">{message}</p> : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit">Save profile</Button>
      </form>

      <section className="rounded-[1.25rem] border bg-card p-5 space-y-4">
        <h2 className="font-display text-xl">Privacy & data</h2>
        <p className="text-sm text-muted-foreground">
          Export a copy of your data, or permanently delete your account and stored reports.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={exportData}>
            Export my data
          </Button>
          <Button type="button" variant="danger" onClick={deleteAccount}>
            Delete account
          </Button>
        </div>
      </section>
    </div>
  );
}
