 "use client";
import Link from "next/link";
import { Inbox, Send, Search, UserRound, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function BottomNav(){
 const path=usePathname();
 const items=[["/inbox","Incoming",Inbox],["/relayed","Relayed",ArrowUpRight],["/send","Send",Send],["/search","Search",Search],["/me","Me",UserRound]] as const;
 return <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-relay-line bg-white/95 px-3 pb-safe backdrop-blur md:hidden"><div className="mx-auto flex max-w-md items-end justify-between py-2">{items.map(([href,label,Icon])=><Link key={href} href={href} className={`flex min-w-14 flex-col items-center gap-1 text-[10px] font-semibold ${path.startsWith(href)?"text-relay-orange":"text-relay-muted"}`}><span className={href==="/send"?"-mt-6 grid h-14 w-14 place-items-center rounded-full bg-relay-orange text-white shadow-lg ring-8 ring-relay-soft":""}><Icon size={href==="/send"?25:20}/></span>{label}</Link>)}</div></nav>
}