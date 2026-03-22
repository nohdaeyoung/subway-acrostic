import { SEOUL_LINES } from "@/data/seoul-subway";
import { BUSAN_LINES } from "@/data/busan-subway";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_STATIONS } from "@/data/busan-subway";

export function getStationOgColor(stationId: string): string {
  const isSeoul = stationId.startsWith("s-");
  const station = isSeoul
    ? SEOUL_STATIONS.find((s) => s.id === stationId)
    : BUSAN_STATIONS.find((s) => s.id === stationId);
  const lineId = station?.lines[0];
  if (!lineId) return "#10b981";
  const lines = isSeoul ? SEOUL_LINES : BUSAN_LINES;
  return lines[lineId]?.color ?? "#10b981";
}

export function getStationOgLineName(stationId: string): string {
  const isSeoul = stationId.startsWith("s-");
  const station = isSeoul
    ? SEOUL_STATIONS.find((s) => s.id === stationId)
    : BUSAN_STATIONS.find((s) => s.id === stationId);
  const lineId = station?.lines[0];
  if (!lineId) return "";
  const lines = isSeoul ? SEOUL_LINES : BUSAN_LINES;
  const lineName = lines[lineId]?.name ?? lineId;
  const cityLabel = isSeoul ? "서울" : "부산";
  return `${cityLabel} ${lineName}`;
}
