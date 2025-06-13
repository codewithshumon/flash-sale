import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises"; // Added unlink here
import { tmpdir } from "os";
import { join } from "path";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Create a temporary file
    const tempDir = tmpdir();
    const path = join(tempDir, file.name);
    await writeFile(path, bytes);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(path, {
      folder: "flash-sale-products",
    });

    // Delete temporary file
    await unlink(path);

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
