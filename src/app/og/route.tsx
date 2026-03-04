import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "지하철 N행시";
  const subtitle = searchParams.get("subtitle") || "서울·부산 지하철역 이름으로 쓴 N행시";
  const tag = searchParams.get("tag") || "";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #d1fae5 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {tag && (
          <div
            style={{
              fontSize: 20,
              color: "#059669",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {tag}
          </div>
        )}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#6b7280",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 48,
            fontSize: 22,
            color: "#10b981",
            fontWeight: 600,
          }}
        >
          🚇 지하철 N행시 — m.324.ing
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
  image.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  return image;
}
