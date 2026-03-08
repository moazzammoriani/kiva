import React, { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { SubmissionsTable, type ColumnDef } from "./SubmissionsTable";
import { AdmissionDetail } from "./AdmissionDetail";
import "./dashboard.css";

type Tab = "contacts" | "careers" | "admissions";

function formatDate(value: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function truncate(max: number) {
  return (value: string | null) => {
    if (!value) return "—";
    return value.length > max ? (
      <span className="db-cell-truncate" title={value}>
        {value.slice(0, max)}...
      </span>
    ) : (
      value
    );
  };
}

function renderCvLink(value: string | null, _row: any, token: string) {
  if (!value) return "—";
  return (
    <a
      className="db-link"
      href={`${value}?token=${token}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      Download
    </a>
  );
}

const CONTACT_COLUMNS: ColumnDef[] = [
  { key: "id", label: "#" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  { key: "phone", label: "Phone", sortable: false },
  { key: "message", label: "Message", render: truncate(80), sortable: false },
  { key: "created_at", label: "Date", render: formatDate },
];

const CAREER_COLUMNS: ColumnDef[] = [
  { key: "id", label: "#" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone", sortable: false },
  { key: "position", label: "Position" },
  { key: "cover_letter", label: "Cover Letter", render: truncate(60), sortable: false },
  { key: "cv_url", label: "CV", render: renderCvLink, sortable: false },
  { key: "created_at", label: "Date", render: formatDate },
];

const ADMISSION_COLUMNS: ColumnDef[] = [
  { key: "id", label: "#" },
  { key: "session", label: "Session" },
  { key: "child_name", label: "Child Name" },
  { key: "dob", label: "DOB", sortable: false },
  { key: "mother_name", label: "Mother", sortable: false },
  { key: "father_name", label: "Father", sortable: false },
  { key: "mother_phone", label: "Mother Phone", sortable: false },
  { key: "created_at", label: "Date", render: formatDate },
];

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("contacts");
  const [admissionDetailId, setAdmissionDetailId] = useState<number | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    async function check() {
      const stored = localStorage.getItem("tina_token");
      if (!stored) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${stored}` },
        });
        if (res.ok) {
          const data = await res.json();
          setToken(stored);
          setUsername(data.username);
        } else {
          localStorage.removeItem("tina_token");
        }
      } catch {
        // Network error — don't clear token
      }
      setChecking(false);
    }
    check();
  }, []);

  function handleLogin(newToken: string) {
    setToken(newToken);
    // Fetch username
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${newToken}` },
    })
      .then((r) => r.json())
      .then((d) => setUsername(d.username))
      .catch(() => {});
  }

  function handleLogout() {
    localStorage.removeItem("tina_token");
    setToken(null);
    setUsername(null);
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setAdmissionDetailId(null);
  }

  if (checking) {
    return <div className="db-loading">Loading...</div>;
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "contacts", label: "Contacts" },
    { key: "careers", label: "Careers" },
    { key: "admissions", label: "Admissions" },
  ];

  return (
    <>
      <header className="db-header">
        <h1>Kiva School — Staff Dashboard</h1>
        <div className="db-header-right">
          {username && <span className="db-header-user">{username}</span>}
          <button className="db-btn-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="db-content">
        <div className="db-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`db-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => handleTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "admissions" && admissionDetailId != null ? (
          <AdmissionDetail
            id={admissionDetailId}
            token={token}
            onBack={() => setAdmissionDetailId(null)}
          />
        ) : (
          <SubmissionsTable
            key={activeTab}
            token={token}
            endpoint={`/api/submissions/${activeTab}`}
            columns={
              activeTab === "contacts"
                ? CONTACT_COLUMNS
                : activeTab === "careers"
                  ? CAREER_COLUMNS
                  : ADMISSION_COLUMNS
            }
            onRowClick={
              activeTab === "admissions"
                ? (row) => setAdmissionDetailId(row.id)
                : undefined
            }
          />
        )}
      </main>
    </>
  );
}
