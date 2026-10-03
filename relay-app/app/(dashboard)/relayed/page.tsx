import { createClient } from "@/lib/supabase/server";
import { TransferCard } from "@/components/TransferCard";

export default async function RelayedPage(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 const {data:transfers}=await supabase.from("transfers").select("*").eq("sender_id",user!.id).order("created_at",{ascending:false});
 return <div className="mx-auto max-w-3xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.2em] text-relay-orange">Relayed</p><h1 className="mt-2 text-3xl font-black">Your sent batons</h1><p className="mt-2 text-relay-muted">Everything you have passed to someone else.</p></div>{transfers?.length?<div className="space-y-3">{transfers.map(t=><TransferCard key={t.id} transfer={t} mode="sent"/>)}</div>:<div className="card p-10 text-center text-relay-muted">You haven't relayed a file yet.</div>}</div>
}