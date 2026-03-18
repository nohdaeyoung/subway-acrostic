export interface Station {
  id: string;
  name: string;
  city: "seoul" | "busan";
  lines: string[];
  lat: number;
  lng: number;
}

export interface Acrostic {
  _id: string;
  stationId: string;
  lines: string[];
  createdAt: string;
  updatedAt: string;
}

export type City = "seoul" | "busan";

export interface TrainPosition {
  trainNo: string;
  lineId: string;      // "1"~"8"
  statnNm: string;     // 현재 역명 (한국어)
  stationId: string;   // "s-xxx"
  lat: number;
  lng: number;
  direction: "up" | "down";  // 0=상행/내선, 1=하행/외선
}

/** 노선 곡선 컨트롤 포인트 (Quadratic Bezier) */
export interface CurvePoint {
  id: string;
  lineId: string;
  segmentIndex: number;
  fromStationId: string;
  toStationId: string;
  controlLat: number;
  controlLng: number;
}
