import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_STATIONS } from "@/data/busan-subway";
import { stationLabel } from "@/lib/subway-utils";
import { getStationOgColor, getStationOgLineName } from "@/lib/og-utils";

export const runtime = "edge";

const SEED_MAP = new Map(ACROSTIC_SEEDS.map((s) => [s.stationId, s]));
const ALL_STATIONS = [...SEOUL_STATIONS, ...BUSAN_STATIONS];
const STATION_MAP = new Map(ALL_STATIONS.map((s) => [s.id, s]));

const BASE_URL = "https://m.324.ing";

function getFontSizes(lineCount: number): { station: number; poem: number } {
  if (lineCount <= 3) return { station: 60, poem: 22 };
  if (lineCount <= 5) return { station: 48, poem: 18 };
  return { station: 36, poem: 15 };
}

// Hex color → light background (12% opacity via mixing with white)
function lightBg(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c * 0.12 + 255 * 0.88);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function badgeBg(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c * 0.2 + 255 * 0.8);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ stationId: string }> }
) {
  const { stationId } = await params;
  const seed = SEED_MAP.get(stationId);
  const station = STATION_MAP.get(stationId);

  // No seed → fallback to generic OG
  if (!seed || !station) {
    const name = station?.name ?? stationId;
    return NextResponse.redirect(
      `${BASE_URL}/og?title=${encodeURIComponent(stationLabel(name))}&subtitle=${encodeURIComponent("지하철역 시짓기 놀이")}`
    );
  }

  const lineColor = getStationOgColor(stationId);
  const lineName = getStationOgLineName(stationId);
  const chars = station.name.split("");
  const { station: stationFontSize, poem: poemFontSize } = getFontSizes(chars.length);
  const nType = `${chars.length}행시`;
  const bg = lightBg(lineColor);
  const badge = badgeBg(lineColor);

  // Korean font load — fallback to generic OG on failure
  let fontData: ArrayBuffer;
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff"
    );
    if (!res.ok) throw new Error("font fetch failed");
    fontData = await res.arrayBuffer();
  } catch {
    return NextResponse.redirect(
      `${BASE_URL}/og?title=${encodeURIComponent(stationLabel(station.name))}&subtitle=${encodeURIComponent(`${nType} · 지하철역 시짓기 놀이`)}&tag=${encodeURIComponent(lineName)}`
    );
  }

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: bg,
          borderLeft: `10px solid ${lineColor}`,
          padding: "52px 64px 44px 56px",
          fontFamily: "Pretendard",
        }}
      >
        {/* Header: line name + N행시 type */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: lineColor,
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: lineColor,
              letterSpacing: "0.04em",
            }}
          >
            {lineName}
          </span>
          <span style={{ fontSize: 18, color: "#9ca3af" }}>· {nType}</span>
        </div>

        {/* Station name */}
        <div
          style={{
            fontSize: stationFontSize,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}
        >
          {stationLabel(station.name)}
        </div>

        {/* Poem lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {chars.map((char: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: poemFontSize + 8,
                  height: poemFontSize + 8,
                  borderRadius: "50%",
                  background: badge,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: poemFontSize - 4,
                  fontWeight: 700,
                  color: lineColor,
                  flexShrink: 0,
                }}
              >
                {char}
              </div>
              <span
                style={{
                  fontSize: poemFontSize,
                  color: "#374151",
                  lineHeight: 1.5,
                  paddingTop: 4,
                }}
              >
                {seed.lines[i] ?? ""}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: lineColor }}>
            🚇 지하철역 시짓기 놀이
          </span>
          <span style={{ fontSize: 16, color: "#9ca3af" }}>m.324.ing</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700 }],
    }
  );

  image.headers.set(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400"
  );
  return image;
}
