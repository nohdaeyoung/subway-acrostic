# SEO + GEO 통합 전략기획서

> **서비스**: 지하철 N행시 (subway-acrostic)
> **URL**: https://m.324.ing
> **작성일**: 2026-03-04
> **기술 스택**: Next.js 16 (Static Export) + Leaflet + localStorage
> **현재 상태**: SEO/GEO 미구현 (Zero State)

---

## 목차

1. [현황 진단](#1-현황-진단)
2. [SEO 전략 (담당자별)](#2-seo-전략-담당자별)
3. [GEO 전략 (Generative Engine Optimization)](#3-geo-전략-generative-engine-optimization)
4. [담당자별 액션 플랜](#4-담당자별-액션-플랜)
5. [KPI 및 측정 방안](#5-kpi-및-측정-방안)
6. [실행 로드맵](#6-실행-로드맵)
7. [구현 코드 샘플](#7-구현-코드-샘플)

---

## 1. 현황 진단

### 1.1 SEO 현황 점수

| 항목 | 현재 점수 | 목표 점수 | 비고 |
|------|----------|----------|------|
| Technical SEO | 10/100 | 85/100 | robots.txt, sitemap.xml 부재 |
| On-page SEO | 15/100 | 80/100 | 최소 메타태그만 존재 |
| Off-page SEO | 0/100 | 40/100 | 백링크, 소셜 시그널 전무 |
| Content SEO | 5/100 | 70/100 | 시딩 데이터 120개 존재하나 크롤링 불가 |
| **종합** | **8/100** | **70/100** | |

### 1.2 Technical SEO 문제점

```
CRITICAL:
[X] robots.txt 없음 → 크롤러 제어 불가
[X] sitemap.xml 없음 → 검색엔진 페이지 발견 불가
[X] OG(Open Graph) 태그 없음 → 소셜 미디어 공유 시 미리보기 없음
[X] Twitter Card 없음 → 트위터/X 공유 시 카드 없음
[X] 구조화 데이터(JSON-LD) 없음 → 리치 스니펫 불가
[X] canonical URL 없음 → 중복 콘텐츠 이슈 가능
[X] 페이지별 고유 title/description 없음 → 모든 페이지 동일 메타

WARNING:
[X] "use client" SPA 구조 → 검색엔진 자바스크립트 렌더링 의존
[X] 정적 HTML에 콘텐츠 없음 → CSR 데이터(localStorage)는 크롤링 불가
[X] lang="ko" 설정됨 (양호) → 하지만 hreflang 없음
[X] favicon 미설정 → 기본 Next.js 파비콘
[X] 이미지 alt 태그 미사용 → SVG 파일만 존재, 접근성 부재
```

### 1.3 On-page SEO 문제점

```
현재 layout.tsx 메타데이터:
- title: "지하철 N행시" (키워드 부족, 브랜드 설명 없음)
- description: "지하철역 이름으로 쓴 N행시를 노선도 위에서 열람하세요" (CTA 없음, 59자)

문제점:
[X] 단일 페이지 앱 → 모든 URL이 동일한 메타 정보
[X] heading 구조(h1~h6) 시맨틱 부족 → h1은 있으나 h2 이하 미사용
[X] 내부 링크 구조 빈약 → 홈 ↔ 개발노트만 존재
[X] URL 구조 없음 → /station/강남, /line/2 같은 의미 있는 URL 부재
[X] 콘텐츠가 JavaScript에 의존 → 크롤러가 N행시 콘텐츠 접근 불가
```

### 1.4 GEO(AI 검색 최적화) 현황 진단

| 항목 | 현재 상태 | 심각도 |
|------|----------|--------|
| AI 크롤링 가능한 텍스트 콘텐츠 | 없음 (localStorage) | CRITICAL |
| 구조화 데이터 (Schema.org) | 없음 | CRITICAL |
| FAQ/Q&A 콘텐츠 | 없음 | HIGH |
| 브랜드 멘션 (외부 사이트) | 없음 | HIGH |
| 인용 가능한 통계/사실 | 시딩 데이터 120개 존재하나 비노출 | MEDIUM |
| 권위 시그널 (도메인 연차, 백링크) | 없음 | MEDIUM |
| llms.txt / llms-full.txt | 없음 | MEDIUM |

**핵심 문제**: 현재 아키텍처에서 N행시 콘텐츠는 localStorage에만 존재하므로, 어떤 검색엔진(전통적이든 AI든)도 이 콘텐츠를 발견하고 인덱싱할 수 없다.

### 1.5 경쟁 키워드 분석

| 키워드 | 예상 월간 검색량 | 경쟁 강도 | 현재 순위 | 기회 |
|--------|----------------|----------|----------|------|
| N행시 | 2,400+ | 낮음 | 미인덱싱 | HIGH |
| 삼행시 | 1,600+ | 낮음 | 미인덱싱 | HIGH |
| 삼행시 모음 | 800+ | 낮음 | 미인덱싱 | HIGH |
| 지하철 N행시 | 50-100 | 매우 낮음 | 미인덱싱 | VERY HIGH |
| 역이름 삼행시 | 50-100 | 매우 낮음 | 미인덱싱 | VERY HIGH |
| 강남역 삼행시 | 30-50 | 매우 낮음 | 미인덱싱 | VERY HIGH |
| 지하철역 이름 놀이 | 100+ | 낮음 | 미인덱싱 | HIGH |
| N행시 생성기 | 500+ | 중간 | 미인덱싱 | MEDIUM |
| 삼행시 짓기 | 300+ | 낮음 | 미인덱싱 | HIGH |

**전략 키워드 그룹**:
- 1차 타겟: "지하철 N행시", "역이름 삼행시", "지하철역 삼행시 모음"
- 2차 타겟: "N행시 모음", "삼행시 모음", "재미있는 삼행시"
- Long-tail: "[역이름] 삼행시" (역별 약 700+ 키워드 조합)

### 1.6 타겟 오디언스 분석

| 세그먼트 | 비율 (추정) | 니즈 | 진입 경로 |
|----------|------------|------|----------|
| 10-20대 학생 | 40% | 재미, 놀이, SNS 공유 | 카카오톡, 인스타그램 |
| 20-30대 직장인 | 35% | 출퇴근 시간 활용, 가벼운 재미 | 네이버 검색, 커뮤니티 |
| 30-40대 부모 | 15% | 자녀와 함께하는 언어놀이 | 네이버/구글 검색 |
| 콘텐츠 크리에이터 | 10% | 소재 발굴, 영감 | 구글 검색, 유튜브 |

**핵심 페르소나**: 출퇴근길 지하철에서 "삼행시 모음" 또는 "재미있는 N행시"를 검색하는 20-30대 사용자

---

## 2. SEO 전략 (담당자별)

### 2.1 Technical SEO (DevOps / 프론트엔드)

#### 2.1.1 sitemap.xml 구성

```
sitemap.xml
├── 정적 페이지
│   ├── / (홈)
│   ├── /dev-note (개발 노트)
│   └── /about (서비스 소개 - 신규)
├── 역별 페이지 (서울 약 600개 + 부산 약 150개)
│   ├── /station/gangnam
│   ├── /station/hongdae
│   └── ...
├── 노선별 페이지 (서울 22개 + 부산 5개)
│   ├── /line/seoul/2
│   ├── /line/busan/1
│   └── ...
└── 콘텐츠 페이지
    ├── /best (인기 N행시)
    └── /random (랜덤 N행시)
```

**우선순위/갱신빈도 설정**:
- 홈: priority 1.0, changefreq daily
- 역별 페이지(시딩 콘텐츠 있음): priority 0.8, changefreq weekly
- 역별 페이지(빈 페이지): priority 0.5, changefreq monthly
- 노선별 페이지: priority 0.7, changefreq weekly
- 정적 페이지: priority 0.3, changefreq monthly

#### 2.1.2 robots.txt 구성

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://m.324.ing/sitemap.xml
```

AI 크롤러별 세분화:
```
# AI 검색엔진 명시적 허용
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

#### 2.1.3 Core Web Vitals 최적화

| 지표 | 현재 (추정) | 목표 | 전략 |
|------|-----------|------|------|
| LCP (Largest Contentful Paint) | 2.5-4s | < 2.5s | 지도 lazy load, 폰트 preload |
| FID (First Input Delay) | < 100ms | < 100ms | 현재 양호 예상 |
| CLS (Cumulative Layout Shift) | 0.1-0.25 | < 0.1 | 지도 영역 고정 높이, 폰트 swap |
| INP (Interaction to Next Paint) | 미측정 | < 200ms | 이벤트 핸들러 최적화 |

**구체적 최적화 항목**:
1. Leaflet 지도 번들 dynamic import (약 200KB 절감)
2. 지도 컨테이너에 고정 높이/너비 설정 (CLS 방지)
3. Google Fonts (Geist) → `display: swap` + preconnect
4. 이미지 최적화 (현재 SVG만 사용, 양호)
5. CSS 인라인 critical path 최적화 (Tailwind purge 확인)

#### 2.1.4 구조화 데이터 (JSON-LD) 설계

**홈페이지** - WebApplication + WebSite:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "지하철 N행시",
  "url": "https://m.324.ing",
  "description": "서울/부산 지하철역 이름으로 N행시(삼행시/사행시)를 작성하고 노선도 위에서 열람하는 웹 서비스",
  "applicationCategory": "EntertainmentApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "inLanguage": "ko",
  "author": {
    "@type": "Organization",
    "name": "지하철 N행시"
  }
}
```

**역별 페이지** - CreativeWork:
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "강남역 삼행시",
  "text": "강물에 흘러보낸 내 과거의 빈자리가\n남은 내 삶을 새롭게 시작할 힘을 만든다.",
  "about": {
    "@type": "Place",
    "name": "강남역",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.4979,
      "longitude": 127.0276
    },
    "containedInPlace": {
      "@type": "Place",
      "name": "서울특별시"
    }
  },
  "inLanguage": "ko",
  "genre": "N행시",
  "isPartOf": {
    "@type": "WebApplication",
    "name": "지하철 N행시",
    "url": "https://m.324.ing"
  }
}
```

**FAQ 페이지** - FAQPage:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "N행시란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "N행시는 주어진 단어의 각 글자로 시작하는 문장을 만드는 언어 놀이입니다. 예를 들어 '강남'으로 삼행시를 지으면 '강'으로 시작하는 문장과 '남'으로 시작하는 문장을 만듭니다."
      }
    }
  ]
}
```

#### 2.1.5 Canonical URL 전략

```
모든 페이지에 canonical 설정:

홈:           <link rel="canonical" href="https://m.324.ing/" />
역별 페이지:   <link rel="canonical" href="https://m.324.ing/station/gangnam" />
노선별 페이지: <link rel="canonical" href="https://m.324.ing/line/seoul/2" />
```

**중복 콘텐츠 방지 규칙**:
- 쿼리 파라미터 무시: `?view=map` 등은 canonical에 포함하지 않음
- 도시 파라미터: 역별 페이지는 도시와 무관하게 고유 URL 사용
- trailing slash: 일관되게 없음으로 통일

#### 2.1.6 페이지별 메타태그 전략

| 페이지 | title | description |
|--------|-------|-------------|
| 홈 | 지하철 N행시 - 서울/부산 지하철역 삼행시 모음 | 서울과 부산 700개+ 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요. 직접 삼행시를 작성하고 공유할 수 있습니다. |
| 역별 (콘텐츠 있음) | {역이름}역 삼행시 - 지하철 N행시 | {역이름}역 이름으로 만든 {N}행시를 감상하세요. "{첫 줄 미리보기...}" - 지하철 N행시 |
| 역별 (콘텐츠 없음) | {역이름}역 N행시 쓰기 - 지하철 N행시 | {역이름}역 이름으로 나만의 N행시를 작성해보세요. {노선명} {역이름}역의 삼행시를 기다리고 있습니다. |
| 노선별 | {노선명} N행시 모음 - 지하철 N행시 | 서울 지하철 {노선명} 전체 역의 N행시를 한눈에 모아보세요. 총 {역수}개 역의 삼행시 모음. |
| 개발 노트 | 개발 노트 - 지하철 N행시 | 지하철 N행시 서비스의 개발 기록과 업데이트 이력을 확인하세요. |
| 인기 N행시 | 인기 N행시 모음 - 지하철 N행시 | 가장 많이 읽히는 지하철 역 이름 N행시를 모아봤습니다. 재미있는 삼행시를 발견하세요. |

### 2.2 Content SEO (데이터 / 콘텐츠 담당자)

#### 2.2.1 핵심 아키텍처 전환: Static Export 기반 SEO 콘텐츠

**현재 문제**: localStorage 기반 데이터는 검색엔진이 크롤링할 수 없음

**해결 전략**: 시딩 데이터(`acrostic-seeds.ts`)를 활용한 정적 페이지 생성

```
아키텍처 전환:

[현재]
page.tsx ("use client") → localStorage → 런타임 렌더링
                                         (크롤러 접근 불가)

[목표]
acrostic-seeds.ts → generateStaticParams() → 정적 HTML 생성
                                              (크롤러 접근 가능)
                  → 클라이언트에서 localStorage 오버레이
                    (사용자 작성 콘텐츠 반영)
```

#### 2.2.2 역별 랜딩 페이지 전략

**URL 구조**: `/station/[stationId]`

```
/station/gangnam
├── 메타: "강남역 삼행시 - 지하철 N행시"
├── 콘텐츠:
│   ├── 역 정보 (이름, 노선, 좌표)
│   ├── N행시 본문 (시딩 데이터 기반 정적 렌더링)
│   ├── 관련 역 링크 (같은 노선 인접 역)
│   └── "나만의 N행시 작성하기" CTA
├── JSON-LD: CreativeWork + Place
└── OG Image: 역별 동적 생성
```

**정적 생성 대상** (Phase 1):
- 시딩 데이터가 있는 120개 역 페이지 우선 생성
- 빌드 타임에 `generateStaticParams()` + `generateMetadata()`로 정적 HTML 생성

**콘텐츠 확장 계획** (Phase 2):
- 나머지 600+ 역에 대한 빈 랜딩 페이지 생성
- "이 역의 첫 번째 N행시 작성자가 되어보세요" CTA 포함
- 역 주변 정보, 노선 정보 등 부가 콘텐츠 추가

#### 2.2.3 노선별 랜딩 페이지 전략

**URL 구조**: `/line/[city]/[lineId]`

```
/line/seoul/2
├── 메타: "서울 2호선 N행시 모음 - 지하철 N행시"
├── 콘텐츠:
│   ├── 노선 개요 (역 수, 색상, 노선 길이 등)
│   ├── N행시가 있는 역 목록 (카드 형태)
│   ├── 아직 N행시가 없는 역 목록 (참여 유도)
│   └── 인접 노선 링크
├── JSON-LD: ItemList + BreadcrumbList
└── 통계: "2호선 N행시 작성률: 15/51 (29%)"
```

#### 2.2.4 콘텐츠 구조화 방안

**BreadcrumbList 구조**:
```
홈 > 서울 > 2호선 > 강남역
홈 > 부산 > 1호선 > 서면역
홈 > 인기 N행시
```

**내부 링크 네트워크**:
```
[홈페이지]
    ├── [노선별 페이지] ←→ [역별 페이지]
    │       ↕                    ↕
    │   [인접 노선]         [인접 역]
    │                           ↕
    └── [인기 N행시] ←── [역별 페이지]
```

**콘텐츠 시딩 확장 계획**:
1. 현재 120개 시딩 데이터 유지 및 품질 개선
2. 주요 역(환승역, 랜드마크역) 30개 추가 시딩
3. 부산 지역 시딩 강화 (현재 3개 → 15개 목표)
4. 시즌별/테마별 큐레이션 콘텐츠 추가

### 2.3 On-page SEO (프론트엔드 / 디자이너)

#### 2.3.1 시맨틱 HTML 구조 개선

**현재 구조**:
```html
<main>
  <header>
    <h1>지하철 N행시</h1>   <!-- 유일한 heading -->
  </header>
  <div>...</div>            <!-- 시맨틱 없는 div 중첩 -->
</main>
```

**개선 구조**:
```html
<main>
  <header role="banner">
    <h1>지하철 N행시</h1>
    <nav aria-label="도시 선택">...</nav>
  </header>

  <nav aria-label="뷰 모드 선택">...</nav>

  <section aria-label="노선 필터">
    <h2 class="sr-only">노선 선택</h2>
    ...
  </section>

  <section aria-label="N행시 목록">
    <h2 class="sr-only">N행시 목록</h2>
    <article>
      <h3>강남역 삼행시</h3>
      ...
    </article>
  </section>

  <footer role="contentinfo">...</footer>
</main>
```

#### 2.3.2 이미지 alt 태그 전략

| 이미지 유형 | alt 텍스트 패턴 | 예시 |
|------------|----------------|------|
| 노선 색상 인디케이터 | "{노선명} 노선 표시" | "2호선 노선 표시" |
| 역 마커 (지도) | "{역이름}역 위치" | "강남역 위치" |
| N행시 카드 초성 뱃지 | 장식용이므로 `alt=""` + `aria-hidden="true"` | - |
| OG 이미지 | "{역이름}역 {N}행시 - 지하철 N행시" | "강남역 삼행시 - 지하철 N행시" |
| 소셜 공유 이미지 | 동일 | - |

#### 2.3.3 내부 링크 구조

```
현재: 홈 ↔ 개발노트 (2개 링크)

목표: 체계적 내부 링크 네트워크

홈페이지 (/)
├── /line/seoul/1 ~ /line/seoul/incheon2   (서울 22개 노선)
├── /line/busan/1 ~ /line/busan/donghae    (부산 5개 노선)
├── /best                                   (인기 N행시)
├── /about                                  (서비스 소개 + FAQ)
└── /dev-note                              (개발 노트)

노선 페이지 (/line/seoul/2)
├── /station/gangnam                        (소속 역 링크)
├── /station/yeoksam
├── /line/seoul/7                           (환승 노선 링크)
└── /                                       (홈 브레드크럼)

역별 페이지 (/station/gangnam)
├── /station/yeoksam                        (인접 역)
├── /station/gyodae                         (인접 역)
├── /line/seoul/2                           (소속 노선)
├── /line/seoul/shinbundang                 (환승 노선)
└── /                                       (홈 브레드크럼)
```

---

## 3. GEO 전략 (Generative Engine Optimization)

### 3.1 GEO 개요

GEO(Generative Engine Optimization)는 ChatGPT, Perplexity, Gemini, Claude 등 AI 기반 검색엔진에서 서비스가 인용/추천되도록 최적화하는 전략이다.

**GEO vs SEO 핵심 차이**:

| 구분 | SEO | GEO |
|------|-----|-----|
| 목표 | 검색결과 상위 노출 | AI 응답에 인용/추천 |
| 평가 주체 | Google 알고리즘 | LLM (GPT, Claude 등) |
| 콘텐츠 형태 | 키워드 최적화된 웹페이지 | 인용 가능한 정보, 구조화된 지식 |
| 링크 가치 | 백링크 = 권위 시그널 | 브랜드 멘션 = 인용 가능성 |
| 핵심 전략 | 페이지 최적화 | 답변 가능한 콘텐츠 구조화 |

### 3.2 AI 검색엔진별 대응 전략

#### ChatGPT (GPT) / Perplexity

**크롤러**: GPTBot, PerplexityBot
**특성**: 웹 크롤링 + 실시간 검색 결합, 인용 출처 표시

**대응 전략**:
1. `robots.txt`에서 GPTBot, PerplexityBot 명시적 허용
2. 구조화 데이터(JSON-LD)로 콘텐츠 의미 전달
3. FAQ 콘텐츠를 Q&A 형태로 구성하여 직접 인용 유도
4. 페이지 상단에 핵심 정보 배치 (inverted pyramid 구조)
5. `llms.txt` 파일 제공 (서비스 소개 및 API 정보)

#### Google Gemini (AI Overviews)

**특성**: Google 검색과 통합, 기존 SEO 시그널 활용

**대응 전략**:
1. Google 구조화 데이터 가이드라인 100% 준수
2. FAQPage, HowTo, CreativeWork 스키마 활용
3. "사람들이 많이 묻는 질문" 섹션 구성
4. 한국어 콘텐츠 품질 강화 (명확하고 간결한 문장)
5. Google Search Console에서 AI Overview 노출 모니터링

#### Claude / Anthropic

**크롤러**: ClaudeBot, Anthropic-ai
**특성**: 긴 문맥 이해 우수, 구조화된 콘텐츠 선호

**대응 전략**:
1. Markdown 친화적 텍스트 구조
2. 명확한 heading 계층 구조
3. 정의/설명 형태의 콘텐츠 구성
4. `llms.txt` 활용한 서비스 컨텍스트 제공

### 3.3 구조화 데이터로 AI 크롤링 최적화

**핵심 원칙**: AI 모델이 "지하철 N행시"를 하나의 도메인 지식으로 이해하도록 구조화

```
Schema.org 적용 계층:

WebSite (m.324.ing)
├── WebApplication (지하철 N행시 앱)
│   ├── CreativeWork (개별 N행시)
│   │   ├── Place (역 정보 + 좌표)
│   │   └── author (작성 정보)
│   ├── ItemList (노선별 N행시 모음)
│   └── FAQPage (자주 묻는 질문)
├── BreadcrumbList (네비게이션)
└── Organization (서비스 운영 주체)
```

### 3.4 FAQ / Q&A 콘텐츠 전략

AI 검색엔진이 직접 인용할 수 있는 Q&A 콘텐츠를 구성한다.

**FAQ 콘텐츠 (총 15-20개)**:

| 카테고리 | 질문 예시 | 목적 |
|----------|----------|------|
| 서비스 소개 | "지하철 N행시란 무엇인가요?" | 브랜드 인지 + AI 인용 |
| 사용법 | "N행시를 어떻게 작성하나요?" | 사용 유도 + How-to 스키마 |
| 콘텐츠 | "가장 인기있는 지하철역 삼행시는?" | 콘텐츠 노출 + 클릭 유도 |
| 언어놀이 | "N행시란 무엇인가요?" | 교육 콘텐츠 + 키워드 확보 |
| 지하철 정보 | "서울 지하철은 몇 호선까지 있나요?" | Long-tail 트래픽 |
| 지하철 정보 | "부산 지하철 노선은 몇 개인가요?" | 지역 키워드 확보 |

**FAQ 콘텐츠 작성 원칙**:
1. 질문은 실제 사용자가 검색할 법한 자연어로 작성
2. 답변 첫 문장에 핵심 정보를 포함 (AI 인용 최적화)
3. 답변 내에 서비스 URL과 브랜드명 자연스럽게 포함
4. JSON-LD `FAQPage` 스키마로 마크업

### 3.5 브랜드 멘션 전략

AI 검색엔진은 학습 데이터에서의 빈도(멘션 횟수)를 권위 시그널로 활용한다.

**멘션 확보 채널 (우선순위순)**:

| 채널 | 목표 | 콘텐츠 형태 | 담당 |
|------|------|------------|------|
| 네이버 블로그 | 월 2-3건 | 서비스 리뷰, N행시 소개 | 마케터 |
| 브런치/미디엄 | 월 1-2건 | 개발기, 기술 블로그 | 개발자 |
| Reddit r/korea | 분기 1건 | 서비스 소개, 재미있는 N행시 공유 | 마케터 |
| Product Hunt | 1회 | 서비스 런칭 | 마케터 |
| 디시인사이드/에펨코리아 | 월 1-2건 | 재미있는 N행시 모음 | 마케터 |
| GitHub | 상시 | 오픈소스 README에 링크 | 개발자 |
| 네이버 지식iN | 월 2-3건 | N행시 관련 답변 시 서비스 언급 | 마케터 |

### 3.6 권위 시그널 구축 방안

| 시그널 | 현재 | 목표 (6개월) | 방법 |
|--------|------|-------------|------|
| 도메인 연차 | 신규 | 6개월 | 시간 경과 (조작 불가) |
| 백링크 수 | 0 | 20+ | 블로그, 포럼, 기사 |
| 브랜드 멘션 | 0 | 50+ | 위 채널 전략 실행 |
| 소셜 시그널 | 0 | 100+ | SNS 공유 기능 + 바이럴 |
| 구조화 데이터 | 없음 | 100% 적용 | 개발 구현 |
| HTTPS | 적용 | 유지 | - |
| 콘텐츠 양 | 2 페이지 | 750+ 페이지 | 역별 + 노선별 페이지 |
| 콘텐츠 갱신 | 비정기 | 주 1회+ | 커뮤니티 콘텐츠 유입 |

### 3.7 llms.txt 전략

AI 모델이 서비스를 이해할 수 있도록 표준화된 컨텍스트 파일을 제공한다.

**`/llms.txt` 내용 설계**:
```
# 지하철 N행시 (Subway Acrostic)

> 서울/부산 지하철역 이름으로 N행시(삼행시/사행시 등)를 작성하고
> 노선도 위에서 열람하는 한국어 웹 서비스입니다.

## 서비스 개요
- URL: https://m.324.ing
- 언어: 한국어
- 지원 도시: 서울(22개 노선, 600+역), 부산(5개 노선, 150+역)
- 콘텐츠: 지하철역 이름을 이용한 N행시 (삼행시, 사행시 등)
- 비용: 무료

## 주요 기능
- 지하철 노선도 위에서 역별 N행시 열람
- 직접 N행시 작성 및 공유
- 서울/부산 전 노선 실제 지도 좌표 기반 표시
- 노선별 필터링 및 목록/지도 뷰 전환

## 콘텐츠 안내
- /station/{id} : 역별 N행시 페이지
- /line/{city}/{lineId} : 노선별 N행시 모음
- /best : 인기 N행시
- /about : 서비스 소개 및 FAQ
```

---

## 4. 담당자별 액션 플랜

### 4.1 프론트엔드 개발자

**역할**: SEO/GEO 기술 구현의 핵심 담당자

| 순서 | 작업 | 우선순위 | 예상 공수 | Phase |
|------|------|---------|----------|-------|
| 1 | layout.tsx 메타데이터 전면 개선 (title, description, OG, Twitter) | P0 | 0.5일 | 1 |
| 2 | robots.txt 작성 및 배포 | P0 | 0.5일 | 1 |
| 3 | sitemap.ts 구현 (정적 + 동적 페이지) | P0 | 1일 | 1 |
| 4 | JSON-LD 구조화 데이터 컴포넌트 구현 | P0 | 1일 | 1 |
| 5 | `/station/[stationId]` 동적 라우트 생성 | P0 | 2일 | 2 |
| 6 | `generateStaticParams()` + `generateMetadata()` 구현 | P0 | 1일 | 2 |
| 7 | `/line/[city]/[lineId]` 동적 라우트 생성 | P1 | 1.5일 | 2 |
| 8 | OG 이미지 동적 생성 API (next/og) | P1 | 1.5일 | 2 |
| 9 | 시맨틱 HTML 리팩토링 (header, nav, section, article) | P1 | 1일 | 2 |
| 10 | 내부 링크 네트워크 구현 (브레드크럼, 관련 역) | P1 | 1일 | 2 |
| 11 | `/about` 페이지 (FAQ 포함) 구현 | P1 | 1일 | 2 |
| 12 | `/best` 인기 N행시 페이지 구현 | P2 | 1일 | 3 |
| 13 | SNS 공유 기능 구현 (카카오톡, 트위터, 링크 복사) | P2 | 1일 | 3 |
| 14 | llms.txt, llms-full.txt 작성 및 배포 | P2 | 0.5일 | 3 |
| 15 | Core Web Vitals 최적화 (Leaflet lazy load 등) | P2 | 1일 | 3 |

**총 예상 공수**: 약 14.5일

**핵심 구현 고려사항**:

```
아키텍처 전환 핵심:
- acrostic-seeds.ts의 데이터를 빌드 타임에 정적 HTML로 생성
- "use client"는 인터랙티브 기능(지도, 에디터)에만 사용
- 역별/노선별 페이지는 Server Component로 구현
- generateStaticParams()로 빌드 시 모든 역 페이지 사전 생성
- 클라이언트에서 localStorage 데이터로 시딩 데이터 오버라이드
```

**Static Export 호환성 주의사항**:

현재 `next.config.ts`에 `output: 'export'` 설정이 없으므로 Static Export를 사용하려면 다음을 확인해야 한다.

```
Static Export에서 불가한 기능:
- next/og (Image Response) → 대안: 사전 빌드된 OG 이미지 사용
- API Routes → 현재 사용하지 않으므로 무관
- Middleware → 현재 사용하지 않으므로 무관
- ISR → Static Export에서 불가, 전체 빌드로 대체

Static Export에서 가능한 기능:
- generateStaticParams() → 정적 페이지 생성 가능
- generateMetadata() → 정적 메타데이터 생성 가능
- sitemap.ts → 정적 sitemap 생성 가능
- robots.ts → 정적 robots.txt 생성 가능
- JSON-LD → <script> 태그로 정적 삽입 가능
```

### 4.2 데이터 관리자

**역할**: 콘텐츠 전략 수립 및 시딩 데이터 관리

| 순서 | 작업 | 우선순위 | 예상 공수 | Phase |
|------|------|---------|----------|-------|
| 1 | 시딩 데이터 품질 검수 (오타, 문맥 확인) | P0 | 2일 | 1 |
| 2 | 주요 환승역 30개 N행시 추가 시딩 | P1 | 3일 | 2 |
| 3 | 부산 시딩 데이터 12개 추가 (현재 3개) | P1 | 2일 | 2 |
| 4 | FAQ 콘텐츠 15-20개 작성 | P1 | 2일 | 2 |
| 5 | 역별 부가 정보 데이터 구성 (개통연도, 일일 승객수 등) | P2 | 3일 | 3 |
| 6 | 월별 테마 콘텐츠 기획 (봄/여름/가을/겨울) | P2 | 1일 | 3 |
| 7 | 커뮤니티 제출 N행시 큐레이션 기준 수립 | P2 | 1일 | 3 |

**총 예상 공수**: 약 14일

**시딩 데이터 품질 기준**:
```
필수 조건:
- 역 이름의 각 글자로 정확히 시작해야 함
- 욕설, 비하, 혐오 표현 금지
- 최소 2행 이상

권장 조건:
- 감성적이거나 위트 있는 내용
- 역/지역과 관련된 내용 우대
- 스토리가 있는 구성
```

### 4.3 디자이너

**역할**: OG 이미지 디자인, 소셜 공유 비주얼

| 순서 | 작업 | 우선순위 | 예상 공수 | Phase |
|------|------|---------|----------|-------|
| 1 | OG 이미지 기본 템플릿 디자인 (1200x630) | P0 | 2일 | 1 |
| 2 | 노선별 OG 이미지 색상 가이드 | P1 | 0.5일 | 1 |
| 3 | 파비콘 및 앱 아이콘 디자인 (16/32/180/192/512) | P1 | 1일 | 1 |
| 4 | 소셜 공유 카드 디자인 (카카오톡, 트위터) | P1 | 1.5일 | 2 |
| 5 | 역별 OG 이미지 동적 템플릿 시안 | P1 | 1일 | 2 |
| 6 | 서비스 소개 페이지 비주얼 | P2 | 1일 | 3 |
| 7 | SNS 홍보용 이미지 템플릿 (인스타그램, 트위터) | P2 | 1일 | 3 |

**총 예상 공수**: 약 8일

**OG 이미지 디자인 가이드**:
```
기본 템플릿 (1200 x 630px):
┌─────────────────────────────────────────────────┐
│                                                   │
│  [노선 색상 바]                                     │
│                                                   │
│  강남역 삼행시                                      │
│                                                   │
│  강 ─ 강물에 흘러보낸 내 과거의 빈자리가              │
│  남 ─ 남은 내 삶을 새롭게 시작할 힘을 만든다.         │
│                                                   │
│                          지하철 N행시 · m.324.ing   │
│                                                   │
└─────────────────────────────────────────────────┘

노선별 색상:
- 1호선: #0052A4 (파랑)
- 2호선: #00A84D (초록)
- 3호선: #EF7C1C (주황)
- ... (seoul-subway.ts SEOUL_LINES 참조)
```

### 4.4 DevOps

**역할**: 인프라, 배포, 성능 최적화

| 순서 | 작업 | 우선순위 | 예상 공수 | Phase |
|------|------|---------|----------|-------|
| 1 | Google Search Console 등록 및 소유권 인증 | P0 | 0.5일 | 1 |
| 2 | Naver Search Advisor 등록 | P0 | 0.5일 | 1 |
| 3 | robots.txt 배포 확인 | P0 | 0.5일 | 1 |
| 4 | sitemap.xml 배포 및 제출 | P0 | 0.5일 | 1 |
| 5 | CDN 캐시 전략 수립 (정적 페이지: 1일, 이미지: 1주) | P1 | 1일 | 2 |
| 6 | HTTPS 인증서 갱신 자동화 확인 | P1 | 0.5일 | 2 |
| 7 | 빌드 파이프라인에 sitemap 자동 생성 통합 | P1 | 1일 | 2 |
| 8 | Core Web Vitals 모니터링 대시보드 구성 | P2 | 1일 | 3 |
| 9 | 페이지 로딩 성능 모니터링 (실제 사용자 데이터) | P2 | 1일 | 3 |
| 10 | 배포 시 자동 Google Indexing API 호출 | P3 | 1일 | 3 |

**총 예상 공수**: 약 7.5일

**CDN 캐시 전략**:
```
Cache-Control 헤더 설정:

HTML 페이지:
  Cache-Control: public, max-age=86400, stale-while-revalidate=3600
  (1일 캐시, 1시간 stale 허용)

정적 에셋 (_next/static):
  Cache-Control: public, max-age=31536000, immutable
  (1년 캐시, 해시 기반 파일명)

OG 이미지:
  Cache-Control: public, max-age=604800
  (1주 캐시)

sitemap.xml:
  Cache-Control: public, max-age=3600
  (1시간 캐시)
```

### 4.5 QA

**역할**: SEO 테스트 자동화, 품질 보증

| 순서 | 작업 | 우선순위 | 예상 공수 | Phase |
|------|------|---------|----------|-------|
| 1 | Lighthouse CI 파이프라인 구성 | P0 | 1일 | 1 |
| 2 | SEO 체크리스트 기반 수동 검증 | P0 | 1일 | 1 |
| 3 | 메타태그 자동 검증 테스트 작성 | P1 | 1일 | 2 |
| 4 | JSON-LD 유효성 자동 테스트 | P1 | 1일 | 2 |
| 5 | OG 이미지 렌더링 테스트 | P1 | 0.5일 | 2 |
| 6 | 모바일/데스크톱 반응형 SEO 검증 | P1 | 0.5일 | 2 |
| 7 | sitemap.xml URL 유효성 검증 | P1 | 0.5일 | 2 |
| 8 | Core Web Vitals 주간 리포트 자동화 | P2 | 1일 | 3 |
| 9 | 깨진 링크(404) 자동 감지 | P2 | 0.5일 | 3 |
| 10 | Google Rich Results Test API 자동 검증 | P3 | 1일 | 3 |

**총 예상 공수**: 약 8일

**Lighthouse CI 임계값**:
```
Lighthouse CI Assert 설정:

Performance: >= 80
Accessibility: >= 90
Best Practices: >= 90
SEO: >= 90

개별 Audit:
- meta-description: pass
- document-title: pass
- robots-txt: pass
- canonical: pass
- structured-data: pass (커스텀)
- image-alt: pass
- hreflang: pass
```

**SEO 수동 체크리스트**:
```
배포 전 체크:
[ ] 모든 페이지에 고유한 title 태그 존재
[ ] 모든 페이지에 고유한 meta description 존재
[ ] 모든 페이지에 canonical URL 설정
[ ] OG 태그 4종 (title, description, image, url) 설정
[ ] Twitter Card 태그 설정
[ ] JSON-LD 구조화 데이터 삽입
[ ] robots.txt 접근 가능
[ ] sitemap.xml 접근 가능 및 URL 유효
[ ] 모든 이미지에 alt 속성 존재
[ ] heading 태그 계층 구조 올바름 (h1 > h2 > h3)
[ ] 404 페이지 커스텀 구현
[ ] 내부 링크에 깨진 링크 없음
```

### 4.6 마케터

**역할**: 외부 홍보, 백링크, 커뮤니티 전략

| 순서 | 작업 | 우선순위 | 예상 공수 | Phase |
|------|------|---------|----------|-------|
| 1 | Google Search Console / Naver Search Advisor 분석 시작 | P0 | 상시 | 1 |
| 2 | 서비스 소개 블로그 포스트 1편 작성 (네이버 블로그) | P1 | 1일 | 2 |
| 3 | 커뮤니티 포스팅 (에펨코리아, 인스타그램) | P1 | 상시 | 2 |
| 4 | 네이버 지식iN N행시 관련 답변 시 서비스 링크 포함 | P1 | 상시 | 2 |
| 5 | SNS 공유 캠페인 기획 ("내 출근길 N행시 챌린지") | P1 | 2일 | 3 |
| 6 | 인스타그램 계정 운영 (주 2-3회 N행시 카드 게시) | P2 | 상시 | 3 |
| 7 | Product Hunt 런칭 준비 | P2 | 2일 | 3 |
| 8 | 기술 블로그 게시 (개발기) | P2 | 1일 | 3 |
| 9 | 월별 "이달의 N행시" 큐레이션 SNS 발행 | P2 | 상시 | 3 |
| 10 | 지하철 관련 커뮤니티/매체 협력 제안 | P3 | 상시 | 3 |

**총 예상 공수**: 약 6일 + 상시 운영

**SNS 캠페인 아이디어**:
```
#1 "내 출근길 N행시 챌린지"
- 매일 출근길 역 이름으로 N행시를 쓰고 캡처 공유
- 해시태그: #지하철N행시 #출근길삼행시 #서울지하철
- 플랫폼: 인스타그램, 트위터

#2 "우리 동네 역 삼행시 대결"
- 같은 노선의 인접 역 N행시 대결 투표
- 해시태그: #역대결 #지하철N행시
- 플랫폼: 인스타그램 스토리 투표

#3 "노선 완주 챌린지"
- 한 노선의 모든 역에 N행시를 쓰는 챌린지
- 완주 인증 시 SNS에서 선정
```

---

## 5. KPI 및 측정 방안

### 5.1 목표 KPI

#### Phase 1: 기반 구축 (1개월)

| KPI | 현재 | 목표 | 측정 방법 |
|-----|------|------|----------|
| Google 인덱싱 페이지 수 | 0 | 150+ | Google Search Console |
| Lighthouse SEO 점수 | 미측정 | 90+ | Lighthouse CI |
| robots.txt + sitemap 상태 | 없음 | 정상 동작 | 수동 확인 |
| 구조화 데이터 오류 | 없음 (미구현) | 0건 | Google Rich Results Test |

#### Phase 2: 콘텐츠 확산 (3개월)

| KPI | 현재 | 목표 | 측정 방법 |
|-----|------|------|----------|
| 월간 자연 검색 유입 | 0 | 500+ | Google Analytics |
| 인덱싱 페이지 수 | 0 | 750+ | Google Search Console |
| 평균 검색 순위 (타겟 키워드) | 미노출 | 30위 이내 | Google Search Console |
| 백링크 수 | 0 | 10+ | Ahrefs / Search Console |
| OG 이미지 노출 공유 수 | 0 | 50+ | SNS 트래킹 |

#### Phase 3: 성장 궤도 (6개월)

| KPI | 현재 | 목표 | 측정 방법 |
|-----|------|------|----------|
| 월간 자연 검색 유입 | 0 | 3,000+ | Google Analytics |
| "지하철 N행시" 키워드 순위 | 미노출 | 1-3위 | Google Search Console |
| AI 검색 응답 인용 횟수 | 0 | 월 5+ | 수동 모니터링 |
| 브랜드 검색량 ("지하철 N행시") | 0 | 100+/월 | Google Trends |
| Core Web Vitals 통과율 | 미측정 | 90%+ | CrUX Report |
| SNS 팔로워 (인스타그램) | 0 | 500+ | 인스타그램 인사이트 |

#### Phase 4: 안정화 (1년)

| KPI | 현재 | 목표 | 측정 방법 |
|-----|------|------|----------|
| 월간 자연 검색 유입 | 0 | 10,000+ | Google Analytics |
| "N행시 모음" 키워드 순위 | 미노출 | 10위 이내 | Google Search Console |
| Naver 검색 노출 | 0 | 상위 노출 | Naver Search Advisor |
| AI 검색 브랜드 멘션 | 0 | 안정적 인용 | AI 검색 모니터링 |
| 페이지 체류 시간 | 미측정 | 2분+ | Google Analytics |

### 5.2 Google Search Console 설정

**설정 순서**:
1. 도메인 소유권 인증 (DNS TXT 레코드 방식 권장)
2. sitemap.xml 제출
3. URL 검사 도구로 주요 페이지 인덱싱 요청
4. 실적 보고서 필터 설정 (키워드별, 페이지별)
5. Core Web Vitals 보고서 활성화

**주요 모니터링 지표**:
- 전체 클릭수, 노출수, CTR, 평균 게재순위
- 상위 검색어 (어떤 키워드로 노출되는지)
- 상위 페이지 (어떤 페이지가 유입을 만드는지)
- 커버리지 오류 (인덱싱 실패 페이지)

### 5.3 측정 도구 스택

| 도구 | 용도 | 비용 |
|------|------|------|
| Google Search Console | 검색 성과 추적, 인덱싱 관리 | 무료 |
| Google Analytics 4 | 트래픽 분석, 사용자 행동 | 무료 |
| Naver Search Advisor | 네이버 검색 최적화 | 무료 |
| Lighthouse CI | SEO/성능 자동 테스트 | 무료 |
| Google PageSpeed Insights | Core Web Vitals 측정 | 무료 |
| Google Rich Results Test | 구조화 데이터 검증 | 무료 |
| Schema.org Validator | JSON-LD 문법 검증 | 무료 |
| Ahrefs Webmaster Tools | 백링크 모니터링 | 무료(기본) |
| Screaming Frog (옵션) | 크롤링 시뮬레이션 | 무료(500 URL 이하) |

---

## 6. 실행 로드맵

### Phase 1: Technical SEO 기반 구축 (1주)

```
Day 1-2: 기본 인프라
├── [프론트엔드] layout.tsx 메타데이터 전면 개선
├── [프론트엔드] robots.ts 구현
├── [프론트엔드] sitemap.ts 구현 (정적 페이지 + 시딩 데이터 역)
├── [DevOps] Google Search Console 등록
├── [DevOps] Naver Search Advisor 등록
└── [디자이너] 파비콘 디자인

Day 3-4: 구조화 데이터
├── [프론트엔드] JSON-LD 컴포넌트 구현 (WebApplication, WebSite)
├── [프론트엔드] canonical URL 설정
├── [QA] Lighthouse CI 파이프라인 구성
├── [QA] SEO 체크리스트 기반 검증
└── [데이터] 시딩 데이터 품질 검수 시작

Day 5: 검증 및 배포
├── [QA] 메타태그, 구조화 데이터 검증
├── [DevOps] sitemap.xml 제출 (GSC, Naver)
├── [DevOps] CDN 캐시 전략 적용
└── [전원] Phase 1 리뷰 및 Phase 2 계획 확정
```

### Phase 2: 콘텐츠 SEO 구현 (2-4주)

```
Week 2: 역별 페이지 구현
├── [프론트엔드] /station/[stationId] 라우트 생성
├── [프론트엔드] generateStaticParams() 구현
├── [프론트엔드] generateMetadata() 역별 동적 메타 구현
├── [프론트엔드] 역별 JSON-LD (CreativeWork + Place) 구현
├── [데이터] 주요 환승역 N행시 시딩 추가 (15개)
└── [디자이너] OG 이미지 기본 템플릿 완성

Week 3: 노선별 페이지 + 부가 페이지
├── [프론트엔드] /line/[city]/[lineId] 라우트 생성
├── [프론트엔드] /about 페이지 (FAQ 포함) 구현
├── [프론트엔드] 시맨틱 HTML 리팩토링
├── [프론트엔드] 내부 링크 네트워크 구현
├── [데이터] FAQ 콘텐츠 15개 작성
├── [데이터] 부산 시딩 데이터 추가
└── [QA] 메타태그/JSON-LD 자동 검증 테스트

Week 4: OG 이미지 + 공유 기능
├── [프론트엔드] OG 이미지 생성 구현
├── [프론트엔드] SNS 공유 기능 구현
├── [디자이너] 소셜 공유 카드 디자인 반영
├── [QA] OG 이미지 렌더링 테스트
├── [QA] sitemap URL 유효성 검증
├── [DevOps] 빌드 파이프라인 sitemap 자동 생성 통합
└── [마케터] 서비스 소개 블로그 포스트 작성
```

### Phase 3: GEO 최적화 및 브랜딩 (1-3개월)

```
Month 2: GEO 기반 구축
├── [프론트엔드] llms.txt 작성 및 배포
├── [프론트엔드] /best 인기 N행시 페이지 구현
├── [프론트엔드] Core Web Vitals 최적화
├── [데이터] 역별 부가 정보 데이터 구성
├── [데이터] 월별 테마 콘텐츠 기획
├── [마케터] 커뮤니티 포스팅 시작
├── [마케터] 네이버 지식iN 활동 시작
├── [마케터] SNS 캠페인 기획 및 실행
└── [QA] Core Web Vitals 주간 리포트 자동화

Month 3: 확산 및 성장
├── [마케터] Product Hunt 런칭
├── [마케터] 인스타그램 계정 본격 운영
├── [마케터] 기술 블로그 게시
├── [데이터] 커뮤니티 콘텐츠 큐레이션 시작
├── [DevOps] 성능 모니터링 대시보드 구성
├── [QA] 깨진 링크 자동 감지 구현
└── [전원] 3개월 KPI 리뷰 및 전략 조정
```

### 타임라인 다이어그램

```
         Week 1    Week 2    Week 3    Week 4    Month 2   Month 3
         ┌────────┬────────┬────────┬────────┬────────┬────────┐
Phase 1  │████████│        │        │        │        │        │
Tech SEO │ meta   │        │        │        │        │        │
         │ robot  │        │        │        │        │        │
         │ sitemap│        │        │        │        │        │
         ├────────┼────────┼────────┼────────┤        │        │
Phase 2  │        │████████│████████│████████│        │        │
Content  │        │ station│ line   │ OG img │        │        │
SEO      │        │ pages  │ pages  │ share  │        │        │
         │        │        │ FAQ    │        │        │        │
         ├────────┼────────┼────────┼────────┼────────┼────────┤
Phase 3  │        │        │        │        │████████│████████│
GEO +    │        │        │        │        │ llms   │ PH     │
Brand    │        │        │        │        │ SNS    │ growth │
         │        │        │        │        │ blog   │ review │
         └────────┴────────┴────────┴────────┴────────┴────────┘
```

---

## 7. 구현 코드 샘플

### 7.1 layout.tsx 메타데이터 개선

```typescript
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://m.324.ing";
const SITE_NAME = "지하철 N행시";
const SITE_DESCRIPTION =
  "서울과 부산 700개+ 지하철역 이름으로 쓴 N행시를 노선도 위에서 감상하세요. 직접 삼행시를 작성하고 공유할 수 있습니다.";

export const metadata: Metadata = {
  // 기본 메타
  title: {
    default: `${SITE_NAME} - 서울/부산 지하철역 삼행시 모음`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "N행시",
    "삼행시",
    "지하철",
    "지하철역",
    "서울 지하철",
    "부산 지하철",
    "삼행시 모음",
    "N행시 모음",
    "역이름 삼행시",
    "지하철 N행시",
    "언어놀이",
    "노선도",
  ],

  // Canonical
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 서울/부산 지하철역 삼행시 모음`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "지하철 N행시 - 서울/부산 지하철역 삼행시 모음",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - 서울/부산 지하철역 삼행시 모음`,
    description: SITE_DESCRIPTION,
    images: ["/og-default.png"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 기타
  applicationName: SITE_NAME,
  category: "entertainment",
  creator: "지하철 N행시",
  publisher: "지하철 N행시",

  // 아이콘
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },

  // 검증
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
    // other: { "naver-site-verification": "NAVER_VERIFICATION_CODE" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: "ko",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/station/{search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* JSON-LD: WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              inLanguage: "ko",
              author: {
                "@type": "Organization",
                name: SITE_NAME,
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### 7.2 JSON-LD 구조화 데이터 컴포넌트

```typescript
// src/components/JsonLd.tsx

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// --- 역별 페이지용 JSON-LD 생성 함수 ---

interface StationJsonLdParams {
  stationName: string;
  stationId: string;
  lat: number;
  lng: number;
  city: string;
  lineName: string;
  acrosticLines: string[];
}

export function createStationJsonLd({
  stationName,
  stationId,
  lat,
  lng,
  city,
  lineName,
  acrosticLines,
}: StationJsonLdParams): Record<string, unknown> {
  const cityName = city === "seoul" ? "서울특별시" : "부산광역시";
  const charCount = stationName.length;
  const nType = charCount === 2 ? "이" : charCount === 3 ? "삼" : `${charCount}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${stationName}역 ${nType}행시`,
    text: acrosticLines.join("\n"),
    url: `https://m.324.ing/station/${stationId}`,
    inLanguage: "ko",
    genre: "N행시",
    about: {
      "@type": "Place",
      name: `${stationName}역`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lng,
      },
      containedInPlace: {
        "@type": "Place",
        name: cityName,
      },
    },
    isPartOf: {
      "@type": "WebApplication",
      name: "지하철 N행시",
      url: "https://m.324.ing",
    },
  };
}

// --- 노선별 페이지용 JSON-LD 생성 함수 ---

interface LineJsonLdParams {
  lineName: string;
  city: string;
  lineId: string;
  stationCount: number;
  acrosticCount: number;
}

export function createLineJsonLd({
  lineName,
  city,
  lineId,
  stationCount,
  acrosticCount,
}: LineJsonLdParams): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${lineName} N행시 모음`,
    description: `${lineName} 전체 ${stationCount}개 역 중 ${acrosticCount}개 역의 N행시를 감상하세요.`,
    url: `https://m.324.ing/line/${city}/${lineId}`,
    numberOfItems: acrosticCount,
    itemListElement: [], // 동적으로 채움
  };
}

