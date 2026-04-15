import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "./Pagination";
import { ExportModal } from "./ExportModal";
import { ConfirmModal } from "./ConfirmModal";

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
  exportFilename?: string;
  onEdit?: (row: any) => void;
  deleteEndpoint?: string;
  deleteTitle?: string;
  deleteMessage?: (row: any) => string;
}

export function SubmissionsTable({
  token,
  endpoint,
  columns,
  onRowClick,
  exportFilename,
  onEdit,
  deleteEndpoint,
  deleteTitle,
  deleteMessage,
}: Props) {
  const [showExport, setShowExport] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [sortCol, setSortCol] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateFrom, dateTo]);

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
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);

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
  }, [token, endpoint, page, perPage, sortCol, sortOrder, debouncedSearch, dateFrom, dateTo]);

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

  function clearFilters() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  }

  async function confirmDelete() {
    if (!deleteTarget || !deleteEndpoint) return;
    setDeleting(true);
    try {
      const res = await fetch(`${deleteEndpoint}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      alert(err.message ?? "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  const hasFilters = search || dateFrom || dateTo;
  const showActions = Boolean(onEdit || deleteEndpoint);

  if (error) {
    return <div className="db-empty">{error}</div>;
  }

  return (
    <>
      {showExport && exportFilename && (
        <ExportModal
          token={token}
          endpoint={`${endpoint}/export`}
          filename={exportFilename}
          onClose={() => setShowExport(false)}
        />
      )}

      {deleteTarget && deleteEndpoint && (
        <ConfirmModal
          title={deleteTitle ?? "Delete entry?"}
          message={deleteMessage ? deleteMessage(deleteTarget) : "This action cannot be undone."}
          confirmLabel="Delete"
          danger
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      <div className="db-filters">
        <input
          className="db-search-input"
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="db-date-filters">
          <label className="db-date-label">
            From
            <input
              className="db-date-input"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>
          <label className="db-date-label">
            To
            <input
              className="db-date-input"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>
          {hasFilters && (
            <button className="db-btn-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
        {exportFilename && (
          <button className="db-btn-export" onClick={() => setShowExport(true)}>
            Export CSV
          </button>
        )}
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
                  {showActions && <th>Actions</th>}
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
                    {showActions && (
                      <td className="db-actions-cell" onClick={(e) => e.stopPropagation()}>
                        {onEdit && (
                          <button
                            className="db-btn-action db-btn-action-edit"
                            onClick={() => onEdit(row)}
                          >
                            Edit
                          </button>
                        )}
                        {deleteEndpoint && (
                          <button
                            className="db-btn-action db-btn-action-delete"
                            onClick={() => setDeleteTarget(row)}
                            title="Delete entry"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
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
