"use client";

import dynamic from "next/dynamic";
import type { Station, City } from "@/types/subway";
import type { StationData, LineInfo } from "@/data/seoul-subway";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-400 text-sm">지도를 불러오는 중...</span>
    </div>
  ),
});

interface SubwayMapProps {
  city: City;
  stations: Station[];
  lines: Record<string, LineInfo>;
  lineRoutes: Record<string, string[][]>;
  stationDataMap: Map<string, StationData>;
  acrosticStationIds: Set<string>;
  onStationClick: (station: Station) => void;
}

export default function SubwayMap(props: SubwayMapProps) {
  return (
    <div className="w-full h-[calc(100vh-180px)] min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <LeafletMap {...props} />
    </div>
  );
}
