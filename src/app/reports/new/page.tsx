"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { REPORT_CATEGORIES } from "@/lib/constants";
import { Disclaimer } from "@/components/reports/disclaimer";

export default function NewReportPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/reports/analyze", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Analysis failed.");
      if (data.id) {
        // still navigate to failed report detail if created
        setTimeout(() => router.push(`/reports/${data.id}`), 1200);
      }
      return;
    }
    router.push(`/reports/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
      <div>
        <h1 className="font-display text-3xl">Add report</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a clear photo of your report or paste the text. Supported images: JPG, PNG, WEBP, GIF (max 8 MB).
        </p>
      </div>
      <Disclaimer />
      <form onSubmit={onSubmit} className="space-y-4 rounded-[1.25rem] border bg-card p-5 sm:p-6">
        <label className="block space-y-2 text-sm">
          <span>Category</span>
          <Select name="category" defaultValue="GENERAL" required>
            {REPORT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="block space-y-2 text-sm">
          <span>Report image</span>
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Or paste report text</span>
          <Textarea name="text" placeholder="Paste lab values, notes, or OCR text…" />
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Analyzing with AI…" : "Analyze report"}
        </Button>
      </form>
    </div>
  );
}
