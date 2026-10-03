import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDownloadUrl } from "@/lib/r2";

export async function GET(req:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const id=new URL(req.url).searchParams.get("transferId");if(!id)return NextResponse.json({error:"Missing transferId."},{status:400});
 const {data:t,error}=await supabase.from("transfers").select("*").eq("id",id).single();if(error||!t)return NextResponse.json({error:"Transfer not found."},{status:404});
 if(t.sender_id!==user.id&&t.receiver_id!==user.id)return NextResponse.json({error:"Forbidden."},{status:403});
 if(t.status==="baton_dropped"||new Date(t.expires_at)<new Date())return NextResponse.json({error:"This baton has expired."},{status:410});
 const url=await createDownloadUrl(t.r2_key,t.file_name);return NextResponse.json({url});
}