# station-og Design

> office-hours 세션 설계 문서 요약
> 원본: ~/.gstack/projects/nohdaeyoung-subway-acrostic/dyno-main-design-20260322-232939.md
> Status: APPROVED

## 목표

`/og/station/[stationId]` 전용 edge route 신설 — 역별 노선색 액센트 OG 이미지 카드.

현재 `/og` 라우트는 제네릭 그린 텍스트 카드. 소셜 공유 시 N행시 내용이 보이지 않음.

## 구현 범위

### 신규 파일
- `src/lib/og-utils.ts` — `getStationOgColor()`, `getStationOgLineName()`
- `src/app/og/station/[stationId]/route.tsx` — 전용 ImageResponse

### 수정 파일
- `src/app/station/[stationId]/page.tsx` — generateMetadata OG URL 변경

### 참고: AcrosticEditor에 getLineName() 이미 존재 → 공통 유틸로 추출 고려

## 카드 레이아웃 (1200×630)

```
┌─────────────────────────────────────────┐
│ ● 서울 2호선 · 2행시          [좌상단]  │
│ 강남역                         [크게]   │
│ ◉강  강물처럼 흘러가는 도시의 맥박      │
│ ◉남  남쪽으로 떠나는 꿈을 싣고서       │
│ 🚇 지하철역 시짓기 놀이  m.324.ing     │
└─────────────────────────────────────────┘
```

노선별 배경색 (lines[0] 기준):
- 서울 2호선 `#00A84D` → 초록 계열
- 서울 1호선 `#0052A4` → 남색 계열
- 부산 1호선 `#F06A2E` → 주황 계열

## 행 수별 font-size 규칙

| 행 수 | 역 이름 | 시 줄 |
|-------|---------|-------|
| 1–3행 | 60px   | 22px  |
| 4–5행 | 48px   | 18px  |
| 6–7행 | 36px   | 15px  |

가산디지털단지(7행) 등 장문 역 확인됨.

## 한글 폰트 로드 (필수)

```ts
const fontData = await fetch(
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff"
).then(res => res.arrayBuffer());
// ImageResponse fonts: [{ name: "Pretendard", data: fontData, weight: 700 }]
```

폰트 fetch 실패 시 → 기존 `/og`로 fallback (에러 throw 금지).

## Fallback

시드에 없는 역 → 기존 `/og?title=...` redirect.

## 캐시

초기: `max-age=3600` (검증 후 86400으로 올리기).
