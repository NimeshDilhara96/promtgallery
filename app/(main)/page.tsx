import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import Link from "next/link";
import Image from "next/image";
import { FilterSection } from "@/components/FilterSection";
import { SortSelect } from "@/components/SortSelect";
import { PromptCard } from "@/components/PromptCard";
import AdBanner from "@/components/AdBanner";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import HeroAnimation from "@/components/HeroAnimation";

const getCachedCategories = unstable_cache(
  async () => {
    await dbConnect();
    const allCategoriesRaw = await Prompt.distinct("category");
    const categoriesSet = new Set<string>();
    allCategoriesRaw.forEach((cat) => {
      if (Array.isArray(cat)) cat.forEach((c) => categoriesSet.add(c));
      else categoriesSet.add(cat);
    });
    return Array.from(categoriesSet).sort();
  },
  ["global-categories"],
  { revalidate: 3600 } // Cache for 1 hour
);

const getCachedTotalPromptsCount = unstable_cache(
  async () => {
    await dbConnect();
    return Prompt.countDocuments();
  },
  ["global-total-prompts"],
  { revalidate: 3600 } // Cache for 1 hour
);

const getCachedTrendingPrompts = unstable_cache(
  async () => {
    await dbConnect();
    return Prompt.find({}, {
      _id: 1, title: 1, slug: 1, prompt: 1, image: 1, stats: 1, platform: 1, category: 1, tags: 1, created_at: 1
    })
      .sort({ "stats.views": -1 }) // Trending based on views
      .limit(6)
      .lean();
  },
  ["global-trending-prompts"],
  { revalidate: 3600 } // Update trending every hour
);

