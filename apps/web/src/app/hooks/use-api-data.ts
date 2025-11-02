// src/hooks/use-api-data.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: PaginatedResponse<T>;
  message?: string;
  error?: any;
}

export function useApiData<T>(
  endpoint: string,
  initialPage = 1,
  initialLimit = 10,
  initialData?: PaginatedResponse<T>
) {
  const [data, setData] = useState<T[]>(initialData?.data || []);
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(false);

  // Use a ref to track if we've used initial data
  const hasUsedInitialData = useRef(!!initialData);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to first page when search changes
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = useCallback(async () => {
    // Skip fetch if we have initial data and no parameters have changed
    if (
      hasUsedInitialData.current &&
      page === initialPage &&
      debouncedSearch === "" &&
      rowsPerPage === initialLimit
    ) {
      hasUsedInitialData.current = false; // Mark as used
      return;
    }

    setLoading(true);
    try {
      console.log("Loading roles");
      console.log("Endpoint: ", endpoint);
      const res = await fetch(
        `${endpoint}?page=${page}&limit=${rowsPerPage}&search=${encodeURIComponent(
          debouncedSearch
        )}`
      );
      console.log("API RESPONSE");
      const json: ApiResponse<T> = await res.json();
      console.log(json);
      console.log("done");
      if (!res.ok || !json.success) {
        toast.error(json.message || "Failed to load data");
        setData([]);
        setTotalPages(1);
        return;
      }

      if (!json.data?.data?.length) {
        if (debouncedSearch.trim() !== "") {
          toast.error("No results found");
        }
        setData([]);
        setTotalPages(1);
        return;
      }

      setData(json.data.data || []);
      setTotalPages(json.data.totalPages || 1);
    } catch (err: any) {
      toast.error("An error occurred while loading data");
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, rowsPerPage, debouncedSearch, initialPage, initialLimit]);

  // Fetch data on page, rowsPerPage, or debouncedSearch change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    hasUsedInitialData.current = false; // Force refetch
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading: loading && !hasUsedInitialData.current, // Don't show loading for initial render
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    search,
    setSearch,
    refresh,
  };
}
