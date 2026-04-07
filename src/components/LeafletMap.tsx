"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Station, City, TrainPosition, CurvePoint } from "@/types/subway";
import type { StationData, LineInfo } from "@/data/seoul-subway";
import { curvePointKey } from "@/lib/curvePoints";

interface LeafletMapProps {
  city: City;
  stations: Station[];
  lines: Record<string, LineInfo>;
  lineRoutes: Record<string, string[][]>;
  stationDataMap: Map<string, StationData>;
  acrosticStationIds: Set<string>;
  selectedLine: string | null;
  onStationClick: (station: Station) => void;
  trainPositions?: TrainPosition[];
  isAdmin?: boolean;
  curvePoints?: Map<string, CurvePoint>;
  onCurvePointAdd?: (cp: CurvePoint) => void;
  onCurvePointUpdate?: (cp: CurvePoint) => void;
  onCurvePointDelete?: (cp: CurvePoint) => void;
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

/** Quadratic Bezier 보간: P0→P1(control)→P2, steps개 점 생성 */
function interpolateBezier(
  p0: [number, number],
  control: [number, number],
  p2: [number, number],
  steps: number = 20,
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      u * u * p0[0] + 2 * u * t * control[0] + t * t * p2[0],
      u * u * p0[1] + 2 * u * t * control[1] + t * t * p2[1],
    ]);
  }
  return pts;
}

/** 점 P에서 선분 AB까지의 최단 거리 (제곱) */
function distSqToSegment(
  p: [number, number],
  a: [number, number],
  b: [number, number],
): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return (p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2;
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const px = a[0] + t * dx;
  const py = a[1] + t * dy;
  return (p[0] - px) ** 2 + (p[1] - py) ** 2;
}

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

