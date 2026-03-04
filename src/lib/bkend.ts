import type { Acrostic } from "@/types/subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import { isLoggedIn } from "@/lib/auth";
import { createAcrosticSchema, updateAcrosticSchema } from "@/lib/acrostic-schema";

const STORAGE_KEY = "subway-acrostics";
const DELETED_KEY = "subway-acrostics-deleted";

function loadLocal(): Acrostic[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function loadDeleted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(DELETED_KEY);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveLocal(acrostics: Acrostic[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(acrostics));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      throw new Error("저장 공간이 부족합니다. 일부 N행시를 삭제 후 다시 시도해 주세요.");
    }
    throw e;
  }
}

function addDeleted(stationId: string): void {
  const deleted = loadDeleted();
  deleted.add(stationId);
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]));
  } catch {
    // 삭제 목록 저장 실패는 무시 (치명적이지 않음)
  }
}

function loadAll(): Acrostic[] {
  const local = loadLocal();
  const localStationIds = new Set(local.map((a) => a.stationId));
  const deleted = loadDeleted();

  // Merge: local overrides seeds; deleted seeds stay deleted
  const seedFallback = ACROSTIC_SEEDS.filter(
    (s) => !localStationIds.has(s.stationId) && !deleted.has(s.stationId)
  );

  return [...local, ...seedFallback];
}

export function getAcrosticByStation(stationId: string): Acrostic | null {
  return loadAll().find((a) => a.stationId === stationId) ?? null;
}

export function getAllAcrostics(): Acrostic[] {
  return loadAll();
}

export async function createAcrostic(
  stationId: string,
  lines: string[]
): Promise<Acrostic> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");
  const parsed = createAcrosticSchema.safeParse({ stationId, lines });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const local = loadLocal();
  const existing = local.find((a) => a.stationId === stationId);
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
  local.push(acrostic);
  saveLocal(local);
  return acrostic;
}

export async function updateAcrostic(
  id: string,
  lines: string[]
): Promise<Acrostic> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");
  const parsed = updateAcrosticSchema.safeParse({ id, lines });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const local = loadLocal();
  const idx = local.findIndex((a) => a._id === id);

  if (idx === -1) {
    // Might be a seed entry — promote it to local with updated content
    const seed = ACROSTIC_SEEDS.find((s) => s._id === id);
    if (!seed) throw new Error("N행시를 찾을 수 없습니다");
    const now = new Date().toISOString();
    const promoted: Acrostic = {
      ...seed,
      _id: crypto.randomUUID(),
      lines,
      updatedAt: now,
    };
    local.push(promoted);
    saveLocal(local);
    return promoted;
  }

  local[idx] = { ...local[idx], lines, updatedAt: new Date().toISOString() };
  saveLocal(local);
  return local[idx];
}

export async function deleteAcrostic(id: string): Promise<boolean> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");
  const local = loadLocal();
  const seed = ACROSTIC_SEEDS.find((s) => s._id === id);
  const inLocal = local.some((a) => a._id === id);

  if (!inLocal && !seed) throw new Error("N행시를 찾을 수 없습니다.");

  const filtered = local.filter((a) => a._id !== id);
  if (seed) addDeleted(seed.stationId);
  saveLocal(filtered);
  return true;
}
