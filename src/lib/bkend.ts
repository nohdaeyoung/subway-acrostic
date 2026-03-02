import type { Acrostic } from "@/types/subway";

const STORAGE_KEY = "subway-acrostics";

function loadAll(): Acrostic[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAll(acrostics: Acrostic[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(acrostics));
}

export async function getAcrosticByStation(
  stationId: string
): Promise<Acrostic | null> {
  return loadAll().find((a) => a.stationId === stationId) ?? null;
}

export async function getAllAcrostics(): Promise<Acrostic[]> {
  return loadAll();
}

export async function createAcrostic(
  stationId: string,
  lines: string[]
): Promise<Acrostic> {
  const all = loadAll();
  const existing = all.find((a) => a.stationId === stationId);
  if (existing) {
    throw new Error("이미 N행시가 등록된 역입니다");
  }
  const now = new Date().toISOString();
  const acrostic: Acrostic = {
    _id: crypto.randomUUID(),
    stationId,
    lines,
    createdAt: now,
    updatedAt: now,
  };
  all.push(acrostic);
  saveAll(all);
  return acrostic;
}

export async function updateAcrostic(
  id: string,
  lines: string[]
): Promise<Acrostic> {
  const all = loadAll();
  const idx = all.findIndex((a) => a._id === id);
  if (idx === -1) throw new Error("N행시를 찾을 수 없습니다");
  all[idx] = { ...all[idx], lines, updatedAt: new Date().toISOString() };
  saveAll(all);
  return all[idx];
}

export async function deleteAcrostic(id: string): Promise<boolean> {
  const all = loadAll();
  const filtered = all.filter((a) => a._id !== id);
  saveAll(filtered);
  return true;
}
