import type { Acrostic } from "@/types/subway";
import { isLoggedIn } from "@/lib/auth";
import { createAcrosticSchema, updateAcrosticSchema } from "@/lib/acrostic-schema";
import { db } from "@/lib/firebase";
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
  };
}

export async function getAllAcrostics(): Promise<Acrostic[]> {
  const snapshot = await getDocs(collection(db, COL));
  return snapshot.docs.map((d) => toAcrostic(d.id, d.data()));
}

export async function getAcrosticByStation(
  stationId: string
): Promise<Acrostic | null> {
  const q = query(
    collection(db, COL),
    where("stationId", "==", stationId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const d = snapshot.docs[0];
    return toAcrostic(d.id, d.data());
  }
  return null;
}

export async function createAcrostic(
  stationId: string,
  lines: string[]
): Promise<Acrostic> {
  if (!isLoggedIn()) throw new Error("인증이 필요합니다.");
  const parsed = createAcrosticSchema.safeParse({ stationId, lines });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const existing = await getAcrosticByStation(stationId);
  if (existing) {
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