// --- BreadcrumbList JSON-LD ---

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

### 7.3 sitemap.ts 구현

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_STATIONS } from "@/data/busan-subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";

const BASE_URL = "https://m.324.ing";

// 시딩 데이터가 있는 역 ID 목록
const seededStationIds = new Set(ACROSTIC_SEEDS.map((s) => s.stationId));

// 서울 노선 ID 목록
const SEOUL_LINE_IDS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "shinbundang", "gyeongui", "suin", "arex", "gyeongchun",
  "seohaeseon", "ui", "sillim", "gtxa", "gimpo_gold",
  "everline", "uijeongbu", "incheon1", "incheon2",
];

// 부산 노선 ID 목록
const BUSAN_LINE_IDS = ["1", "2", "3", "4", "donghae"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // 1. 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/dev-note`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/best`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // 2. 서울 역별 페이지
  const seoulStationPages: MetadataRoute.Sitemap = SEOUL_STATIONS.map(
    (station) => ({
      url: `${BASE_URL}/station/${station.id}`,
      lastModified: now,
      changeFrequency: seededStationIds.has(station.id)
        ? ("weekly" as const)
        : ("monthly" as const),
      priority: seededStationIds.has(station.id) ? 0.8 : 0.5,
    })
  );

  // 3. 부산 역별 페이지
  const busanStationPages: MetadataRoute.Sitemap = BUSAN_STATIONS.map(
    (station) => ({
      url: `${BASE_URL}/station/${station.id}`,
      lastModified: now,
      changeFrequency: seededStationIds.has(station.id)
        ? ("weekly" as const)
        : ("monthly" as const),
      priority: seededStationIds.has(station.id) ? 0.8 : 0.5,
    })
  );

  // 4. 서울 노선별 페이지
  const seoulLinePages: MetadataRoute.Sitemap = SEOUL_LINE_IDS.map(
    (lineId) => ({
      url: `${BASE_URL}/line/seoul/${lineId}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  // 5. 부산 노선별 페이지
  const busanLinePages: MetadataRoute.Sitemap = BUSAN_LINE_IDS.map(
    (lineId) => ({
      url: `${BASE_URL}/line/busan/${lineId}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [
    ...staticPages,
    ...seoulStationPages,
    ...busanStationPages,
    ...seoulLinePages,
    ...busanLinePages,
  ];
}
```

### 7.4 robots.ts 구현

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "Anthropic-ai",
        allow: "/",
      },
    ],
    sitemap: "https://m.324.ing/sitemap.xml",
  };
}
```

### 7.5 역별 동적 페이지 예시

```typescript
// src/app/station/[stationId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_STATIONS } from "@/data/busan-subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import JsonLd, {
  createStationJsonLd,
  createBreadcrumbJsonLd,
} from "@/components/JsonLd";
import StationPageClient from "./StationPageClient";

// 모든 역 데이터 통합
const ALL_STATIONS = [
  ...SEOUL_STATIONS.map((s) => ({ ...s, city: "seoul" as const })),
  ...BUSAN_STATIONS.map((s) => ({ ...s, city: "busan" as const })),
];

const stationMap = new Map(ALL_STATIONS.map((s) => [s.id, s]));
const seedMap = new Map(ACROSTIC_SEEDS.map((s) => [s.stationId, s]));

// 빌드 타임에 모든 역 페이지 사전 생성
export function generateStaticParams() {
  return ALL_STATIONS.map((station) => ({
    stationId: station.id,
  }));
}

// 역별 동적 메타데이터
export function generateMetadata({
  params,
}: {
  params: { stationId: string };
}): Metadata {
  const station = stationMap.get(params.stationId);
  if (!station) return {};

  const seed = seedMap.get(station.id);
  const charCount = station.name.length;
  const nType =
    charCount === 2 ? "이" : charCount === 3 ? "삼" : `${charCount}`;

  const title = seed
    ? `${station.name}역 ${nType}행시`
    : `${station.name}역 N행시 쓰기`;

  const description = seed
    ? `${station.name}역 이름으로 만든 ${nType}행시를 감상하세요. "${seed.lines[0]}..." - 지하철 N행시`
    : `${station.name}역 이름으로 나만의 N행시를 작성해보세요. 지하철 N행시`;

  return {
    title,
    description,
    alternates: {
      canonical: `/station/${station.id}`,
    },
    openGraph: {
      title: `${title} | 지하철 N행시`,
      description,
      url: `https://m.324.ing/station/${station.id}`,
      images: [
        {
          url: `/og/station/${station.id}.png`,
          width: 1200,
          height: 630,
          alt: `${station.name}역 ${nType}행시 - 지하철 N행시`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 지하철 N행시`,
      description,
      images: [`/og/station/${station.id}.png`],
    },
  };
}

export default function StationPage({
  params,
}: {
  params: { stationId: string };
}) {
  const station = stationMap.get(params.stationId);
  if (!station) return notFound();

  const seed = seedMap.get(station.id);
  const cityName = station.city === "seoul" ? "서울" : "부산";
  const primaryLineName = station.lines[0]; // 실제 구현에서는 LINE 정보 매핑

  return (
    <>
      {/* 구조화 데이터 */}
      {seed && (
        <JsonLd
          data={createStationJsonLd({
            stationName: station.name,
            stationId: station.id,
            lat: station.lat,
            lng: station.lng,
            city: station.city,
            lineName: primaryLineName,
            acrosticLines: seed.lines,
          })}
        />
      )}

      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "홈", url: "https://m.324.ing" },
          { name: cityName, url: `https://m.324.ing/line/${station.city}` },
          {
            name: `${station.name}역`,
            url: `https://m.324.ing/station/${station.id}`,
          },
        ])}
      />

      {/* 정적 렌더링된 콘텐츠 (SEO용) */}
      <article>
        <header>
          <h1>{station.name}역 N행시</h1>
          <p>
            {cityName} 지하철 {station.name}역
          </p>
        </header>

        {seed ? (
          <section aria-label="N행시 콘텐츠">
            <h2 className="sr-only">
              {station.name}역{" "}
              {station.name.length === 2
                ? "이"
                : station.name.length === 3
                  ? "삼"
                  : station.name.length}
              행시
            </h2>
            {station.name.split("").map((char, i) => (
              <div key={i}>
                <strong>{char}</strong>
                <span>{seed.lines[i] || ""}</span>
              </div>
            ))}
          </section>
        ) : (
          <section aria-label="N행시 작성 안내">
            <p>
              아직 {station.name}역의 N행시가 없습니다. 첫 번째 작성자가
              되어보세요.
            </p>
          </section>
        )}
      </article>

      {/* 클라이언트 인터랙션 (에디터, 지도 등) */}
      <StationPageClient stationId={params.stationId} />
    </>
  );
}
```

### 7.6 OG 이미지 생성 코드

> **참고**: Static Export(`output: 'export'`)에서는 `next/og` ImageResponse를 사용할 수 없다.
> 아래는 두 가지 대안을 제시한다.

#### 대안 A: 빌드 스크립트로 OG 이미지 사전 생성 (Static Export 호환)

```typescript
// scripts/generate-og-images.ts
// 빌드 시 실행하여 모든 역의 OG 이미지를 사전 생성

