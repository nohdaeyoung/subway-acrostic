import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SEOUL_LINES, SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_LINES, BUSAN_STATIONS } from "@/data/busan-subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import { stationLabel } from "@/lib/subway-utils";

const BASE_URL = "https://m.324.ing";

type City = "seoul" | "busan";

const LINES: Record<City, typeof SEOUL_LINES> = {
  seoul: SEOUL_LINES,
  busan: BUSAN_LINES,
};

const STATIONS = {
  seoul: SEOUL_STATIONS,
  busan: BUSAN_STATIONS,
};

const CITY_LABEL: Record<City, string> = {
  seoul: "서울",
  busan: "부산",
};

const SEED_MAP = new Map(ACROSTIC_SEEDS.map((s) => [s.stationId, s]));

export function generateStaticParams() {
  const params: { city: string; lineId: string }[] = [];
  for (const lineId of Object.keys(SEOUL_LINES)) {
    params.push({ city: "seoul", lineId });
  }
  for (const lineId of Object.keys(BUSAN_LINES)) {
    params.push({ city: "busan", lineId });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; lineId: string }>;
}): Promise<Metadata> {
  const { city, lineId } = await params;
  if (city !== "seoul" && city !== "busan") return {};

  const line = LINES[city as City][lineId];
  if (!line) return {};

  const cityLabel = CITY_LABEL[city as City];
  const title = `${cityLabel} ${line.name} N행시 모음 - 지하철 N행시`;
  const description = `${cityLabel} 지하철 ${line.name} 역 이름으로 만든 N행시 모음. ${line.name} 각 역의 개성 있는 삼행시·사행시를 노선도와 함께 감상하세요.`;
  const ogImage = `${BASE_URL}/og?title=${encodeURIComponent(`${cityLabel} ${line.name}`)}&subtitle=${encodeURIComponent("역 이름 N행시 모음")}&tag=${encodeURIComponent(`${cityLabel} 지하철`)}`;

  return {
    title,
    description,
    alternates: { canonical: `/line/${city}/${lineId}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/line/${city}/${lineId}`,
      type: "website",
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

export default async function LinePage({
  params,
}: {
  params: Promise<{ city: string; lineId: string }>;
}) {
  const { city, lineId } = await params;
  if (city !== "seoul" && city !== "busan") notFound();

  const typedCity = city as City;
  const line = LINES[typedCity][lineId];
  if (!line) notFound();

  const allStations = STATIONS[typedCity];
  const lineStations = allStations.filter((s) => s.lines.includes(lineId));
  const seededStations = lineStations.filter((s) => SEED_MAP.has(s.id));

  const cityLabel = CITY_LABEL[typedCity];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cityLabel} ${line.name} N행시 모음`,
    description: `${cityLabel} 지하철 ${line.name} 각 역 이름으로 만든 N행시 컬렉션`,
    url: `${BASE_URL}/line/${city}/${lineId}`,
    isPartOf: { "@type": "WebApplication", name: "지하철 N행시", url: BASE_URL },
    hasPart: seededStations.map((s) => ({
      "@type": "CreativeWork",
      name: `${stationLabel(s.name)} N행시`,
      url: `${BASE_URL}/station/${s.id}`,
    })),
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
        name: `${cityLabel} ${line.name}`,
        item: `${BASE_URL}/line/${city}/${lineId}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← 지하철 N행시
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-500">{cityLabel} {line.name}</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {/* Line header */}
        <div className="mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
            {cityLabel} 지하철 · {line.name}
          </p>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="w-5 h-5 rounded-full shrink-0"
              style={{ backgroundColor: line.color }}
            />
            <h1 className="text-3xl font-bold text-gray-900">{line.name} N행시 모음</h1>
          </div>
          <p className="text-sm text-gray-500">
            전체 {lineStations.length}개 역 중 {seededStations.length}개 역 N행시 수록
          </p>
        </div>

        {seededStations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-400">아직 등록된 N행시가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {seededStations.map((station) => {
              const seed = SEED_MAP.get(station.id)!;
              const chars = station.name.split("");
              return (
                <Link
                  key={station.id}
                  href={`/station/${station.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    <h2 className="font-bold text-gray-900">{stationLabel(station.name)}</h2>
                    <span className="text-xs text-gray-400">{chars.length}행시</span>
                  </div>
                  <div className="space-y-2">
                    {chars.map((char, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs shrink-0 mt-0.5"
                          style={{
                            backgroundColor: `${line.color}22`,
                            color: line.color,
                          }}
                        >
                          {char}
                        </span>
                        <p className="text-sm text-gray-700 leading-6">
                          {seed.lines[i] ?? ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-emerald-800 font-medium mb-3">
            {line.name} 노선도에서 직접 역을 클릭해 N행시를 확인해보세요
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
