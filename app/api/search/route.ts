import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    await dbConnect();

    const words = q.trim().split(/\s+/).filter((w) => w.length > 0);
    const filter = {
      $and: words.map((word) => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
          { tags: { $regex: word, $options: "i" } },
        ],
      })),
    };

    const results = await Prompt.find(
      filter,
      { title: 1, slug: 1, image: 1, category: 1 }
    )
      .limit(5)
      .lean();

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
