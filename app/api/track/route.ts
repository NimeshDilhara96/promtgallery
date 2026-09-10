import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { id, type } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    await dbConnect();

    const objectId = new mongoose.Types.ObjectId(id);

    let updateQuery = {};
    if (type === "copy") {
      updateQuery = { $inc: { "stats.copies": 1 }, $set: { updated_at: new Date() } };
    } else if (type === "view") {
      updateQuery = { $inc: { "stats.views": 1 }, $set: { updated_at: new Date() } };
    } else {
      return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(objectId, updateQuery, { new: true }).lean();

    if (!updatedPrompt) {
      return NextResponse.json({ success: false, error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      stats: updatedPrompt.stats,
    });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
