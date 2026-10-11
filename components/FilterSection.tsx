"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export function FilterSection({
  categories,
  currentCategory,
  currentSearch,
  currentSort,
}: {
  categories: string[];
  currentCategory: string;
  currentSearch: string;
  currentSort: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const isFirstRender = useRef(true);
  const dropdownRef = useRef<HTMLFormElement>(null);

  // Sync state if URL changes from outside
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch popup suggestions and trigger live feed filtering
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      // 1. Fetch suggestions for popup
      if (searchTerm.length >= 2) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
          setSuggestions(data.results || []);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }

    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentCategory, currentSort, currentSearch, router]);

  function buildFilterUrl(cat: string, searchVal: string, sortVal: string) {
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("category", cat);
    if (searchVal && searchVal.trim()) params.set("search", searchVal.trim());
    if (sortVal && sortVal !== "latest") params.set("sort", sortVal);
    const q = params.toString();
    return q ? `/?${q}` : "/";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(buildFilterUrl(currentCategory, searchTerm, currentSort), { scroll: false });
    setShowDropdown(false);
  }

  return (
    <section id="categories" className="search-section py-4 bg-white border-bottom">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <form onSubmit={handleSubmit} className="search-form mb-4 position-relative" ref={dropdownRef}>
              <div 
                className={`input-group input-group-lg bg-white border border-primary border-opacity-25 ${showDropdown && suggestions.length > 0 ? "rounded-top-4 border-bottom-0 shadow-lg" : "rounded-pill shadow-sm overflow-hidden"}`}
                style={{ transition: "all 0.1s ease", zIndex: showDropdown && suggestions.length > 0 ? 1021 : 1, position: "relative" }}
              >
                <span className="input-group-text bg-transparent border-0 ps-4">
                  <i className="bi bi-search text-primary opacity-75"></i>
                </span>
                <input
                  type="text"
                  name="search"
                  id="search-input"
                  aria-label="Search prompts by keyword, category, or style"
                  className="form-control border-0 shadow-none ps-2 bg-transparent"
                  placeholder="Type to search amazing prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                  style={{ fontSize: "1.1rem" }}
                  autoComplete="off"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(""); setSuggestions([]); setShowDropdown(false); }}
                    className="btn bg-transparent border-0 text-danger pe-4 hover-opacity"
                    aria-label="Clear search query"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>

              {/* Popup Search Suggestions */}
              {showDropdown && suggestions.length > 0 && (
                <div 
                  className="position-absolute w-100 bg-white shadow-lg border border-top-0 border-primary border-opacity-25 rounded-bottom-4 overflow-hidden"
                  style={{ top: "100%", left: 0, zIndex: 1020 }}
                >
                  <div className="list-group list-group-flush">
                    {suggestions.map((s: any) => (
                      <Link 
                        key={s._id} 
                        href={`/prompt/${s.slug}`}
                        className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3 border-0"
                        onClick={() => setShowDropdown(false)}
                      >
                        {s.image ? (
                          <div className="rounded overflow-hidden flex-shrink-0 bg-light shadow-sm" style={{ width: "50px", height: "50px", position: "relative" }}>
                            <Image src={`/${s.image.replace(/^\//, '')}`} alt={s.title} fill style={{ objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div className="rounded bg-light shadow-sm d-flex align-items-center justify-content-center text-muted flex-shrink-0" style={{ width: "50px", height: "50px" }}>
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                        <div className="text-truncate">
                          <h6 className="mb-0 text-dark fw-bold text-truncate">{s.title}</h6>
                          <small className="text-muted d-block text-truncate">
                            {Array.isArray(s.category) ? s.category[0] : s.category || "General"}
                          </small>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="bg-light p-2 text-center border-top">
                    <button type="submit" className="btn btn-link text-decoration-none text-primary fw-semibold p-0">
                      View all results <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="text-center mt-4">
              <h5 className="h6 fw-bold mb-3 text-muted">
                <i className="bi bi-funnel-fill me-2"></i>
                Filter by Category
              </h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link
                  href={buildFilterUrl("all", currentSearch, currentSort)}
                  scroll={false}
                  className={`btn btn-sm rounded-pill ${
                    currentCategory === "all" ? "btn-primary active" : "btn-outline-primary"
                  }`}
                >
                  <i className="bi bi-grid-fill me-1"></i> All Prompts
                </Link>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat}
                      href={buildFilterUrl(cat, currentSearch, currentSort)}
                      scroll={false}
                      className={`btn btn-sm rounded-pill ${
                        currentCategory === cat ? "btn-primary active" : "btn-outline-primary"
                      }`}
                    >
                      {cat}
                    </Link>
                  ))
                ) : (
                  <p className="text-muted small">No categories available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Note: If you want to use onChange in SortSelect, you need a Client Component. 
// We'll just export it as a separate Client Component file to keep it clean.
