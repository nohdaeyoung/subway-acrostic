import type { Acrostic } from "@/types/subway";
import { isLoggedIn } from "@/lib/auth";
import { createAcrosticSchema, updateAcrosticSchema } from "@/lib/acrostic-schema";
import { db } from "@/lib/firebase";
import { AI_ACROSTIC_SEEDS } from "@/data/ai-acrostic-seeds";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const COL = "acrostics";

function toAcrostic(id: string, data: Record<string, unknown>): Acrostic {
  return {
    _id: id,
    stationId: data.stationId as string,
    lines: data.lines as string[],
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string,
    isAi: (data.isAi as boolean | undefined) ?? false,
    aiConcept: data.aiConcept as Acrostic["aiConcept"],
  };
}

/** AI seed에서 역별 랜덤 시 하나를 뽑아 Acrostic으로 변환 */
function pickAiAcrostic(stationId: string): Acrostic | null {
  const candidates = AI_ACROSTIC_SEEDS.filter((s) => s.stationId === stationId);
  if (candidates.length === 0) return null;
  // 결정론적 선택 (stationId 기반 해시로 항상 같은 컨셉 반환)
  const hash = stationId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const picked = candidates[hash % candidates.length];
  return {
    _id: `ai-${stationId}-${picked.concept}`,
    stationId: picked.stationId,
    lines: picked.lines,
    createdAt: "2026-03-29T00:00:00.000Z",
    updatedAt: "2026-03-29T00:00:00.000Z",
    isAi: true,
    aiConcept: picked.concept,
  };
}

/** 역별 AI 시 전체 목록 (3개 컨셉 모두) */
function allAiAcrosticsForStation(stationId: string): Acrostic[] {
  return AI_ACROSTIC_SEEDS.filter((s) => s.stationId === stationId).map((s) => ({
    _id: `ai-${s.stationId}-${s.concept}`,
    stationId: s.stationId,
    lines: s.lines,
    createdAt: "2026-03-29T00:00:00.000Z",
    updatedAt: "2026-03-29T00:00:00.000Z",
    isAi: true,
    aiConcept: s.concept,
  }));
}

export async function getAllAcrostics(): Promise<Acrostic[]> {
  const snapshot = await getDocs(collection(db, COL));
  const userAcrostics = snapshot.docs.map((d) => toAcrostic(d.id, d.data()));

  // 리스트 뷰용: 사용자 시 + AI 시 모두 표시 (단, 같은 역에 사용자 시 있으면 AI는 1개 대표)
  // 사용자 시 있는 역도 AI 시 대표 1개 추가하여 둘 다 보이게
  const aiAcrostics: Acrostic[] = [];
  const aiStationIds = new Set(AI_ACROSTIC_SEEDS.map((s) => s.stationId));
  for (const stationId of aiStationIds) {
    const picked = pickAiAcrostic(stationId);
    if (picked) aiAcrostics.push(picked);
  }

  return [...userAcrostics, ...aiAcrostics];
}

/**
 * 한 역에 대한 모든 시 반환 (사용자 시 + AI 시 3개 컨셉)
 * 정렬: 사용자 시 → AI 사랑 → AI 철학 → AI 유머
 */
export async function getAcrosticsByStation(stationId: string): Promise<Acrostic[]> {
  const q = query(collection(db, COL), where("stationId", "==", stationId));
  const snapshot = await getDocs(q);
  const userAcrostics = snapshot.docs.map((d) => toAcrostic(d.id, d.data()));

  const aiAcrostics = allAiAcrosticsForStation(stationId);
  // AI 정렬: love → philosophy → humor
  const conceptOrder = { love: 0, philosophy: 1, humor: 2 };
  aiAcrostics.sort(
    (a, b) =>
      (conceptOrder[a.aiConcept ?? "love"] ?? 99) -
      (conceptOrder[b.aiConcept ?? "love"] ?? 99),
  );

  return [...userAcrostics, ...aiAcrostics];
}

/** 단일 시 반환 (호환용 - 사용자 우선, 없으면 AI 첫 번째) */
export async function getAcrosticByStation(
  stationId: string
): Promise<Acrostic | null> {
  const all = await getAcrosticsByStation(stationId);
  return all[0] ?? null;
}

/** 역에 대한 모든 AI 시 (3개 컨셉) 반환 - 상세 페이지에서 전체 보기용 */
export function getAllAiAcrosticsForStation(stationId: string): Acrostic[] {
  return allAiAcrosticsForStation(stationId);
}

export async function createAcrostic(
  stationId: string,
  lines: string[]
): Promise<Acrostic> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");
  const parsed = createAcrosticSchema.safeParse({ stationId, lines });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  // Firestore에서 직접 사용자 시 존재 여부 확인 (AI 시는 무시)
  const q = query(collection(db, COL), where("stationId", "==", stationId));
  const existingSnap = await getDocs(q);
  if (!existingSnap.empty) {
    throw new Error("이미 N행시가 등록된 역입니다");
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const acrostic: Acrostic = { _id: id, stationId, lines, createdAt: now, updatedAt: now };

  await setDoc(doc(db, COL, id), {
    stationId,
    lines,
    createdAt: now,
    updatedAt: now,
  });

  return acrostic;
}

export async function updateAcrostic(
  id: string,
  lines: string[]
): Promise<Acrostic> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");
  const parsed = updateAcrosticSchema.safeParse({ id, lines });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const now = new Date().toISOString();
  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("N행시를 찾을 수 없습니다");

  await setDoc(ref, { ...snap.data(), lines, updatedAt: now });
  return toAcrostic(id, { ...snap.data(), lines, updatedAt: now });
}

export async function deleteAcrostic(id: string): Promise<boolean> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");

  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("N행시를 찾을 수 없습니다.");

  await deleteDoc(ref);
  return true;
}
