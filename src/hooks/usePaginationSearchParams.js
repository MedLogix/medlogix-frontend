import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

export default function usePaginationSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("limit")) || DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState(JSON.parse(searchParams.get("filters")) || {});

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", page);
      params.set("limit", pageSize);
      params.set("search", search);
      params.set("filters", JSON.stringify(filters));
      return params;
    });
  }, [page, pageSize, search, filters, setSearchParams]);

  return { page, setPage, pageSize, setPageSize, search, setSearch, filters, setFilters };
}
