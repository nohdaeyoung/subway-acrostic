"use client";

import { useState, useMemo } from "react";
import SubwayMap from "@/components/SubwayMap";
import CityTabs from "@/components/CityTabs";
import AcrosticEditor from "@/components/AcrosticEditor";
import AcrosticList from "@/components/AcrosticList";
import LoginForm from "@/components/LoginForm";
import Toast from "@/components/Toast";
import { useSubwayPageState } from "@/hooks/useSubwayPageState";
import { useTrainPositions } from "@/hooks/useTrainPositions";

export default function Home() {
  const [lineDropOpen, setLineDropOpen] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

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

  const { trains } = useTrainPositions(city, realtimeEnabled);

  // 전체 역 기준 진척도
  const totalWritten = acrosticStationIds.size;
  const progressPct = allStations.length > 0
    ? Math.round((totalWritten / allStations.length) * 100)
    : 0;

  // 랜덤 보기: N행시가 있는 역만
  function handleRandomView() {
    const withAcrostic = allStations.filter((s) => acrosticStationIds.has(s.id));
    if (withAcrostic.length === 0) return;
    const random = withAcrostic[Math.floor(Math.random() * withAcrostic.length)];
    handleStationClick(random);
  }

  // 랜덤 쓰기: N행시가 없는 역만
  function handleRandomStation() {
    const missing = allStations.filter((s) => !acrosticStationIds.has(s.id));
    if (missing.length === 0) return;
    const random = missing[Math.floor(Math.random() * missing.length)];
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

  // Desktop line filter pills
  const lineFilterPills = (
    <div className="flex flex-wrap items-center gap-1.5 px-5 py-2.5 shrink-0 relative" style={{ borderBottom: "1px solid var(--border-soft)" }}>
      <button
        onClick={() => setSelectedLine(null)}
        aria-pressed={selectedLine === null}
        className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full transition-all shrink-0 font-medium"
        style={{
          background: selectedLine === null ? "var(--bg-deep)" : "transparent",
          color: selectedLine === null ? "var(--bg-card)" : "var(--text-faded)",
        }}
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
            className="flex items-center gap-1 text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full transition-all shrink-0"
            style={{
              background: selectedLine === line.id ? "var(--bg-deep)" : "transparent",
              color: selectedLine === line.id ? "var(--bg-card)" : isActive ? "var(--text-body)" : "var(--text-ghost)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: line.color, opacity: isActive ? 1 : 0.3 }}
            />
            {line.name}
            {count > 0 && (
              <span style={{ color: selectedLine === line.id ? "var(--text-ghost)" : "var(--accent-vermillion)", opacity: 0.8 }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
      {/* 실시간 토글 */}
      <button
        onClick={() => setRealtimeEnabled((v) => !v)}
        disabled={city !== "seoul"}
        aria-pressed={realtimeEnabled}
        className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all shrink-0"
        style={{
          opacity: city !== "seoul" ? 0.4 : 1,
          cursor: city !== "seoul" ? "not-allowed" : "pointer",
          background: realtimeEnabled ? "var(--accent-vermillion)" : "transparent",
          color: realtimeEnabled ? "#fff" : "var(--text-faded)",
          borderColor: realtimeEnabled ? "var(--accent-vermillion)" : "var(--border-rule)",
        }}
      >
        {realtimeEnabled && (
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
        실시간
      </button>
    </div>
  );

  return (
    <main className="flex flex-col h-[100dvh] bg-paper">
      {/* ─── Header ─── */}
      <header className="shrink-0" style={{ borderBottom: "1px solid var(--border-rule)" }}>
        {/* Row 1: 타이틀 + 관리자 */}
        <div className="flex items-center justify-between px-5 h-14">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-xl tracking-tight" style={{ color: "var(--text-ink)", fontWeight: 800 }}>
              지하철 N행시
            </h1>
            <span className="hidden sm:inline text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--text-ghost)", fontFamily: "var(--font-serif)" }}>
              驛에서 쓰다
            </span>
          </div>
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <>
                <span className="text-xs font-medium stamp-accent">관리자</span>
                <a href="/admin" className="text-xs transition-colors" style={{ color: "var(--text-faded)" }}>설정</a>
                <button onClick={handleLogout} className="text-xs transition-colors" style={{ color: "var(--text-faded)" }}>
                  로그아웃
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs transition-colors"
                style={{ color: "var(--text-ghost)" }}
              >
                관리자
              </button>
            )}
          </div>
        </div>

        {/* Row 2: 도시 + 진척도 */}
        <div className="flex items-center justify-between px-5 pb-3">
          <CityTabs activeCity={city} onChange={setCity} />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-faded)" }}>
              <span className="font-serif" style={{ color: "var(--accent-vermillion)", fontWeight: 700 }}>
                {totalWritten}
              </span>
              <span>/</span>
              <span>{allStations.length}역</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="progress-track w-16 h-1.5">
                <div className="progress-fill h-full" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-[11px] font-medium" style={{ color: "var(--accent-vermillion)" }}>
                {progressPct}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile: 뷰 모드 토글 ─── */}
      <div className="md:hidden flex items-center gap-1 px-5 py-2 shrink-0" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-soft)" }}>
        <button
          onClick={() => setViewMode("list")}
          aria-pressed={viewMode === "list"}
          className="px-3 py-1.5 text-sm rounded-lg transition-all font-serif"
          style={{
            background: viewMode === "list" ? "var(--bg-deep)" : "transparent",
            color: viewMode === "list" ? "var(--bg-card)" : "var(--text-faded)",
            fontWeight: viewMode === "list" ? 700 : 400,
          }}
        >
          시집
        </button>
        <button
          onClick={() => setViewMode("map")}
          aria-pressed={viewMode === "map"}
          className="px-3 py-1.5 text-sm rounded-lg transition-all font-serif"
          style={{
            background: viewMode === "map" ? "var(--bg-deep)" : "transparent",
            color: viewMode === "map" ? "var(--bg-card)" : "var(--text-faded)",
            fontWeight: viewMode === "map" ? 700 : 400,
          }}
        >
          노선도
        </button>
      </div>

      {/* ─── Mobile: 노선 선택 (지도 모드) ─── */}
      {viewMode === "map" && (
        <div className="md:hidden px-5 py-2 shrink-0 relative z-20" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-soft)" }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLineDropOpen((v) => !v)}
              className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ border: "1px solid var(--border-rule)", background: "var(--bg-card)", color: "var(--text-body)" }}
            >
              <span className="flex items-center gap-2">
                {selectedLine ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lines[selectedLine]?.color }} />
                    <span className="font-medium">{lines[selectedLine]?.name}</span>
                  </>
                ) : (
                  <span style={{ color: "var(--text-faded)" }}>전체 노선</span>
                )}
              </span>
              <svg
                aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`shrink-0 transition-transform duration-200 ${lineDropOpen ? "rotate-180" : ""}`}
                style={{ color: "var(--text-ghost)" }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {lineDropOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLineDropOpen(false)} />
                <div className="absolute left-5 right-5 top-full mt-1 z-20 rounded-xl shadow-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-rule)" }}>
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedLine(null); setLineDropOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                      style={{
                        background: selectedLine === null ? "var(--bg-paper)" : "transparent",
                        color: selectedLine === null ? "var(--text-ink)" : "var(--text-body)",
                        fontWeight: selectedLine === null ? 600 : 400,
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "var(--text-ghost)" }} />
                      전체 노선
                      {selectedLine === null && (
                        <svg aria-hidden="true" className="ml-auto w-4 h-4" style={{ color: "var(--accent-vermillion)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                    {Object.values(lines).map((line) => {
                      const count = lineAcrosticCount.get(line.id) ?? 0;
                      return (
                        <button
                          key={line.id}
                          onClick={() => { setSelectedLine(line.id); setLineDropOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                          style={{
                            background: selectedLine === line.id ? "var(--bg-paper)" : "transparent",
                            color: selectedLine === line.id ? "var(--text-ink)" : "var(--text-body)",
                            fontWeight: selectedLine === line.id ? 600 : 400,
                          }}
                        >
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
                          <span className="flex-1">{line.name}</span>
                          {count > 0 && (
                            <span className="text-xs font-medium" style={{ color: "var(--accent-vermillion)" }}>{count}</span>
                          )}
                          {selectedLine === line.id && (
                            <svg aria-hidden="true" className="w-4 h-4" style={{ color: "var(--accent-vermillion)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

            {/* 모바일 실시간 토글 */}
            <button
              onClick={() => setRealtimeEnabled((v) => !v)}
              disabled={city !== "seoul"}
              aria-pressed={realtimeEnabled}
              className="flex items-center gap-1 text-xs px-2.5 py-2 rounded-lg border transition-all shrink-0"
              style={{
                opacity: city !== "seoul" ? 0.4 : 1,
                cursor: city !== "seoul" ? "not-allowed" : "pointer",
                background: realtimeEnabled ? "var(--accent-vermillion)" : "transparent",
                color: realtimeEnabled ? "#fff" : "var(--text-faded)",
                borderColor: realtimeEnabled ? "var(--accent-vermillion)" : "var(--border-rule)",
              }}
            >
              {realtimeEnabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
              실시간
            </button>
          </div>
        </div>
      )}

      {/* ─── Content ─── */}
      <div className="flex-1 min-h-0">
        {/* Mobile */}
        <div className="md:hidden h-full">
          {viewMode === "list" ? (
            <AcrosticList
              acrostics={listAcrostics}
              stations={allStations}
              onStationClick={handleStationClick}
            />
          ) : (
            <div className="p-4 flex flex-col gap-3">
              <div className="w-full aspect-[3/2] rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-rule)" }}>
                <SubwayMap
                  city={city}
                  stations={stations}
                  lines={lines}
                  lineRoutes={lineRoutes}
                  stationDataMap={stationDataMap}
                  acrosticStationIds={acrosticStationIds}
                  selectedLine={selectedLine}
                  onStationClick={handleStationClick}
                  trainPositions={trains}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRandomView}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-serif transition-all active:scale-[0.98]"
                  style={{ background: "var(--bg-deep)", color: "var(--bg-card)", fontWeight: 700 }}
                >
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/><polyline points="4 20 9 20 4 15"/>
                    <path d="M21 3l-7 7M3 21l7-7M21 16v5h-5M3 8V3h5"/>
                  </svg>
                  랜덤 감상
                </button>
                <button
                  onClick={handleRandomStation}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-serif transition-all active:scale-[0.98]"
                  style={{ background: "var(--accent-vermillion)", color: "#fff", fontWeight: 700 }}
                >
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.855z"/>
                  </svg>
                  랜덤 집필
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: 2-column */}
        <div className="hidden md:flex h-full">
          <aside className="w-80 xl:w-96 flex flex-col shrink-0" style={{ borderRight: "1px solid var(--border-rule)", background: "var(--bg-card)" }}>
            <AcrosticList
              acrostics={listAcrostics}
              stations={allStations}
              onStationClick={handleStationClick}
            />
          </aside>
          <div className="flex-1 flex flex-col min-w-0" style={{ background: "var(--bg-paper)" }}>
            {lineFilterPills}
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
              <div className="w-full aspect-[3/2] rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-rule)" }}>
                <SubwayMap
                  city={city}
                  stations={stations}
                  lines={lines}
                  lineRoutes={lineRoutes}
                  stationDataMap={stationDataMap}
                  acrosticStationIds={acrosticStationIds}
                  selectedLine={selectedLine}
                  onStationClick={handleStationClick}
                  trainPositions={trains}
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleRandomView}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-serif transition-all active:scale-[0.98]"
                  style={{ background: "var(--bg-deep)", color: "var(--bg-card)", fontWeight: 700 }}
                >
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/><polyline points="4 20 9 20 4 15"/>
                    <path d="M21 3l-7 7M3 21l7-7M21 16v5h-5M3 8V3h5"/>
                  </svg>
                  랜덤 감상
                </button>
                <button
                  onClick={handleRandomStation}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-serif transition-all active:scale-[0.98]"
                  style={{ background: "var(--accent-vermillion)", color: "#fff", fontWeight: 700 }}
                >
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.855z"/>
                  </svg>
                  랜덤 집필
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-center gap-4 px-5 py-4 shrink-0 text-xs" style={{ borderTop: "1px solid var(--border-rule)", background: "var(--bg-card)", color: "var(--text-ghost)" }}>
        <span className="font-serif">© {new Date().getFullYear()} 지하철 N행시</span>
        <span style={{ color: "var(--border-rule)" }}>·</span>
        <a href="/about" className="transition-colors hover:opacity-70">소개</a>
        <span style={{ color: "var(--border-rule)" }}>·</span>
        <a href="/dev-note" className="transition-colors hover:opacity-70">개발 노트</a>
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
          onRandomView={handleRandomView}
        />
      )}
      {toast && <Toast message={toast} />}
    </main>
  );
}
