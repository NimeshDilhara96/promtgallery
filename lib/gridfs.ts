import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket: GridFSBucket | null = null;

export function getGridFSBucket(): GridFSBucket {
  if (bucket) return bucket;
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database not connected");
  }
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "images",
  });
  return bucket;
}

export async function uploadImage(file: File): Promise<string> {
  const bucket = getGridFSBucket();
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
    } as any);
    
    uploadStream.on("error", (error) => reject(error));
    uploadStream.on("finish", () => {
      // The API endpoint will serve this via /api/image/[filename]
      resolve(`api/image/${filename}`);
    });
    
    uploadStream.end(buffer);
  });
}
