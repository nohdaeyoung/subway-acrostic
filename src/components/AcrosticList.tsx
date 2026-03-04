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
          // 북→남(lat 내림차순), 동위도면 서→동(lng 오름차순)
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
      {/* Search input */}
      <div className="shrink-0 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="역 이름으로 검색"
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
          />
          {trimmed && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full"
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
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600">
          <svg aria-hidden="true" className="w-10 h-10 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"
              d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
          </svg>
          <span className="text-sm">
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
              <div key={lineKey} className="mb-4">
                {/* Line header */}
                <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lineColor }}
                  />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {lineName}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 ml-auto">
                    {lineItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-3 px-4 py-3">
                  {lineItems.map(({ acrostic, station }) => {
                    const chars = station.name.split("");
                    return (
                      <button
                        key={acrostic._id}
                        onClick={() => onStationClick(station)}
                        className="text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-none dark:ring-1 dark:ring-white/8 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:hover:ring-white/16 hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: lineColor }}
                          />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {stationLabel(station.name)}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {chars.map((char, i) => (
                            <div key={`${acrostic._id}-${i}`} className="flex items-start gap-2">
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs shrink-0 mt-0.5"
                                style={{
                                  backgroundColor: `${lineColor}22`,
                                  color: lineColor,
                                }}
                              >
                                {char}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                                {acrostic.lines[i] || ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
