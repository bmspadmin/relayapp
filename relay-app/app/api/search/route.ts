import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const q=new URL(req.url).searchParams.get("q")?.toLowerCase().replace(/^@/,"").trim()||"";if(q.length<2)return NextResponse.json([]);
 const {data:users}=await supabase.from("profiles").select("id,username,display_name,avatar_url").ilike("username",`${q}%`).limit(8);
 const {data:ws}=await supabase.from("workspaces").select("id,slug,name,logo_url").ilike("slug",`${q}%`).limit(5);
 const results:any[]=(users||[]).map(x=>({type:"user",id:x.id,username:x.username,display_name:x.display_name||`@${x.username}`,avatar_url:x.avatar_url}));
 (ws||[]).forEach(x=>results.push({type:"workspace",id:x.id,username:x.slug,display_name:x.name,avatar_url:x.logo_url}));
 return NextResponse.json(results);
}