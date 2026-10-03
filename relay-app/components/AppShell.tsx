import { Logo } from "./Logo";
import { BottomNav } from "./BottomNav";
import Link from "next/link";
import { Inbox, Send, Search, UserRound, Building2 } from "lucide-react";

export function AppShell({children}:{children:React.ReactNode}){
 return <div className="min-h-screen bg-relay-soft">
   <header className="sticky top-0 z-20 border-b border-relay-line bg-white/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6"><Logo/><Link href="/send" className="hidden rounded-xl bg-relay-orange px-4 py-2 text-sm font-bold text-white md:inline-flex">+ Pass Baton</Link></div>
   </header>
   <div className="mx-auto flex max-w-6xl">
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-relay-line bg-white px-4 py-6 md:block">
      <nav className="space-y-1">{[["/send","Send",Send],["/inbox","Incoming",Inbox],["/relayed","Relayed",Inbox],["/search","Search",Search],["/workspaces","Workspaces",Building2],["/me","Me",UserRound]].map(([href,label,Icon])=><Link key={href as string} href={href as string} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-relay-muted hover:bg-relay-soft hover:text-relay-ink"><Icon size={18}/>{label as string}</Link>)}</nav>
    </aside>
    <main className="min-w-0 flex-1 px-4 py-6 pb-28 md:px-8 md:py-8">{children}</main>
   </div><BottomNav/>
 </div>
}