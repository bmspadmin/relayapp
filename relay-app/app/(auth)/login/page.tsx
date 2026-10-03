 "use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/inbox");
    setBusy(false);
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) setError(error.message);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-2 text-2xl font-black tracking-tight"><span className="h-3 w-3 rounded-full bg-relay-orange"/> RELAY</div>
          <h1 className="text-4xl font-black tracking-tight">Pass it like a baton.</h1>
          <p className="mt-3 text-relay-muted">Send files directly to people and teams with @usernames.</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <button onClick={google} className="btn-secondary mt-3 w-full">Continue with Google</button>
        <p className="mt-8 text-center text-sm text-relay-muted">New to RELAY? <Link className="font-semibold text-relay-ink underline" href="/signup">Create account</Link></p>
      </div>
    </main>
  );
}