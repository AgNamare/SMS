import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // ✅ Check file size (2MB max)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 2MB limit." },
        { status: 413 } // 413 Payload Too Large
      );
    }

    // ✅ Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "users" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ success: true, data: uploadResponse });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Image upload failed.",
      },
      { status: 500 }
    );
  }
}
