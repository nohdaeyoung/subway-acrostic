"use client";

import { useState, useEffect, useCallback } from "react";
import type { CurvePoint } from "@/types/subway";
import {
  getAllCurvePoints,
  saveCurvePoint,
  deleteCurvePoint,
  curvePointKey,
} from "@/lib/curvePoints";

export function useCurvePoints(enabled = false) {
  const [curvePoints, setCurvePoints] = useState<Map<string, CurvePoint>>(
    new Map(),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    getAllCurvePoints()
      .then((pts) => {
        const map = new Map<string, CurvePoint>();
        for (const cp of pts) {
          const key = curvePointKey(
            cp.lineId,
            cp.segmentIndex,
            cp.fromStationId,
            cp.toStationId,
          );
          map.set(key, cp);
        }
        setCurvePoints(map);
      })
      .catch((err) => {
        console.error("[curvePoints] load failed:", err);
      })
      .finally(() => setLoading(false));
  }, [enabled]);

  const upsert = useCallback((cp: CurvePoint) => {
    const key = curvePointKey(
      cp.lineId,
      cp.segmentIndex,
      cp.fromStationId,
      cp.toStationId,
    );
    // Optimistic update — 즉시 UI 반영
    setCurvePoints((prev) => {
      const next = new Map(prev);
      next.set(key, cp);
      return next;
    });
    // Firebase 비동기 저장 (실패해도 UI는 유지)
    saveCurvePoint(cp).catch((err) => {
      console.error("[curvePoints] save failed:", err);
    });
  }, []);

  const remove = useCallback((cp: CurvePoint) => {
    const key = curvePointKey(
      cp.lineId,
      cp.segmentIndex,
      cp.fromStationId,
      cp.toStationId,
    );
    // Optimistic update
    setCurvePoints((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
    deleteCurvePoint(cp.id).catch((err) => {
      console.error("[curvePoints] delete failed:", err);
    });
  }, []);

  return { curvePoints, loading, upsert, remove };
}
