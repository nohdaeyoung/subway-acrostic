"use client";

import { useState, useEffect } from "react";
import type { TrainPosition, City } from "@/types/subway";

const POLL_INTERVAL = 15_000; // 15초

export function useTrainPositions(city: City, enabled: boolean) {
  const [trains, setTrains] = useState<TrainPosition[]>([]);

  useEffect(() => {
    if (!enabled || city !== "seoul") {
      setTrains([]);
      return;
    }

    async function fetchTrains() {
      try {
        const res = await fetch("/api/trains");
        if (!res.ok) return;
        const data: TrainPosition[] = await res.json();
        setTrains(data);
      } catch {
        // 에러 시 이전 데이터 유지
      }
    }

    fetchTrains();
    const id = setInterval(fetchTrains, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [city, enabled]);

  return { trains };
}
