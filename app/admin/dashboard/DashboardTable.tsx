"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deletePrompt } from "./actions";

export function DashboardTable({ initialPrompts }: { initialPrompts: any[] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<{ id: string; title: string } | null>(null);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const confirmDelete = (id: string, title: string) => {
    setPromptToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (promptToDelete) {
      await deletePrompt(promptToDelete.id);
      setPrompts(prompts.filter(p => p._id !== promptToDelete.id));
      setDeleteModalOpen(false);
      setPromptToDelete(null);
    }
  };

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>All Prompts
              <small className="text-muted ms-2">(Newest First)</small>
            </h5>
            <Link href="/admin/add-prompt" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>Add New Prompt
            </Link>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Platform</th>
                  <th className="text-center">Views</th>
                  <th className="text-center">Copies</th>
                  <th>Created</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                      No prompts found. <Link href="/admin/add-prompt">Add your first prompt</Link>
                    </td>
                  </tr>
                ) : (
                  prompts.map((prompt, index) => {
                    const createdTime = prompt.created_at ? new Date(prompt.created_at).getTime() : 0;
                    const isNew = (now - createdTime) < 86400000;
                    const rowClass = isNew ? "bg-primary bg-opacity-10" : "";
                    const imageSrc = prompt.image ? (prompt.image.startsWith("/") ? prompt.image : `/${prompt.image}`) : null;
                    const categories = Array.isArray(prompt.category) ? prompt.category : [prompt.category];

                    return (
                      <tr key={prompt._id} className={rowClass}>
                        <td className="position-relative">
                          {isNew && (
                            <span className="badge bg-success position-absolute" style={{ top: -5, right: -5, fontSize: "10px" }}>
                              NEW
                            </span>
                          )}
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt="Thumbnail"
                              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML += '<div class="bg-light d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 8px;"><i class="bi bi-image text-muted"></i></div>';
                              }}
                            />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", borderRadius: "8px" }}>
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>{prompt.title}</strong>
                          {index === 0 && <span className="badge bg-success ms-2">Latest</span>}
                          <br />
                          <small className="text-muted">
                            {prompt.prompt.substring(0, 60)}...
                          </small>
                        </td>
                        <td>
                          {categories.map((cat: string) => (
                            <span key={cat} className="badge bg-primary mb-1 me-1">{cat}</span>
                          ))}
                        </td>
                        <td>
                          <small className="text-muted">{prompt.platform || "All"}</small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info">
                            <i className="bi bi-eye me-1"></i>
                            {prompt.stats?.views || 0}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-clipboard-check me-1"></i>
                            {prompt.stats?.copies || 0}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {prompt.created_at ? (
                              <>
                                {new Date(prompt.created_at).toLocaleDateString()}
                                <br />
                                {new Date(prompt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </small>
                        </td>
                        <td className="text-end text-nowrap">
                          <Link
                            href={`/prompt/${prompt.slug}`}
                            className="btn btn-sm btn-outline-primary me-1"
                            target="_blank"
                            title="View"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link
                            href={`/admin/edit-prompt/${prompt._id}`}
                            className="btn btn-sm btn-outline-secondary me-1"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => confirmDelete(prompt._id, prompt.title)}
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this prompt?</p>
                <p className="fw-bold">{promptToDelete?.title}</p>
                <p className="text-danger small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  <i className="bi bi-trash me-2"></i>Delete Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
