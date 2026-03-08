import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "./Pagination";

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any, token: string) => React.ReactNode;
}

interface Props {
  token: string;
  endpoint: string;
  columns: ColumnDef[];
  onRowClick?: (row: any) => void;
}

export function SubmissionsTable({ token, endpoint, columns, onRowClick }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [sortCol, setSortCol] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        sort: sortCol,
        order: sortOrder,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`${endpoint}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err: any) {
      setError(err.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [token, endpoint, page, perPage, sortCol, sortOrder, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSort(key: string) {
    if (sortCol === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(key);
      setSortOrder("desc");
    }
  }

  if (error) {
    return <div className="db-empty">{error}</div>;
  }

  return (
    <>
      <div className="db-search-bar">
        <input
          className="db-search-input"
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="db-loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="db-empty">No submissions found.</div>
      ) : (
        <>
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={sortCol === col.key ? "sorted" : ""}
                      onClick={() =>
                        col.sortable !== false && handleSort(col.key)
                      }
                    >
                      {col.label}
                      {col.sortable !== false && (
                        <span className="sort-arrow">
                          {sortCol === col.key
                            ? sortOrder === "asc"
                              ? "\u25B2"
                              : "\u25BC"
                            : ""}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row.id}
                    className={onRowClick ? "clickable-row" : ""}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render
                          ? col.render(row[col.key], row, token)
                          : row[col.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pages={pages}
            total={total}
            perPage={perPage}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