import { createCanvas, registerFont } from "canvas"; // node-canvas 사용
import * as fs from "fs";
import * as path from "path";
import { SEOUL_STATIONS } from "../src/data/seoul-subway";
import { BUSAN_STATIONS } from "../src/data/busan-subway";
import { ACROSTIC_SEEDS } from "../src/data/acrostic-seeds";

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = "public/og/station";

const seedMap = new Map(ACROSTIC_SEEDS.map((s) => [s.stationId, s]));

function generateOgImage(
  stationName: string,
  stationId: string,
  lineColor: string,
  acrosticLines?: string[]
) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // 배경
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 상단 노선 색상 바
  ctx.fillStyle = lineColor;
  ctx.fillRect(0, 0, WIDTH, 8);

  // 역 이름
  ctx.fillStyle = "#111827";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText(`${stationName}역`, 60, 100);

  // N행시 타입
  const charCount = stationName.length;
  const nType = charCount === 2 ? "이" : charCount === 3 ? "삼" : `${charCount}`;
  ctx.fillStyle = "#6B7280";
  ctx.font = "24px sans-serif";
  ctx.fillText(`${nType}행시`, 60, 140);

  // N행시 내용
  if (acrosticLines) {
    const chars = stationName.split("");
    let y = 200;
    for (let i = 0; i < chars.length; i++) {
      // 초성 원
      ctx.beginPath();
      ctx.arc(80, y + 4, 18, 0, Math.PI * 2);
      ctx.fillStyle = `${lineColor}33`;
      ctx.fill();
      ctx.fillStyle = lineColor;
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(chars[i], 80, y + 11);

      // 내용
      ctx.textAlign = "left";
      ctx.fillStyle = "#374151";
      ctx.font = "22px sans-serif";
      const text = acrosticLines[i] || "";
      const truncated = text.length > 40 ? text.slice(0, 40) + "..." : text;
      ctx.fillText(truncated, 115, y + 11);

      y += 50;
    }
  } else {
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "28px sans-serif";
    ctx.fillText("나만의 N행시를 작성해보세요", 60, 300);
  }

  // 하단 브랜드
  ctx.fillStyle = "#D1D5DB";
  ctx.fillRect(0, HEIGHT - 60, WIDTH, 1);
  ctx.fillStyle = "#9CA3AF";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("지하철 N행시  m.324.ing", WIDTH - 60, HEIGHT - 22);

  // 파일 저장
  const outputPath = path.join(OUTPUT_DIR, `${stationId}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
}

// 실행
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const allStations = [
  ...SEOUL_STATIONS.map((s) => ({ ...s, city: "seoul" })),
  ...BUSAN_STATIONS.map((s) => ({ ...s, city: "busan" })),
];

for (const station of allStations) {
  const seed = seedMap.get(station.id);
  generateOgImage(
    station.name,
    station.id,
    "#00A84D", // 실제 구현에서는 노선별 색상 매핑
    seed?.lines
  );
}

console.log(`Generated ${allStations.length} OG images`);
```

#### 대안 B: API Route 기반 동적 생성 (SSR 모드 전환 시)

```typescript
// src/app/api/og/[stationId]/route.tsx
// Static Export가 아닌 SSR/ISR 모드에서만 사용 가능

import { ImageResponse } from "next/og";
import { SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_STATIONS } from "@/data/busan-subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";

export const runtime = "edge";

const allStations = new Map(
  [
    ...SEOUL_STATIONS.map((s) => ({ ...s, city: "seoul" as const })),
    ...BUSAN_STATIONS.map((s) => ({ ...s, city: "busan" as const })),
  ].map((s) => [s.id, s])
);

const seedMap = new Map(ACROSTIC_SEEDS.map((s) => [s.stationId, s]));

export async function GET(
  _request: Request,
  { params }: { params: { stationId: string } }
) {
  const station = allStations.get(params.stationId);
  if (!station) {
    return new Response("Station not found", { status: 404 });
  }

  const seed = seedMap.get(station.id);
  const chars = station.name.split("");
  const charCount = chars.length;
  const nType =
    charCount === 2 ? "이" : charCount === 3 ? "삼" : `${charCount}`;
  const lineColor = "#00A84D"; // 실제 구현에서는 노선별 색상 매핑

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 노선 색상 바 */}
        <div style={{ height: 8, backgroundColor: lineColor, width: "100%" }} />

        {/* 콘텐츠 */}
        <div style={{ display: "flex", flexDirection: "column", padding: 60, flex: 1 }}>
          {/* 역 이름 */}
          <div style={{ fontSize: 48, fontWeight: 700, color: "#111827" }}>
            {station.name}역
          </div>
          <div
            style={{ fontSize: 24, color: "#6B7280", marginTop: 8 }}
          >
            {nType}행시
          </div>

          {/* N행시 내용 */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 40, gap: 16 }}>
            {seed ? (
              chars.map((char, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: `${lineColor}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 700,
                      color: lineColor,
                    }}
                  >
                    {char}
                  </div>
                  <div style={{ fontSize: 22, color: "#374151" }}>
                    {(seed.lines[i] || "").slice(0, 40)}
                    {(seed.lines[i] || "").length > 40 ? "..." : ""}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 28, color: "#9CA3AF" }}>
                나만의 N행시를 작성해보세요
              </div>
            )}
          </div>
        </div>

        {/* 하단 브랜드 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px 60px",
            borderTop: "1px solid #E5E7EB",
            fontSize: 18,
            color: "#9CA3AF",
          }}
        >
          지하철 N행시 &middot; m.324.ing
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

### 7.7 llms.txt 구현

```
// public/llms.txt

# 지하철 N행시 (Subway Acrostic)

> 서울/부산 지하철역 이름으로 N행시(삼행시/사행시 등)를 작성하고
> 노선도 위에서 열람하는 한국어 웹 서비스입니다.

## 서비스 개요
- URL: https://m.324.ing
- 언어: 한국어
- 지원 도시: 서울(22개 노선, 600+역), 부산(5개 노선, 150+역)
- 콘텐츠: 지하철역 이름을 이용한 N행시 (삼행시, 사행시 등)
- 비용: 무료

## N행시란?
N행시는 주어진 단어의 각 글자로 시작하는 문장을 만드는 한국의 전통적인 언어 놀이입니다.
예를 들어 "강남"으로 이행시를 지으면:
- 강: 강물에 흘러보낸 내 과거의 빈자리가
- 남: 남은 내 삶을 새롭게 시작할 힘을 만든다.

## 주요 기능
- 지하철 노선도(Leaflet 지도) 위에서 역별 N행시 열람
- 직접 N행시 작성
- 서울/부산 전 노선 실제 지도 좌표 기반 표시
- 노선별 필터링 및 목록/지도 뷰 전환

## 페이지 구조
- / : 메인 페이지 (지도 + 목록 뷰)
- /station/{stationId} : 역별 N행시 상세 페이지
- /line/{city}/{lineId} : 노선별 N행시 모음
- /best : 인기 N행시 모음
- /about : 서비스 소개 및 FAQ
- /dev-note : 개발 기록

## 기술 스택
- Next.js 16 + TypeScript
- Leaflet (지도 시각화)
- Tailwind CSS (스타일링)

## 문의
- 서비스에 대한 문의는 웹사이트를 통해 가능합니다.
```

---

## 부록: 전략 의사결정 기록

### A.1 Static Export vs SSR 전환 결정

| 옵션 | 장점 | 단점 | 권장도 |
|------|------|------|--------|
| Static Export 유지 | 비용 없음, 빠른 로딩, CDN 캐시 | OG 이미지 동적 생성 불가, ISR 불가 | O (권장) |
| SSR 전환 (Vercel) | OG 이미지 동적 생성, ISR 가능 | 서버 비용 발생, 인프라 복잡도 증가 | 향후 고려 |
| Hybrid (Static + Edge Function) | OG 이미지만 Edge에서 생성 | 설정 복잡도 | 중기 옵션 |

**결정**: Phase 1-2는 Static Export 유지, OG 이미지는 빌드 스크립트로 사전 생성. 트래픽이 월 10,000 이상 도달 시 SSR 전환 검토.

### A.2 사용자 작성 콘텐츠(UGC) SEO 반영 방안

현재 사용자가 작성한 N행시는 localStorage에만 저장되어 검색엔진에 노출되지 않는다. 향후 UGC를 SEO에 반영하려면 다음 단계가 필요하다.

```
현재 → Phase 2 (시딩만 정적) → Phase 4 (UGC 서버화)

Phase 4 요구사항:
1. 백엔드 API 서버 구축 (사용자 콘텐츠 저장)
2. 콘텐츠 모더레이션 시스템
3. ISR 또는 SSR로 전환하여 실시간 콘텐츠 반영
4. 사용자 인증 시스템 (스팸 방지)

현재 단계에서는 시딩 데이터 기반 정적 페이지로 SEO 기반을 먼저 구축한다.
```

### A.3 비용 추정

| 항목 | Phase 1-2 | Phase 3 | Phase 4 (향후) |
|------|----------|---------|---------------|
| 호스팅 | 무료 (정적) | 무료 (정적) | $10-20/월 (SSR) |
| 도메인 | 기존 유지 | 기존 유지 | 기존 유지 |
| CDN | 무료 (Cloudflare/Vercel) | 무료 | $0-10/월 |
| 모니터링 도구 | 무료 | 무료 | 무료 |
| OG 이미지 빌드 | 빌드 타임 (무료) | 빌드 타임 (무료) | Edge ($0-5/월) |
| **월 총비용** | **$0** | **$0** | **$10-35** |

---

## 문서 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-03-04 | v1.0 | 초안 작성 |
