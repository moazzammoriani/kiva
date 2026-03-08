import React from "react";

interface Props {
  page: number;
  pages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
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
        <span>
          Page {page} of {pages}
        </span>
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
