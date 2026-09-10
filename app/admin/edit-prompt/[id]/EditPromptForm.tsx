"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { editPromptAction } from "./actions";

export function EditPromptForm({ existingCategories, prompt }: { existingCategories: string[], prompt: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const initialImage = prompt.image ? (prompt.image.startsWith("/") ? prompt.image : `/${prompt.image}`) : null;
  const [preview, setPreview] = useState<string | null>(initialImage);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    try {
      const res = await editPromptAction(prompt._id, formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(initialImage);
    }
  };

  const promptCategories = Array.isArray(prompt.category) ? prompt.category : [prompt.category];

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <input type="hidden" name="existing_image" value={prompt.image || ""} />

      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-bold">
          Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          defaultValue={prompt.title}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="prompt" className="form-label fw-bold">
          Prompt Text <span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control font-monospace"
          id="prompt"
          name="prompt"
          rows={6}
          defaultValue={prompt.prompt}
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          Categories <span className="text-danger">*</span>
        </label>
        
        {existingCategories.length > 0 && (
          <div className="existing-categories mb-2" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "8px", padding: "10px", background: "white" }}>
            <div className="row g-2">
              {existingCategories.map((cat) => (
                <div key={cat} className="col-md-3 col-sm-4 col-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="categories[]"
                      value={cat}
                      id={`cat_${cat}`}
                      defaultChecked={promptCategories.includes(cat)}
                    />
                    <label className="form-check-label" htmlFor={`cat_${cat}`}>
                      {cat}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="custom-category-box" style={{ background: "#f8f9fa", border: "2px dashed #dee2e6", borderRadius: "8px", padding: "15px", marginTop: "15px" }}>
          <label htmlFor="custom_category" className="form-label fw-bold mb-2">
            <i className="bi bi-plus-circle me-1"></i>Add New Category
          </label>
          <input
            type="text"
            className="form-control"
            id="custom_category"
            name="custom_category"
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="platform" className="form-label fw-bold">Platform</label>
        <select className="form-select" id="platform" name="platform" defaultValue={prompt.platform || "All Platforms"}>
          <option value="All Platforms">All Platforms</option>
          <option value="Midjourney">Midjourney</option>
          <option value="DALL-E">DALL-E</option>
          <option value="ChatGPT">ChatGPT</option>
          <option value="Stable Diffusion">Stable Diffusion</option>
          <option value="Leonardo AI">Leonardo AI</option>
          <option value="Gemini">Gemini</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label fw-bold">Tags</label>
        <input
          type="text"
          className="form-control"
          id="tags"
          name="tags"
          defaultValue={(prompt.tags || []).join(", ")}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="form-label fw-bold">Update Image</label>
        <input
          type="file"
          className="form-control"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="form-text">Leave blank to keep the current image</div>
        {preview && (
          <div id="imagePreview" className="mt-2">
            <img src={preview} className="image-preview img-fluid" style={{ maxHeight: "300px", borderRadius: "8px" }} alt="Preview" />
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-save me-2"></i>Update Prompt
            </>
          )}
        </button>
        <Link href="/admin/dashboard" className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
