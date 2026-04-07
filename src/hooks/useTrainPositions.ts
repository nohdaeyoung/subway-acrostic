"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TrainPosition, City } from "@/types/subway";

const POLL_INTERVAL = 15_000; // 15초마다 API 폴링
const TICK_INTERVAL = 1_000;  // 1초마다 위치 업데이트

// 상태별 예상 소요 시간 (ms)
const DURATION: Record<number, number> = {
  0: 30_000,  // 진입: 이전역→현재역 마지막 구간 (~30초)
  1: 30_000,  // 도착: 정차 중 (~30초, 다음 상태까지 대기)
  2: 120_000, // 출발: 현재역→다음역 전체 구간 (~2분)
};

interface AnimState {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  startedAt: number;   // 이 상태가 시작된 시각 (Date.now)
  duration: number;    // 예상 소요 시간 (ms)
  trainSttus: 0 | 1 | 2;
  // 원본 필드
  trainNo: string;
  lineId: string;
  statnNm: string;
  stationId: string;
  direction: "up" | "down";
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** 애니메이션 상태에서 현재 시각 기준 보간 좌표 계산 */
function computePosition(state: AnimState, now: number): TrainPosition {
  let progress: number;
  if (state.trainSttus === 1) {
    // 도착: 역에 정차 중, 움직이지 않음
    progress = 1;
  } else {
    const elapsed = now - state.startedAt;
    progress = Math.min(Math.max(elapsed / state.duration, 0), 1);
  }

  return {
    trainNo: state.trainNo,
    lineId: state.lineId,
    statnNm: state.statnNm,
    stationId: state.stationId,
    lat: lerp(state.fromLat, state.toLat, progress),
    lng: lerp(state.fromLng, state.toLng, progress),
    direction: state.direction,
    trainSttus: state.trainSttus,
    fromLat: state.fromLat,
    fromLng: state.fromLng,
    toLat: state.toLat,
    toLng: state.toLng,
  };
}

export function useTrainPositions(city: City, enabled: boolean) {
  const [trains, setTrains] = useState<TrainPosition[]>([]);
  const animStates = useRef<Map<string, AnimState>>(new Map());
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

  /** 두 좌표 사이의 거리 (대략적 유클리드) */
  const dist = (lat1: number, lng1: number, lat2: number, lng2: number) =>
    Math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2);

  // API 데이터를 애니메이션 상태에 반영
  const mergeApiData = useCallback((apiTrains: TrainPosition[]) => {
    const now = Date.now();
    const seen = new Set<string>();

    for (const t of apiTrains) {
      const key = `${t.trainNo}-${t.lineId}`;
      seen.add(key);

      const existing = animStates.current.get(key);

      // 상태가 바뀌었거나 역이 바뀌었으면 전환
      const changed =
        !existing ||
        existing.trainSttus !== t.trainSttus ||
        existing.statnNm !== t.statnNm;

      if (changed && existing) {
        // 현재 렌더링 위치 계산 (점프 방지)
        const elapsed = now - existing.startedAt;
        const progress = existing.trainSttus === 1
          ? 1
          : Math.min(Math.max(elapsed / existing.duration, 0), 1);
        const curLat = lerp(existing.fromLat, existing.toLat, progress);
        const curLng = lerp(existing.fromLng, existing.toLng, progress);

        // 현재 위치 → 새 목표까지 남은 거리 기반으로 duration 조정
        const totalDist = dist(t.fromLat, t.fromLng, t.toLat, t.toLng);
        const remainDist = dist(curLat, curLng, t.toLat, t.toLng);
        const baseDuration = DURATION[t.trainSttus] ?? 120_000;
        const adjDuration = totalDist > 0
          ? baseDuration * (remainDist / totalDist)
          : baseDuration;

        animStates.current.set(key, {
          fromLat: curLat,   // 현재 위치에서 이어서 시작
          fromLng: curLng,
          toLat: t.toLat,
          toLng: t.toLng,
          startedAt: now,
          duration: Math.max(adjDuration, 3_000), // 최소 3초
          trainSttus: t.trainSttus,
          trainNo: t.trainNo,
          lineId: t.lineId,
          statnNm: t.statnNm,
          stationId: t.stationId,
          direction: t.direction,
        });
      } else if (!existing) {
        // 새 열차: API 제공 좌표로 시작
        animStates.current.set(key, {
          fromLat: t.fromLat,
          fromLng: t.fromLng,
          toLat: t.toLat,
          toLng: t.toLng,
          startedAt: now,
          duration: DURATION[t.trainSttus] ?? 120_000,
          trainSttus: t.trainSttus,
          trainNo: t.trainNo,
          lineId: t.lineId,
          statnNm: t.statnNm,
          stationId: t.stationId,
          direction: t.direction,
        });
      }
      // 같은 상태+같은 역이면 기존 애니메이션 ��지
    }

    // API에서 사라진 열차 제거
    for (const key of animStates.current.keys()) {
      if (!seen.has(key)) {
        animStates.current.delete(key);
      }
    }
  }, []);

  // 매초 위치 업데이트
  const tick = useCallback(() => {
    const now = Date.now();
    const positions: TrainPosition[] = [];
    for (const state of animStates.current.values()) {
      positions.push(computePosition(state, now));
    }
    setTrains(positions);
  }, []);

  useEffect(() => {
    if (!enabled || city !== "seoul") {
      setTrains([]);
      animStates.current.clear();
      return;
    }

    async function fetchTrains() {
      try {
        const res = await fetch(`/api/trains?t=${Date.now()}`);
        if (!res.ok) return;
        const data: TrainPosition[] = await res.json();
        mergeApiData(data);
        tick(); // 즉시 반영
      } catch {
        // 에러 시 기존 애니메이션 유지
      }
    }

    // 초기 fetch
    fetchTrains();

    // 15초마다 API 폴링
    pollRef.current = setInterval(fetchTrains, POLL_INTERVAL);

    // 1초마다 위치 보간
    tickRef.current = setInterval(tick, TICK_INTERVAL);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(tickRef.current);
      animStates.current.clear();
    };
  }, [city, enabled, mergeApiData, tick]);

  return { trains };
}
