"use client";

import type { Station } from "@/types/subway";

interface StationDotProps {
  station: Station;
  hasAcrostic: boolean;
  onClick: (station: Station) => void;
}

export default function StationDot({
  station,
  hasAcrostic,
  onClick,
}: StationDotProps) {
  return (
    <button
      onClick={() => onClick(station)}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      title={station.name}
    >
      <span
        className={`block w-3 h-3 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-150 ${
          hasAcrostic ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />
      <span className="absolute left-1/2 -translate-x-1/2 top-4 text-[10px] font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 px-1 rounded">
        {station.name}
      </span>
    </button>
  );
}
