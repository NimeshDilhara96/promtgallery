import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { EditPromptForm } from "./EditPromptForm";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const prompt = await Prompt.findById(id).lean();
  if (!prompt) {
    notFound();
  }
  
  const allCategoriesRaw = await Prompt.distinct("category");
  const categoriesSet = new Set<string>();
  allCategoriesRaw.forEach((cat) => {
    if (Array.isArray(cat)) cat.forEach((c) => categoriesSet.add(c));
    else categoriesSet.add(cat);
  });
  const existingCategories = Array.from(categoriesSet).sort();

  return (
    <div className="container py-5">
      <div className="form-container" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h4 className="mb-0"><i className="bi bi-pencil-square me-2"></i>Edit Prompt</h4>
          </div>
          <div className="card-body p-4">
            <EditPromptForm 
              existingCategories={existingCategories} 
              prompt={JSON.parse(JSON.stringify(prompt))} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
