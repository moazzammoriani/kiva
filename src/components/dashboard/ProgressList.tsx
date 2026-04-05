import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "./Pagination";

interface Props {
  token: string;
  onEdit: (admissionId: number) => void;
}

const COLUMNS = [
  { key: "child_name", label: "Child Name" },
  { key: "class_name", label: "Class" },
  { key: "father_name", label: "Father" },
  { key: "father_phone", label: "Father Phone" },
  { key: "mother_name", label: "Mother" },
  { key: "mother_phone", label: "Mother Phone" },
  { key: "form_status", label: "Form Status" },
  { key: "affiliation", label: "Affiliation" },
  { key: "interview_applicable", label: "Interview" },
  { key: "parent_status", label: "Parent Status" },
  { key: "first_call_interview_assessment", label: "1st Call" },
  { key: "second_call_interview_assessment", label: "2nd Call" },
  { key: "acceptance", label: "Acceptance" },
  { key: "send_confirmation_date", label: "Confirmation" },
  { key: "due_date_for_payment", label: "Due Date" },
  { key: "follow_up", label: "Follow Up" },
  { key: "follow_up_2", label: "Follow Up 2" },
  { key: "follow_up_3", label: "Follow Up 3" },
  { key: "status", label: "Status" },
  { key: "session", label: "Session", sortable: true },
  { key: "remarks", label: "Remarks" },
];

function truncate(value: string | null, max = 40): string {
  if (!value) return "";
  return value.length > max ? value.slice(0, max) + "..." : value;
}

export function ProgressList({ token, onEdit }: Props) {
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

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

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

      const res = await fetch(`/api/submissions/progress?${params}`, {
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
  }, [token, page, perPage, sortCol, sortOrder, debouncedSearch, dateFrom, dateTo]);

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

  async function handleDelete(row: any) {
    if (!row.progress_id) return;
    if (!window.confirm(`Clear progress data for ${row.child_name}?`)) return;
    try {
      const res = await fetch(`/api/submissions/progress/${row.admission_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      fetchData();
    } catch (err: any) {
      alert(err.message ?? "Failed to delete");
    }
  }

  const hasFilters = search || dateFrom || dateTo;

  if (error) {
    return <div className="db-empty">{error}</div>;
  }

  return (
    <>
      <div className="db-filters">
        <input
          className="db-search-input"
          type="text"
          placeholder="Search by child or parent name..."
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
      </div>

      {loading ? (
        <div className="db-loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="db-empty">No admissions found.</div>
      ) : (
        <>
          <div className="db-table-wrap">
            <table className="db-table db-progress-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={sortCol === col.key ? "sorted" : ""}
                      onClick={() => col.sortable && handleSort(col.key)}
                      style={col.sortable ? { cursor: "pointer" } : undefined}
                    >
                      {col.label}
                      {col.sortable && sortCol === col.key && (
                        <span className="sort-arrow">
                          {sortOrder === "asc" ? "\u25B2" : "\u25BC"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.admission_id}>
                    <td className="db-actions-cell">
                      <button
                        className="db-btn-action db-btn-action-edit"
                        onClick={() => onEdit(row.admission_id)}
                      >
                        Edit
                      </button>
                      {row.progress_id && (
                        <button
                          className="db-btn-action db-btn-action-delete"
                          onClick={() => handleDelete(row)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                    {COLUMNS.map((col) => (
                      <td key={col.key} title={row[col.key] || ""}>
                        {truncate(row[col.key]) || "\u2014"}
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
