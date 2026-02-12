import React, { useState } from "react";

const TOKEN_KEY = "tina_token";

type Status = "idle" | "publishing" | "success" | "error";

export function PublishScreen() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handlePublish() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setStatus("error");
      setMessage("You must be logged in to publish.");
      return;
    }

    setStatus("publishing");
    setMessage("");
    try {
      const res = await fetch("/api/rebuild", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Rebuild failed (${res.status})`);
      }
      setStatus("success");
      setMessage("Site rebuilt successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message ?? "Publish failed.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#374151",
          marginBottom: "0.5rem",
        }}
      >
        Publish Site
      </h3>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Rebuild the live site with your latest CMS changes.
      </p>
      <button
        onClick={handlePublish}
        disabled={status === "publishing"}
        style={{
          padding: "10px 24px",
          borderRadius: "8px",
          border: "none",
          fontWeight: 600,
          fontSize: "14px",
          cursor: status === "publishing" ? "wait" : "pointer",
          color: "#fff",
          background:
            status === "success"
              ? "#16a34a"
              : status === "error"
                ? "#dc2626"
                : "#2563eb",
          opacity: status === "publishing" ? 0.7 : 1,
          transition: "background 0.2s, opacity 0.2s",
        }}
      >
        {status === "publishing"
          ? "Publishing\u2026"
          : status === "success"
            ? "Published!"
            : "Publish"}
      </button>
      {message && (
        <p
          style={{
            marginTop: "1rem",
            color: status === "error" ? "#dc2626" : "#16a34a",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
