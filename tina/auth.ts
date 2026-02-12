import { AbstractAuthProvider } from "tinacms";

const TOKEN_KEY = "tina_token";

interface TokenObject {
  id_token: string;
  access_token: string;
}

export class KivaAuthProvider extends AbstractAuthProvider {
  private backendUrl: string;

  constructor(backendUrl = "") {
    super();
    this.backendUrl = backendUrl;
  }

  async authenticate(props?: Record<string, string>) {
    const res = await fetch(`${this.backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const { token } = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    return { id_token: token, access_token: token };
  }

  async getToken(): Promise<TokenObject | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { id_token: token, access_token: token } : null;
  }

  async getUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const res = await fetch(`${this.backendUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return res.json();
  }

  getLoginStrategy() {
    return "UsernamePassword" as const;
  }

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
