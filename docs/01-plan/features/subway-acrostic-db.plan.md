# Plan: N행시 서버 DB 연동

> ⚠️ **플랜 상태 주의**: 이 플랜은 Supabase 마이그레이션을 기술하지만
> 실제 구현은 **Firebase Firestore**로 완료됨 (2026-03 기준).
> 아래 UI/UX 명세 섹션은 현재 Firestore 기반 구현에 적용되는 미완성 사항임.

## 문제
N행시 데이터가 브라우저 localStorage에만 저장되어 디바이스 간 동기화 불가.

## 해결 (실제 구현)
Firebase Firestore `acrostics` 컬렉션 사용. `bkend.ts`가 이미 Firestore SDK 기반으로 전환됨.
— 아래 Supabase 구현 범위는 **참고용**이며 실제와 다름.

## 구현 범위

### 1. Supabase 테이블
```sql
CREATE TABLE acrostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id TEXT NOT NULL UNIQUE,
  lines TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. API 라우트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/acrostics | 전체 목록 |
| POST | /api/acrostics | 생성 (인증 필수) |
| PUT | /api/acrostics/[id] | 수정 (인증 필수) |
| DELETE | /api/acrostics/[id] | 삭제 (인증 필수) |

### 3. bkend.ts 전환
- localStorage → fetch API 호출
- seed 데이터는 DB에 마이그레이션
- 읽기는 비인증, 쓰기는 JWT 인증

### 4. 환경변수
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 테스트 설정 (신규)

### 패키지 설치
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
```

### vitest.config.ts (신규)
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

### package.json scripts 추가
```json
"test": "vitest",
"test:run": "vitest run"
```

### 핵심 테스트 파일

**`src/hooks/useSubwayPageState.test.ts`**
```
loadAcrostics() — Firestore 성공 → allAcrostics 채워짐, loadingAllAcrostics=false
loadAcrostics() — Firestore 실패 → 시드 폴백, acrosticsError=true
loadAcrostics() — 최초 호출 → loadingAllAcrostics=true 후 false
loadAcrostics() — 2회차 (hasLoadedOnce=true) → 스켈레톤 없음
```

**`src/components/AcrosticList.test.tsx`**
```
loading=true → 스켈레톤 3행 렌더링
loading=false, acrostics 있음 → 목록 렌더링
loading=false, acrostics 없음 → 빈 상태 렌더링
```

**`src/components/Toast.test.tsx`**
```
onRetry 없음 → 버튼 없음 (기존 동작)
onRetry 있음 → "다시 시도" 버튼 렌더링, 클릭 시 호출됨
```

## 변경 파일 (실제 Firestore 기반)
- `src/lib/bkend.ts` ✅ 완료
- `src/hooks/useSubwayPageState.ts` — `loadingAllAcrostics`, `acrosticsError` 상태 추가 필요
- `src/components/AcrosticList.tsx` — 스켈레톤 3행 로딩 UI 추가 필요
- `src/components/Toast.tsx` — `role="status"` + `aria-live="polite"` 추가 필요

## 변경 파일 (원래 Supabase 플랜 — 참고용, 미적용)
- `src/lib/supabase.ts` (신규)
- `src/app/api/acrostics/route.ts` (신규)
- `src/app/api/acrostics/[id]/route.ts` (신규)
- `src/lib/bkend.ts` (전면 수정)
- `scripts/migrate-seeds.ts` (신규, 일회성)

---

## UI: 초기 로드 IA (비동기 전환 필수 명세)

`getAllAcrostics()` 완료 전 상태를 명확히 처리해야 함.
현재 구현은 Firestore 기반으로 이미 비동기 — 아래 상태 명세가 누락된 상태.

### 정보 계층 로딩 순서

| UI 요소 | 로드 전 | 로드 완료 후 |
|---------|---------|-------------|
| 진척도 (N/M역 N%) | `--` 또는 숨김 (0% flash 금지) | 실제 수치 |
| 노선별 카운트 pill | 숨김 (0 표시 금지) | 실제 카운트 |
| AcrosticList | **스켈레톤 3행** (pulse 애니메이션) | 항목 목록 |
| 지도 마커 (N행시 있는 역) | 전체 회색 (미구분) | 노선색 마커 표시 |

### 상태 테이블

| 기능 | LOADING | ERROR | SUCCESS | EMPTY |
|------|---------|-------|---------|-------|
| 전체 N행시 로드 | 스켈레톤 / 진척도 숨김 | Toast + 재시도 버튼 | 목록/지도 마커 표시 | "아직 작성된 시가 없습니다" |
| 역 클릭 (개별 로드) | AcrosticEditor 스피너 | 모달 내 에러 메시지 | 시 내용 표시 | 작성 유도 UI |
| 저장/수정/삭제 | 버튼 disabled + 스피너 | Toast 에러 메시지 | Toast 성공 + 모달 닫힘 | — |

### 에러 복구

- `getAllAcrostics()` 실패: Toast 3초 + **재시도 버튼** 표시 (현재 구현 없음)
- 재시도 없이 토스트만 사라지면 사용자가 빈 지도에 갇힘

### 오프라인 / 타임아웃 폴백

지하철 터널 구간 약 신호 환경 대응 (primary use case).

- Firestore 실패 → `acrostic-seeds.ts` 시드 119편+ 폴백 표시
- Toast: "오프라인 모드 — 기본 시를 읽습니다"
- 구현: `loadAcrostics()`의 catch 블록에서 시드 import 후 `setAllAcrostics(seeds)`
- 폴백 상태에서 쓰기 버튼은 disabled + "연결 필요" 툴팁