// 컨트롤 포인트 드래그 마커 아이콘
function buildControlPointIcon(): L.DivIcon {
  return L.divIcon({
    className: "curve-control-point",
    html: `<div style="
      width:14px;height:14px;
      background:#e85d04;
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      cursor:grab;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/** 지하철 모양 열차 아이콘 (호선 색상 + 방향 표시) */
function buildTrainIcon(color: string, lineId: string, direction: string, sttus: number): L.DivIcon {
  const isMoving = sttus !== 1;
  const isUp = direction === "up";
  const W = 30;
  const H = 16;

  // 방향에 따른 전면 윈드실드 위치
  const windshieldX = isUp ? 1 : W - 9;
  const bodyClip = isUp
    ? `M4,0 H${W - 2} Q${W},0 ${W},2 V${H - 2} Q${W},${H} ${W - 2},${H} H4 Q0,${H} 0,${H - 4} V4 Q0,0 4,0Z`
    : `M2,0 H${W - 4} Q${W},0 ${W},4 V${H - 4} Q${W},${H} ${W - 4},${H} H2 Q0,${H} 0,${H - 2} V2 Q0,0 2,0Z`;

  const opacity = sttus === 0 ? 0.8 : 1;
  const shadow = isMoving ? "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.3))";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="filter:${shadow};opacity:${opacity};pointer-events:none;">
    <!-- 차체 -->
    <path d="${bodyClip}" fill="${color}"/>
    <!-- 윈드실드 -->
    ${isMoving ? `<rect x="${windshieldX}" y="3" width="8" height="${H - 6}" rx="2" fill="white" opacity="0.35"/>` : ""}
    <!-- 호선 번호 -->
    <text x="${W / 2}" y="${H - 4}" text-anchor="middle" fill="white" font-size="9" font-weight="bold" font-family="system-ui,sans-serif">${lineId}</text>
    <!-- 정차 표시 -->
    ${sttus === 1 ? `<rect x="0" y="0" width="${W}" height="${H}" rx="4" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="3,2"/>` : ""}
  </svg>`;

  return L.divIcon({
    className: "train-icon",
    html: svg,
    iconSize: [W, H],
    iconAnchor: [W / 2, H / 2],
  });
}

// Leaflet 네이티브 API로 열차 마커를 관리하는 레이어
// 매초 위치 업데이트 시 마커를 재생성하지 않고 setLatLng으로 이동
function TrainLayer({ trainPositions, lines }: { trainPositions: TrainPosition[]; lines: Record<string, LineInfo> }) {
  const map = useMap();
  const markersRef = useRef<Map<string, { marker: L.Marker; sttus: number; lineId: string }>>(new Map());

  useEffect(() => {
    const currentKeys = new Set<string>();

    for (const train of trainPositions) {
      const key = `${train.trainNo}-${train.lineId}`;
      currentKeys.add(key);

      const color = lines[train.lineId]?.color ?? "#888";
      const sttus = train.trainSttus ?? 1;

      const existing = markersRef.current.get(key);

      if (existing) {
        existing.marker.setLatLng([train.lat, train.lng]);
        if (existing.sttus !== sttus || existing.lineId !== train.lineId) {
          existing.marker.setIcon(buildTrainIcon(color, train.lineId, train.direction, sttus));
          existing.sttus = sttus;
          existing.lineId = train.lineId;
        }
      } else {
        const icon = buildTrainIcon(color, train.lineId, train.direction, sttus);
        const marker = L.marker([train.lat, train.lng], {
          icon,
          zIndexOffset: 1000,
        }).addTo(map);
        markersRef.current.set(key, { marker, sttus, lineId: train.lineId });
      }
    }

    // 사라진 열차 마커 제거
    for (const [key, { marker }] of markersRef.current) {
      if (!currentKeys.has(key)) {
        marker.remove();
        markersRef.current.delete(key);
      }
    }
  }, [trainPositions, lines, map]);

  // 언마운트 시 전체 정리
  useEffect(() => {
    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
    };
  }, [map]);

  return null;
}

/** 관리자 모드: 컨트롤 포인트 드래그 마커 레이어 */
function CurveEditLayer({
  curvePoints,
  onUpdate,
  onDelete,
}: {
  curvePoints: Map<string, CurvePoint>;
  onUpdate: (cp: CurvePoint) => void;
  onDelete: (cp: CurvePoint) => void;
}) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // 기존 마커 제거
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const icon = buildControlPointIcon();

    for (const cp of curvePoints.values()) {
      const marker = L.marker([cp.controlLat, cp.controlLng], {
        icon,
        draggable: true,
        zIndexOffset: 2000,
      }).addTo(map);

      // 드래그 끝나면 위치 업데이트
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onUpdate({ ...cp, controlLat: pos.lat, controlLng: pos.lng });
      });

      // 우클릭으로 삭제
      marker.on("contextmenu", (e) => {
        const ev = e as L.LeafletMouseEvent;
        ev.originalEvent.preventDefault();
        ev.originalEvent.stopPropagation();
        onDelete(cp);
      });

      // 툴팁
      marker.bindTooltip("드래그: 곡선 조정 · 우클릭: 삭제", {
        direction: "top",
        offset: [0, -10],
        className: "curve-tooltip",
      });

      markersRef.current.push(marker);
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [curvePoints, map, onUpdate, onDelete]);

  return null;
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
  trainPositions,
  isAdmin,
  curvePoints,
  onCurvePointAdd,
  onCurvePointUpdate,
  onCurvePointDelete,
}: LeafletMapProps) {
  const center = CITY_CENTER[city];
  const showLabels = selectedLine !== null;

  // 각 노선의 역 좌표 + segmentIndex + stationId 정보를 구축
  const polylineData = useMemo(() => {
    const result: {
      lineId: string;
      segmentIndex: number;
      stationIds: string[];
      coords: [number, number][];
    }[] = [];
    for (const [lineId, segments] of Object.entries(lineRoutes)) {
      const lineInfo = lines[lineId];
      if (!lineInfo) continue;
      for (let si = 0; si < segments.length; si++) {
        const segment = segments[si];
        const coords: [number, number][] = [];
        const ids: string[] = [];
        for (const stationId of segment) {
          const sd = stationDataMap.get(stationId);
          if (sd) {
            coords.push([sd.lat, sd.lng]);
            ids.push(stationId);
          }
        }
        if (coords.length > 1) {
          result.push({ lineId, segmentIndex: si, stationIds: ids, coords });
        }
      }
    }
    return result;
  }, [lineRoutes, lines, stationDataMap]);

  // 곡선 포인트 적용하여 최종 폴리라인 좌표 계산
  const polylines = useMemo(() => {
    return polylineData.map(({ lineId, segmentIndex, stationIds, coords }) => {
      const finalCoords: [number, number][] = [];
      for (let i = 0; i < coords.length; i++) {
        if (i === 0) {
          finalCoords.push(coords[i]);
          continue;
        }
        // 이전 역 → 현재 역 사이에 곡선 포인트가 있는지 확인
        const key = curvePointKey(lineId, segmentIndex, stationIds[i - 1], stationIds[i]);
        const cp = curvePoints?.get(key);
        if (cp) {
          // Bezier 보간 (시작점은 이미 추가됨, 끝점 포함)
          const bezierPts = interpolateBezier(
            coords[i - 1],
            [cp.controlLat, cp.controlLng],
            coords[i],
          );
          // 첫 점(시작)은 이미 추가했으므로 건너뜀
          for (let j = 1; j < bezierPts.length; j++) {
            finalCoords.push(bezierPts[j]);
          }
        } else {
          finalCoords.push(coords[i]);
        }
      }
      return { lineId, coords: finalCoords };
    });
  }, [polylineData, curvePoints]);

  // Filter visible stations
  const visibleStations = useMemo(
    () => stations.filter((s) => selectedLine === null || s.lines.includes(selectedLine)),
    [stations, selectedLine]
  );

  // Memoize pathOptions per line
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

  // 관리자 모드: 노선 클릭 시 곡선 포인트 추가
  const handlePolylineClick = useCallback(
    (
      e: L.LeafletMouseEvent,
      lineId: string,
      segmentIndex: number,
      stationIds: string[],
      coords: [number, number][],
    ) => {
      if (!isAdmin || !onCurvePointAdd) return;

      const clickLatLng: [number, number] = [e.latlng.lat, e.latlng.lng];

      // 가장 가까운 역 간 구간 찾기
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < coords.length - 1; i++) {
        const d = distSqToSegment(clickLatLng, coords[i], coords[i + 1]);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }

      const fromId = stationIds[bestIdx];
      const toId = stationIds[bestIdx + 1];
      const key = curvePointKey(lineId, segmentIndex, fromId, toId);

      // 이미 곡선 포인트가 있으면 무시
      if (curvePoints?.has(key)) return;

      const newCp: CurvePoint = {
        id: key,
        lineId,
        segmentIndex,
        fromStationId: fromId,
        toStationId: toId,
        controlLat: e.latlng.lat,
        controlLng: e.latlng.lng,
      };
      onCurvePointAdd(newCp);
    },
    [isAdmin, onCurvePointAdd, curvePoints],
  );

  // Pre-build all station icons
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

  // 관리자 모드 폴리라인 옵션 (클릭 가능하도록 weight 넓힘)
  const adminPolylineOptions = useMemo(() => {
    if (!isAdmin) return null;
    return new Map(
      Object.entries(lines).map(([lineId, info]) => [
        lineId,
        {
          color: info.color,
          weight: 12,
          opacity: 0,
        } as L.PathOptions,
      ])
    );
  }, [isAdmin, lines]);


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

      {/* Subway lines (곡선 적용) */}
      {polylines.map(({ lineId, coords }, idx) => (
        <Polyline
          key={`${lineId}-${idx}`}
          positions={coords}
          pathOptions={polylineOptions.get(lineId)!}
        />
      ))}

      {/* 관리자 모드: 투명 넓은 히트 영역 (클릭 감지용) */}
      {isAdmin && adminPolylineOptions &&
        polylineData.map(({ lineId, segmentIndex, stationIds, coords }, idx) => (
          <Polyline
            key={`hit-${lineId}-${segmentIndex}-${idx}`}
            positions={coords}
            pathOptions={adminPolylineOptions.get(lineId)!}
            eventHandlers={{
              click: (e) => handlePolylineClick(e, lineId, segmentIndex, stationIds, coords),
            }}
          />
        ))
      }

      {/* Station markers */}
      {visibleStations.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={stationIcons.get(station.id)!}
          eventHandlers={{ click: () => onStationClick(station) }}
        />
      ))}

      {/* Train position markers */}
      <TrainLayer trainPositions={trainPositions ?? []} lines={lines} />

      {/* 관리자 모드: 컨트롤 포인트 마커 */}
      {isAdmin && curvePoints && onCurvePointUpdate && onCurvePointDelete && (
        <CurveEditLayer
          curvePoints={curvePoints}
          onUpdate={onCurvePointUpdate}
          onDelete={onCurvePointDelete}
        />
      )}
    </MapContainer>
  );
}
