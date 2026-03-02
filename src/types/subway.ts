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
  createdBy: string;
  lines: string[];
  createdAt: string;
  updatedAt: string;
}

export type City = "seoul" | "busan";
