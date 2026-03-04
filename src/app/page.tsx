"use client";

import { useState, useEffect, useMemo } from "react";
import SubwayMap from "@/components/SubwayMap";
import CityTabs from "@/components/CityTabs";
import AcrosticEditor from "@/components/AcrosticEditor";
import AcrosticList from "@/components/AcrosticList";
import LoginForm from "@/components/LoginForm";
import Toast from "@/components/Toast";
import { useSubwayPageState } from "@/hooks/useSubwayPageState";

function SunIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Home() {
  // Dark mode toggle
  const [isDark, setIsDark] = useState(false);
  const [lineDropOpen, setLineDropOpen] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  const {
    city, setCity,
    viewMode, setViewMode,
    selectedLine, setSelectedLine,
    stations, lines, lineRoutes, stationDataMap,
    allStations,
    allAcrostics, acrosticStationIds,
    selectedStation, currentAcrostic, loadingAcrostic,
    loggedIn,
    showLogin, setShowLogin,
    toast,
    handleStationClick,
    handleCloseModal,
    handleLoginSuccess,
    handleLogout,
    handleSaved,
  } = useSubwayPageState();

  // 선택된 호선 기준으로 사이드바 N행시 목록 필터링
  function handleRandomStation() {
    if (allStations.length === 0) return;
    const random = allStations[Math.floor(Math.random() * allStations.length)];
    handleStationClick(random);
  }

  // 노선별 N행시 작성 수
  const lineAcrosticCount = useMemo(() => {
    const acrosticIds = new Set(allAcrostics.map((a) => a.stationId));
    const countMap = new Map<string, number>();
    allStations
      .filter((s) => s.city === city && acrosticIds.has(s.id))
      .forEach((s) => {
        s.lines.forEach((lineId) => {
          countMap.set(lineId, (countMap.get(lineId) ?? 0) + 1);
        });
      });
    return countMap;
  }, [allAcrostics, allStations, city]);

  const listAcrostics = useMemo(() => {
    if (!selectedLine) return allAcrostics;
    const lineStationIds = new Set(
      allStations
        .filter((s) => s.city === city && s.lines.includes(selectedLine))
        .map((s) => s.id)
    );
    return allAcrostics.filter((a) => lineStationIds.has(a.stationId));
  }, [allAcrostics, allStations, selectedLine, city]);

  // Desktop line filter — flex-wrap (allows 2 rows when narrow)
  const lineFilterPills = (
    <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
      <button
        onClick={() => setSelectedLine(null)}
        aria-pressed={selectedLine === null}
        className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full transition-all shrink-0 font-medium ${
          selectedLine === null
            ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
      >
        전체
      </button>
      {Object.values(lines).map((line) => {
        const isActive = selectedLine === null || selectedLine === line.id;
        const count = lineAcrosticCount.get(line.id) ?? 0;
        return (
          <button
            key={line.id}
            onClick={() => setSelectedLine((prev) => (prev === line.id ? null : line.id))}
            aria-pressed={selectedLine === line.id}
            className={`flex items-center gap-1 text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full transition-all shrink-0 ${
              selectedLine === line.id
                ? "bg-gray-900 text-white font-medium dark:bg-gray-100 dark:text-gray-900"
                : isActive
                  ? "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  : "text-gray-300 hover:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-800"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: line.color, opacity: isActive ? 1 : 0.3 }}
            />
            {line.name}
            {count > 0 && (
              <span className={`${selectedLine === line.id ? "opacity-70" : "text-emerald-500"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <main className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-[0_1px_4px_rgba(0,0,0,0.05)] shrink-0">
        {/* Row 1: 서비스명 + 테마토글 + 관리자 */}
        <div className="flex items-center justify-between px-4 h-12">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">지하철 N행시</h1>
          <div className="flex items-center gap-1.5">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            {/* Admin */}
            {loggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">관리자</span>
                <a href="/admin" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">설정</a>
                <button onClick={handleLogout} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                관리자
              </button>
            )}
          </div>
        </div>
        {/* Row 2: CityTabs + 범례 */}
        <div className="flex items-center justify-between px-4 pb-2.5">
          <CityTabs activeCity={city} onChange={setCity} />
          <div className="flex gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              있음 ({acrosticStationIds.size})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 inline-block" />
              없음
            </span>
          </div>
        </div>
      </header>

      {/* Mobile only: ViewMode toggle */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
        <button
          onClick={() => setViewMode("list")}
          aria-pressed={viewMode === "list"}
          className={`px-3 py-1.5 text-sm rounded-xl transition-all ${
            viewMode === "list"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          목록
        </button>
        <button
          onClick={() => setViewMode("map")}
          aria-pressed={viewMode === "map"}
          className={`px-3 py-1.5 text-sm rounded-xl transition-all ${
            viewMode === "map"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          지도
        </button>
      </div>

      {/* Mobile only: line select (map mode) */}
      {viewMode === "map" && (
        <div className="md:hidden px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 relative z-20">
          {/* Trigger */}
          <button
            onClick={() => setLineDropOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          >
            <span className="flex items-center gap-2">
              {selectedLine ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lines[selectedLine]?.color }} />
                  <span className="font-medium">{lines[selectedLine]?.name}</span>
                </>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">전체 노선</span>
              )}
            </span>
            <svg
              aria-hidden="true"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${lineDropOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {/* Dropdown */}
          {lineDropOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setLineDropOpen(false)} />
              {/* Layer */}
              <div className="absolute left-4 right-4 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {/* 전체 노선 */}
                  <button
                    onClick={() => { setSelectedLine(null); setLineDropOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                      selectedLine === null
                        ? "bg-gray-50 dark:bg-gray-700 font-medium text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-500 shrink-0" />
                    전체 노선
                    {selectedLine === null && (
                      <svg aria-hidden="true" className="ml-auto w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                  {/* 각 노선 */}
                  {Object.values(lines).map((line) => {
                    const count = lineAcrosticCount.get(line.id) ?? 0;
                    return (
                      <button
                        key={line.id}
                        onClick={() => { setSelectedLine(line.id); setLineDropOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                          selectedLine === line.id
                            ? "bg-gray-50 dark:bg-gray-700 font-medium text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
                        <span className="flex-1">{line.name}</span>
                        {count > 0 && (
                          <span className="text-xs text-emerald-500 font-medium">{count}</span>
                        )}
                        {selectedLine === line.id && (
                          <svg aria-hidden="true" className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0">
        {/* Mobile: toggle */}
        <div className="md:hidden h-full">
          {viewMode === "list" ? (
            <AcrosticList
              acrostics={listAcrostics}
              stations={allStations}
              onStationClick={handleStationClick}
            />
          ) : (
            <div className="p-4 flex flex-col gap-3">
              <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
              <button
                onClick={handleRandomStation}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium transition-all"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8"/><polyline points="4 20 9 20 4 15"/>
                  <path d="M21 3l-7 7M3 21l7-7M21 16v5h-5M3 8V3h5"/>
                </svg>
                랜덤 쓰기
              </button>
            </div>
          )}
        </div>

        {/* Desktop: 2-column */}
        <div className="hidden md:flex h-full">
          <aside className="w-80 xl:w-96 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 shrink-0">
            <AcrosticList
              acrostics={listAcrostics}
              stations={allStations}
              onStationClick={handleStationClick}
            />
          </aside>
          <div className="flex-1 flex flex-col min-w-0">
            {lineFilterPills}
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
              <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
              <button
                onClick={handleRandomStation}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium transition-all shrink-0"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8"/><polyline points="4 20 9 20 4 15"/>
                  <path d="M21 3l-7 7M3 21l7-7M21 16v5h-5M3 8V3h5"/>
                </svg>
                랜덤 쓰기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — 2× height */}
      <footer className="flex items-center justify-center gap-4 px-4 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 text-xs text-gray-400 dark:text-gray-600">
        <span>© {new Date().getFullYear()} 지하철 N행시</span>
        <a href="/about" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">소개</a>
        <a href="/dev-note" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">개발 노트</a>
      </footer>

      {showLogin && !selectedStation && (
        <LoginForm onSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />
      )}
      {selectedStation && (
        <AcrosticEditor
          station={selectedStation}
          acrostic={currentAcrostic}
          loading={loadingAcrostic}
          loggedIn={loggedIn}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}
      {toast && <Toast message={toast} />}
    </main>
  );
}
