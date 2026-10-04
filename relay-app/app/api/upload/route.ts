import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { safeFileName } from "@/lib/utils";

const MAX_FILE_SIZE = 500 * 1024 * 1024;
const BUCKET = "relay-files";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const size = Number(body.fileSize);

  if (!body.fileName || !size || size < 1 || size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Invalid file or file exceeds 500 MB." },
      { status: 400 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 400 });
  }

  const key = `transfers/${profile.username}/${randomUUID()}-${safeFileName(body.fileName)}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(key);

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Could not prepare storage upload." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    path: key,
    token: data.token,
    bucket: BUCKET
  });
}