### Toast 컴포넌트 확장

현재 `Toast.tsx`는 이미 `role="status"` + `aria-live="polite"` 구현됨 — a11y 변경 불필요.

에러 Toast에 재시도 버튼 추가를 위해 `onRetry` prop 추가:
```tsx
// Toast.tsx
interface ToastProps {
  message: string;
  onRetry?: () => void; // 제공 시 자동 사라짐 없이 버튼 표시
  onClose?: () => void; // onRetry 존재 시 필수 — 닫기 버튼으로 수동 해제 가능하게
}
// onRetry Toast는 auto-dismiss 없음 → 반드시 닫기(×) 버튼 제공해야 함
// 닫기 시 page.tsx에서 setToast(null) + setToastAction(null) 호출
```

`useSubwayPageState.ts`에 `toastAction: (() => void) | null` 상태 추가:
```ts
const [toastAction, setToastAction] = useState<(() => void) | null>(null);
// ⚠️ React useState footgun: 함수를 저장할 때는 반드시 래퍼 사용
// 에러 시: setToastAction(() => () => loadAcrostics())  // ← 이중 화살표 필수
// 성공/리셋 시: setToastAction(null)
// 잘못된 예: setToastAction(() => loadAcrostics) → loadAcrostics()를 updater로 즉시 호출함
```

`page.tsx`에서:
```tsx
{toast && <Toast message={toast} onRetry={toastAction ?? undefined} />}
```

### 접근성 요구사항 (a11y)

로딩/에러 상태 전환 시 스크린리더 지원 필수:

| 요소 | 현재 | 필요한 변경 |
|------|------|------------|
| Toast 컴포넌트 | 없음 | `role="status"` + `aria-live="polite"` 추가 |
| 실시간 버튼 (비활성) | `opacity:0.4` 만 | `aria-disabled="true"` 추가 |
| AcrosticList 스켈레톤 | (신규) | 컨테이너에 `aria-busy="true"` + `aria-label="시 목록 불러오는 중"` |
| 재시도 버튼 (신규) | (신규) | `aria-label="데이터 다시 불러오기"` |

### AcrosticList 컴포넌트 인터페이스 변경

`loading?: boolean` prop 추가 필요:
```tsx
interface AcrosticListProps {
  acrostics: Acrostic[];
  stations: Station[];
  onStationClick: (station: Station) => void;
  loading?: boolean; // 추가 — true 시 스켈레톤 표시
}
```

`page.tsx` 양쪽(모바일/데스크톱)에서 `loading={loadingAllAcrostics}` 전달:
```tsx
<AcrosticList
  acrostics={listAcrostics}
  stations={allStations}
  onStationClick={handleStationClick}
  loading={loadingAllAcrostics}
/>
```

**알려진 제약**: `loadAcrostics()`는 mount 시 + save 후 두 번 호출됨.
save가 초기 로드 중 발생하면 두 Firestore 요청이 경쟁할 수 있음.
최악 결과는 단순 stale이 아니라 **방금 저장한 acrostic이 목록에서 사라짐** (초기 느린 응답이 save 후 응답을 덮어쓸 경우).
단기: 허용 (확률 낮고 새로고침으로 복구됨). 중기 TODO: AbortController 또는 요청 시퀀스 카운터로 최신 응답만 반영.

### 스켈레톤 컴포넌트 디자인 제약

신규 스켈레톤/로딩 UI는 반드시 기존 CSS 변수만 사용:
- 배경: `var(--bg-soft)` 또는 `var(--border-rule)` (새 색상 추가 금지)
- pulse 애니메이션: Tailwind `animate-pulse` 사용 (커스텀 keyframe 불필요)
- 레이아웃: 실제 AcrosticList 카드와 동일한 height/padding 유지 (layout shift 방지)

### `useSubwayPageState` 변경 사항

```ts
// 추가 상태
const [loadingAllAcrostics, setLoadingAllAcrostics] = useState(true);
const [acrosticsError, setAcrosticsError] = useState(false);
const hasLoadedOnce = useRef(false); // 스켈레톤은 최초 로드에만 표시

// loadAcrostics 수정
const loadAcrostics = useCallback(async () => {
  if (!hasLoadedOnce.current) setLoadingAllAcrostics(true); // 최초만 스켈레톤
  setAcrosticsError(false);
  try {
    const acrostics = await getAllAcrostics();
    setAllAcrostics(acrostics);
    setAcrosticStationIds(new Set(acrostics.map((a) => a.stationId)));
  } catch {
    setAcrosticsError(true);
    // 시드 폴백
    const { ACROSTIC_SEEDS } = await import("@/data/acrostic-seeds");
    setAllAcrostics(ACROSTIC_SEEDS);
    setAcrosticStationIds(new Set(ACROSTIC_SEEDS.map((a) => a.stationId)));
    setToast("오프라인 모드 — 기본 시를 읽습니다");
    setToastAction(() => () => loadAcrostics()); // ← 이중 화살표: 함수 저장 (updater 방지)
  } finally {
    setLoadingAllAcrostics(false);
    hasLoadedOnce.current = true;
  }
}, []);
```

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 4 fixes applied (React footgun, race condition, Toast dismiss, setToastAction bug) |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 4/10 → 8/10, 4 decisions |

**UNRESOLVED:** 0
**VERDICT:** ENG + DESIGN CLEAR — ready for implementation (`/pdca do`).
