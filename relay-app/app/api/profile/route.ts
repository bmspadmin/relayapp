import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json();const allowed={display_name:body.display_name,bio:body.bio,avatar_url:body.avatar_url};
 const {data,error}=await supabase.from("profiles").update(allowed).eq("id",user.id).select().single();
 if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json(data);
}