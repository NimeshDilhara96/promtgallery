import Link from "next/link";
import { redirect } from "next/navigation";

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
  async function searchAction(formData: FormData) {
    "use server";
    const search = formData.get("search") as string;
    let url = `/?category=${currentCategory}&sort=${currentSort}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    redirect(url);
  }

  return (
    <section id="categories" className="search-section py-4 bg-white border-bottom">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <form action={searchAction} className="search-form mb-4">
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  name="search"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by keyword, category, or style..."
                  defaultValue={currentSearch}
                />
                {currentSearch && (
                  <Link
                    href={`/?category=${currentCategory}&sort=${currentSort}`}
                    className="input-group-text bg-white text-danger border-start-0 text-decoration-none"
                    title="Clear search"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </Link>
                )}
                <button type="submit" className="btn btn-primary px-4">
                  <span className="d-none d-sm-inline">Search</span>
                  <span className="d-inline d-sm-none">Go</span>
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <h5 className="h6 fw-bold mb-3 text-muted">
                <i className="bi bi-funnel-fill me-2"></i>
                Filter by Category
              </h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link
                  href={`/?category=all${
                    currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
                  }&sort=${currentSort}`}
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
                      href={`/?category=${encodeURIComponent(cat)}${
                        currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
                      }&sort=${currentSort}`}
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
