import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createUploadPost } from "@/lib/r2";
import { randomUUID } from "crypto";
import { safeFileName } from "@/lib/utils";

export async function POST(req:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json();const size=Number(body.fileSize);if(!body.fileName||!size||size>524288000)return NextResponse.json({error:"Invalid file or file exceeds 500 MB."},{status:400});
 const {data:profile}=await supabase.from("profiles").select("username").eq("id",user.id).single();if(!profile)return NextResponse.json({error:"Profile not found."},{status:400});
 const key=`transfers/${profile.username}/${randomUUID()}-${safeFileName(body.fileName)}`;
 const post=await createUploadPost(key,body.fileType||"application/octet-stream");
 return NextResponse.json({url:post.url,fields:post.fields,key});
}