import React from "react";

interface Props {
  page: number;
  pages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export function Pagination({ page, pages, total, perPage, onPageChange }: Props) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="db-pagination">
      <span className="db-pagination-info">
        Showing {start}–{end} of {total}
      </span>
      <div className="db-pagination-controls">
        <button
          className="db-btn-page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {pageNumbers(page, pages).map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="db-pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`db-btn-page-num ${p === page ? "active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          className="db-btn-page"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
