import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import Link from "next/link";
import { FilterSection } from "@/components/FilterSection";
import { SortSelect } from "@/components/SortSelect";
import { PromptCard } from "@/components/PromptCard";
import AdBanner from "@/components/AdBanner";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await dbConnect();

  const searchParams = await props.searchParams;
  const category = searchParams.category || "all";
  const search = searchParams.search || "";
  const sortBy = searchParams.sort || "latest";
  const page = parseInt(searchParams.page || "1");
  const promptsPerPage = 12;

  // Build filter
  const filter: any = {};
  if (category !== "all") {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { prompt: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort
  let sortOptions: any = { created_at: -1 };
  if (sortBy === "views") {
    sortOptions = { "stats.views": -1, created_at: -1 };
  } else if (sortBy === "copies") {
    sortOptions = { "stats.copies": -1, created_at: -1 };
  }

  // Fetch prompts
  const totalPromptsCount = await Prompt.countDocuments();
  const allCategoriesRaw = await Prompt.distinct("category");
  // Categories could be array of strings or flat strings
  const categoriesSet = new Set<string>();
  allCategoriesRaw.forEach((cat) => {
    if (Array.isArray(cat)) cat.forEach((c) => categoriesSet.add(c));
    else categoriesSet.add(cat);
  });
  const categories = Array.from(categoriesSet).sort();

  const filteredCount = await Prompt.countDocuments(filter);
  const totalPages = Math.ceil(filteredCount / promptsPerPage) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * promptsPerPage;

  const prompts = await Prompt.find(filter)
    .sort(sortOptions)
    .skip(offset)
    .limit(promptsPerPage)
    .lean();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured AI Prompts",
    "itemListElement": prompts.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": p.title,
        "description": p.prompt ? p.prompt.substring(0, 150) : "",
        "category": Array.isArray(p.category) ? p.category[0] : (p.category || "General"),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero-section bg-white py-5 border-bottom">
        <div className="container py-4">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10 col-xl-9">
              <div className="hero-content mb-4">
                <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-4 fs-6 rounded-pill">
                  <i className="bi bi-stars me-2"></i> AI-Powered Creativity
                </span>
                <h1 className="display-2 fw-bold mb-4 text-dark">
                  Create Stunning <span className="text-primary">AI Art</span>
                </h1>
                <p
                  className="lead text-muted mb-5 fs-5 px-lg-5 mx-auto"
                  style={{ maxWidth: "700px" }}
                >
                  Browse our curated collection of high-quality prompts. Copy,
                  customize, and create amazing AI-generated images with just
                  one click.
                </p>
              </div>

              <div className="row justify-content-center g-3 mt-4">
                <div className="col-lg-3 col-md-4 col-sm-4 col-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-3">
                      <div className="mb-2">
                        <i
                          className="bi bi-collection-fill text-primary"
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                      <h3 className="h4 text-primary fw-bold mb-1">
                        {totalPromptsCount}+
                      </h3>
                      <p className="text-muted mb-0 small fw-semibold">
                        AI Prompts
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-4 col-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-3">
                      <div className="mb-2">
                        <i
                          className="bi bi-grid-3x3-gap-fill text-primary"
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                      <h3 className="h4 text-primary fw-bold mb-1">
                        {categories.length}+
                      </h3>
                      <p className="text-muted mb-0 small fw-semibold">
                        Categories
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-4 col-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-3">
                      <div className="mb-2">
                        <i
                          className="bi bi-gift-fill text-primary"
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                      <h3 className="h4 text-primary fw-bold mb-1">100%</h3>
                      <p className="text-muted mb-0 small fw-semibold">
                        Free Forever
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterSection
        categories={categories}
        currentCategory={category}
        currentSearch={search}
        currentSort={sortBy}
      />

      <div className="container mt-4 mb-3">
        <div
          className="alert alert-info d-flex align-items-center shadow-sm border-0 rounded-3"
          role="alert"
        >
          <div className="alert-icon me-3">
            <i className="bi bi-info-circle-fill fs-3"></i>
          </div>
          <div className="flex-grow-1">
            <h5 className="alert-heading mb-1 fw-bold">New to AI Prompts?</h5>
            <p className="mb-0 small">
              Learn how to use these prompts with your own photos on Midjourney,
              DALL-E, and more!
            </p>
          </div>
          <Link
            href="/instructions"
            className="btn btn-primary btn-sm ms-3 flex-shrink-0"
          >
            <i className="bi bi-book me-1"></i>
            <span className="d-none d-sm-inline">View Instructions</span>
            <span className="d-inline d-sm-none">Learn</span>
          </Link>
        </div>
      </div>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h2 className="h3 mb-0">
              <i className="bi bi-image me-2 text-primary"></i>
              {category === "all" ? "Latest Prompts" : `${category} Prompts`}
              {search && ` matching "${search}"`}
            </h2>
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sort-select" className="text-muted small mb-0">Sort by:</label>
              <SortSelect
                currentCategory={category}
                currentSearch={search}
                currentSort={sortBy}
              />
            </div>
          </div>

          {prompts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h3>No prompts found</h3>
              <p className="text-muted">
                Try adjusting your search or category filter.
              </p>
              <Link href="/" className="btn btn-primary mt-2">
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {prompts.map((p) => (
                <div key={p._id.toString()} className="col-12 col-md-6 col-lg-4">
                  <PromptCard
                    prompt={{
                      _id: p._id.toString(),
                      title: p.title,
                      slug: p.slug,
                      prompt: p.prompt,
                      image: p.image,
                      stats: p.stats,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Homepage In-feed / Bottom Ad Banner */}
          <div className="my-4">
            <AdBanner label="Sponsored" />
          </div>

          {totalPages > 1 && (
            <nav className="mt-5" aria-label="Prompt pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <Link
                    href={`/?page=${currentPage - 1}&category=${category}&search=${search}&sort=${sortBy}`}
                    className="page-link"
                  >
                    Previous
                  </Link>
                </li>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <Link
                      href={`/?page=${i + 1}&category=${category}&search=${search}&sort=${sortBy}`}
                      className="page-link"
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <Link
                    href={`/?page=${currentPage + 1}&category=${category}&search=${search}&sort=${sortBy}`}
                    className="page-link"
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>

      <section className="py-5 bg-white border-top">
        <div className="container text-center">
          <h2 className="h3 mb-3">Want to Learn More?</h2>
          <p className="lead text-muted mb-4">
            Discover how AI Prompt Gallery can help you create stunning AI art
          </p>
          <Link href="/about" className="btn btn-primary btn-lg px-5">
            <i className="bi bi-info-circle me-2"></i> About Us
          </Link>
        </div>
      </section>
    </>
  );
}
