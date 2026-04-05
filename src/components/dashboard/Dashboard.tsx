import React, { useState, useEffect, useCallback } from "react";
import { LoginForm } from "./LoginForm";
import { SubmissionsTable, type ColumnDef } from "./SubmissionsTable";
import { AdmissionDetail } from "./AdmissionDetail";
import { ContactDetail } from "./ContactDetail";
import { CareerDetail } from "./CareerDetail";
import { ProgressList } from "./ProgressList";
import { ProgressForm } from "./ProgressForm";
import "./dashboard.css";

type Tab = "contacts" | "careers" | "admissions" | "progress";

const TABS: Tab[] = ["contacts", "careers", "admissions", "progress"];

type RouteMode = "list" | "detail" | "new" | "edit";

function parseRoute(): { tab: Tab; detailId: number | null; mode: RouteMode } {
  const path = window.location.pathname.replace(/\/+$/, "");
  // e.g. /dashboard/progress/new
  const newMatch = path.match(/^\/dashboard\/(\w+)\/new$/);
  if (newMatch && TABS.includes(newMatch[1] as Tab)) {
    return { tab: newMatch[1] as Tab, detailId: null, mode: "new" };
  }
  // e.g. /dashboard/progress/5/edit
  const editMatch = path.match(/^\/dashboard\/(\w+)\/(\d+)\/edit$/);
  if (editMatch && TABS.includes(editMatch[1] as Tab)) {
    return { tab: editMatch[1] as Tab, detailId: Number(editMatch[2]), mode: "edit" };
  }
  // e.g. /dashboard/careers/5
  const match = path.match(/^\/dashboard\/(\w+)\/(\d+)$/);
  if (match && TABS.includes(match[1] as Tab)) {
    return { tab: match[1] as Tab, detailId: Number(match[2]), mode: "detail" };
  }
  // e.g. /dashboard/careers
  const tabMatch = path.match(/^\/dashboard\/(\w+)$/);
  if (tabMatch && TABS.includes(tabMatch[1] as Tab)) {
    return { tab: tabMatch[1] as Tab, detailId: null, mode: "list" };
  }
  return { tab: "contacts", detailId: null, mode: "list" };
}

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
  const [detailId, setDetailId] = useState<number | null>(null);
  const [routeMode, setRouteMode] = useState<RouteMode>("list");

  const applyRoute = useCallback(() => {
    const route = parseRoute();
    setActiveTab(route.tab);
    setDetailId(route.detailId);
    setRouteMode(route.mode);
  }, []);

  // Parse URL on mount + listen for popstate (browser back/forward)
  useEffect(() => {
    applyRoute();
    window.addEventListener("popstate", applyRoute);
    return () => window.removeEventListener("popstate", applyRoute);
  }, [applyRoute]);

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

  function navigate(path: string) {
    history.pushState(null, "", path);
    applyRoute();
  }

  function handleLogin(newToken: string) {
    setToken(newToken);
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
    navigate(`/dashboard/${tab}`);
  }

  function handleRowClick(row: any) {
    navigate(`/dashboard/${activeTab}/${row.id}`);
  }

  function handleBack() {
    navigate(`/dashboard/${activeTab}`);
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
    { key: "progress", label: "Progress" },
  ];

  function renderDetail() {
    if (detailId == null) return null;
    switch (activeTab) {
      case "contacts":
        return <ContactDetail id={detailId} token={token!} onBack={handleBack} />;
      case "careers":
        return <CareerDetail id={detailId} token={token!} onBack={handleBack} />;
      case "admissions":
        return <AdmissionDetail id={detailId} token={token!} onBack={handleBack} />;
    }
  }

  function renderProgressTab() {
    if (routeMode === "edit" && detailId != null) {
      return (
        <ProgressForm
          token={token!}
          admissionId={detailId}
          onBack={handleBack}
          onSaved={handleBack}
        />
      );
    }
    return (
      <ProgressList
        token={token!}
        onEdit={(admissionId) => navigate(`/dashboard/progress/${admissionId}/edit`)}
      />
    );
  }

  function renderContent() {
    if (activeTab === "progress") {
      return renderProgressTab();
    }
    if (detailId != null) {
      return renderDetail();
    }
    return (
      <SubmissionsTable
        key={activeTab}
        token={token!}
        endpoint={`/api/submissions/${activeTab}`}
        columns={
          activeTab === "contacts"
            ? CONTACT_COLUMNS
            : activeTab === "careers"
              ? CAREER_COLUMNS
              : ADMISSION_COLUMNS
        }
        onRowClick={handleRowClick}
      />
    );
  }

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

        {renderContent()}
      </main>
    </>
  );
}
