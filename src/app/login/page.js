"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("incorrect password");
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/8 p-6"
      >
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-6 w-6 rounded-md" />
          <p className="text-sm text-white">dlnator</p>
        </div>
        <p className="mt-3 text-sm text-white/45">
          enter password to continue
        </p>

        <input
          type="password"
          autoFocus
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-xl border border-white/8 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
        />

        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          className="mt-4 w-full px-5 py-2.5"
          disabled={loading || !password}
        >
          {loading ? "checking..." : "unlock"}
        </Button>
      </form>
    </section>
  );
}
