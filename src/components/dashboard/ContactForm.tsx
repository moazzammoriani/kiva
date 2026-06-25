import React, { useState, useEffect } from "react";
import {
  PHONE_ERROR_MESSAGE,
  cleanPhoneInputValue,
  validatePakistanMobile,
} from "../../utils/phone";

interface Props {
  token: string;
  id: number;
  onBack: () => void;
  onSaved: () => void;
}

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "email" | "textarea";
  wide?: boolean;
  phone?: boolean;
  phoneRequired?: boolean;
}

const FIELDS: FieldDef[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", phone: true, phoneRequired: true },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message", type: "textarea", wide: true },
];

function PrintValue({ value }: { value: any }) {
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <span className={`db-form-print-value${isEmpty ? " empty" : ""}`}>
      {isEmpty ? "empty" : String(value)}
    </span>
  );
}

export function ContactForm({ token, id, onBack, onSaved }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/submissions/contacts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        const v: Record<string, any> = {};
        for (const f of FIELDS) v[f.key] = data[f.key] ?? "";
        setValues(v);
        setOriginalValues(v);
        setName(data.name ?? "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  function setField(key: string, value: any) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...values };
      for (const field of FIELDS.filter((f) => f.phone)) {
        const current = values[field.key] ?? "";
        const original = originalValues[field.key] ?? "";
        if (current !== original) {
          const result = validatePakistanMobile(current, {
            required: field.phoneRequired,
          });
          if (!result.valid) {
            setError(`${field.label}: ${PHONE_ERROR_MESSAGE}`);
            return;
          }
          payload[field.key] = result.normalized;
        }
      }

      const res = await fetch(`/api/submissions/contacts/${id}`, {
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

  return (
    <div>
      <div className="db-detail-toolbar">
        <button className="db-detail-back" onClick={onBack}>
          &larr; Back to list
        </button>
        <h2 className="db-detail-title" style={{ margin: 0 }}>
          Edit Contact — {name}
        </h2>
        <button className="db-btn-print" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="db-print-header">
        <img src="/images/home/kiva-logo.png" alt="Kiva School" className="db-print-logo" />
        <p>Contact Submission</p>
      </div>

      {error && <div className="db-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="db-detail-section">
          <div className="db-detail-grid">
            {FIELDS.map((f) => (
              <div
                key={f.key}
                className={`db-form-group ${f.wide ? "full-width" : ""}`}
              >
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={5}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={f.phone ? "tel" : f.type ?? "text"}
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setField(
                        f.key,
                        f.phone ? cleanPhoneInputValue(e.target.value) : e.target.value,
                      )
                    }
                    inputMode={f.phone ? "tel" : undefined}
                  />
                )}
                <PrintValue value={values[f.key]} />
              </div>
            ))}
          </div>
        </div>

        <div className="db-form-actions">
          <button type="button" className="db-btn-cancel" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="db-btn-save" disabled={saving}>
            {saving ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}
