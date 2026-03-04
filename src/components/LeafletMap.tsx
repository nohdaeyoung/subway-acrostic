"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Station, City } from "@/types/subway";
import type { StationData, LineInfo } from "@/data/seoul-subway";

interface LeafletMapProps {
  city: City;
  stations: Station[];
  lines: Record<string, LineInfo>;
  lineRoutes: Record<string, string[][]>;
  stationDataMap: Map<string, StationData>;
  acrosticStationIds: Set<string>;
  selectedLine: string | null;
  onStationClick: (station: Station) => void;
}

const CITY_CENTER: Record<City, { lat: number; lng: number; zoom: number }> = {
  seoul: { lat: 37.5565, lng: 126.9780, zoom: 12 },
  busan: { lat: 35.1596, lng: 129.0553, zoom: 12 },
};

// Korean character width estimate (px) for icon sizing
const CHAR_W = 11;
const PAD_X = 4; // horizontal padding on each side
const GAP = 3;   // gap between dot and label
const ICON_H = 24; // fixed icon height (touch-friendly min)

function buildIcon(
  name: string,
  hasAcrostic: boolean,
  lineColor: string,
  isTransfer: boolean,
  showLabel: boolean,
): L.DivIcon {
  const dotD = isTransfer ? 12 : 8;
  const fillColor = hasAcrostic ? "#10b981" : "#ffffff";
  const strokeColor = hasAcrostic ? "#059669" : lineColor;
  const strokeW = isTransfer ? 2.5 : 2;

  const labelW = showLabel ? name.length * CHAR_W : 0;
  const totalW = Math.max(PAD_X + dotD + (showLabel ? GAP + labelW : 0) + PAD_X, 24);
  // iconAnchor: pin the center of the dot to the station coordinate
  const anchorX = PAD_X + dotD / 2;
  const anchorY = ICON_H / 2;

  const pulseHtml = hasAcrostic
    ? `<div class="marker-pulse" style="position:absolute;inset:-6px;border-radius:50%;background:#10b981;pointer-events:none;"></div>`
    : "";

  const dotHtml = `<div style="
    position:relative;
    width:${dotD}px;height:${dotD}px;
    flex-shrink:0;
    overflow:visible;
  ">
    ${pulseHtml}
    <div style="
      position:absolute;inset:0;
      border-radius:50%;
      background:${fillColor};
      border:${strokeW}px solid ${strokeColor};
      box-sizing:border-box;
    "></div>
  </div>`;

  const labelHtml = showLabel
    ? `<span class="marker-label" style="font-size:10px;font-weight:600;white-space:nowrap;line-height:1;">${name}</span>`
    : "";

  return L.divIcon({
    className: "subway-station-icon",
    html: `<div style="
      display:flex;
      align-items:center;
      gap:${GAP}px;
      height:${ICON_H}px;
      padding:0 ${PAD_X}px;
      cursor:pointer;
    ">${dotHtml}${labelHtml}</div>`,
    iconSize: [totalW, ICON_H],
    iconAnchor: [anchorX, anchorY],
  });
}

function CityChanger({ city }: { city: City }) {
  const map = useMap();
  const prevCity = useRef(city);

  useEffect(() => {
    if (prevCity.current !== city) {
      const c = CITY_CENTER[city];
      map.setView([c.lat, c.lng], c.zoom);
      prevCity.current = city;
    }
  }, [city, map]);

  return null;
}

export default function SubwayLeafletMap({
  city,
  stations,
  lines,
  lineRoutes,
  stationDataMap,
  acrosticStationIds,
  selectedLine,
  onStationClick,
}: LeafletMapProps) {
  const center = CITY_CENTER[city];
  const showLabels = selectedLine !== null;

  // Build polyline coordinates
  const polylines = useMemo(() => {
    const result: { lineId: string; coords: [number, number][][] }[] = [];
    for (const [lineId, segments] of Object.entries(lineRoutes)) {
      const lineInfo = lines[lineId];
      if (!lineInfo) continue;
      const coordSegments: [number, number][][] = [];
      for (const segment of segments) {
        const coords: [number, number][] = [];
        for (const stationId of segment) {
          const sd = stationDataMap.get(stationId);
          if (sd) coords.push([sd.lat, sd.lng]);
        }
        if (coords.length > 1) coordSegments.push(coords);
      }
      if (coordSegments.length > 0) {
        result.push({ lineId, coords: coordSegments });
      }
    }
    return result;
  }, [lineRoutes, lines, stationDataMap]);

  // Filter visible stations
  const visibleStations = useMemo(
    () => stations.filter((s) => selectedLine === null || s.lines.includes(selectedLine)),
    [stations, selectedLine]
  );

  // Memoize pathOptions per line to prevent object recreation on every render
  const polylineOptions = useMemo(
    () => new Map(
      Object.entries(lines).map(([lineId, info]) => [
        lineId,
        {
          color: info.color,
          weight: selectedLine === lineId ? 4 : 3,
          opacity: selectedLine === null ? 0.85 : selectedLine === lineId ? 1 : 0.1,
        } as L.PathOptions,
      ])
    ),
    [lines, selectedLine]
  );

  // Pre-build all station icons (avoid recreating on every render)
  const stationIcons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const station of visibleStations) {
      const hasAcrostic = acrosticStationIds.has(station.id);
      const isTransfer = station.lines.length > 1;
      const lineColor = lines[station.lines[0]]?.color ?? "#888";
      map.set(station.id, buildIcon(station.name, hasAcrostic, lineColor, isTransfer, showLabels));
    }
    return map;
  }, [visibleStations, acrosticStationIds, lines, showLabels]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={center.zoom}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={false}
      minZoom={10}
      maxZoom={16}
    >
      <CityChanger city={city} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Subway lines */}
      {polylines.map(({ lineId, coords }) =>
        coords.map((segment, idx) => (
          <Polyline
            key={`${lineId}-${idx}`}
            positions={segment}
            pathOptions={polylineOptions.get(lineId)!}
          />
        ))
      )}

      {/* Station markers — dot + label as single clickable rectangle */}
      {visibleStations.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={stationIcons.get(station.id)!}
          eventHandlers={{ click: () => onStationClick(station) }}
        />
      ))}
    </MapContainer>
  );
}
