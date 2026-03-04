export interface LineInfo {
  id: string;
  name: string;
  color: string;
}

export interface StationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lines: string[];
}
