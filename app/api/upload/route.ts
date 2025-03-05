// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Extract form data from the request
    const formData = await request.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define the upload directory and ensure it exists
    const uploadDir = "./public/uploads";
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Create a unique file name using the current timestamp
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Write the file to disk
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ message: "File uploaded successfully", fileName });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
