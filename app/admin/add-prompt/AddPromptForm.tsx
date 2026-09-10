"use client";

import { useState } from "react";
import Link from "next/link";
import { addPromptAction } from "./actions";

export function AddPromptForm({ existingCategories }: { existingCategories: string[] }) {
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const res = await addPromptAction(formData);
    if (res?.error) {
      setError(res.error);
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
      setPreview(null);
    }
  };

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-bold">
          Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          required
          placeholder="e.g., Cyberpunk Portrait Style"
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
          required
          placeholder="Enter the full AI prompt here..."
        ></textarea>
        <div className="form-text">The complete prompt that users will copy</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          Categories <span className="text-danger">*</span>
        </label>
        
        {existingCategories.length > 0 && (
          <div className="existing-categories mb-2" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "8px", padding: "10px", background: "white" }}>
            <small className="text-muted d-block mb-2">
              <i className="bi bi-info-circle me-1"></i>Select from existing categories:
            </small>
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
            placeholder="Enter new category name (e.g., 3D Art, Cartoon, etc.)"
          />
          <div className="form-text">
            <i className="bi bi-lightbulb me-1"></i>
            Add multiple categories separated by commas (e.g., "3D Art, Cartoon, Pixel Art")
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="platform" className="form-label fw-bold">Platform</label>
        <select className="form-select" id="platform" name="platform" defaultValue="All Platforms">
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
          placeholder="e.g., portrait, cyberpunk, neon, futuristic"
        />
        <div className="form-text">Comma-separated tags for better searchability</div>
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="form-label fw-bold">Example Image</label>
        <input
          type="file"
          className="form-control"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="form-text">Upload an example image (JPG, PNG, GIF, WebP - Max 5MB)</div>
        {preview && (
          <div id="imagePreview" className="mt-2">
            <img src={preview} className="image-preview img-fluid" style={{ maxHeight: "300px", borderRadius: "8px" }} alt="Preview" />
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary px-4">
          <i className="bi bi-plus-circle me-2"></i>Add Prompt
        </button>
        <Link href="/admin/dashboard" className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
