import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getGridFSBucket } from "@/lib/gridfs";
import { Readable } from "stream";

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    await dbConnect();
    const bucket = await getGridFSBucket();
    
    const files = await bucket.find({ filename }).toArray();
    
    if (files.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    const file = files[0];
    const downloadStream = bucket.openDownloadStreamByName(filename);
    
    // Convert Node.js Readable stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err: Error) => controller.error(err));
      },
    });
    
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": (file as any).contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
