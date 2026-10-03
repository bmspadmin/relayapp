import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RealtimeInbox } from "@/components/RealtimeInbox";

export default async function DashboardLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("id").eq("id",user.id).maybeSingle();
 if(!profile) redirect("/signup");
 return <AppShell><RealtimeInbox userId={user.id}/>{children}</AppShell>;
}