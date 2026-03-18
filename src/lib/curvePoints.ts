import type { CurvePoint } from "@/types/subway";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const COL = "curvePoints";

function toCurvePoint(id: string, data: Record<string, unknown>): CurvePoint {
  return {
    id,
    lineId: data.lineId as string,
    segmentIndex: data.segmentIndex as number,
    fromStationId: data.fromStationId as string,
    toStationId: data.toStationId as string,
    controlLat: data.controlLat as number,
    controlLng: data.controlLng as number,
  };
}

/** 모든 곡선 포인트 로드 */
export async function getAllCurvePoints(): Promise<CurvePoint[]> {
  const snapshot = await getDocs(collection(db, COL));
  return snapshot.docs.map((d) => toCurvePoint(d.id, d.data()));
}

/** 곡선 포인트 저장 (upsert) */
export async function saveCurvePoint(cp: CurvePoint): Promise<void> {
  const { id, ...data } = cp;
  await setDoc(doc(db, COL, id), data);
}

/** 곡선 포인트 삭제 */
export async function deleteCurvePoint(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

/** 곡선 포인트 키 생성 */
export function curvePointKey(
  lineId: string,
  segmentIndex: number,
  fromStationId: string,
  toStationId: string,
): string {
  return `${lineId}_${segmentIndex}_${fromStationId}_${toStationId}`;
}
