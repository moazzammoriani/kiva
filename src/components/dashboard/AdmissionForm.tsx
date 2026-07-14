import React, { useState, useEffect } from "react";
import { formatCnic, normalizeCnic } from "../../utils/cnic";
import { calculateEligibleClass } from "../../utils/classEligibility";
import {
  PHONE_ERROR_MESSAGE,
  cleanPhoneInputValue,
  normalizePakistanMobile,
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
  type?: "text" | "date" | "textarea" | "checkbox";
  section: string;
  wide?: boolean;
  cnic?: boolean;
  phone?: boolean;
  phoneRequired?: boolean;
  readonly?: boolean;
}

const FIELDS: FieldDef[] = [
  { key: "session", label: "Session", section: "Child Information" },
  { key: "child_name", label: "Child Name", section: "Child Information" },
  { key: "dob", label: "Date of Birth", type: "date", section: "Child Information" },
  { key: "eligible_class", label: "Eligible Class", section: "Child Information", readonly: true },
  { key: "applied_before", label: "Applied Before", section: "Child Information" },
  { key: "previous_school", label: "Previous School", section: "Child Information" },
  { key: "previous_class", label: "Previous Class", section: "Child Information" },
  { key: "has_report", label: "Has Report", section: "Child Information" },
  { key: "special_needs", label: "Special Needs", section: "Child Information" },
  {
    key: "special_needs_details",
    label: "Special Needs Details",
    type: "textarea",
    wide: true,
    section: "Child Information",
  },
  { key: "address", label: "Address", type: "textarea", wide: true, section: "Child Information" },
  { key: "medical_info", label: "Medical Info", type: "textarea", wide: true, section: "Child Information" },
  { key: "reason", label: "Reason for Changing School", type: "textarea", wide: true, section: "Child Information" },

  { key: "mother_name", label: "Name", section: "Mother's Details" },
  { key: "mother_profession", label: "Profession", section: "Mother's Details" },
  { key: "mother_education", label: "Education", section: "Mother's Details" },
  { key: "mother_institution", label: "Institution Attended", section: "Mother's Details" },
  { key: "mother_organization", label: "Organization", section: "Mother's Details" },
  { key: "mother_email", label: "Email", section: "Mother's Details" },
  { key: "mother_phone", label: "Phone", section: "Mother's Details", phone: true, phoneRequired: true },
  { key: "mother_cnic", label: "CNIC", section: "Mother's Details", cnic: true },

  { key: "father_name", label: "Name", section: "Father's Details" },
  { key: "father_profession", label: "Profession", section: "Father's Details" },
  { key: "father_education", label: "Education", section: "Father's Details" },
  { key: "father_institution", label: "Institution Attended", section: "Father's Details" },
  { key: "father_organization", label: "Organization", section: "Father's Details" },
  { key: "father_email", label: "Email", section: "Father's Details" },
  { key: "father_phone", label: "Phone", section: "Father's Details", phone: true, phoneRequired: true },
  { key: "father_cnic", label: "CNIC", section: "Father's Details", cnic: true },

  { key: "sibling_name", label: "Name", section: "Sibling Information" },
  { key: "sibling_grade", label: "Grade", section: "Sibling Information" },
  { key: "sibling_school", label: "School", section: "Sibling Information" },

  { key: "emergency_name", label: "Name", section: "Emergency Contact" },
  { key: "emergency_phone", label: "Phone", section: "Emergency Contact", phone: true, phoneRequired: true },

  { key: "hear_about", label: "How Did You Hear About Us", section: "Additional" },
  { key: "signature", label: "Signature", section: "Additional" },
  { key: "declaration", label: "Declaration", type: "checkbox", section: "Additional" },
  { key: "fit_response", label: "Why KIVA is a Good Fit", type: "textarea", wide: true, section: "Additional" },
];

const SECTIONS = Array.from(new Set(FIELDS.map((f) => f.section)));
const CONTACT_FIELD_KEYS = [
  "mother_name",
  "mother_phone",
  "father_name",
  "father_phone",
  "emergency_name",
  "emergency_phone",
];
const EMERGENCY_CONTACT_MESSAGE =
  "Please provide an emergency contact that is different from the mother and father.";
const SPECIAL_NEEDS_DETAILS_MESSAGE =
  "Special educational needs details are required when Special Needs is Yes.";

