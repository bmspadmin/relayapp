import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req:Request){
 const auth=req.headers.get("authorization");if(process.env.CRON_SECRET&&auth!==`Bearer ${process.env.CRON_SECRET}`)return NextResponse.json({error:"Unauthorized"},{status:401});
 const supabase=await createClient();const {data,error}=await supabase.rpc("expire_transfers");if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({expired:data||0});
}