import { createClient } from "@/lib/supabase/server";
import { TransferCard } from "@/components/TransferCard";
import { Inbox } from "lucide-react";

export default async function InboxPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 const {data:transfers}=await supabase.from("transfers").select("*").eq("receiver_id",user!.id).order("created_at",{ascending:false});
 return <div className="mx-auto max-w-3xl">
  <div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.2em] text-relay-orange">Incoming</p><h1 className="mt-2 text-3xl font-black tracking-tight">Your batons</h1><p className="mt-2 text-relay-muted">Files people have passed directly to you.</p></div>
  {transfers?.length?<div className="space-y-3">{transfers.map(t=><TransferCard key={t.id} transfer={t}/>)}</div>:<div className="card flex min-h-64 flex-col items-center justify-center p-8 text-center"><div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-relay-orange"><Inbox/></div><h2 className="text-xl font-black">No batons on track yet.</h2><p className="mt-2 max-w-sm text-sm text-relay-muted">When someone sends a file to your @username, it will land here.</p></div>}
 </div>
}