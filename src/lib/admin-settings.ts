const SETTINGS_KEY = "subway-admin-settings";

export interface AdminSettings {
  // Search console verification
  googleVerification: string;
  naverVerification: string;
  // Analytics
  googleAnalyticsId: string;
  // Custom code injection
  customHead: string;
  customBody: string;
}

const DEFAULT: AdminSettings = {
  googleVerification: "",
  naverVerification: "",
  googleAnalyticsId: "",
  customHead: "",
  customBody: "",
};

export function getAdminSettings(): AdminSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
