"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Station, City, Acrostic } from "@/types/subway";
import { getAcrosticByStation, getAllAcrostics } from "@/lib/bkend";
import { isLoggedIn, clearToken } from "@/lib/auth";
import SubwayMap from "@/components/SubwayMap";
import CityTabs from "@/components/CityTabs";
import AcrosticEditor from "@/components/AcrosticEditor";
import LoginForm from "@/components/LoginForm";
import { SEOUL_LINES, SEOUL_STATIONS, SEOUL_LINE_ROUTES } from "@/data/seoul-subway";
import { BUSAN_LINES, BUSAN_STATIONS, BUSAN_LINE_ROUTES } from "@/data/busan-subway";
import type { StationData } from "@/data/seoul-subway";

function toStation(sd: StationData, city: City): Station {
  return { id: sd.id, name: sd.name, city, lines: sd.lines, lat: sd.lat, lng: sd.lng };
}

export default function Home() {
  const [city, setCity] = useState<City>("seoul");
  const [acrosticStationIds, setAcrosticStationIds] = useState<Set<string>>(new Set());
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentAcrostic, setCurrentAcrostic] = useState<Acrostic | null>(null);
  const [loadingAcrostic, setLoadingAcrostic] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

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

  // Load which stations have acrostics
  const loadAcrosticIds = useCallback(() => {
    getAllAcrostics().then((acrostics) => {
      setAcrosticStationIds(new Set(acrostics.map((a) => a.stationId)));
    });
  }, []);

  useEffect(() => {
    loadAcrosticIds();
  }, [loadAcrosticIds]);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  async function handleStationClick(station: Station) {
    setSelectedStation(station);
    setLoadingAcrostic(true);
    const acrostic = await getAcrosticByStation(station.id);
    setCurrentAcrostic(acrostic);
    setLoadingAcrostic(false);
  }

  function handleCloseModal() {
    setSelectedStation(null);
    setCurrentAcrostic(null);
  }

  function handleLoginSuccess() {
    setLoggedIn(true);
    setShowLogin(false);
  }

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
  }

  function handleSaved() {
    handleCloseModal();
    loadAcrosticIds();
  }

  return (
    <main className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900">지하철 N행시</h1>
          <CityTabs activeCity={city} onChange={setCity} />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              N행시 있음
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white border border-gray-300 inline-block" />
              N행시 없음
            </span>
          </div>
          {loggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-medium">관리자</span>
              <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-gray-700">
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              관리자
            </button>
          )}
        </div>
      </header>

      {/* Line Legend - Desktop: wrap buttons, Mobile: select box */}
      {/* Mobile select */}
      <div className="md:hidden px-4 py-2 border-b border-gray-100 shrink-0">
        <select
          value={selectedLine ?? ""}
          onChange={(e) => setSelectedLine(e.target.value || null)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="">전체 노선</option>
          {Object.values(lines).map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>
      {/* Desktop buttons */}
      <div className="hidden md:flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-100 shrink-0">
        {Object.values(lines).map((line) => {
          const isActive = selectedLine === null || selectedLine === line.id;
          return (
            <button
              key={line.id}
              onClick={() => setSelectedLine(prev => prev === line.id ? null : line.id)}
              className={`flex items-center gap-1 text-[11px] whitespace-nowrap px-2 py-1 rounded-full transition-all ${
                selectedLine === line.id
                  ? "bg-gray-900 text-white font-medium"
                  : isActive
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-100"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full inline-block shrink-0"
                style={{ backgroundColor: line.color, opacity: isActive ? 1 : 0.3 }}
              />
              {line.name}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="flex-1 min-h-0">
        <SubwayMap
          city={city}
          stations={stations}
          lines={lines}
          lineRoutes={lineRoutes}
          stationDataMap={stationDataMap}
          acrosticStationIds={acrosticStationIds}
          selectedLine={selectedLine}
          onStationClick={handleStationClick}
        />
      </div>

      {/* Modals */}
      {showLogin && (
        <LoginForm onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />
      )}

      {selectedStation && (
        <AcrosticEditor
          station={selectedStation}
          acrostic={loadingAcrostic ? null : currentAcrostic}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}
