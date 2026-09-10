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
        let url = `/?category=${currentCategory}&sort=${e.target.value}`;
        if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
        router.push(url);
      }}
    >
      <option value="latest">Latest First</option>
      <option value="views">Most Viewed</option>
      <option value="copies">Most Copied</option>
    </select>
  );
}
