import { NextResponse } from "next/server";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
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

// Build (stationName-lineId) → { lat, lng, id } lookup
const stationLookup = new Map<string, { lat: number; lng: number; id: string }>();
for (const s of SEOUL_STATIONS) {
  for (const lineId of s.lines) {
    // Only index lines 1~8
    if (/^[1-8]$/.test(lineId)) {
      stationLookup.set(`${s.name}-${lineId}`, { lat: s.lat, lng: s.lng, id: s.id });
    }
  }
}

export async function GET() {
  const apiKey = process.env.SEOUL_SUBWAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
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

      trains.push({
        trainNo: String(item.trainNo ?? item.btrainNo ?? Math.random()),
        lineId,
        statnNm,
        stationId: stationInfo.id,
        lat: stationInfo.lat,
        lng: stationInfo.lng,
        direction: item.updnLine === "0" || item.updnLine === 0 ? "up" : "down",
      });
    }
  }

  return NextResponse.json(trains);
}
