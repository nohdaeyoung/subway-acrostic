"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { Station, City, Acrostic } from "@/types/subway";
import type { StationData } from "@/data/subway-types";
import { SEOUL_LINES, SEOUL_STATIONS, SEOUL_LINE_ROUTES } from "@/data/seoul-subway";
import { BUSAN_LINES, BUSAN_STATIONS, BUSAN_LINE_ROUTES } from "@/data/busan-subway";
import { getAcrosticsByStation, getAllAcrostics } from "@/lib/bkend";
import { isLoggedIn, clearToken } from "@/lib/auth";
import { toStation } from "@/lib/subway-utils";

export type ViewMode = "list" | "map";

export function useSubwayPageState() {
  const [city, setCity] = useState<City>("seoul");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [allAcrostics, setAllAcrostics] = useState<Acrostic[]>([]);
  const [acrosticStationIds, setAcrosticStationIds] = useState<Set<string>>(new Set());
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentAcrostics, setCurrentAcrostics] = useState<Acrostic[]>([]);
  const [loadingAcrostic, setLoadingAcrostic] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Build station data from local TS modules
  const { stations, lines, lineRoutes, stationDataMap } = useMemo(() => {
    const rawStations = city === "seoul" ? SEOUL_STATIONS : BUSAN_STATIONS;
    const lines = city === "seoul" ? SEOUL_LINES : BUSAN_LINES;
    const lineRoutes = city === "seoul" ? SEOUL_LINE_ROUTES : BUSAN_LINE_ROUTES;
    const stations = rawStations.map((sd) => toStation(sd, city));
    const stationDataMap = new Map<string, StationData>();
    for (const sd of rawStations) {
      stationDataMap.set(sd.id, sd);
    }
    return { stations, lines, lineRoutes, stationDataMap };
  }, [city]);

  // All stations (seoul + busan) for list view matching
  const allStations = useMemo(() => [
    ...SEOUL_STATIONS.map((sd) => toStation(sd, "seoul")),
    ...BUSAN_STATIONS.map((sd) => toStation(sd, "busan")),
  ], []);

  const loadAcrostics = useCallback(async () => {
    try {
      const acrostics = await getAllAcrostics();
      setAllAcrostics(acrostics);
      // 진행률/마커 하이라이트는 사용자 작성 시만 카운트 (관리자 모드 무관)
      const userWrittenIds = acrostics
        .filter((a) => !a.isAi)
        .map((a) => a.stationId);
      setAcrosticStationIds(new Set(userWrittenIds));
    } catch {
      setToast("저장 데이터를 불러오지 못했습니다");
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(""), 3000);
    }
  }, []);

  useEffect(() => { loadAcrostics(); }, [loadAcrostics]);
  useEffect(() => { setLoggedIn(isLoggedIn()); }, []);
  // W-17: 도시 전환 시 노선 선택 초기화 (미초기화 시 빈 지도 버그)
  useEffect(() => { setSelectedLine(null); }, [city]);

  const handleStationClick = useCallback(async (station: Station) => {
    if (station.city !== city) setCity(station.city);
    setSelectedStation(station);
    setLoadingAcrostic(true);
    try {
      const acrostics = await getAcrosticsByStation(station.id);
      setCurrentAcrostics(acrostics);
    } catch {
      setCurrentAcrostics([]);
    } finally {
      setLoadingAcrostic(false);
    }
  }, [city]);

  const handleCloseModal = useCallback(() => {
    setSelectedStation(null);
    setCurrentAcrostics([]);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setLoggedIn(true);
    setShowLogin(false);
    // 미입력 역 랜덤 팝업
    const missing = allStations.filter((s) => !acrosticStationIds.has(s.id));
    if (missing.length > 0) {
      const random = missing[Math.floor(Math.random() * missing.length)];
      handleStationClick(random);
    }
  }, [allStations, acrosticStationIds, handleStationClick]);

  const handleLogout = useCallback(() => {
    clearToken();
    setLoggedIn(false);
  }, []);

  const handleSaved = useCallback(() => {
    handleCloseModal();
    loadAcrostics();
    setToast("저장되었습니다");
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 2000);
  }, [handleCloseModal, loadAcrostics]);

  return {
    city, setCity,
    viewMode, setViewMode,
    selectedLine, setSelectedLine,
    stations, lines, lineRoutes, stationDataMap,
    allStations,
    allAcrostics, acrosticStationIds,
    selectedStation, currentAcrostics, loadingAcrostic,
    loggedIn,
    showLogin, setShowLogin,
    toast,
    handleStationClick,
    handleCloseModal,
    handleLoginSuccess,
    handleLogout,
    handleSaved,
  };
}
