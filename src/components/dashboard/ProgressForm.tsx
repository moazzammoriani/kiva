import React, { useState, useEffect } from "react";

interface Props {
  token: string;
  admissionId: number;
  onBack: () => void;
  onSaved: () => void;
}

const CLASS_OPTIONS = [
  "Playgroup", "Pre-Nursery", "Nursery", "KG",
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII",
];

const FIELD_DEFS: { key: string; label: string; wide?: boolean; options?: string[]; type?: string }[] = [
  { key: "child_name", label: "Child Name" },
  { key: "father_name", label: "Father Name" },
  { key: "father_phone", label: "Father Contact No" },
  { key: "mother_name", label: "Mother Name" },
  { key: "mother_phone", label: "Mother Contact No" },
  { key: "date_of_facilitation", label: "Date of Facilitation", type: "date" },
  { key: "class_name", label: "Class", options: CLASS_OPTIONS },
  { key: "form_status", label: "Form Status", options: ["YES", "NO", "PAAR", "OTHER"] },
  { key: "affiliation", label: "Affiliation", options: ["AMI", "DAYCARE", "KIVA", "PAAR", "Other"] },
  { key: "interview_applicable", label: "Interview Applicable", options: ["YES", "NO"] },
  { key: "parent_status", label: "Parent Status", options: ["Reachable", "Not Reachable"] },
  { key: "first_call_interview_assessment", label: "1st Call Interview Assessment", type: "date" },
  { key: "second_call_interview_assessment", label: "2nd Call Interview Assessment", type: "date" },
  { key: "acceptance", label: "Acceptance / No Acceptance", options: ["YES", "NO"] },
  { key: "session", label: "Session" },
  { key: "send_confirmation_date", label: "Send Confirmation Date", type: "date" },
  { key: "due_date_for_payment", label: "Due Date for Payment", type: "date" },
  { key: "status", label: "Status", options: ["ACCEPTED", "AWAITING", "DECLINE", "EXTENDED"] },
  { key: "follow_up", label: "Follow Up", wide: true },
  { key: "follow_up_2", label: "Follow Up 2", wide: true },
  { key: "follow_up_3", label: "Follow Up 3", wide: true },
  { key: "remarks", label: "Remarks", wide: true },
];

export function ProgressForm({ token, admissionId, onBack, onSaved }: Props) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/submissions/progress/${admissionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        const f: Record<string, string> = {};
        for (const def of FIELD_DEFS) {
          f[def.key] = data[def.key] ?? "";
        }
        setFields(f);
        setChildName(data.child_name ?? "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [admissionId, token]);

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/submissions/progress/${admissionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Error ${res.status}`);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="db-loading">Loading...</div>;

  return (
    <div>
      <div className="db-detail-toolbar">
        <button className="db-detail-back" onClick={onBack}>
          &larr; Back to list
        </button>
        <h2 className="db-detail-title" style={{ margin: 0 }}>
          Edit Progress — {childName}
        </h2>
        <button className="db-btn-print" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="db-print-header">
        <img src="/images/home/kiva-logo.png" alt="Kiva School" className="db-print-logo" />
        <p>Admission Progress</p>
      </div>

      {error && <div className="db-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="db-progress-form-grid">
          {FIELD_DEFS.map((def) => (
            <div
              key={def.key}
              className={`db-form-group ${def.wide ? "full-width" : ""}`}
            >
              <label>{def.label}</label>
              {def.options ? (
                <select
                  value={fields[def.key] ?? ""}
                  onChange={(e) => handleFieldChange(def.key, e.target.value)}
                >
                  <option value="">— Select —</option>
                  {def.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : def.wide ? (
                <textarea
                  rows={3}
                  value={fields[def.key] ?? ""}
                  onChange={(e) => handleFieldChange(def.key, e.target.value)}
                />
              ) : (
                <input
                  type={def.type ?? "text"}
                  value={fields[def.key] ?? ""}
                  onChange={(e) => handleFieldChange(def.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="db-form-actions">
          <button type="button" className="db-btn-cancel" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="db-btn-save" disabled={saving}>
            {saving ? "Saving..." : "Save Progress"}
          </button>
        </div>
      </form>
    </div>
  );
}
