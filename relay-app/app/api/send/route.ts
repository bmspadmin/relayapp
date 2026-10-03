import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const b=await req.json();if(!b.r2Key||!b.fileName||!b.fileSize||!b.receiver)return NextResponse.json({error:"Missing transfer data."},{status:400});
 const {data:sender}=await supabase.from("profiles").select("*").eq("id",user.id).single();if(!sender)return NextResponse.json({error:"Sender profile not found."},{status:400});
 const target=String(b.receiver).toLowerCase().replace(/^@/,"");
 let rows:any[]=[];
 const {data:userTarget}=await supabase.from("profiles").select("id,username").eq("username",target).maybeSingle();
 if(userTarget) rows=[{id:userTarget.id,username:userTarget.username,type:"user"}];
 else {
  const {data:w}=await supabase.from("workspaces").select("id,slug").eq("slug",target).maybeSingle();
  if(w){const {data:members}=await supabase.from("workspace_members").select("user_id,profiles(username)").eq("workspace_id",w.id);rows=(members||[]).map((m:any)=>({id:m.user_id,username:m.profiles.username,type:"workspace"}));}
  else {
   const parts=target.split("_"); const groupSlug=parts.pop(); const workspaceSlug=parts.join("_"); const {data:g}=await supabase.from("workspace_groups").select("id,slug,workspace_id,workspaces!inner(slug)").eq("slug",groupSlug).eq("workspaces.slug",workspaceSlug).maybeSingle();
   if(g){const {data:members}=await supabase.from("group_members").select("user_id,profiles(username)").eq("group_id",g.id);rows=(members||[]).map((m:any)=>({id:m.user_id,username:m.profiles.username,type:"group"}));}
  }
 }
 if(!rows.length)return NextResponse.json({error:"Recipient not found."},{status:404});
 const inserts=rows.map(r=>({file_name:b.fileName,file_size:Number(b.fileSize),file_type:b.fileType||null,file_url:b.r2Key,r2_key:b.r2Key,sender_id:user.id,sender_username:sender.username,receiver_id:r.id,receiver_username:r.username,receiver_type:r.type,message:b.message||null}));
 const {error}=await supabase.from("transfers").insert(inserts);if(error)return NextResponse.json({error:error.message},{status:400});
 await supabase.from("profiles").update({total_sent:sender.total_sent+rows.length}).eq("id",user.id);
 return NextResponse.json({success:true,count:rows.length});
}