const getCachedPopularCategories = unstable_cache(
  async () => {
    await dbConnect();
    const popular = await Prompt.aggregate([
      {
        $project: {
          categoryArray: {
            $cond: {
              if: { $isArray: "$category" },
              then: "$category",
              else: ["$category"]
            }
          }
        }
      },
      { $unwind: "$categoryArray" },
      { $match: { categoryArray: { $nin: [null, ""] } } },
      { $group: { _id: "$categoryArray", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    return popular.map((p: any) => ({ name: p._id, count: p.count }));
  },
  ["global-popular-categories"],
  { revalidate: 3600 }
);

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
    const words = search.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 0) {
      filter.$and = words.map(word => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
          { tags: { $regex: word, $options: "i" } },
        ]
      }));
    }
  }

  // Build sort
  let sortOptions: any = { created_at: -1 };
  if (sortBy === "views") {
    sortOptions = { "stats.views": -1, created_at: -1 };
  } else if (sortBy === "copies") {
    sortOptions = { "stats.copies": -1, created_at: -1 };
  }

  const isDefaultView = category === "all" && !search && page === 1;

  // 1. Fetch Global Cached Data (Zero DB hits if cached)
  const [totalPromptsCount, categories, trendingPromptsRaw, popularCategories] = await Promise.all([
    getCachedTotalPromptsCount(),
    getCachedCategories(),
    isDefaultView ? getCachedTrendingPrompts() : Promise.resolve([]),
    isDefaultView ? getCachedPopularCategories() : Promise.resolve([]),
  ]);
  
  const trendingPrompts = trendingPromptsRaw.length > 0 
    ? JSON.parse(JSON.stringify(trendingPromptsRaw)) 
    : [];

  // 2. Fetch Dynamic Data in Parallel
  // By not waiting for the count to finish before querying the prompts, we cut latency in half.
  const rawPage = Math.max(1, page);
  const offset = (rawPage - 1) * promptsPerPage;
  
  const [filteredCount, prompts] = await Promise.all([
    Prompt.countDocuments(filter),
    Prompt.find(filter, {
      _id: 1,
      title: 1,
      slug: 1,
      prompt: 1,
      image: 1,
      stats: 1,
      platform: 1,
      category: 1,
      tags: 1,
      created_at: 1
    })
      .sort(sortOptions)
      .skip(offset)
      .limit(promptsPerPage)
      .lean()
  ]);

  const totalPages = Math.ceil(filteredCount / promptsPerPage) || 1;
  const currentPage = Math.min(rawPage, totalPages);

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
      <section
        style={{
          background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 50%, #f0f6ff 100%)',
          borderBottom: '1px solid #cfe2ff',
          padding: '3rem 0 2rem'
        }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-between">
            {/* Left: Text Content */}
            <div className="col-lg-7 text-center text-lg-start">
              {/* AI badge */}
              <div className="mb-3 d-flex justify-content-center justify-content-lg-start">
                <span
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-semibold"
                  style={{
                    background: 'rgba(13,110,253,0.1)',
                    color: '#0d6efd',
                    fontSize: '0.8rem',
                    border: '1px solid rgba(13,110,253,0.2)'
                  }}
                >
                  <span style={{ width: 8, height: 8, background: '#0d6efd', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                  AI Prompt Gallery
                </span>
              </div>

              <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.2, color: '#0a1929' }}>
                Discover &amp; Copy<br />
                <span className="text-primary">
                  Perfect AI Prompts
                </span>
              </h1>

              <p className="mb-4 mx-auto mx-lg-0" style={{ color: '#64748b', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.7 }}>
                Type a style. Pick a prompt. Generate stunning AI art — instantly. Browse our curated library for Midjourney, DALL·E & Stable Diffusion.
              </p>

              {/* Stats row */}
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 36, height: 36, background: 'rgba(13,110,253,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-collection-fill text-primary" style={{ fontSize: '0.9rem' }}></i>
                  </div>
                  <div>
                    <div className="fw-bold lh-1" style={{ color: '#0f172a', fontSize: '1rem' }}>{totalPromptsCount}+</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Prompts</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 36, height: 36, background: 'rgba(13,110,253,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-grid-3x3-gap-fill text-primary" style={{ fontSize: '0.9rem' }}></i>
                  </div>
                  <div>
                    <div className="fw-bold lh-1" style={{ color: '#0f172a', fontSize: '1rem' }}>{categories.length}+</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Categories</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 36, height: 36, background: 'rgba(34,197,94,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-gift-fill" style={{ color: '#22c55e', fontSize: '0.9rem' }}></i>
                  </div>
                  <div>
                    <div className="fw-bold lh-1" style={{ color: '#0f172a', fontSize: '1rem' }}>100%</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Free</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live animated prompt widget */}
            <div className="col-lg-5 d-none d-lg-block">
              <HeroAnimation />
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}} />
      </section>


      <FilterSection
        categories={categories}
        currentCategory={category}
        currentSearch={search}
        currentSort={sortBy}
      />

      {isDefaultView && popularCategories.length > 0 && (
        <section className="py-2 bg-light border-bottom">
          <div className="container py-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.75rem' }}></i>
              <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.8px' }}>Popular Categories</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {popularCategories.map((cat: any) => (
                <Link key={cat.name} href={`/?category=${encodeURIComponent(cat.name)}`} className="text-decoration-none">
                  <span className="badge px-2 py-1 rounded-pill border fw-medium" style={{ background: '#fff', color: '#334155', fontSize: '0.72rem', transition: 'all 0.2s' }}>
                    {cat.name} <span className="text-muted ms-1" style={{ fontSize: '0.65rem' }}>{cat.count}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {isDefaultView && trendingPrompts.length > 0 && (
        <section className="py-3 bg-white border-bottom">
          <div className="container">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-fire text-danger me-2" style={{ fontSize: '0.9rem' }}></i>
              <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Trending Prompts</span>
            </div>
            <div className="row g-2">
              {trendingPrompts.map((p: any) => (
                <div key={p._id} className="col-12 col-md-6 col-xl-4">
                  <Link href={`/prompt/${p.slug}`} className="text-decoration-none">
                    <div className="card shadow-sm border border-light border-opacity-50 bg-white rounded-3 overflow-hidden trending-card">
                      <div className="d-flex align-items-center p-2" style={{ gap: 8 }}>
                        <div className="flex-shrink-0 position-relative rounded-2 overflow-hidden bg-light border" style={{ width: "52px", height: "52px" }}>
                          {p.image ? (
                            <Image src={`/${p.image.replace(/^\//, '')}`} alt={p.title} fill sizes="52px" style={{ objectFit: 'cover' }} />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"><i className="bi bi-image" style={{ fontSize: '0.9rem' }}></i></div>
                          )}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="text-dark fw-semibold text-truncate" style={{ fontSize: '0.78rem' }}>{p.title}</div>
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill" style={{ fontSize: '0.62rem' }}>
                              <i className="bi bi-fire me-1"></i>{p.stats?.views || 0}
                            </span>
                            <span className="badge bg-light text-secondary border rounded-pill text-truncate" style={{ fontSize: '0.62rem', maxWidth: 80 }}>
                              {Array.isArray(p.category) ? p.category[0] : (p.category || 'General')}
                            </span>
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted opacity-50" style={{ fontSize: '0.7rem' }}></i>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .trending-card { transition: all 0.2s ease; }
              .trending-card:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.06) !important; }
            `}} />
          </div>
        </section>
      )}

      <div className="container mt-2 mb-2">
        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border" style={{ background: 'rgba(13,110,253,0.05)', borderColor: 'rgba(13,110,253,0.15) !important' }}>
          <i className="bi bi-info-circle-fill text-primary" style={{ fontSize: '0.85rem', flexShrink: 0 }}></i>
          <span className="text-muted" style={{ fontSize: '0.78rem', flexGrow: 1 }}>
            <strong className="text-dark">New to AI Prompts?</strong> Learn how to use these with your photos on Midjourney, DALL-E &amp; more.
          </span>
          <Link href="/instructions" className="btn btn-primary btn-sm flex-shrink-0 py-1 px-2" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-book me-1"></i>Guide
          </Link>
        </div>
      </div>

      <section id="prompts-list" className="py-5 bg-light">
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
                      platform: p.platform,
                      category: p.category,
                      tags: p.tags,
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
                    href={`/?page=${currentPage - 1}&category=${category}&search=${search}&sort=${sortBy}#prompts-list`}
                    scroll={true}
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
                      href={`/?page=${i + 1}&category=${category}&search=${search}&sort=${sortBy}#prompts-list`}
                      scroll={true}
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
                    href={`/?page=${currentPage + 1}&category=${category}&search=${search}&sort=${sortBy}#prompts-list`}
                    scroll={true}
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

