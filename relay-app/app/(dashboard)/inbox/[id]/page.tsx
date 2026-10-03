 "use client";
import { useEffect,useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams,useRouter } from "next/navigation";
import { Download, ArrowLeft, Clock3, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import Link from "next/link";

export default function TransferDetail(){
 const {id}=useParams<{id:string}>(); const router=useRouter(); const supabase=createClient();
 const [t,setT]=useState<any>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{(async()=>{const {data,error}=await supabase.from("transfers").select("*").eq("id",id).single();if(error)setError(error.message);else setT(data)})()},[id]);
 async function download(){setBusy(true);setError("");const r=await fetch(`/api/download?transferId=${id}`);const d=await r.json();if(!r.ok){setError(d.error||"Download failed.");setBusy(false);return;}if(t.status==="on_track")await supabase.rpc("mark_transfer_received",{transfer_uuid:id});window.location.href=d.url;setBusy(false);}
 if(error)return <div className="card p-8 text-red-700">{error}</div>;
 if(!t)return <div className="card p-8">Loading baton…</div>;
 const dropped=t.status==="baton_dropped";
 return <div className="mx-auto max-w-2xl"><Link href="/inbox" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-relay-muted"><ArrowLeft size={16}/>Back to incoming</Link><div className="card p-6 md:p-8"><div className="flex items-start gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-2xl font-black text-relay-orange">{t.file_name.slice(0,1).toUpperCase()}</div><div className="min-w-0"><h1 className="break-words text-2xl font-black">{t.file_name}</h1><p className="mt-1 text-sm text-relay-muted">{formatBytes(Number(t.file_size))} · {t.file_type||"File"}</p></div></div><div className="my-7 h-px bg-relay-line"/>{dropped?<div className="rounded-2xl bg-gray-100 p-5"><div className="flex items-center gap-2 font-black text-gray-600"><Clock3 size={18}/>Baton Dropped</div><p className="mt-2 text-sm text-gray-500">This baton left the track after 10 days. Relay races don't wait.</p></div>:<><div className="rounded-2xl bg-relay-soft p-5"><p className="text-xs font-bold uppercase tracking-widest text-relay-muted">From</p><p className="mt-1 font-bold">@{t.sender_username}</p>{t.message&&<p className="mt-4 text-sm text-relay-muted">“{t.message}”</p>}</div><button onClick={download} disabled={busy} className="btn-primary mt-5 w-full py-4"><Download size={18}/>{busy?"Preparing secure download…":"Download file"}</button>{t.status==="received"&&<p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-green-700"><CheckCircle2 size={14}/>Received</p>}</>}</div></div>
}