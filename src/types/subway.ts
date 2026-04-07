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
  isAi?: boolean;                              // AI 생성 여부 (진행률 제외)
  aiConcept?: "love" | "philosophy" | "humor"; // AI 생성 시 컨셉
}

export type City = "seoul" | "busan";

export interface TrainPosition {
  trainNo: string;
  lineId: string;      // "1"~"8"
  statnNm: string;     // 현재 역명 (한국어)
  stationId: string;   // "s-xxx"
  lat: number;         // 현재 표시 좌표 (클라이언트 보간)
  lng: number;
  direction: "up" | "down";  // 0=상행/내선, 1=하행/외선
  trainSttus: 0 | 1 | 2;    // 0=진입, 1=도착, 2=출발
  fromLat: number;     // 애니메이션 출발 좌표
  fromLng: number;
  toLat: number;       // 애니메이션 도착 좌표
  toLng: number;
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
