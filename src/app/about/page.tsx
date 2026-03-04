import type { Metadata } from "next";
import Link from "next/link";
import { SEOUL_LINES, SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_LINES, BUSAN_STATIONS } from "@/data/busan-subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";

const BASE_URL = "https://m.324.ing";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "지하철 N행시 서비스 소개. 서울·부산 700개 이상 지하철역 이름으로 만든 삼행시·사행시를 노선도 위에서 감상하세요. N행시란 무엇인지, 어떻게 즐기는지 알아보세요.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "서비스 소개 | 지하철 N행시",
    description:
      "서울·부산 700개 이상 지하철역 이름으로 만든 N행시 서비스. 노선도 위에서 역 이름 삼행시·사행시를 감상하세요.",
    url: `${BASE_URL}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "서비스 소개 | 지하철 N행시",
    description: "서울·부산 700개 이상 지하철역 이름으로 만든 N행시 서비스.",
  },
};

const seoulLineCount = Object.keys(SEOUL_LINES).length;
const busanLineCount = Object.keys(BUSAN_LINES).length;
const totalStations = SEOUL_STATIONS.length + BUSAN_STATIONS.length;
const seededCount = ACROSTIC_SEEDS.length;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "지하철 N행시 서비스 소개",
  url: `${BASE_URL}/about`,
  description:
    "서울·부산 지하철역 이름으로 만든 N행시(삼행시·사행시) 서비스 소개 페이지",
  mainEntity: {
    "@type": "Organization",
    name: "지하철 N행시",
    url: BASE_URL,
    sameAs: [BASE_URL],
    description:
      "서울·부산 700개 이상 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상할 수 있는 한국어 언어유희 웹 서비스",
    foundingDate: "2024",
    inLanguage: "ko",
    areaServed: ["서울특별시", "부산광역시"],
    knowsAbout: ["N행시", "삼행시", "지하철", "한국어 언어유희"],
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: BASE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "서비스 소개",
      item: `${BASE_URL}/about`,
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors"
          >
            ← 지하철 N행시
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">서비스 소개</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* Title */}
        <div className="mb-10">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            About
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
            지하철 N행시
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            서울·부산 지하철역 이름으로 만든 N행시를 노선도 위에서 감상하는 한국어 언어유희 서비스입니다.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: totalStations.toString() + "+", label: "전체 역" },
            { value: seoulLineCount + busanLineCount + "개", label: "노선" },
            { value: seededCount + "+", label: "등록된 N행시" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center"
            >
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* What is N행시 */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            N행시란?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            N행시(N-行詩)는 주어진 단어의 각 글자로 시작하는 문장을 차례로 이어 만드는 한국의 언어유희입니다.
            영어의 애크로스틱(acrostic poem)과 유사한 형식으로, 주로 인터넷 문화에서 유머와 감성을 담아 즐깁니다.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">예시 — 강남역 2행시</p>
            <div className="space-y-1.5">
              {[
                { char: "강", line: "강물에 흘러보낸 내 과거의 빈자리가" },
                { char: "남", line: "남은 내 삶을 새롭게 시작할 힘을 만든다." },
              ].map(({ char, line }) => (
                <div key={char} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs shrink-0">
                    {char}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-6">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* How to use */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            이용 방법
          </h2>
          <ol className="space-y-3">
            {[
              "상단의 서울/부산 탭에서 도시를 선택합니다.",
              "지도 또는 목록에서 보고 싶은 역을 클릭합니다.",
              "해당 역 이름으로 만든 N행시를 감상합니다.",
              "관리자 계정으로 직접 N행시를 작성하거나 수정할 수 있습니다.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-6">{step}</p>
              </li>
            ))}
          </ol>
        </article>

        {/* Coverage */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-10">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            수록 노선
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                서울 ({seoulLineCount}개 노선 · {SEOUL_STATIONS.length}개 역)
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.values(SEOUL_LINES).map((line) => (
                  <Link
                    key={line.id}
                    href={`/line/seoul/${line.id}`}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    {line.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                부산 ({busanLineCount}개 노선 · {BUSAN_STATIONS.length}개 역)
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.values(BUSAN_LINES).map((line) => (
                  <Link
                    key={line.id}
                    href={`/line/busan/${line.id}`}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    {line.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
          <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium mb-3">
            지금 바로 지하철역 N행시를 감상해보세요
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            노선도 보러 가기 →
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
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
