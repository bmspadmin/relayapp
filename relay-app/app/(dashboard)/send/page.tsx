 "use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Send, Search } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

type Result={type:"user"|"workspace"|"group";id:string;username:string;display_name:string;avatar_url?:string|null;description?:string|null};

export default function SendPage(){
 const supabase=createClient(); const router=useRouter(); const params=useSearchParams();
 const [file,setFile]=useState<File|null>(null),[to,setTo]=useState(params.get("to")||""),[note,setNote]=useState(""),[results,setResults]=useState<Result[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[drag,setDrag]=useState(false);

 useEffect(()=>{const q=to.replace(/^@/,"").trim(); if(q.length<2){setResults([]);return;} const t=setTimeout(async()=>{const r=await fetch(`/api/search?q=${encodeURIComponent(q)}`);if(r.ok)setResults(await r.json())},250);return()=>clearTimeout(t)},[to]);

 function pick(f:File|null){if(!f)return;if(f.size>524288000){setError("Maximum file size is 500 MB.");return;}setFile(f);setError("")}
 async function relay(){
  if(!file||!to){setError("Choose a file and recipient.");return;} setBusy(true);setError("");
  try{
   const up=await fetch("/api/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileName:file.name,fileSize:file.size,fileType:file.type})});
   const data=await up.json(); if(!up.ok)throw new Error(data.error||"Could not prepare upload.");
   const form=new FormData(); Object.entries(data.fields).forEach(([k,v])=>form.append(k,String(v))); form.append("file",file);
   const r2=await fetch(data.url,{method:"POST",body:form}); if(!r2.ok)throw new Error("Upload to storage failed.");
   const send=await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileName:file.name,fileSize:file.size,fileType:file.type,r2Key:data.key,receiver:to.replace(/^@/,""),message:note})});
   const result=await send.json(); if(!send.ok)throw new Error(result.error||"Could not relay baton.");
   router.push("/relayed");
  }catch(e:any){setError(e.message||"Something went wrong.");setBusy(false)}
 }
 return <div className="mx-auto max-w-2xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.2em] text-relay-orange">Send</p><h1 className="mt-2 text-3xl font-black">Pass the baton.</h1><p className="mt-2 text-relay-muted">Drop a file, type an @username, and put it directly in their inbox.</p></div>
  <div className="card p-5 md:p-7">
   <label onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);pick(e.dataTransfer.files[0])}} className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center ${drag?"border-relay-orange bg-orange-50":"border-relay-line bg-relay-soft"}`}>
    <input type="file" className="hidden" onChange={e=>pick(e.target.files?.[0]||null)}/>
    {file?<><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-relay-orange"><UploadCloud/></div><p className="mt-3 font-bold">{file.name}</p><p className="mt-1 text-sm text-relay-muted">{formatBytes(file.size)} · {file.type||"File"}</p><button type="button" className="mt-3 text-xs font-bold text-red-600" onClick={e=>{e.preventDefault();setFile(null)}}><X className="mr-1 inline" size={14}/>Remove</button></>:<><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-relay-orange"><UploadCloud/></div><p className="mt-3 font-bold">Drop your file here</p><p className="mt-1 text-sm text-relay-muted">or click to browse · up to 500 MB</p></>}
   </label>
   <div className="relative mt-5"><label className="mb-2 block text-sm font-bold">Pass to</label><div className="relative"><span className="absolute left-4 top-3.5 text-relay-muted">@</span><Search className="absolute right-4 top-3.5 text-relay-muted" size={18}/><input className="input pl-8 pr-10" placeholder="username, workspace or group" value={to.replace(/^@/,"")} onChange={e=>setTo("@"+e.target.value.replace(/^@/,""))}/></div>
    {results.length>0&&<div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-relay-line bg-white shadow-xl">{results.map(r=><button key={`${r.type}-${r.id}`} onClick={()=>{setTo("@"+r.username);setResults([])}} className="flex w-full items-center gap-3 p-3 text-left hover:bg-relay-soft"><div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-sm font-bold text-relay-orange">{r.display_name[0]?.toUpperCase()}</div><div><p className="font-bold">{r.display_name}</p><p className="text-xs text-relay-muted">@{r.username} · {r.type}</p></div></button>)}</div>}
   </div>
   <div className="mt-5"><label className="mb-2 block text-sm font-bold">Note <span className="font-normal text-relay-muted">optional</span></label><textarea className="input min-h-28 resize-none" placeholder="Add a quick message…" value={note} onChange={e=>setNote(e.target.value)}/></div>
   {error&&<p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
   <button onClick={relay} disabled={busy||!file||!to} className="btn-primary mt-5 w-full py-4"><Send size={18}/>{busy?"Relaying baton…":"Relay Baton"}</button>
  </div>
 </div>
}