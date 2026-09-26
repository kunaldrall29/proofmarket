"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type AdminData = {
  users: Array<{
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
    _count: { reports: number };
  }>;
  aggregates: {
    userCount: number;
    reportCount: number;
    waitlist: Array<{ serviceSlug: string; _count: number }>;
    usage: Array<{ eventType: string; _count: number }>;
  };
  services: Array<{
    id: string;
    slug: string;
    name: string;
    isActive: boolean;
    isPlaceholder: boolean;
  }>;
};

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin");
    if (res.status === 403) {
      setError("Forbidden — admin role required.");
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to load admin data.");
      return;
    }
    setData(json);
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(userId: string, role: string) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setRole", userId, role }),
    });
    load();
  }

  async function toggleService(slug: string) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleService", slug }),
    });
    load();
  }

  if (error) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-danger">{error}</div>;
  }
  if (!data) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-muted-foreground">Loading admin…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Server-enforced admin tools. Aggregate usage is anonymized (no PHI in event payloads).
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.25rem] border bg-card p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Users</p>
          <p className="mt-2 font-display text-3xl">{data.aggregates.userCount}</p>
        </div>
        <div className="rounded-[1.25rem] border bg-card p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Reports analyzed</p>
          <p className="mt-2 font-display text-3xl">{data.aggregates.reportCount}</p>
        </div>
        <div className="rounded-[1.25rem] border bg-card p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Usage events</p>
          <ul className="mt-2 space-y-1 text-sm">
            {data.aggregates.usage.map((u) => (
              <li key={u.eventType}>
                {u.eventType}: {u._count}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl sm:text-2xl mb-4">Users</h2>

        <div className="space-y-3 md:hidden">
          {data.users.map((u) => (
            <article key={u.id} className="rounded-[1.25rem] border bg-card p-4">
              <p className="font-medium">{u.name || "—"}</p>
              <p className="mt-1 break-all text-sm text-muted-foreground">{u.email}</p>
              <p className="mt-2 text-sm">
                {u.role} · {u._count.reports} reports
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-3 min-h-11 w-full"
                onClick={() => setRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
              >
                Make {u.role === "ADMIN" ? "user" : "admin"}
              </Button>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-[1.25rem] border bg-card md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Reports</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{u.name || "—"}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u._count.reports}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                    >
                      Make {u.role === "ADMIN" ? "user" : "admin"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl sm:text-2xl mb-4">Service categories</h2>
        <div className="space-y-2">
          {data.services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {s.name}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({s.slug}
                    {s.isPlaceholder ? " · placeholder" : ""})
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{s.isActive ? "Active" : "Hidden"}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => toggleService(s.slug)}
              >
                Toggle visibility
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl sm:text-2xl mb-4">Waitlist (anonymized counts)</h2>
        <ul className="space-y-2 text-sm">
          {data.aggregates.waitlist.length === 0 ? (
            <li className="text-muted-foreground">No waitlist entries yet.</li>
          ) : (
            data.aggregates.waitlist.map((w) => (
              <li key={w.serviceSlug} className="rounded-2xl border bg-card px-4 py-3">
                {w.serviceSlug}: {w._count}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
