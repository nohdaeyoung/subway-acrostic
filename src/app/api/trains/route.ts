import { NextResponse } from "next/server";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
import { SEOUL_LINE_ROUTES } from "@/data/seoul/routes";
import type { TrainPosition } from "@/types/subway";

// Seoul API subwayId → our lineId
const SUBWAY_ID_MAP: Record<string, string> = {
  "1001": "1",
  "1002": "2",
  "1003": "3",
  "1004": "4",
  "1005": "5",
  "1006": "6",
  "1007": "7",
  "1008": "8",
};

// Lines 1~8 in Seoul API format
const SEOUL_LINE_NAMES = [
  "1호선", "2호선", "3호선", "4호선",
  "5호선", "6호선", "7호선", "8호선",
];

// stationId → { lat, lng, name }
const stationById = new Map(
  SEOUL_STATIONS.map((s) => [s.id, { lat: s.lat, lng: s.lng, name: s.name }])
);

// Build (stationName-lineId) → { lat, lng, id } lookup
const stationLookup = new Map<string, { lat: number; lng: number; id: string }>();
for (const s of SEOUL_STATIONS) {
  for (const lineId of s.lines) {
    if (/^[1-8]$/.test(lineId)) {
      stationLookup.set(`${s.name}-${lineId}`, { lat: s.lat, lng: s.lng, id: s.id });
    }
  }
}

// Build route neighbor map: "stationName-lineId" → [prevStationId, nextStationId]
// prev = lower index in route, next = higher index in route
const routeNeighbors = new Map<string, [string | null, string | null]>();
for (const [lineId, segments] of Object.entries(SEOUL_LINE_ROUTES)) {
  if (!/^[1-8]$/.test(lineId)) continue;
  for (const segment of segments) {
    for (let i = 0; i < segment.length; i++) {
      const sd = stationById.get(segment[i]);
      if (!sd) continue;
      const key = `${sd.name}-${lineId}`;
      if (routeNeighbors.has(key)) continue;
      routeNeighbors.set(key, [
        i > 0 ? segment[i - 1] : null,
        i < segment.length - 1 ? segment[i + 1] : null,
      ]);
    }
  }
}

/** 두 좌표 사이를 t(0~1) 비율로 보간 */
function lerp(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number,
  t: number,
) {
  return {
    lat: fromLat + (toLat - fromLat) * t,
    lng: fromLng + (toLng - fromLng) * t,
  };
}

// 서버 메모리 캐시: 15초간 서울 API 응답 재사용 (일일 호출량 절약)
let cachedTrains: TrainPosition[] = [];
let cachedAt = 0;
const CACHE_TTL = 15_000; // 15초

export async function GET() {
  const apiKey = process.env.SEOUL_SUBWAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  // 캐시 유효하면 즉시 반환
  const now = Date.now();
  if (now - cachedAt < CACHE_TTL && cachedTrains.length > 0) {
    return NextResponse.json(cachedTrains, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  const results = await Promise.allSettled(
    SEOUL_LINE_NAMES.map((lineName) =>
      fetch(
        `http://swopenapi.seoul.go.kr/api/subway/${apiKey}/json/realtimePosition/0/500/${encodeURIComponent(lineName)}`,
        { cache: "no-store" }
      ).then((r) => r.json())
    )
  );

  const trains: TrainPosition[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const data = result.value;
    const realtimePositionList = data?.realtimePositionList;
    if (!Array.isArray(realtimePositionList)) continue;

    for (const item of realtimePositionList) {
      const lineId = SUBWAY_ID_MAP[String(item.subwayId)];
      if (!lineId) continue;

      const statnNm: string = item.statnNm ?? "";
      const key = `${statnNm}-${lineId}`;
      const stationInfo = stationLookup.get(key);
      if (!stationInfo) continue;

      const isUp = item.updnLine === "0" || item.updnLine === 0;
      const trainSttus = Number(item.trainSttus ?? 1) as 0 | 1 | 2;

      // 기본값: 역 좌표
      let fromLat = stationInfo.lat;
      let fromLng = stationInfo.lng;
      let toLat = stationInfo.lat;
      let toLng = stationInfo.lng;

      // 역간 애니메이션 구간 설정
      const neighbors = routeNeighbors.get(key);
      if (neighbors) {
        const [prevId, nextId] = neighbors;

        if (trainSttus === 0) {
          // 진입: 이전역 → 현재역 구간
          const srcId = isUp ? nextId : prevId;
          const srcCoords = srcId ? stationById.get(srcId) : null;
          if (srcCoords) {
            fromLat = srcCoords.lat;
            fromLng = srcCoords.lng;
          }
          // toLat/toLng = 현재역 (기본값 유지)
        } else if (trainSttus === 2) {
          // 출발: 현재역 → 다음역 구간
          // fromLat/fromLng = 현재역 (기본값 유지)
          const dstId = isUp ? prevId : nextId;
          const dstCoords = dstId ? stationById.get(dstId) : null;
          if (dstCoords) {
            toLat = dstCoords.lat;
            toLng = dstCoords.lng;
          }
        }
        // 도착(1): from=to=현재역 (기본값 유지, 정차 중)
      }

      // 초기 표시 좌표 (API 응답 시점의 위치)
      let lat = fromLat;
      let lng = fromLng;
      if (trainSttus === 0) {
        // 진입: 80% 지점
        const pos = lerp(fromLat, fromLng, toLat, toLng, 0.8);
        lat = pos.lat;
        lng = pos.lng;
      } else if (trainSttus === 2) {
        // 출발: 25% 지점
        const pos = lerp(fromLat, fromLng, toLat, toLng, 0.25);
        lat = pos.lat;
        lng = pos.lng;
      }

      trains.push({
        trainNo: String(item.trainNo ?? item.btrainNo ?? Math.random()),
        lineId,
        statnNm,
        stationId: stationInfo.id,
        lat,
        lng,
        direction: isUp ? "up" : "down",
        trainSttus,
        fromLat,
        fromLng,
        toLat,
        toLng,
      });
    }
  }

  // 캐시 갱신
  cachedTrains = trains;
  cachedAt = Date.now();

  return NextResponse.json(trains, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
