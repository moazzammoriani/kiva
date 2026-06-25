import React, { useState, useEffect } from "react";
import { printPdf } from "../../utils/printPdf";
import {
  PHONE_ERROR_MESSAGE,
  cleanPhoneInputValue,
  validatePakistanMobile,
} from "../../utils/phone";
import { ELIGIBLE_CLASS_OPTIONS } from "../../utils/classEligibility";

interface Props {
  token: string;
  admissionId: number;
  onBack: () => void;
  onSaved: () => void;
}

export const CLASS_OPTIONS = [...ELIGIBLE_CLASS_OPTIONS];

export const FIELD_DEFS: {
  key: string;
  label: string;
  wide?: boolean;
  options?: string[];
  type?: string;
  phone?: boolean;
}[] = [
  { key: "child_name", label: "Child Name" },
  { key: "father_name", label: "Father Name" },
  { key: "father_phone", label: "Father Contact No", phone: true },
  { key: "mother_name", label: "Mother Name" },
  { key: "mother_phone", label: "Mother Contact No", phone: true },
  { key: "date_of_facilitation", label: "Date of Facilitation", type: "date" },
  { key: "class_name", label: "Class", options: CLASS_OPTIONS },
  {
    key: "form_status",
    label: "Form Status",
    options: ["YES", "NO", "PAAR", "OTHER"],
  },
  {
    key: "affiliation",
    label: "Affiliation",
    options: ["AMI", "DAYCARE", "KIVA", "PAAR", "Other"],
  },
  {
    key: "interview_applicable",
    label: "Interview Applicable",
    options: ["YES", "NO"],
  },
  {
    key: "parent_status",
    label: "Parent Status",
    options: ["Reachable", "Not Reachable"],
  },
  {
    key: "first_call_interview_assessment",
    label: "1st Call Interview Assessment",
    type: "date",
  },
  {
    key: "second_call_interview_assessment",
    label: "2nd Call Interview Assessment",
    type: "date",
  },
  {
    key: "acceptance",
    label: "Acceptance / No Acceptance",
    options: ["YES", "NO"],
  },
  { key: "session", label: "Session" },
  {
    key: "send_confirmation_date",
    label: "Send Confirmation Date",
    type: "date",
  },
  { key: "due_date_for_payment", label: "Due Date for Payment", type: "date" },
  {
    key: "status",
    label: "Status",
    options: ["ACCEPTED", "AWAITING", "DECLINE", "EXTENDED"],
  },
  { key: "follow_up", label: "Follow Up", wide: true },
  { key: "follow_up_2", label: "Follow Up 2", wide: true },
  { key: "follow_up_3", label: "Follow Up 3", wide: true },
  { key: "remarks", label: "Remarks", wide: true },
];

function PrintValue({ value }: { value: any }) {
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <span className={`db-form-print-value${isEmpty ? " empty" : ""}`}>
      {isEmpty ? "empty" : String(value)}
    </span>
  );
}

export function ProgressForm({ token, admissionId, onBack, onSaved }: Props) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [originalFields, setOriginalFields] = useState<Record<string, string>>(
    {},
  );
  const [childName, setChildName] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [ageOnJuly, setAgeOnJuly] = useState("");
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
        setOriginalFields(f);
        setChildName(data.child_name ?? "");
        setSubmittedAt(
          data.submitted_at
            ? new Date(data.submitted_at).toLocaleDateString()
            : "",
        );
        setCurrentAge(data.current_age ?? "");
        setAgeOnJuly(data.age_on_july ?? "");
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
      const payload = { ...fields };
      for (const def of FIELD_DEFS.filter((field) => field.phone)) {
        const current = fields[def.key] ?? "";
        const original = originalFields[def.key] ?? "";
        if (current !== original) {
          const result = validatePakistanMobile(current);
          if (!result.valid) {
            setError(`${def.label}: ${PHONE_ERROR_MESSAGE}`);
            return;
          }
          payload[def.key] = result.normalized;
        }
      }

      const res = await fetch(`/api/submissions/progress/${admissionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const pdfUrl = `/api/submissions/progress/${admissionId}/pdf?token=${encodeURIComponent(token)}`;

  return (
    <div>
      <div className="db-detail-toolbar">
        <button className="db-detail-back" onClick={onBack}>
          &larr; Back to list
        </button>
        <h2 className="db-detail-title" style={{ margin: 0 }}>
          Edit Progress — {childName}
        </h2>
        <div className="db-detail-actions">
          <a className="db-btn-print" href={pdfUrl}>
            Export PDF
          </a>
          <button className="db-btn-print" onClick={() => printPdf(pdfUrl)}>
            Print
          </button>
        </div>
      </div>

      <div className="db-print-header">
        <img
          src="/images/home/kiva-logo.png"
          alt="Kiva School"
          className="db-print-logo"
        />
        <p>Admission Progress</p>
      </div>

      {(submittedAt || currentAge || ageOnJuly) && (
        <div className="db-detail-section" style={{ marginBottom: "1rem" }}>
          <div className="db-detail-grid">
            {submittedAt && (
              <div className="db-detail-field">
                <label>Admission Submitted</label>
                <span>{submittedAt}</span>
              </div>
            )}
            {currentAge && (
              <div className="db-detail-field">
                <label>Age</label>
                <span>{currentAge}</span>
              </div>
            )}
            {ageOnJuly && (
              <div className="db-detail-field">
                <label>Age on July 1</label>
                <span>{ageOnJuly}</span>
              </div>
            )}
          </div>
        </div>
      )}

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
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
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
                  type={def.phone ? "tel" : (def.type ?? "text")}
                  value={fields[def.key] ?? ""}
                  onChange={(e) =>
                    handleFieldChange(
                      def.key,
                      def.phone
                        ? cleanPhoneInputValue(e.target.value)
                        : e.target.value,
                    )
                  }
                  inputMode={def.phone ? "tel" : undefined}
                />
              )}
              <PrintValue value={fields[def.key]} />
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
