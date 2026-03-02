"use client";

import { useState, useEffect, useCallback } from "react";
import type { Station, City, Acrostic } from "@/types/subway";
import { getAcrosticByStation, getAllAcrostics } from "@/lib/bkend";
import { isLoggedIn, clearToken } from "@/lib/auth";
import SubwayMap from "@/components/SubwayMap";
import CityTabs from "@/components/CityTabs";
import AcrosticModal from "@/components/AcrosticModal";
import AcrosticEditor from "@/components/AcrosticEditor";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const [city, setCity] = useState<City>("seoul");
  const [stations, setStations] = useState<Station[]>([]);
  const [acrosticStationIds, setAcrosticStationIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentAcrostic, setCurrentAcrostic] = useState<Acrostic | null>(
    null
  );
  const [loadingAcrostic, setLoadingAcrostic] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editing, setEditing] = useState(false);

  // Load stations for current city
  useEffect(() => {
    fetch(`/data/${city}-stations.json`)
      .then((res) => res.json())
      .then((data: Station[]) => setStations(data))
      .catch(() => setStations([]));
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

  // Check login status
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  async function handleStationClick(station: Station) {
    setSelectedStation(station);
    setEditing(false);
    setLoadingAcrostic(true);
    const acrostic = await getAcrosticByStation(station.id);
    setCurrentAcrostic(acrostic);
    setLoadingAcrostic(false);
  }

  function handleCloseModal() {
    setSelectedStation(null);
    setCurrentAcrostic(null);
    setEditing(false);
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
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              지하철 N행시
            </h1>
            <CityTabs activeCity={city} onChange={setCity} />
          </div>
          <div>
            {loggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-600 font-medium">
                  관리자
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                관리자 로그인
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            N행시 있음
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            N행시 없음
          </span>
        </div>

        {/* Map */}
        <SubwayMap
          city={city}
          stations={stations}
          acrosticStationIds={acrosticStationIds}
          onStationClick={handleStationClick}
        />

        {/* Station list for accessibility */}
        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            역 목록 ({stations.length}개)
          </h2>
          <div className="flex flex-wrap gap-2">
            {stations.map((station) => (
              <button
                key={station.id}
                onClick={() => handleStationClick(station)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  acrosticStationIds.has(station.id)
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {station.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLogin && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onCancel={() => setShowLogin(false)}
        />
      )}

      {selectedStation && !editing && (
        <AcrosticModal
          station={selectedStation}
          acrostic={currentAcrostic}
          loading={loadingAcrostic}
          onClose={handleCloseModal}
        />
      )}

      {selectedStation && editing && (
        <AcrosticEditor
          station={selectedStation}
          acrostic={currentAcrostic}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}

      {/* Edit button - shown when logged in and viewing modal */}
      {selectedStation && !editing && loggedIn && !loadingAcrostic && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2 bg-emerald-600 text-white text-sm rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
          >
            {currentAcrostic ? "수정하기" : "N행시 작성하기"}
          </button>
        </div>
      )}
    </main>
  );
}
