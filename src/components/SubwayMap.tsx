"use client";

import type { Station, City } from "@/types/subway";
import StationDot from "./StationDot";

interface SubwayMapProps {
  city: City;
  stations: Station[];
  acrosticStationIds: Set<string>;
  onStationClick: (station: Station) => void;
}

const VIEWBOX = "0 0 100 100";

const LINE_STYLE = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  strokeWidth: "1.2",
};

function SeoulSubwaySVG() {
  return (
    <svg
      viewBox={VIEWBOX}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="grid-seoul" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid-seoul)" />

      {/* Line 1 - Dark Blue */}
      <polyline
        {...LINE_STYLE}
        stroke="#003499"
        strokeWidth="1.4"
        points="37.5,55 42,48 45,48 48.5,48"
      />

      {/* Line 2 - Green (loop) */}
      <polyline
        {...LINE_STYLE}
        stroke="#00A84D"
        strokeWidth="1.4"
        points="28,48 31,48 38,51 42,51 50,52 55,48 68,58 56,70 42,76"
      />
      <path
        d="M 42,76 Q 20,70 28,48"
        fill="none"
        stroke="#00A84D"
        strokeWidth="1.0"
        strokeDasharray="2,1.5"
        strokeLinecap="round"
      />

      {/* Line 3 - Orange */}
      <polyline
        {...LINE_STYLE}
        stroke="#EF7C1C"
        strokeWidth="1.4"
        points="37,43 41,44 43,54 48,56"
      />

      {/* Line 5 - Purple */}
      <polyline
        {...LINE_STYLE}
        stroke="#996CAC"
        strokeWidth="1.4"
        points="30,60 35,57 39,47"
      />

      {/* Line 6 - Brown */}
      <polyline
        {...LINE_STYLE}
        stroke="#CD7C2F"
        strokeWidth="1.4"
        points="36,62 41,59 47,57"
      />

      {/* Han River */}
      <path
        d="M 15,63 Q 35,60 50,63 Q 65,66 85,62"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <text x="22" y="61.5" fontSize="2.8" fill="#3b82f6" opacity="0.55" fontFamily="sans-serif">
        한강
      </text>
    </svg>
  );
}

function BusanSubwaySVG() {
  return (
    <svg
      viewBox={VIEWBOX}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="grid-busan" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid-busan)" />

      {/* Line 1 - Orange */}
      <polyline
        {...LINE_STYLE}
        stroke="#F4831F"
        strokeWidth="1.4"
        points="55,35 50,50 48,55 42,58 38,65 36,67"
      />

      {/* Line 2 - Green */}
      <polyline
        {...LINE_STYLE}
        stroke="#37B44E"
        strokeWidth="1.4"
        points="32,42 50,50 68,48 72,44 75,40"
      />

      {/* Coastline */}
      <path
        d="M 25,75 Q 40,78 60,76 Q 75,74 88,72"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <text x="30" y="73.5" fontSize="2.8" fill="#3b82f6" opacity="0.55" fontFamily="sans-serif">
        남해
      </text>
    </svg>
  );
}

export default function SubwayMap({
  city,
  stations,
  acrosticStationIds,
  onStationClick,
}: SubwayMapProps) {
  return (
    <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      {city === "seoul" ? <SeoulSubwaySVG /> : <BusanSubwaySVG />}

      {stations.map((station) => (
        <StationDot
          key={station.id}
          station={station}
          hasAcrostic={acrosticStationIds.has(station.id)}
          onClick={onStationClick}
        />
      ))}
    </div>
  );
}
