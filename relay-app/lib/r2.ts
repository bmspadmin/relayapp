import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
  });
}

export async function createUploadPost(key: string, contentType: string) {
  return createPresignedPost(r2Client(), {
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Conditions: [
      ["content-length-range", 1, 524288000],
      ["eq", "$Content-Type", contentType || "application/octet-stream"]
    ],
    Fields: { "Content-Type": contentType || "application/octet-stream" },
    Expires: 900
  });
}

export async function createDownloadUrl(key: string, fileName: string) {
  return getSignedUrl(
    r2Client(),
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName.replace(/"/g, "")}"`
    }),
    { expiresIn: 3600 }
  );
}