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

export function AdmissionDetail({ id, token, onBack }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/submissions/admissions/${id}`, {
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
      <button className="db-detail-back" onClick={onBack}>
        &larr; Back to list
      </button>

      <h2 className="db-detail-title">
        {data.child_name} — {data.session}
      </h2>

      <div className="db-detail-section">
        <h3>Child Information</h3>
        <div className="db-detail-grid">
          <Field label="Child Name" value={data.child_name} />
          <Field label="Date of Birth" value={data.dob} />
          <Field label="Session" value={data.session} />
          <Field label="Applied Before" value={data.applied_before} />
          <Field label="Previous School" value={data.previous_school} />
          <Field label="Previous Class" value={data.previous_class} />
          <Field label="Has Report" value={data.has_report} />
          <Field label="Special Needs" value={data.special_needs} />
          <FieldFull label="Address" value={data.address} />
          <FieldFull label="Medical Info" value={data.medical_info} />
          <FieldFull label="Reason for Changing School" value={data.reason} />
        </div>
        {data.progress_report_url && (
          <div style={{ marginTop: "0.75rem" }}>
            <a
              className="db-link"
              href={`${data.progress_report_url}?token=${token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Progress Report
            </a>
          </div>
        )}
      </div>

      <div className="db-detail-section">
        <h3>Mother's Details</h3>
        <div className="db-detail-grid">
          <Field label="Name" value={data.mother_name} />
          <Field label="Profession" value={data.mother_profession} />
          <Field label="Education" value={data.mother_education} />
          <Field label="Organization" value={data.mother_organization} />
          <Field label="Email" value={data.mother_email} />
          <Field label="Phone" value={data.mother_phone} />
          <Field label="CNIC" value={data.mother_cnic} />
        </div>
      </div>

      <div className="db-detail-section">
        <h3>Father's Details</h3>
        <div className="db-detail-grid">
          <Field label="Name" value={data.father_name} />
          <Field label="Profession" value={data.father_profession} />
          <Field label="Education" value={data.father_education} />
          <Field label="Organization" value={data.father_organization} />
          <Field label="Email" value={data.father_email} />
          <Field label="Phone" value={data.father_phone} />
          <Field label="CNIC" value={data.father_cnic} />
        </div>
      </div>

      <div className="db-detail-section">
        <h3>Sibling Information</h3>
        <div className="db-detail-grid">
          <Field label="Name" value={data.sibling_name} />
          <Field label="Grade" value={data.sibling_grade} />
          <Field label="School" value={data.sibling_school} />
        </div>
      </div>

      <div className="db-detail-section">
        <h3>Emergency Contact</h3>
        <div className="db-detail-grid">
          <Field label="Name" value={data.emergency_name} />
          <Field label="Phone" value={data.emergency_phone} />
        </div>
      </div>

      <div className="db-detail-section">
        <h3>Additional</h3>
        <div className="db-detail-grid">
          <Field label="How Did You Hear About Us" value={data.hear_about} />
          <Field label="Declaration" value={data.declaration ? "Yes" : "No"} />
          <Field label="Signature" value={data.signature} />
          <Field label="Submitted" value={formatDate(data.created_at)} />
          <FieldFull label="Why KIVA is a Good Fit" value={data.fit_response} />
        </div>
      </div>
    </div>
  );
}
