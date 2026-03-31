import React, { useState, useEffect } from "react";

interface Props {
  id: number;
  token: string;
  onBack: () => void;
}

function Field({ label, value }: { label: string; value: any }) {
  if (value == null || value === "") return null;
  return (
    <div className="db-detail-field">
      <label>{label}</label>
      <span>{String(value)}</span>
    </div>
  );
}

function FieldFull({ label, value }: { label: string; value: any }) {
  if (value == null || value === "") return null;
  return (
    <div className="db-detail-field full-width">
      <label>{label}</label>
      <span>{String(value)}</span>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function CareerDetail({ id, token, onBack }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/submissions/careers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setData(await res.json());
      } catch (err: any) {
        setError(err.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, token]);

  if (loading) return <div className="db-loading">Loading...</div>;
  if (error) return <div className="db-empty">{error}</div>;
  if (!data) return null;

  return (
    <div>
      <div className="db-detail-toolbar">
        <button className="db-detail-back" onClick={onBack}>
          &larr; Back to list
        </button>
        <button className="db-btn-print" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="db-print-header">
        <img src="/images/home/kiva-logo.png" alt="Kiva School" className="db-print-logo" />
        <p>Career Application</p>
      </div>

      <h2 className="db-detail-title">{data.name}</h2>

      <div className="db-detail-section">
        <div className="db-detail-grid">
          <Field label="Name" value={data.name} />
          <Field label="Email" value={data.email} />
          <Field label="Phone" value={data.phone} />
          <Field label="Position" value={data.position} />
          <Field label="Submitted" value={formatDate(data.created_at)} />
          <FieldFull label="Cover Letter" value={data.cover_letter} />
        </div>
        {data.cv_url && (
          <div style={{ marginTop: "0.75rem" }}>
            <a
              className="db-link"
              href={`${data.cv_url}?token=${token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
