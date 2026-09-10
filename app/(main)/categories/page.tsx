import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | AI Prompt Gallery",
  description: "Browse AI art prompts organized by category: Portraits, Landscapes, 3D Art, Anime, and more.",
};

const categoryIcons: Record<string, string> = {
  Portrait: "bi-person-bounding-box",
  Landscape: "bi-image",
  "3D Art": "bi-box",
  Anime: "bi-palette",
  Architecture: "bi-building",
  Cyberpunk: "bi-cpu",
  Fantasy: "bi-magic",
  SciFi: "bi-rocket-takeoff",
  Realistic: "bi-camera",
  Abstract: "bi-brush",
  Animals: "bi-bug",
  Fashion: "bi-sunglasses",
};

export default async function CategoriesPage() {
  await dbConnect();

  const allPrompts = await Prompt.find({}, "category image").lean();

  // Aggregate categories count and a sample image
  const categoryMap = new Map<string, { count: number; sampleImage?: string }>();

  allPrompts.forEach((p) => {
    const cats: string[] = Array.isArray(p.category) ? p.category : [p.category || "General"];
    cats.forEach((cat) => {
      if (!cat) return;
      const current = categoryMap.get(cat) || { count: 0 };
      current.count += 1;
      if (!current.sampleImage && p.image) {
        current.sampleImage = p.image;
      }
      categoryMap.set(cat, current);
    });
  });

  const categories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      sampleImage: data.sampleImage,
      icon: categoryIcons[name] || "bi-folder",
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <section className="py-5 bg-gradient-primary">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-3 fs-6 rounded-pill">
                <i className="bi bi-folder me-2"></i> Categories
              </span>
              <h1 className="display-4 fw-bold mb-3">Explore by Category</h1>
              <p className="lead text-muted">
                Find the perfect AI art prompts tailored for your creative style and tool
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.name} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <Link
                  href={`/?category=${encodeURIComponent(cat.name)}`}
                  className="text-decoration-none"
                >
                  <div className="card h-100 border-0 shadow-sm prompt-card hover-lift">
                    <div className="card-body p-4 text-center">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "64px", height: "64px", fontSize: "1.75rem" }}
                      >
                        <i className={`bi ${cat.icon}`}></i>
                      </div>
                      <h3 className="h5 fw-bold text-dark mb-1">{cat.name}</h3>
                      <p className="text-muted small mb-0">
                        {cat.count} {cat.count === 1 ? "Prompt" : "Prompts"}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-0 text-center pb-3 pt-0">
                      <span className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        View Prompts <i className="bi bi-arrow-right ms-1"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="btn btn-primary btn-lg px-5">
              <i className="bi bi-grid-3x3-gap me-2"></i> Browse All Prompts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
