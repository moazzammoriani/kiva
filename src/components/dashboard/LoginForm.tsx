import React, { useState } from "react";

interface Props {
  onLogin: (token: string) => void;
}

export function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? "Invalid credentials");
      }

      const { token } = await res.json();
      localStorage.setItem("tina_token", token);
      onLogin(token);
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="db-login-wrap">
      <form className="db-login-card" onSubmit={handleSubmit}>
        <h2>Staff Dashboard</h2>
        <p>Sign in to view form submissions</p>

        <div className="db-form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="db-form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="db-btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {error && <p className="db-error">{error}</p>}
      </form>
    </div>
  );
}
