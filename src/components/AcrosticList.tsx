"use client";

import { useState, useMemo } from "react";
import type { Station, Acrostic } from "@/types/subway";
import { SEOUL_LINES } from "@/data/seoul-subway";
import { BUSAN_LINES } from "@/data/busan-subway";
import { SEOUL_LINE_ORDER, BUSAN_LINE_ORDER } from "@/data/line-order";
import { stationLabel } from "@/lib/subway-utils";

const ALL_LINES: Record<string, { id: string; name: string; color: string }> = {
  ...SEOUL_LINES,
  ...Object.fromEntries(
    Object.entries(BUSAN_LINES).map(([k, v]) => [`busan-${k}`, v])
  ),
  donghae: BUSAN_LINES.donghae,
};

interface AcrosticListProps {
  acrostics: Acrostic[];
  stations: Station[];
  onStationClick: (station: Station) => void;
}

interface GroupedItem {
  acrostic: Acrostic;
  station: Station;
}

export default function AcrosticList({
  acrostics,
  stations,
  onStationClick,
}: AcrosticListProps) {
  const [query, setQuery] = useState("");

  const stationMap = useMemo(
    () => new Map(stations.map((s) => [s.id, s])),
    [stations]
  );

  const items: GroupedItem[] = useMemo(
    () =>
      acrostics
        .map((a) => ({ acrostic: a, station: stationMap.get(a.stationId) }))
        .filter((item): item is GroupedItem => item.station !== undefined)
        .sort((a, b) => {
          if (b.station.lat !== a.station.lat) return b.station.lat - a.station.lat;
          return a.station.lng - b.station.lng;
        }),
    [acrostics, stationMap]
  );

  const trimmed = query.trim();
  const filteredItems = useMemo(
    () => (trimmed ? items.filter((i) => i.station.name.includes(trimmed)) : items),
    [items, trimmed]
  );

  // Group by primary line
  const groups = new Map<string, GroupedItem[]>();
  for (const item of filteredItems) {
    const primaryLine = item.station.lines[0];
    const lineKey =
      item.station.city === "busan" && !["donghae"].includes(primaryLine)
        ? `busan-${primaryLine}`
        : primaryLine;
    if (!groups.has(lineKey)) groups.set(lineKey, []);
    groups.get(lineKey)!.push(item);
  }

  const seoulKeys = SEOUL_LINE_ORDER.filter((k) => groups.has(k));
  const busanKeys = BUSAN_LINE_ORDER.map((k) =>
    k === "donghae" ? "donghae" : `busan-${k}`
  ).filter((k) => groups.has(k));
  const otherKeys = [...groups.keys()].filter(
    (k) => !seoulKeys.includes(k) && !busanKeys.includes(k)
  );
  const orderedKeys = [...seoulKeys, ...busanKeys, ...otherKeys];

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="shrink-0 px-5 py-3" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-ghost)" }}
            aria-hidden="true" fill="none" viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
              d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="역 이름으로 검색"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 transition-shadow"
            style={{
              background: "var(--bg-paper)",
              color: "var(--text-ink)",
              border: "1px solid var(--border-rule)",
              // focus ring handled by Tailwind
            }}
          />
          {trimmed && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full"
              style={{ color: "var(--text-ghost)" }}
              aria-label="검색 초기화"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: "var(--text-ghost)" }}>
          <span className="font-serif text-3xl" style={{ color: "var(--border-rule)" }}>詩</span>
          <span className="text-sm font-serif">
            {trimmed ? `"${trimmed}" 검색 결과 없음` : "아직 N행시가 없습니다"}
          </span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {orderedKeys.map((lineKey) => {
            const lineItems = groups.get(lineKey)!;
            const lineInfo = ALL_LINES[lineKey];
            const lineName = lineInfo?.name ?? lineKey;
            const lineColor = lineInfo?.color ?? "#888";

            return (
              <div key={lineKey} className="mb-2">
                {/* Line header */}
                <div
                  className="sticky top-0 z-10 flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm"
                  style={{ background: "rgba(250, 247, 242, 0.88)", borderBottom: "1px solid var(--border-soft)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: lineColor }}
                  />
                  <span className="text-[11px] font-medium tracking-[0.05em]" style={{ color: "var(--text-body)" }}>
                    {lineName}
                  </span>
                  <span className="text-[11px] ml-auto" style={{ color: "var(--text-ghost)" }}>
                    {lineItems.filter((it) => !it.acrostic.isAi).length}편
                  </span>
                </div>

                {/* Compact rows */}
                {lineItems.map(({ acrostic, station }) => (
                  <button
                    key={acrostic._id}
                    onClick={() => onStationClick(station)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 active:scale-[0.99]"
                    style={{ borderBottom: "1px solid var(--border-soft)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-paper)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span
                      className="w-0.5 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: lineColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif font-bold leading-tight flex items-center gap-1.5" style={{ color: "var(--text-ink)" }}>
                        <span>{stationLabel(station.name)}</span>
                        {acrostic.isAi && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                            style={{
                              background: "rgba(232, 93, 4, 0.08)",
                              color: "var(--accent-vermillion)",
                              border: "1px solid rgba(232, 93, 4, 0.2)",
                              fontWeight: 600,
                              letterSpacing: "0.02em",
                            }}
                          >
                            ✨ AI
                            {acrostic.aiConcept === "love" && " ❤️"}
                            {acrostic.aiConcept === "philosophy" && " 🧠"}
                            {acrostic.aiConcept === "humor" && " 😄"}
                          </span>
                        )}
                      </p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-faded)" }}>
                        <span className="font-serif font-bold" style={{ color: "var(--accent-vermillion)" }}>
                          {station.name[0]}
                        </span>
                        {" "}
                        {acrostic.lines[0] || ""}
                      </p>
                    </div>
                    <svg
                      aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0" style={{ color: "var(--text-ghost)" }}
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
