"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      age: fd.get("age") ? Number(fd.get("age")) : null,
      sex: fd.get("sex") ? String(fd.get("sex")) : null,
    };
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Could not create account.");
      return;
    }
    const login = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      setError("Account created — please log in.");
      router.push("/login");
      return;
    }
    router.push("/home");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl">Create your locker</h1>
      <p className="mt-2 text-muted-foreground">Start with a simple profile. You can edit it anytime.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block space-y-2 text-sm">
          <span>Name</span>
          <Input name="name" required autoComplete="name" />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <Input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2 text-sm">
            <span>Age</span>
            <Input name="age" type="number" min={1} max={120} />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Sex</span>
            <Select name="sex" defaultValue="">
              <option value="">Prefer not</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT">Prefer not to say</option>
            </Select>
          </label>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full min-h-12" disabled={loading}>
          {loading ? "Creating…" : "Sign up"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
