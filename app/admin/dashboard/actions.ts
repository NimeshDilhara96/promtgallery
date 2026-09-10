"use server";

import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function deletePrompt(id: string) {
  await dbConnect();
  await Prompt.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}
