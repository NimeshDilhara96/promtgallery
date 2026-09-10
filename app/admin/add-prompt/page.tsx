import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { AddPromptForm } from "./AddPromptForm";

export default async function AddPromptPage() {
  await dbConnect();
  
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
            <h4 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Add New Prompt</h4>
          </div>
          <div className="card-body p-4">
            <AddPromptForm existingCategories={existingCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}
