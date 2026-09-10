import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dbConnect from "./db";

export async function getGridFSBucket(): Promise<GridFSBucket> {
  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not ready");
  }
  return new mongoose.mongo.GridFSBucket(db, {
    bucketName: "images",
  });
}

export async function uploadImage(file: File): Promise<string> {
  await dbConnect();
  const bucket = await getGridFSBucket();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cleanName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, "_") : "image.jpg";
  const filename = `${Date.now()}-${cleanName}`;
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type || "image/jpeg",
    } as any);
    
    uploadStream.on("error", (error) => {
      console.error("GridFS upload error:", error);
      reject(error);
    });
    
    uploadStream.on("finish", () => {
      resolve(`api/image/${filename}`);
    });
    
    uploadStream.end(buffer);
  });
}
