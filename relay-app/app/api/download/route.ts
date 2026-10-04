import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "relay-files";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("transferId");
  if (!id) {
    return NextResponse.json({ error: "Missing transferId." }, { status: 400 });
  }

  const { data: transfer, error } = await supabase
    .from("transfers")
    .select("id, file_name, r2_key, sender_id, receiver_id, status, expires_at")
    .eq("id", id)
    .single();

  if (error || !transfer) {
    return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
  }

  if (transfer.sender_id !== user.id && transfer.receiver_id !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (
    transfer.status === "baton_dropped" ||
    new Date(transfer.expires_at) < new Date()
  ) {
    return NextResponse.json({ error: "This baton has expired." }, { status: 410 });
  }

  if (!transfer.r2_key) {
    return NextResponse.json({ error: "File path is missing." }, { status: 404 });
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(transfer.r2_key, 3600, {
      download: transfer.file_name
    });

  if (signedUrlError || !data?.signedUrl) {
    return NextResponse.json(
      { error: signedUrlError?.message || "Could not create download URL." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
