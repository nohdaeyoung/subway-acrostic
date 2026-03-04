import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import { SEOUL_STATIONS, SEOUL_LINE_ROUTES } from "@/data/seoul-subway";
import { BUSAN_STATIONS, BUSAN_LINE_ROUTES } from "@/data/busan-subway";
import { stationLabel } from "@/lib/subway-utils";

const BASE_URL = "https://m.324.ing";

// Unified station lookup (Seoul + Busan)
const ALL_STATIONS = [...SEOUL_STATIONS, ...BUSAN_STATIONS];
const STATION_MAP = new Map(ALL_STATIONS.map((s) => [s.id, s]));

// Seed map: stationId → acrostic
const SEED_MAP = new Map(ACROSTIC_SEEDS.map((s) => [s.stationId, s]));

export function generateStaticParams() {
  return ACROSTIC_SEEDS.map((seed) => ({ stationId: seed.stationId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stationId: string }>;
}): Promise<Metadata> {
  const { stationId } = await params;
  const station = STATION_MAP.get(stationId);
  const seed = SEED_MAP.get(stationId);

  if (!station || !seed) return {};

  const chars = station.name.split("");
  const preview = seed.lines[0] ? `"${chars[0]}${seed.lines[0].slice(0, 20)}"` : "";
  const nType = `${chars.length}행시`;
  const title = `${stationLabel(station.name)} ${nType} - 지하철 N행시`;
  const description = `${stationLabel(station.name)} 이름으로 만든 ${nType}. ${preview} — 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요.`;

  const ogImage = `${BASE_URL}/og?title=${encodeURIComponent(station.name + "역")}&subtitle=${encodeURIComponent(`${chars.length}행시 · ${preview}`)}&tag=${encodeURIComponent(`${stationId.startsWith("b-") ? "부산" : "서울"} 지하철`)}`;

  return {
    title,
    description,
    alternates: { canonical: `/station/${stationId}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/station/${stationId}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StationPage({
  params,
}: {
  params: Promise<{ stationId: string }>;
}) {
  const { stationId } = await params;
  const station = STATION_MAP.get(stationId);
  const seed = SEED_MAP.get(stationId);

  if (!station || !seed) notFound();

  const chars = station.name.split("");
  const city = stationId.startsWith("b-") ? "busan" : "seoul";
  const cityLabel = city === "seoul" ? "서울" : "부산";
  const nType = `${chars.length}행시`;

  // JSON-LD: CreativeWork
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${stationLabel(station.name)} ${nType}`,
    text: chars.map((c, i) => `${c}: ${seed.lines[i] ?? ""}`).join("\n"),
    inLanguage: "ko",
    genre: "N행시",
    about: {
      "@type": "Place",
      name: `${stationLabel(station.name)}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: station.lat,
        longitude: station.lng,
      },
      containedInPlace: { "@type": "Place", name: `${cityLabel}특별시` },
    },
    isPartOf: { "@type": "WebApplication", name: "지하철 N행시", url: BASE_URL },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${stationLabel(station.name)}`,
        item: `${BASE_URL}/station/${stationId}`,
      },
    ],
  };

  // 인접 역 계산 (같은 노선 첫 번째 노선 기준)
  const primaryLineId = station.lines[0];
  const lineRoutes = city === "seoul" ? SEOUL_LINE_ROUTES : BUSAN_LINE_ROUTES;
  const routes = lineRoutes[primaryLineId] ?? [];

  type AdjacentStation = { id: string; name: string };
  let prevStation: AdjacentStation | null = null;
  let nextStation: AdjacentStation | null = null;

  for (const route of routes) {
    const idx = route.indexOf(stationId);
    if (idx !== -1) {
      const prevId = idx > 0 ? route[idx - 1] : null;
      const nextId = idx < route.length - 1 ? route[idx + 1] : null;
      if (prevId && SEED_MAP.has(prevId)) {
        const s = STATION_MAP.get(prevId);
        if (s) prevStation = { id: prevId, name: s.name };
      }
      if (nextId && SEED_MAP.has(nextId)) {
        const s = STATION_MAP.get(nextId);
        if (s) nextStation = { id: nextId, name: s.name };
      }
      break;
    }
  }

  const hasAdjacentSeeded = prevStation !== null || nextStation !== null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← 지하철 N행시
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-500">{stationLabel(station.name)}</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* Station header */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{cityLabel} 지하철 · {nType}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{stationLabel(station.name)}</h1>
          <p className="text-sm text-gray-400">{chars.length}글자 · {chars.join(", ")}</p>
        </div>

        {/* Acrostic poem */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">N행시</h2>
          <div className="space-y-4">
            {chars.map((char, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0 mt-0.5">
                  {char}
                </span>
                <p className="text-gray-800 leading-relaxed pt-1.5">{seed.lines[i] ?? ""}</p>
              </div>
            ))}
          </div>
        </article>

        {/* 같은 노선 인접 역 N행시 */}
        {hasAdjacentSeeded && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              같은 노선 다른 역 N행시
            </h2>
            <div className="flex gap-3">
              {prevStation && (
                <Link
                  href={`/station/${prevStation.id}`}
                  className="flex-1 bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all text-center"
                >
                  <span className="block text-xs text-gray-400 mb-1">← 이전 역</span>
                  <span className="text-sm font-medium text-gray-800">{stationLabel(prevStation.name)}</span>
                </Link>
              )}
              {nextStation && (
                <Link
                  href={`/station/${nextStation.id}`}
                  className="flex-1 bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all text-center"
                >
                  <span className="block text-xs text-gray-400 mb-1">다음 역 →</span>
                  <span className="text-sm font-medium text-gray-800">{stationLabel(nextStation.name)}</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-emerald-800 font-medium mb-3">
            더 많은 지하철역 N행시를 노선도에서 확인해보세요
          </p>
          <Link
            href={`/?city=${city}`}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            노선도에서 보기 →
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} 지하철 N행시. All rights reserved.
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </div>
  );
}
