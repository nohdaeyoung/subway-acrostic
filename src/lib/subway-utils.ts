import type { Station, City } from "@/types/subway";
import type { StationData } from "@/data/subway-types";

export function toStation(sd: StationData, city: City): Station {
  return { id: sd.id, name: sd.name, city, lines: sd.lines, lat: sd.lat, lng: sd.lng };
}

/** "서울역" → "서울역", "강남" → "강남역" (이미 역으로 끝나는 역명 중복 방지) */
export function stationLabel(name: string): string {
  return name.endsWith("역") ? name : `${name}역`;
}
