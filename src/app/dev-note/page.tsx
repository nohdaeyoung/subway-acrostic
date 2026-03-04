import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개발 노트",
  description:
    "지하철 N행시 서비스의 개발 기록과 버전별 업데이트 이력을 확인하세요. 역 데이터 교정, UI 개선, 인프라 변경 내역을 담고 있습니다.",
  alternates: {
    canonical: "/dev-note",
  },
  openGraph: {
    title: "개발 노트 | 지하철 N행시",
    description: "지하철 N행시 서비스의 개발 기록과 버전별 업데이트 이력",
    url: "https://m.324.ing/dev-note",
  },
};

const devLog = [
  {
    version: "v1.7",
    title: "세부 데이터 수정",
    items: [
      "서울 8호선 별내선 라우트 순서 수정",
      "서울 5호선 하남선 누락 역 4개 추가",
      "서울 3호선 일산선 역 데이터 수정",
      "부산 동해선 역 데이터 전면 수정",
      "부산 2·3·4호선 역 목록·좌표·라우트 전면 수정",
      "부산 1호선 역 목록·좌표·라우트 전면 수정",
      "7호선 역 순서 5곳 수정 + 좌표 7곳 보정 + 자양역 개명",
    ],
  },
  {
    version: "v1.6",
    title: "데이터 정확도 개선",
    items: [
      "의정부 경전철 15개역 좌표 전면 수정 (Wikidata 기반)",
      "5호선에서 마곡나루역 제거 (9호선/공항철도 전용)",
      "4호선/5호선 라우트 누락역 수정",
      "2호선 신정지선 추가 및 본선 역 순서 수정",
      "4호선 안산~오이도 구간 역 순서 수정 (능길↔정왕)",
      "4호선 당고개역 → 불암산역 개명 반영 및 좌표 수정",
      "2~9호선 누락역 68개 추가 및 좌표 오류 45개 수정 (Wikidata 기반)",
      "1호선 누락역 7개 추가 및 좌표 오류 6개 수정",
    ],
  },
  {
    version: "v1.5",
    title: "인프라 변경",
    items: [
      "bkend.ai 의존성 제거 → localStorage + 환경변수 인증으로 전환",
    ],
  },
  {
    version: "v1.4",
    title: "노선 데이터 확장",
    items: [
      "신분당선 ID 충돌 수정 (s-sangcheon → s-sanghyeon)",
      "신분당선 누락역 3개 추가 (논현, 신논현, 광교중앙)",
      "신분당선 6개 역 좌표 교정",
      "4개 노선 역 좌표 교정: 서해선, 김포골드라인, 인천1호선, GTX-A",
      "1호선 연천 방면(경원선) 17개 역 추가",
      "1호선 인천/천안 방면 노선 확장",
    ],
  },
  {
    version: "v1.3",
    title: "UI/UX 및 성능 최적화",
    items: [
      "노선 선택 UI 반응형 적용 (모바일 select / 데스크톱 버튼)",
      "라인 선택 시에만 역명 표시",
      "미사용 ZoomTracker/useState 제거",
      "모든 줌 레벨에서 역명 항상 표시",
      "지도 성능 최적화 (줌 기반 Tooltip + useMemo)",
      "Tooltip 조건부 렌더링으로 변경",
    ],
  },
  {
    version: "v1.2",
    title: "핵심 기능 추가",
    items: [
      "역 클릭 시 N행시 에디터 열기 + 역명 지도 표시",
      "노선 범례 클릭으로 노선 필터 기능 추가",
      "8개 노선 추가: 경춘·서해·GTX-A·김포골드·에버라인·의정부·인천1·인천2",
      "모달 z-index 문제 수정",
    ],
  },
  {
    version: "v1.1",
    title: "지도 기반 리디자인",
    items: [
      "Leaflet 기반 실제 지도 위에 전체 지하철 노선도 리디자인",
      "서울 1~9호선 + 주요 광역 노선 초기 구현",
    ],
  },
  {
    version: "v1.0",
    title: "초기 구현",
    items: [
      "지하철 N행시 웹서비스 초기 구현",
      "역 이름으로 N행시 작성·열람 기본 기능",
      "서울·부산 도시 탭 전환",
      "N행시 목록 / 지도 뷰 모드",
    ],
  },
];

export default function DevNotePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors text-sm"
        >
          ← 홈으로
        </Link>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">개발 노트</h1>
        <span className="text-sm text-gray-400 dark:text-gray-500">지하철 N행시 개발 기록</span>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* Project summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">지하철 N행시</h2>
          <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              제작자는 지하철역 이름으로 N행시를 쓰는 것이 취미입니다. 계기는 경험수집잡화점의 온라인 모임에서 시작되었습니다. 그 후에도 지속해서 관심을 가지고 작성하고 있습니다. 현재는 농담으로 죽고 싶은 생각이 들 때마다 한편씩 쓴다고 합니다.
            </p>
            <p>
              기존에는 NOTION을 통해 기록하던 방식에서 CLAUDE CODE를 이용해 웹페이지로 전환하는 작업을 진행했습니다.
            </p>
            <p>
              서울, 부산 지하철 전 노선을 실제 지도 위에 좌표 기반으로 구현했습니다. 역 데이터는 Wikidata 및 공식 노선도를 참고하여 지속해서 보정하고 있습니다.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "총 커밋", value: "34" },
            { label: "서울 노선", value: "22+" },
            { label: "부산 노선", value: "5+" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-5 text-center"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </section>

        {/* Dev log */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
            개발 이력
          </h2>
          <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-8">
            {devLog.map(({ version, title, items }) => (
              <li key={version} className="ml-6">
                <span className="absolute -left-2.5 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 dark:bg-gray-100 ring-4 ring-gray-50 dark:ring-gray-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-gray-900" />
                </span>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">{version}</span>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                </div>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} 지하철 N행시. All rights reserved.
      </footer>
    </div>
  );
}
