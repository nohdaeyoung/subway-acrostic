# station-og Gap Analysis

> Phase: Check
> Date: 2026-03-23
> Analyzer: bkit:gap-detector

## Match Rate: 100% ✅

## Requirements Checked (10/10 PASS)

| # | Requirement | Verdict |
|---|-------------|:-------:|
| 1 | `src/lib/og-utils.ts` created with `getStationOgColor()` + `getStationOgLineName()` | PASS |
| 2 | `src/app/og/station/[stationId]/route.tsx` created (edge runtime, 1200×630) | PASS |
| 3 | `page.tsx` generateMetadata uses `/og/station/${stationId}` when seed exists | PASS |
| 4 | Card layout: line header + station name + poem lines with char badges + footer | PASS |
| 5 | Font sizes: 1-3행=60/22px, 4-5행=48/18px, 6-7행=36/15px | PASS |
| 6 | Korean font: Pretendard Bold from jsdelivr CDN | PASS |
| 7 | Font fetch failure → fallback redirect (no throw) | PASS |
| 8 | No seed → fallback to generic `/og` redirect | PASS |
| 9 | Cache-Control: max-age=3600 | PASS |
| 10 | Line color/name from `station.lines[0]` via og-utils helpers | PASS |

## Additions (implementation extras, not contradicting design)

- `lightBg()` / `badgeBg()` helpers — visual color mixing for background and char badges
- `stale-while-revalidate=86400` — aligns with design note "검증 후 86400으로 올리기"

## Gaps: None

All design requirements fully implemented. No action required.
