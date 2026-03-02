const API_BASE = process.env.NEXT_PUBLIC_BKEND_API_URL || "";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse | null> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data: LoginResponse = await res.json();
  setToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("accessToken");
}

export function setToken(token: string): void {
  sessionStorage.setItem("accessToken", token);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("refreshToken");
}

function setRefreshToken(token: string): void {
  sessionStorage.setItem("refreshToken", token);
}

export function clearToken(): void {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  const data = await res.json();
  setToken(data.accessToken);
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken);
  }
  return data.accessToken;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
