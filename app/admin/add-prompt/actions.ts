"use server";

import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { uploadImage } from "@/lib/gridfs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function addPromptAction(formData: FormData) {
  try {
    await dbConnect();
    
    const title = (formData.get("title") as string || "").trim();
    const promptText = (formData.get("prompt") as string || "").trim();
    const platform = (formData.get("platform") as string || "All Platforms").trim();
    const tagsStr = (formData.get("tags") as string || "").trim();
    const customCategory = (formData.get("custom_category") as string || "").trim();
    
    // Get all checked categories
    const categories: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "categories[]" && typeof value === "string" && value.trim()) {
        categories.push(value.trim());
      }
    }
    
    if (customCategory) {
      const customCats = customCategory.split(",").map(c => c.trim()).filter(c => c);
      categories.push(...customCats);
    }
    
    const uniqueCategories = Array.from(new Set(categories));
    
    if (!title || !promptText || uniqueCategories.length === 0) {
      return { error: "Please fill in all required fields (Title, Prompt, and at least one Category)." };
    }
    
    let tags: string[] = [];
    if (tagsStr) {
      tags = tagsStr.split(",").map(t => t.trim()).filter(t => t);
    }
    
    const file = formData.get("image") as File;
    let imagePath = "";
    
    if (file && typeof file.size === "number" && file.size > 0) {
      try {
        imagePath = await uploadImage(file);
      } catch (uploadErr: any) {
        console.error("Image upload failed:", uploadErr);
        return { error: `Failed to upload image: ${uploadErr.message || "Upload error"}` };
      }
    }
    
    let slug = generateSlug(title);
    if (!slug) {
      slug = `prompt-${Date.now()}`;
    }

    let existing = await Prompt.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${generateSlug(title)}-${counter}`;
      existing = await Prompt.findOne({ slug });
      counter++;
    }
    
    const newPrompt = new Prompt({
      title,
      slug,
      prompt: promptText,
      category: uniqueCategories,
      platform: platform || "All Platforms",
      tags,
      image: imagePath,
      stats: { views: 0, copies: 0 },
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    await newPrompt.save();
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath("/categories");
    
    return { success: true };
  } catch (error: any) {
    console.error("Add prompt server action error:", error);
    return { error: error.message || "An unexpected error occurred while saving the prompt." };
  }
}
