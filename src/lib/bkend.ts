import type { Acrostic } from "@/types/subway";

const API_BASE = process.env.NEXT_PUBLIC_BKEND_API_URL || "";
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID || "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ConflictError extends ApiError {
  constructor(message = "이미 N행시가 등록된 역입니다") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (PROJECT_ID) {
    headers["x-project-id"] = PROJECT_ID;
  }
  return headers;
}

export async function getAcrosticByStation(
  stationId: string
): Promise<Acrostic | null> {
  const res = await fetch(
    `${API_BASE}/acrostics?stationId=${encodeURIComponent(stationId)}`,
    { headers: getHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0] ?? null;
}

export async function getAllAcrostics(): Promise<Acrostic[]> {
  const res = await fetch(`${API_BASE}/acrostics`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export async function createAcrostic(
  stationId: string,
  lines: string[],
  token: string
): Promise<Acrostic> {
  const res = await fetch(`${API_BASE}/acrostics`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ stationId, lines }),
  });
  if (res.status === 409) {
    throw new ConflictError();
  }
  if (!res.ok) {
    throw new ApiError("저장에 실패했습니다", res.status);
  }
  return res.json();
}

export async function updateAcrostic(
  id: string,
  lines: string[],
  token: string
): Promise<Acrostic> {
  const res = await fetch(`${API_BASE}/acrostics/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify({ lines }),
  });
  if (!res.ok) {
    throw new ApiError("수정에 실패했습니다", res.status);
  }
  return res.json();
}

export async function deleteAcrostic(
  id: string,
  token: string
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/acrostics/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) {
    throw new ApiError("삭제에 실패했습니다", res.status);
  }
  return true;
}
