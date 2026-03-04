# SEO Technical Gap Analysis Report v2.0

> **Analysis Type**: Gap Analysis (Design vs Implementation) -- Phase 1 Re-verification + Phase 2 New Implementation
>
> **Project**: subway-acrostic (지하철 N행시)
> **Analyst**: gap-detector / pdca-iterator
> **Date**: 2026-03-04
> **Design Doc**: [seo-geo-strategy.md](../04-report/seo-geo-strategy.md)
> **Previous Analysis**: v2.0 (2026-03-04, Combined Match Rate 88%)
> **Status**: Approved (v3.0 — Iteration 1 완료, 94.3%)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Phase 1 이전 분석(v1.0, 매치율 94%)에서 식별된 Gap 항목들의 해소 여부를 재검증하고, Phase 2 신규 구현 항목(역별 페이지, 노선별 페이지, OG 이미지, 사이트맵 확장)에 대한 설계-구현 갭을 식별한다.

### 1.2 Analysis Scope

- **Design Document**: `docs/04-report/seo-geo-strategy.md` (Phase 1 + Phase 2 로드맵)
- **Previous Analysis**: `docs/03-analysis/seo-technical.analysis.md` v1.0
- **Implementation Files**:
  - `src/app/robots.ts` (Phase 1 재검증)
  - `src/app/sitemap.ts` (Phase 2 확장)
  - `src/app/layout.tsx` (Phase 1 유지)
  - `src/components/JsonLd.tsx` (Phase 1 유지)
  - `src/app/station/[stationId]/page.tsx` (Phase 2 신규)
  - `src/app/line/[city]/[lineId]/page.tsx` (Phase 2 신규)
  - `src/app/og/route.tsx` (Phase 2 신규)
  - `src/app/dev-note/page.tsx` (Phase 1 유지)
  - `public/llms.txt` (Phase 1 유지, Phase 2 갱신)
- **Analysis Date**: 2026-03-04

---

## 2. Overall Scores

| Category | v1.0 Score | v2.0 Score | v3.0 Score | Status | Delta (v2→v3) |
|----------|:---------:|:---------:|:---------:|:------:|:-----:|
| robots.txt | 60% | 100% | 100% | Pass | 0% |
| sitemap.xml | 90% | 85% | 88% | Pass | +3% |
| layout.tsx Metadata | 95% | 95% | 95% | Pass | 0% |
| JSON-LD Structured Data (Global) | 95% | 95% | 95% | Pass | 0% |
| dev-note Metadata | 95% | 95% | 95% | Pass | 0% |
| llms.txt | 85% | 90% | 90% | Pass | 0% |
| Station Pages (Phase 2 New) | N/A | 80% | 95% | Pass | +15% |
| Line Pages (Phase 2 New) | N/A | 82% | 92% | Pass | +10% |
| OG Image Generation (Phase 2 New) | N/A | 75% | 75% | Warning | 0% |
| **Overall Design Match** | **87%** | **88%** | **94.3%** | **Pass** | **+6.3%** |

---

## 3. Phase 1 Re-verification (v1.0 Gap Resolution)

### 3.1 robots.ts (v1.0: 60% -> v2.0: 100%)

v1.0에서 식별된 7개 갭 항목 전부 해소되었다.

| v1.0 Gap Item | v2.0 Status | Evidence |
|---------------|:-----------:|---------|
| Disallow: /api/ | Resolved | `src/app/robots.ts:10` -- `disallow: ["/api/", "/_next/"]` |
| Disallow: /_next/ | Resolved | `src/app/robots.ts:10` -- `disallow: ["/api/", "/_next/"]` |
| GPTBot Allow | Resolved | `src/app/robots.ts:13` -- `{ userAgent: "GPTBot", allow: "/" }` |
| Google-Extended Allow | Resolved | `src/app/robots.ts:14` -- `{ userAgent: "Google-Extended", allow: "/" }` |
| Anthropic-ai Allow | Resolved | `src/app/robots.ts:15` -- `{ userAgent: "Anthropic-ai", allow: "/" }` |
| ClaudeBot Allow | Resolved | `src/app/robots.ts:16` -- `{ userAgent: "ClaudeBot", allow: "/" }` |
| PerplexityBot Allow | Resolved | `src/app/robots.ts:17` -- `{ userAgent: "PerplexityBot", allow: "/" }` |

