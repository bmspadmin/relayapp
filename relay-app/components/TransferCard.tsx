import Link from "next/link";
import { FileText, Image as ImageIcon, Film, Music, Archive, Download, CircleCheck, Clock3, CircleOff } from "lucide-react";
import { formatBytes, timeAgo } from "@/lib/utils";
import type { Transfer } from "@/types/database";

function Icon({type}:{type:string|null}){if(type?.startsWith("image/"))return <ImageIcon/>;if(type?.startsWith("video/"))return <Film/>;if(type?.startsWith("audio/"))return <Music/>;if(type?.includes("zip")||type?.includes("archive"))return <Archive/>;return <FileText/>}
export function TransferCard({transfer,mode="incoming"}:{transfer:Transfer,mode?:"incoming"|"sent"}){
 const status=transfer.status;
 return <Link href={`${mode==="incoming"?"/inbox/":"/relayed/"}${transfer.id}`} className="card block p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
  <div className="flex items-start gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-relay-orange"><Icon type={transfer.file_type}/></div>
   <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-bold">{transfer.file_name}</p><p className="mt-1 text-xs text-relay-muted">{formatBytes(Number(transfer.file_size))} · {transfer.file_type||"File"}</p></div>
   <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${status==="received"?"bg-green-50 text-green-700":status==="baton_dropped"?"bg-gray-100 text-gray-500":"bg-amber-50 text-amber-700"}`}>{status==="received"?"Received":status==="baton_dropped"?"Baton Dropped":"On Track"}</span></div>
   <div className="mt-4 flex items-center justify-between text-xs text-relay-muted"><span>{mode==="incoming"?`@${transfer.sender_username}`:`To @${transfer.receiver_username}`}</span><span>{timeAgo(transfer.created_at)}</span></div>
   {transfer.message&&<p className="mt-3 truncate rounded-xl bg-relay-soft px-3 py-2 text-sm text-relay-muted">“{transfer.message}”</p>}</div>
  </div>
 </Link>
}