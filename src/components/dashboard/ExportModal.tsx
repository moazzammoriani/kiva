import React, { useState } from "react";

interface Props {
  token: string;
  endpoint: string;
  filename: string;
  onClose: () => void;
}

export function ExportModal({ token, endpoint, filename, onClose }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exporting, setExporting] = useState(false);

  async function run(all: boolean) {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (!all) {
        if (from) params.set("date_from", from);
        if (to) params.set("date_to", to);
      }
      const res = await fetch(`${endpoint}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err: any) {
      alert(err.message ?? "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Export CSV</h3>
        <div className="db-modal-body">
          <button
            className="db-btn-primary"
            style={{ marginBottom: "1rem" }}
            disabled={exporting}
            onClick={() => run(true)}
          >
            {exporting ? "Exporting..." : "Export All Entries"}
          </button>
          <div className="db-modal-divider">or select a date range</div>
          <div className="db-modal-dates">
            <label className="db-date-label">
              From
              <input
                className="db-date-input"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="db-date-label">
              To
              <input
                className="db-date-input"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>
          <button
            className="db-btn-primary"
            disabled={exporting || (!from && !to)}
            onClick={() => run(false)}
          >
            {exporting ? "Exporting..." : "Export Date Range"}
          </button>
        </div>
        <button className="db-modal-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
