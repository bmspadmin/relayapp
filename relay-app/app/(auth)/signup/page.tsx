 "use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name,setName]=useState(""); const [username,setUsername]=useState("");
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);

  async function signup(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const clean=username.toLowerCase().replace(/^@/,"");
    if(!/^[a-z0-9_]{3,20}$/.test(clean)){ setError("Username must be 3–20 characters: letters, numbers or underscore."); setBusy(false); return; }
    const check=await supabase.from("profiles").select("id").eq("username",clean).maybeSingle();
    if(check.data){setError("That username is already taken."); setBusy(false); return;}
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{username:clean,display_name:name}}});
    if(error){setError(error.message);setBusy(false);return;}
    if(data.session) router.push("/inbox");
    else setError("Account created. Check your email to confirm your account, then sign in.");
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-8"><div className="mb-5 text-2xl font-black"><span className="mr-2 inline-block h-3 w-3 rounded-full bg-relay-orange"/>RELAY</div><h1 className="text-4xl font-black tracking-tight">Claim your baton lane.</h1><p className="mt-3 text-relay-muted">Your @username is how people find you.</p></div>
        <form onSubmit={signup} className="space-y-3">
          <input className="input" placeholder="Display name" value={name} onChange={e=>setName(e.target.value)} required/>
          <div className="relative"><span className="absolute left-4 top-3.5 text-relay-muted">@</span><input className="input pl-8" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required/></div>
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input className="input" placeholder="Password (8+ characters)" type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required/>
          {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy?"Creating account…":"Create account"}</button>
        </form>
        <p className="mt-7 text-center text-sm text-relay-muted">Already have an account? <Link className="font-semibold underline" href="/login">Sign in</Link></p>
      </div>
    </main>
  );
}