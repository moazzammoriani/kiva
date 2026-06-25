import React, { useEffect, useState } from "react";
import { printPdf } from "../../utils/printPdf";
import { FIELD_DEFS } from "./ProgressForm";

interface Props {
  token: string;
  admissionId: number;
  onBack: () => void;
  onEdit: () => void;
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
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ProgressDetail({ token, admissionId, onBack, onEdit }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/submissions/progress/${admissionId}`, {
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
  }, [admissionId, token]);

  if (loading) return <div className="db-loading">Loading...</div>;
  if (error) return <div className="db-empty">{error}</div>;
  if (!data) return null;

  const pdfUrl = `/api/submissions/progress/${admissionId}/pdf?token=${encodeURIComponent(token)}`;
  const wideFields = FIELD_DEFS.filter((def) => def.wide);
  const standardFields = FIELD_DEFS.filter((def) => !def.wide);

  return (
    <div>
      <div className="db-detail-toolbar">
        <button className="db-detail-back" onClick={onBack}>
          &larr; Back to list
        </button>
        <div className="db-detail-actions">
          <button className="db-btn-print" onClick={onEdit}>
            Edit
          </button>
          <a className="db-btn-print" href={pdfUrl}>
            Export PDF
          </a>
          <button className="db-btn-print" onClick={() => printPdf(pdfUrl)}>
            Print
          </button>
        </div>
      </div>

      <div className="db-print-header">
        <img src="/images/home/kiva-logo.png" alt="Kiva School" className="db-print-logo" />
        <p>Admission Progress</p>
      </div>

      <h2 className="db-detail-title">
        {data.child_name || "Admission Progress"} — {data.session || "No session"}
      </h2>

      <div className="db-detail-section">
        <h3>Admission Summary</h3>
        <div className="db-detail-grid">
          <Field label="Admission Submitted" value={formatDate(data.submitted_at)} />
          <Field label="Age" value={data.current_age} />
          <Field label="Age on July 1" value={data.age_on_july} />
          <Field label="Class" value={data.class_name} />
          <Field label="Session" value={data.session} />
        </div>
      </div>

      <div className="db-detail-section">
        <h3>Progress Information</h3>
        <div className="db-detail-grid">
          {standardFields.map((def) => (
            <Field key={def.key} label={def.label} value={data[def.key]} />
          ))}
          {wideFields.map((def) => (
            <FieldFull key={def.key} label={def.label} value={data[def.key]} />
          ))}
        </div>
      </div>
    </div>
  );
}
