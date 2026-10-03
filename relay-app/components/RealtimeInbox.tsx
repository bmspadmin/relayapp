 "use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function RealtimeInbox({userId}:{userId:string}){
 const supabase=createClient();
 useEffect(()=>{
  const channel=supabase.channel(`relay-inbox-${userId}`)
   .on("postgres_changes",{event:"INSERT",schema:"public",table:"transfers",filter:`receiver_id=eq.${userId}`},payload=>{
     window.dispatchEvent(new CustomEvent("relay:new-baton",{detail:payload.new}));
   }).subscribe();
  return()=>{supabase.removeChannel(channel)};
 },[userId]);
 return null;
}