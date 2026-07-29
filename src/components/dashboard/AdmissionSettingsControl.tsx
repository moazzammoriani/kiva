import React, { useEffect, useState } from "react";

interface Props {
  token: string;
}

interface AdmissionSettingsResponse {
  accepting_special_needs: boolean;
}

export function AdmissionSettingsControl({ token }: Props) {
  const [accepting, setAccepting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSettings() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admission/settings", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data: AdmissionSettingsResponse = await response.json();
        setAccepting(data.accepting_special_needs);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Could not load the special-needs admission setting.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadSettings();
    return () => controller.abort();
  }, []);

  async function updateSetting(nextValue: boolean) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admission/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accepting_special_needs: nextValue }),
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data: AdmissionSettingsResponse = await response.json();
      setAccepting(data.accepting_special_needs);
    } catch {
      setError("Could not update the setting. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const disabled = loading || saving;
  const status = loading
    ? "Loading setting..."
    : accepting
      ? "Accepting applications"
      : "Applications suspended";

  return (
    <section
      className={`db-admission-setting ${accepting ? "is-enabled" : "is-disabled"}`}
      aria-labelledby="special-needs-setting-label"
    >
      <div className="db-admission-setting-copy">
        <h2 id="special-needs-setting-label">Special-needs admissions</h2>
        <p
          id="special-needs-setting-status"
          className="db-admission-setting-status"
          aria-live="polite"
        >
          {saving ? "Saving..." : status}
        </p>
        {error && (
          <p className="db-admission-setting-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <label className="db-switch">
        <input
          type="checkbox"
          role="switch"
          checked={accepting}
          disabled={disabled}
          aria-describedby="special-needs-setting-status"
          onChange={(event) => updateSetting(event.target.checked)}
        />
        <span className="db-switch-track" aria-hidden="true">
          <span className="db-switch-thumb" />
        </span>
        <span className="db-sr-only">
          Accept special-needs admission applications
        </span>
      </label>
    </section>
  );
}
