"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
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

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
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
  const [zoom, setZoom] = useState(center.zoom);
  const showLabels = zoom >= 13 || selectedLine !== null;

  // Build polyline coordinates for each line
  const polylines = useMemo(() => {
    const result: { lineId: string; color: string; coords: [number, number][][] }[] = [];
    for (const [lineId, segments] of Object.entries(lineRoutes)) {
      const lineInfo = lines[lineId];
      if (!lineInfo) continue;
      const coordSegments: [number, number][][] = [];
      for (const segment of segments) {
        const coords: [number, number][] = [];
        for (const stationId of segment) {
          const sd = stationDataMap.get(stationId);
          if (sd) {
            coords.push([sd.lat, sd.lng]);
          }
        }
        if (coords.length > 1) coordSegments.push(coords);
      }
      if (coordSegments.length > 0) {
        result.push({ lineId, color: lineInfo.color, coords: coordSegments });
      }
    }
    return result;
  }, [lineRoutes, lines, stationDataMap]);

  // Check if a station is a transfer station (multiple lines)
  function isTransfer(station: Station): boolean {
    return station.lines.length > 1;
  }

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
      <ZoomTracker onZoomChange={setZoom} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Draw subway lines */}
      {polylines.map(({ lineId, color, coords }) =>
        coords.map((segment, idx) => (
          <Polyline
            key={`${lineId}-${idx}`}
            positions={segment}
            pathOptions={{
              color,
              weight: selectedLine === lineId ? 4 : 3,
              opacity: selectedLine === null ? 0.85 : selectedLine === lineId ? 1 : 0.1,
            }}
          />
        ))
      )}

      {/* Draw station markers */}
      {stations.filter((s) => selectedLine === null || s.lines.includes(selectedLine)).map((station) => {
        const hasAcrostic = acrosticStationIds.has(station.id);
        const transfer = isTransfer(station);
        const lineColor = lines[station.lines[0]]?.color ?? "#888";

        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={transfer ? 6 : 4}
            pathOptions={{
              color: hasAcrostic ? "#059669" : lineColor,
              fillColor: hasAcrostic ? "#10b981" : "#ffffff",
              fillOpacity: 1,
              weight: transfer ? 2.5 : 2,
            }}
            eventHandlers={{
              click: () => onStationClick(station),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -8]}
              className="subway-tooltip"
              permanent={showLabels}
            >
              <span className="font-medium text-[10px]">{station.name}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
