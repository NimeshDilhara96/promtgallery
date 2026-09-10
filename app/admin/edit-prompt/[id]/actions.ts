"use server";

import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { uploadImage } from "@/lib/gridfs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function editPromptAction(id: string, formData: FormData) {
  await dbConnect();
  
  const title = formData.get("title") as string;
  const promptText = formData.get("prompt") as string;
  const platform = formData.get("platform") as string;
  const tagsStr = formData.get("tags") as string;
  const customCategory = formData.get("custom_category") as string;
  
  const categories: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key === "categories[]") {
      categories.push(value as string);
    }
  }
  
  if (customCategory) {
    const customCats = customCategory.split(",").map(c => c.trim()).filter(c => c);
    categories.push(...customCats);
  }
  
  const uniqueCategories = Array.from(new Set(categories));
  
  if (!title || !promptText || uniqueCategories.length === 0) {
    return { error: "Please fill in all required fields and select at least one category." };
  }
  
  let tags: string[] = [];
  if (tagsStr) {
    tags = tagsStr.split(",").map(t => t.trim()).filter(t => t);
  }
  
  const file = formData.get("image") as File;
  let imagePath = formData.get("existing_image") as string;
  
  if (file && file.size > 0) {
    try {
      imagePath = await uploadImage(file);
    } catch (e) {
      return { error: "Failed to upload image" };
    }
  }
  
  const existingPrompt = await Prompt.findById(id);
  if (!existingPrompt) return { error: "Prompt not found" };

  let slug = existingPrompt.slug;
  if (title !== existingPrompt.title) {
    slug = generateSlug(title);
    let existing = await Prompt.findOne({ slug, _id: { $ne: existingPrompt._id } });
    let counter = 1;
    while (existing) {
      slug = `${generateSlug(title)}-${counter}`;
      existing = await Prompt.findOne({ slug, _id: { $ne: existingPrompt._id } });
      counter++;
    }
  }
  
  await Prompt.findByIdAndUpdate(id, {
    title,
    slug,
    prompt: promptText,
    category: uniqueCategories,
    platform,
    tags,
    image: imagePath,
    updated_at: new Date(),
  });
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/prompt/${slug}`);
  
  redirect("/admin/dashboard");
}
