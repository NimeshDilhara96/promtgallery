import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // PERFORMANCE & SAFETY TIMEOUTS
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is down (don't hang for 30s)
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 50, // Capacity planning: limit connections so serverless doesn't crash MongoDB
      family: 4, // Skip IPv6 DNS resolution for faster initial connection
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