function normalizeContactName(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function contactFieldsChanged(
  values: Record<string, any>,
  originalValues: Record<string, any>,
) {
  return CONTACT_FIELD_KEYS.some(
    (key) => String(values[key] ?? "") !== String(originalValues[key] ?? ""),
  );
}

function emergencyContactIsDuplicate(values: Record<string, any>) {
  const emergencyName = normalizeContactName(values.emergency_name);
  const parentNames = [
    normalizeContactName(values.mother_name),
    normalizeContactName(values.father_name),
  ].filter(Boolean);

  if (emergencyName && parentNames.includes(emergencyName)) {
    return true;
  }

  const emergencyPhone = normalizePakistanMobile(values.emergency_phone);
  const parentPhones = [
    normalizePakistanMobile(values.mother_phone),
    normalizePakistanMobile(values.father_phone),
  ].filter(Boolean);

  return Boolean(emergencyPhone && parentPhones.includes(emergencyPhone));
}

function PrintValue({ value, isCheckbox }: { value: any; isCheckbox?: boolean }) {
  if (isCheckbox) {
    return <span className="db-form-print-value">{value ? "Yes" : "No"}</span>;
  }
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <span className={`db-form-print-value${isEmpty ? " empty" : ""}`}>
      {isEmpty ? "empty" : String(value)}
    </span>
  );
}

export function AdmissionForm({ token, id, onBack, onSaved }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, any>>({});
  const [childName, setChildName] = useState("");
  const [eligibilityYear, setEligibilityYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/submissions/admissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        const v: Record<string, any> = {};
        for (const f of FIELDS) {
          const value = data[f.key] ?? (f.type === "checkbox" ? false : "");
          v[f.key] = f.cnic ? formatCnic(value) : value;
        }
        setValues(v);
        setOriginalValues(v);
        setChildName(data.child_name ?? "");
        setEligibilityYear(data.eligibility_year ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  function setField(key: string, value: any) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "dob" && eligibilityYear
        ? { eligible_class: calculateEligibleClass(value, eligibilityYear) }
        : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const nextValues = { ...values };
      for (const field of FIELDS.filter((f) => f.phone)) {
        const current = values[field.key] ?? "";
        const original = originalValues[field.key] ?? "";
        if (current !== original) {
          const result = validatePakistanMobile(current, {
            required: field.phoneRequired,
          });
          if (!result.valid) {
            setError(`${field.section} ${field.label}: ${PHONE_ERROR_MESSAGE}`);
            return;
          }
          nextValues[field.key] = result.normalized;
        }
      }

      if (
        contactFieldsChanged(values, originalValues) &&
        emergencyContactIsDuplicate(nextValues)
      ) {
        setError(EMERGENCY_CONTACT_MESSAGE);
        return;
      }

      const specialNeedsChanged =
        String(values.special_needs ?? "") !==
          String(originalValues.special_needs ?? "") ||
        String(values.special_needs_details ?? "") !==
          String(originalValues.special_needs_details ?? "");
      const specialNeedsIsYes =
        String(values.special_needs ?? "").trim().toLowerCase() === "yes";
      const specialNeedsDetailsMissing = !String(
        values.special_needs_details ?? "",
      ).trim();
      if (
        specialNeedsChanged &&
        specialNeedsIsYes &&
        specialNeedsDetailsMissing
      ) {
        setError(SPECIAL_NEEDS_DETAILS_MESSAGE);
        return;
      }

      const { eligible_class: _eligibleClass, ...editableValues } = nextValues;
      const payload = {
        ...editableValues,
        mother_cnic: normalizeCnic(nextValues.mother_cnic),
        father_cnic: normalizeCnic(nextValues.father_cnic),
      };
      const res = await fetch(`/api/submissions/admissions/${id}`, {
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
          Edit Admission — {childName}
        </h2>
        <button className="db-btn-print" onClick={() => window.print()}>
          Print
        </button>
      </div>

      {error && <div className="db-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {SECTIONS.map((section) => (
          <div key={section} className="db-detail-section">
            <h3>{section}</h3>
            <div className="db-detail-grid">
              {FIELDS.filter((f) => f.section === section).map((f) => (
                <div
                  key={f.key}
                  className={`db-form-group ${f.wide ? "full-width" : ""}`}
                >
                  <label>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  ) : f.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(values[f.key])}
                      onChange={(e) => setField(f.key, e.target.checked)}
                    />
                  ) : (
                    <input
                      type={f.type ?? "text"}
                      value={values[f.key] ?? ""}
                      readOnly={f.readonly}
                      onChange={(e) =>
                        setField(
                          f.key,
                          f.cnic
                            ? formatCnic(e.target.value)
                            : f.phone
                              ? cleanPhoneInputValue(e.target.value)
                              : e.target.value,
                        )
                      }
                      inputMode={f.cnic ? "numeric" : f.phone ? "tel" : undefined}
                      maxLength={f.cnic ? 15 : undefined}
                      pattern={f.cnic ? "[0-9]{5}-[0-9]{7}-[0-9]" : undefined}
                    />
                  )}
                  <PrintValue value={values[f.key]} isCheckbox={f.type === "checkbox"} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="db-form-actions">
          <button type="button" className="db-btn-cancel" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="db-btn-save" disabled={saving}>
            {saving ? "Saving..." : "Save Admission"}
          </button>
        </div>
      </form>
    </div>
  );
}
