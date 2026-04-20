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

export function KivaKampDetail({ id, token, onBack }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/submissions/kiva-kamps/${id}`, {
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
        <p>Kiva Kamps Registration</p>
      </div>

      <h2 className="db-detail-title">{data.name}</h2>

      <div className="db-detail-section">
        <div className="db-detail-grid">
          <Field label="Name" value={data.name} />
          <Field label="Class" value={data.child_class} />
          <Field label="Age" value={data.age} />
          <Field label="School" value={data.school_name} />
          <Field label="Father's Name" value={data.father_name} />
          <Field label="Mother's Name" value={data.mother_name} />
          <Field label="Father's Contact" value={data.father_contact} />
          <Field label="Mother's Contact" value={data.mother_contact} />
          <Field label="Attended Kiva Kamp before?" value={data.attended_past} />
          <Field label="Sibling at Kiva / AMI?" value={data.sibling} />
          <Field label="Group registration?" value={data.group_registration} />
          <Field label="Referral source" value={data.referral} />
          <Field label="Submitted" value={formatDate(data.created_at)} />
        </div>
      </div>
    </div>
  );
}