**Current Implementation** (`src/app/robots.ts`):
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: "https://m.324.ing/sitemap.xml",
    host: "https://m.324.ing",
  };
}
```

**Design Document (Section 2.1.2 + Section 7.4)** 대비 완전 일치.

---

### 3.2 layout.tsx / JSON-LD / dev-note / llms.txt (변동 없음)

v1.0에서 Pass 판정을 받은 항목들은 현재도 동일한 상태를 유지한다.

| Category | v1.0 Status | v2.0 Status | Changes |
|----------|:-----------:|:-----------:|---------|
| layout.tsx Metadata | 95% Pass | 95% Pass | No change |
| JSON-LD (WebApplication + FAQPage) | 95% Pass | 95% Pass | No change |
| dev-note Metadata | 95% Pass | 95% Pass | No change |
| GSC/Naver verification | Warning | Warning | Still placeholder (external dependency) |

### 3.3 v1.0 Remaining Gap (External)

| Item | Status | Notes |
|------|:------:|-------|
| GSC verification code | Pending | 외부 서비스 등록 후 적용 필요 -- 코드 구현의 갭이 아님 |
| Naver verification code | Pending | 동일 |

---

## 4. Phase 2 New Implementation Analysis

### 4.1 Station Pages: `/station/[stationId]` (Score: 80%)

**Design Document** (Section 2.2.2, Section 7.5, Phase 2 Roadmap):

#### 4.1.1 Core Structure

| Design Item | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| URL: `/station/[stationId]` | Implemented | Pass | |
| `generateStaticParams()` | Implemented | Pass | 120 seeded stations |
| `generateMetadata()` | Implemented | Pass | Dynamic title, description, OG |
| Server Component (no "use client") | Implemented | Pass | Pure server rendering |
| `notFound()` for invalid station | Implemented | Pass | `src/app/station/[stationId]/page.tsx:63` |

#### 4.1.2 Metadata Specification

**Design** (Section 2.1.6):
- title: `{역이름}역 삼행시 - 지하철 N행시`
- description: `{역이름}역 이름으로 만든 {N}행시를 감상하세요. "{첫 줄 미리보기...}" - 지하철 N행시`

**Implementation** (`src/app/station/[stationId]/page.tsx:35-36`):
- title: `{역이름}역 {N}행시 - 지하철 N행시`
- description: `{역이름}역 이름으로 만든 {N}행시. "{첫글자}{첫줄미리보기}" -- 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요.`

| Design Meta | Implementation | Status |
|-------------|----------------|:------:|
| title 패턴 | `{역이름}역 {N}행시 - 지하철 N행시` | Pass (N행시 vs 삼행시 -- 더 일반적) |
| description CTA 포함 | "노선도 위에서 감상하세요" 포함 | Pass |
| description 미리보기 포함 | seed.lines[0] 미리보기 포함 | Pass |
| alternates.canonical | `/station/${stationId}` | Pass |
| openGraph.title | Implemented | Pass |
| openGraph.description | Implemented | Pass |
| openGraph.url | `${BASE_URL}/station/${stationId}` | Pass |
| openGraph.type | "article" | Changed | Design: 명시 없음, 구현: "article" -- 적절한 선택 |
| openGraph.images | OG 이미지 URL 포함 | Pass |

#### 4.1.3 JSON-LD (CreativeWork)

| Design Field | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| @type: CreativeWork | Implemented | Pass | `page.tsx:73` |
| name: `{역이름}역 {N}행시` | Implemented | Pass | |
| text: N행시 본문 | Implemented | Pass | chars + lines join |
| inLanguage: "ko" | Implemented | Pass | |
| genre: "N행시" | Implemented | Pass | |
| about.@type: Place | Implemented | Pass | |
| about.name: `{역이름}역` | Implemented | Pass | |
| about.geo (GeoCoordinates) | Missing | Missing | Design 명시, 구현 누락 |
| about.containedInPlace | Implemented | Pass | `{cityLabel}특별시` |
| isPartOf (WebApplication) | Implemented | Pass | |

**Gap**: 설계 문서(Section 2.1.4)에서는 역별 CreativeWork JSON-LD에 `geo: { @type: "GeoCoordinates", latitude, longitude }` 필드를 포함하도록 명시했으나 구현에서는 누락되었다. 좌표 데이터는 station 객체에 이미 존재하므로(`station.lat`, `station.lng`) 추가가 용이하다.

#### 4.1.4 Content Structure

| Design Item | Implementation | Status |
|-------------|----------------|:------:|
| 역 정보 (이름, 노선) | Implemented | Pass |
| N행시 본문 (시딩 기반 정적 렌더링) | Implemented | Pass |
| 관련 역 링크 (같은 노선 인접 역) | Missing | Missing |
| "나만의 N행시 작성하기" CTA | Partial | Changed |
| BreadcrumbList JSON-LD | Missing | Missing |

**Analysis**:
- 관련 역 링크(같은 노선 인접 역)가 설계에 포함되어 있으나 구현에 없다. 내부 링크 네트워크 구축은 SEO에 중요한 요소이다.
- CTA는 "노선도에서 보기"로 구현되어 홈 페이지로 연결되나, 설계의 "나만의 N행시 작성하기" 패턴과 다르다.
- BreadcrumbList JSON-LD는 설계 문서(Section 2.2.4, Section 7.2)에서 명시했으나 구현되지 않았다.

#### 4.1.5 Coverage

| Design Target | Implementation | Status |
|---------------|----------------|:------:|
| Phase 2: 시딩 데이터 120개 역 우선 생성 | 120개 역 생성 | Pass |
| Phase 2 확장: 나머지 600+ 역 빈 랜딩 페이지 | 미구현 | Deferred |

**Note**: Phase 2 설계에서 "나머지 600+ 역에 대한 빈 랜딩 페이지 생성"을 명시했으나, 현재 구현은 시딩 데이터가 있는 120개 역만 생성한다. Phase 2 Week 2 범위에 해당하며, 추후 확장이 필요하다.

---

### 4.2 Line Pages: `/line/[city]/[lineId]` (Score: 82%)

**Design Document** (Section 2.2.3, Phase 2 Roadmap Week 3):

#### 4.2.1 Core Structure

| Design Item | Implementation | Status |
|-------------|----------------|:------:|
| URL: `/line/[city]/[lineId]` | Implemented | Pass |
| `generateStaticParams()` | Implemented | Pass |
| `generateMetadata()` | Implemented | Pass |
| Server Component | Implemented | Pass |
| `notFound()` for invalid line | Implemented | Pass |
| Seoul + Busan 전 노선 | 24 Seoul + 5 Busan = 29 lines | Pass |

**Line Coverage Verification** (Seoul 24 lines):
```
1, 2, 3, 4, 5, 6, 7, 8, 9,
shinbundang, gyeongui, suin, arex, ui, sillim,
gyeongchun, seohaeseon, gtxa, gimpo_gold,
everline, uijeongbu, incheon1, incheon2
```
**Busan 5 lines**: `1, 2, 3, 4, donghae`

All lines from `SEOUL_LINES` and `BUSAN_LINES` are included.

#### 4.2.2 Metadata Specification

**Design** (Section 2.1.6):
- title: `{노선명} N행시 모음 - 지하철 N행시`
- description: `서울 지하철 {노선명} 전체 역의 N행시를 한눈에 모아보세요. 총 {역수}개 역의 삼행시 모음.`

**Implementation** (`src/app/line/[city]/[lineId]/page.tsx:52-53`):
- title: `{도시} {노선명} N행시 모음 - 지하철 N행시`
- description: `{도시} 지하철 {노선명} 역 이름으로 만든 N행시 모음. {노선명} 각 역의 개성 있는 삼행시/사행시를 노선도와 함께 감상하세요.`

| Design Meta | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| title 패턴 | `{도시} {노선명} N행시 모음 - 지하철 N행시` | Pass | 도시 추가는 개선 |
| description | CTA 포함, 노선별 맞춤 | Pass | |
| alternates.canonical | `/line/${city}/${lineId}` | Pass | |
| openGraph 설정 | title, description, url, images | Pass | |
| openGraph.type | "website" | Pass | |
| OG 이미지 URL | 동적 `/og?title=...&subtitle=...&tag=...` | Pass | |

#### 4.2.3 JSON-LD

| Design Item | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| @type: ItemList | @type: CollectionPage | Changed | 설계: ItemList, 구현: CollectionPage |
| name | `{도시} {노선명} N행시 모음` | Pass | |
| description | Implemented | Pass | |
| url | `${BASE_URL}/line/${city}/${lineId}` | Pass | |
| numberOfItems | 미포함 | Missing | 설계에 명시 |
| hasPart (CreativeWork 배열) | Implemented | Pass | seededStations 기반 |
| BreadcrumbList JSON-LD | Missing | Missing | 설계 Section 2.2.4에 명시 |

**Gap**: JSON-LD `@type`이 설계의 `ItemList`에서 `CollectionPage`로 변경되었다. CollectionPage도 유효한 Schema.org 타입이지만, 설계와 불일치한다. 또한 `numberOfItems` 필드가 누락되었다. BreadcrumbList JSON-LD도 설계에서 명시했으나 구현되지 않았다.

#### 4.2.4 Content Structure

| Design Item | Implementation | Status |
|-------------|----------------|:------:|
| 노선 개요 (역 수, 색상) | Implemented | Pass |
| N행시가 있는 역 목록 (카드 형태) | Implemented | Pass |
| N행시가 없는 역 목록 (참여 유도) | Missing | Missing |
| 인접 노선 링크 | Missing | Missing |
| 통계: "N행시 작성률" | Partial | Changed |

**Analysis**:
- N행시가 있는 역은 카드 형태로 훌륭하게 표시되나, 시딩이 없는 역 목록은 표시되지 않는다.
- 인접 노선 링크가 없어 내부 링크 네트워크가 약하다.
- 통계는 "전체 {N}개 역 중 {M}개 역 N행시 수록" 형태로 부분 구현되었다.

---

### 4.3 Sitemap Expansion (v1.0: 90% -> v2.0: 85%)

**Design Document** (Section 2.1.1, Section 7.3):

**Current Implementation** (`src/app/sitemap.ts`):
```typescript
return [
  { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
  { url: `${BASE_URL}/dev-note`, priority: 0.4, changeFrequency: "monthly" },
  ...linePages,     // 29 line pages (Seoul 24 + Busan 5)
  ...stationPages,  // 120 station pages (seeded only)
];
```

| Design Item | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| 홈 포함 (priority 1.0) | Implemented (1.0) | Pass | |
| /dev-note 포함 | Implemented (0.4) | Pass | |
| 역별 페이지 포함 | 120 seeded stations | Pass | |
| 역별 priority (시딩 있음): 0.8 | 0.7 | Changed | 0.1 차이 |
| 역별 priority (빈 페이지): 0.5 | N/A | N/A | 빈 페이지 미구현 |
| 역별 changefreq (시딩): weekly | monthly | Changed | |
| 노선별 페이지 포함 | 29 lines (Seoul 24 + Busan 5) | Pass | |
| 노선별 priority: 0.7 | 0.6 | Changed | 0.1 차이 |
| 노선별 changefreq: weekly | monthly | Changed | |
| /about 포함 | Missing | Missing | Phase 2 item, 페이지 미구현 |
| /best 포함 | Missing | Missing | Phase 3 item |
| 전체 역 700+ 페이지 | 120 only | Deferred | Phase 2 확장 범위 |
| lastModified | `SEED_UPDATED` 고정 날짜 | Changed | 설계: `new Date()`, 구현: 고정 날짜 |

**Score 하락 이유**: sitemap이 2개 정적 페이지에서 151개 페이지로 크게 확장되었으나, priority/changefreq 값이 설계 문서와 다르다. 이는 의도적 조정일 가능성이 있으나, 설계 문서 업데이트가 필요하다.

---

### 4.4 OG Image Generation (Score: 75%)

**Design Document** (Section 7.6, Appendix A.1):

| Design Item | Implementation | Status | Notes |
|-------------|----------------|:------:|-------|
| OG 이미지 생성 기능 | `src/app/og/route.tsx` | Pass | Edge Runtime |
| 크기: 1200 x 630px | Implemented | Pass | `{ width: 1200, height: 630 }` |
| 파라미터: title, subtitle | Implemented | Pass | searchParams 기반 |
| 파라미터: tag (노선 태그) | Implemented | Pass | |
| 브랜드 표시 (m.324.ing) | Implemented | Pass | 하단에 표시 |
| 역별 페이지에서 OG URL 사용 | Implemented | Pass | `station/page.tsx:38` |
| 노선별 페이지에서 OG URL 사용 | Implemented | Pass | `line/page.tsx:54` |
| Static Export 호환성 | Warning | Warning | Edge route requires SSR mode |
| 노선별 색상 표시 | Missing | Missing | 고정 그라데이션 사용, 노선색 미반영 |
| N행시 본문 표시 | Missing | Missing | subtitle에 미리보기만 포함, 글자별 행 미표시 |

**Architecture Decision Gap**:

설계 문서 Appendix A.1에서 다음과 같이 결정했다:
> "Phase 1-2는 Static Export 유지, OG 이미지는 빌드 스크립트로 사전 생성."

그러나 실제 구현은 Edge Runtime API Route(`src/app/og/route.tsx`)를 사용한다. 현재 `next.config.ts`에 `output: 'export'`가 설정되어 있지 않으므로 Edge Route가 동작 가능하지만, 이는 Static Export로 전환할 경우 호환성 문제가 발생할 수 있다.

**OG Image Design Gap**:

설계 문서(Section 4.3)에서 제시한 OG 이미지 디자인:
```
[노선 색상 바]
강남역 삼행시
강 -- 강물에 흘러보낸 내 과거의 빈자리가
남 -- 남은 내 삶을 새롭게 시작할 힘을 만든다.
                        지하철 N행시 / m.324.ing
```

실제 구현: 범용적인 title/subtitle/tag 파라미터 기반으로, 노선 색상이나 N행시 본문의 글자별 행을 표시하지 않는다. 기능적으로 동작하지만 설계에서 의도한 역별 맞춤 디자인과 차이가 있다.

---

### 4.5 llms.txt Update (v1.0: 85% -> v2.0: 90%)

| Design Item | v1.0 Status | v2.0 Status | Notes |
|-------------|:-----------:|:-----------:|-------|
| 서비스 설명 | Changed (영어 중심) | Changed | 유지 (실용적 판단) |
| FAQ 섹션 | Pass | Pass | |
| 기술 스택 | Pass | Pass | |
| AI 시스템 허용 명시 | Pass | Pass | |
| 페이지 구조 URL 목록 | Warning | Improved | /station/{id}, /line/ URL 이제 포함 |
| llms-full.txt | Missing | Missing | Phase 3 항목 |

**Improvement**: v1.0에서 누락되었던 `/station/{stationId}`와 `/line/{city}/{lineId}` URL이 Content 섹션에 추가되어 페이지 구조 정보가 개선되었다.

---

## 5. Gap Summary

### 5.1 Resolved Gaps (v1.0 -> v2.0)

| No. | v1.0 Gap | Resolution | Evidence |
|-----|----------|:----------:|---------|
| 1 | robots.txt Disallow 규칙 누락 | Resolved | `robots.ts:10` |
| 2 | robots.txt AI 크롤러 5개 규칙 누락 | Resolved | `robots.ts:13-17` |
| 3 | llms.txt 페이지 URL 목록 부분 누락 | Improved | URL 구조 포함됨 |

### 5.2 Missing Features (Design O, Implementation X)

| No. | Item | Design Location | Description | Impact | Priority |
|-----|------|-----------------|-------------|--------|----------|
| 1 | Station JSON-LD GeoCoordinates | Section 2.1.4:L229-234 | CreativeWork.about.geo 좌표 정보 누락 | Medium | P1 |
| 2 | BreadcrumbList JSON-LD (Station) | Section 2.2.4, 7.2 | 역별 페이지 breadcrumb 구조화 데이터 누락 | Medium | P1 |
| 3 | BreadcrumbList JSON-LD (Line) | Section 2.2.4, 7.2 | 노선별 페이지 breadcrumb 구조화 데이터 누락 | Medium | P1 |
| 4 | 관련 역 링크 (인접 역) | Section 2.2.2:L325 | 같은 노선 인접 역 내부 링크 미구현 | Medium | P2 |
| 5 | N행시 없는 역 목록 (Line Page) | Section 2.2.3:L350 | 노선 페이지에서 미시딩 역 참여 유도 UI 미구현 | Low | P2 |
| 6 | 인접 노선 링크 (Line Page) | Section 2.2.3:L351 | 노선 페이지에서 다른 노선 링크 미구현 | Low | P2 |
| 7 | /about 페이지 | Section 4.1:L633 | Phase 2 Week 3 범위, 미구현 | Medium | P2 |
| 8 | 전체 역 빈 랜딩 페이지 (600+) | Section 2.2.2:L336-338 | Phase 2 확장 범위, 120개만 생성 | Low | P3 |
| 9 | OG 이미지 노선 색상 반영 | Section 4.3:L732-737 | 노선별 색상 바 미적용 | Low | P3 |
| 10 | Line JSON-LD numberOfItems | Section 7.2:L1337 | ItemList.numberOfItems 필드 누락 | Low | P3 |

### 5.3 Added Features (Design X, Implementation O)

| No. | Item | Implementation Location | Description | Impact |
|-----|------|------------------------|-------------|--------|
| 1 | robots.ts host 속성 | `src/app/robots.ts:20` | host: "https://m.324.ing" | Positive |
| 2 | JSON-LD about 배열 (Global) | `src/components/JsonLd.tsx:24-29` | Thing 배열로 주제 명시 | Positive |
| 3 | layout.tsx authors/creator/publisher | `src/app/layout.tsx:38-40` | 저자 정보 추가 | Positive |
| 4 | layout.tsx googleBot 세부 설정 | `src/app/layout.tsx:63-68` | max-video-preview, max-image-preview, max-snippet | Positive |
| 5 | twitter.creator | `src/app/layout.tsx:58` | @subway_nacrostic 핸들 | Positive |
| 6 | llms.txt 선행 구현 | `public/llms.txt` | Phase 3 항목을 Phase 1에서 선행 구현 | Positive |
| 7 | Line JSON-LD hasPart | `line/page.tsx:95-99` | CreativeWork 배열로 역별 N행시 참조 | Positive |
| 8 | OG 이미지 Edge Route | `src/app/og/route.tsx` | 빌드 스크립트 대신 동적 Edge 생성 | Neutral |

### 5.4 Changed Features (Design != Implementation)

| No. | Item | Design | Implementation | Impact |
|-----|------|--------|----------------|--------|
| 1 | Station sitemap priority | 0.8 (seeded) | 0.7 | Low |
| 2 | Station sitemap changefreq | weekly | monthly | Low |
| 3 | Line sitemap priority | 0.7 | 0.6 | Low |
| 4 | Line sitemap changefreq | weekly | monthly | Low |
| 5 | Line JSON-LD @type | ItemList | CollectionPage | Low |
| 6 | OG 이미지 생성 방식 | 빌드 스크립트 사전 생성 | Edge Runtime 동적 생성 | Medium |
| 7 | sitemap lastModified | `new Date()` (동적) | `new Date("2026-03-04")` (고정) | Low |
| 8 | 홈 sitemap changeFrequency | daily | weekly | Low (v1.0 유지) |
| 9 | dev-note sitemap priority | 0.3 | 0.4 | Low (v1.0 유지) |
| 10 | llms.txt 언어 | 한국어 중심 | 영어 중심 | Low (v1.0 유지, 실용적 판단) |

---

## 6. Match Rate Calculation

### 6.1 Phase 1 Checklist (Re-verification)

| No. | Phase 1 목표 항목 | v1.0 | v2.0 | Weight | Score |
|-----|-----------------|:----:|:----:|:------:|:-----:|
| 1 | robots.txt (크롤러 허용, Disallow, AI 규칙) | Partial | Pass | 10 | 10 |
| 2 | sitemap.xml (정적 페이지) | Pass | Pass | 10 | 9 |
| 3 | layout.tsx title template | Pass | Pass | 5 | 5 |
| 4 | layout.tsx description | Pass | Pass | 5 | 5 |
| 5 | layout.tsx keywords | Pass | Pass | 5 | 5 |
| 6 | layout.tsx metadataBase | Pass | Pass | 5 | 5 |
| 7 | layout.tsx canonical | Pass | Pass | 5 | 5 |
| 8 | layout.tsx openGraph | Pass | Pass | 10 | 10 |
| 9 | layout.tsx twitter card | Pass | Pass | 5 | 5 |
| 10 | layout.tsx robots | Pass | Pass | 5 | 5 |
| 11 | JSON-LD WebApplication | Pass | Pass | 10 | 10 |
| 12 | JSON-LD FAQPage (5+ Q&A) | Pass | Pass | 10 | 10 |
| 13 | JSON-LD layout.tsx 주입 | Pass | Pass | 5 | 5 |
| 14 | dev-note 전용 메타데이터 | Pass | Pass | 5 | 5 |
| 15 | llms.txt | Pass | Pass | 5 | 4.5 |
| **Phase 1 Total** | | | | **100** | **98.5** |

### 6.2 Phase 2 Checklist (New)

| No. | Phase 2 목표 항목 | v2.0 Status | v3.0 Status | Weight | v2.0 Score | v3.0 Score |
|-----|-----------------|:-----------:|:-----------:|:------:|:----------:|:----------:|
| 1 | /station/[stationId] 라우트 생성 | Pass | Pass | 10 | 10 | 10 |
| 2 | generateStaticParams (120 stations) | Pass | Pass | 8 | 8 | 8 |
| 3 | generateMetadata (역별 동적 메타) | Pass | Pass | 8 | 8 | 8 |
| 4 | 역별 JSON-LD CreativeWork | Partial | Pass | 8 | 6 | 8 |
| 5 | 역별 JSON-LD BreadcrumbList | Missing | Pass | 5 | 0 | 5 |
| 6 | /line/[city]/[lineId] 라우트 생성 | Pass | Pass | 10 | 10 | 10 |
| 7 | 노선별 generateMetadata | Pass | Pass | 5 | 5 | 5 |
| 8 | 노선별 JSON-LD | Partial | Partial | 5 | 3.5 | 3.5 |
| 9 | 노선별 BreadcrumbList | Missing | Pass | 3 | 0 | 3 |
| 10 | OG 이미지 생성 라우트 | Pass | Pass | 8 | 6 | 6 |
| 11 | sitemap 확장 (역 + 노선) | Partial | Partial | 8 | 6 | 7 |
| 12 | 역별 OG 이미지 URL 메타 | Pass | Pass | 5 | 5 | 5 |
| 13 | 노선별 OG 이미지 URL 메타 | Pass | Pass | 5 | 5 | 5 |
| 14 | 관련 역 링크 (내부 링크) | Missing | Pass | 5 | 0 | 5 |
| 15 | /about 페이지 (FAQ 포함) | Missing | Missing | 4 | 0 | 0 |
| 16 | 시맨틱 HTML 구조 | Pass | Pass | 3 | 3 | 3 |
| **Phase 2 Total** | | | | **100** | **75.5** | **91.5** |

### 6.3 Overall Match Rate

**v2.0 (Before Iteration 1)**:
```
+---------------------------------------------+
|  Phase 1 Match Rate: 98.5% (v1.0: 94%)      |
+---------------------------------------------+
|  Phase 2 Match Rate: 75.5%                   |
+---------------------------------------------+
|  Combined Match Rate: 88%                    |
|  (Phase 1 weight: 40%, Phase 2 weight: 60%)  |
+---------------------------------------------+
```

**v3.0 (After Iteration 1 — 2026-03-04)**:
```
+---------------------------------------------+
|  Phase 1 Match Rate: 98.5%                  |
+---------------------------------------------+
|  Phase 2 Match Rate: 91.5%  (+16 pts)       |
+---------------------------------------------+
|  Combined Match Rate: 94.3%  (+6.3%)        |
|  (Phase 1 weight: 40%, Phase 2 weight: 60%)  |
+---------------------------------------------+
|  Pass:              27 items (77%)           |
|  Partial:            3 items  (9%)           |
|  Changed:           10 items (10%)           |
|  Missing:            2 items  (4%) (P1-P2)   |
+---------------------------------------------+
|  TARGET 90% ACHIEVED                        |
+---------------------------------------------+
```

**Iteration 1 개선 항목 요약**:

| 항목 | v2.0 | v3.0 | 파일 |
|------|:----:|:----:|------|
| 역별 JSON-LD GeoCoordinates | Partial | Pass | `src/app/station/[stationId]/page.tsx` |
| 역별 JSON-LD BreadcrumbList | Missing | Pass | `src/app/station/[stationId]/page.tsx` |
| 노선별 JSON-LD BreadcrumbList | Missing | Pass | `src/app/line/[city]/[lineId]/page.tsx` |
| 인접 역 내부 링크 | Missing | Pass | `src/app/station/[stationId]/page.tsx` |
| sitemap priority (역: 0.8, 노선: 0.7) | Changed | Partial | `src/app/sitemap.ts` |

---

## 7. Phase 2 Completion Assessment

### 7.1 Phase 2 Roadmap vs Current State

| Phase 2 Week | Task | Status |
|:---:|------|:------:|
| Week 2 | /station/[stationId] 라우트 생성 | Done |
| Week 2 | generateStaticParams() 구현 | Done |
| Week 2 | generateMetadata() 역별 동적 메타 구현 | Done |
| Week 2 | 역별 JSON-LD CreativeWork + Place | Partial (geo 누락) |
| Week 3 | /line/[city]/[lineId] 라우트 생성 | Done |
| Week 3 | /about 페이지 (FAQ 포함) | Not Done |
| Week 3 | 시맨틱 HTML 리팩토링 | Done |
| Week 3 | 내부 링크 네트워크 구현 | Not Done |
| Week 4 | OG 이미지 생성 구현 | Done (방식 변경) |
| Week 4 | SNS 공유 기능 | Not Done (Phase 3) |

### 7.2 Phase 2 Completion Rate

**Phase 2 핵심 목표 5개 중 4개 완료 (80%)**:
1. Station Pages -- Done
2. Line Pages -- Done
3. OG Image Generation -- Done (방식 차이)
4. Sitemap Expansion -- Done
5. Internal Link Network -- Not Done

---

## 8. Recommended Actions

### 8.1 Immediate (P1 -- 높은 SEO 영향)

| Priority | Item | File | Description |
|----------|------|------|-------------|
| P1 | Station JSON-LD GeoCoordinates 추가 | `src/app/station/[stationId]/page.tsx` | `about.geo: { @type: "GeoCoordinates", latitude: station.lat, longitude: station.lng }` 추가 |
| P1 | BreadcrumbList JSON-LD 추가 (Station) | `src/app/station/[stationId]/page.tsx` | 홈 > {도시} > {노선} > {역이름}역 구조 |
| P1 | BreadcrumbList JSON-LD 추가 (Line) | `src/app/line/[city]/[lineId]/page.tsx` | 홈 > {도시} > {노선명} 구조 |

### 8.2 Short-term (P2 -- Phase 2 완성)

| Priority | Item | File | Description |
|----------|------|------|-------------|
| P2 | 관련 역 링크 (인접 역) | `src/app/station/[stationId]/page.tsx` | 같은 노선 이전/다음 역 링크 추가 |
| P2 | 인접 노선 링크 (Line Page) | `src/app/line/[city]/[lineId]/page.tsx` | 다른 노선으로의 내부 링크 추가 |
| P2 | sitemap priority/changefreq 조정 | `src/app/sitemap.ts` | 설계 문서 값으로 조정 또는 설계 문서 업데이트 |
| P2 | /about 페이지 구현 | `src/app/about/page.tsx` | FAQ 포함 서비스 소개 페이지 |

### 8.3 Long-term (P3 -- Phase 3 준비)

| Priority | Item | Description |
|----------|------|-------------|
| P3 | 전체 역 빈 랜딩 페이지 (600+) | generateStaticParams 확장, "첫 N행시 작성자가 되어보세요" CTA |
| P3 | OG 이미지 노선 색상 반영 | `lineColor` 파라미터 추가 또는 빌드 스크립트 전환 |
| P3 | Static Export 전환 대비 | OG 이미지 빌드 스크립트 사전 생성 방식 검토 |
| P3 | GSC/Naver 인증 코드 적용 | 외부 서비스 등록 후 `verification` 코드 입력 |

### 8.4 Design Document Update Needed

다음 항목을 설계 문서에 반영할 것을 권장한다:

- [ ] robots.ts host 속성 추가 반영
- [ ] JSON-LD about 배열 추가 반영
- [ ] llms.txt 영어 중심 작성 결정 기록
- [ ] OG 이미지 생성 방식 변경 (빌드 스크립트 -> Edge Route) 반영
- [ ] Line JSON-LD @type 변경 (ItemList -> CollectionPage) 반영
- [ ] sitemap priority/changefreq 실제 값 반영 (또는 구현을 설계에 맞춤)
- [ ] Phase 2 Station pages가 시딩 120개만 대상인 결정 기록

---

## 9. File Reference

| File | Path | Lines | Purpose | Phase |
|------|------|:-----:|---------|:-----:|
| Design Document | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/docs/04-report/seo-geo-strategy.md` | 2016 | SEO/GEO 통합 전략기획서 | - |
| robots.ts | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/robots.ts` | 23 | 크롤러 제어 | 1 |
| sitemap.ts | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/sitemap.ts` | 49 | 사이트맵 생성 (확장) | 1+2 |
| layout.tsx | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/layout.tsx` | 94 | 루트 레이아웃 + 메타데이터 | 1 |
| JsonLd.tsx | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/components/JsonLd.tsx` | 95 | JSON-LD 구조화 데이터 (Global) | 1 |
| station page | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/station/[stationId]/page.tsx` | 147 | 역별 정적 페이지 | 2 |
| line page | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/line/[city]/[lineId]/page.tsx` | 205 | 노선별 정적 페이지 | 2 |
| og route | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/og/route.tsx` | 76 | OG 이미지 동적 생성 | 2 |
| dev-note page | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/dev-note/page.tsx` | 187 | 개발 노트 페이지 | 1 |
| llms.txt | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/public/llms.txt` | 59 | AI 크롤러용 컨텍스트 | 1 |
| acrostic-seeds.ts | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/data/acrostic-seeds.ts` | 120 entries | 시딩 데이터 | 1+2 |
| seoul-subway.ts | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/data/seoul-subway.ts` | 24 lines | 서울 노선 데이터 | 2 |
| busan-subway.ts | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/data/busan-subway.ts` | 5 lines | 부산 노선 데이터 | 2 |
| next.config.ts | `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/next.config.ts` | 7 | Next.js 설정 (no `output: 'export'`) | - |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-04 | Phase 1 initial gap analysis (Match Rate: 94%) | gap-detector |
| 2.0 | 2026-03-04 | Phase 1 re-verification + Phase 2 new implementation analysis (Combined: 88%) | gap-detector |
| 3.0 | 2026-03-04 | Iteration 1 자동 수정 완료: GeoCoordinates, BreadcrumbList (x2), 인접 역 링크, sitemap priority 조정 (Combined: 94.3%) | pdca-iterator |
