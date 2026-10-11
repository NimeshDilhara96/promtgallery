"use client";

import { useRouter } from "next/navigation";

export function SortSelect({
  currentCategory,
  currentSearch,
  currentSort,
}: {
  currentCategory: string;
  currentSearch: string;
  currentSort: string;
}) {
  const router = useRouter();

  return (
    <select
      id="sort-select"
      name="sort"
      aria-label="Sort prompts by"
      className="form-select form-select-sm d-inline-block w-auto"
      defaultValue={currentSort}
      onChange={(e) => {
        const newSort = e.target.value;
        const params = new URLSearchParams();
        if (currentCategory && currentCategory !== "all") params.set("category", currentCategory);
        if (currentSearch && currentSearch.trim()) params.set("search", currentSearch.trim());
        if (newSort !== "latest") params.set("sort", newSort);
        const query = params.toString();
        router.push(query ? `/?${query}` : "/", { scroll: false });
      }}
    >
      <option value="latest">Latest First</option>
      <option value="views">Most Viewed</option>
      <option value="copies">Most Copied</option>
    </select>
  );
}
