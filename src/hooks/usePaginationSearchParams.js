import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

export default function usePaginationSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(searchParams.get("limit") || DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", page);
      params.set("limit", pageSize);
      params.set("search", search);
      return params;
    });
  }, [page, pageSize, search, setSearchParams]);

  return { page, setPage, pageSize, setPageSize, search, setSearch };
}
