const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

export function login(password: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("admin", "true");
    return true;
  }
  return false;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin") === "true";
}

export function clearToken(): void {
  localStorage.removeItem("admin");
}
