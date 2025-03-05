// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Extract form data
    const formData = await request.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define the upload directory and ensure it exists
    const uploadDir = "./public/uploads";
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Create a unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    const docName = formData.get("docName") as string;
    const docRev = formData.get("docRev") as string;

    // Write the file to disk
    await fs.promises.writeFile(filePath, buffer);

    // Create a new Document record in the database.
    // Here, we're storing the file URL relative to the public folder.
    const document = await prisma.document.create({
      data: {
        fileName,
        fileUrl: `/uploads/${fileName}`,
        docName,    // store the document name
        docRev,     // store the document revision
      },
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      fileName: document.fileName,
      fileUrl: document.fileUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
