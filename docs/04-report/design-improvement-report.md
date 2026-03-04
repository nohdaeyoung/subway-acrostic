# 지하철 N행시 - 디자인 점검 보고서

**작성일**: 2026-03-04
**버전**: v1.7 기준
**URL**: https://m.324.ing
**스택**: Next.js 16 + Tailwind CSS 4 + Leaflet + React 19

---

## 1. 현황 분석

### 1-1. PC 레이아웃 현황

```
┌────────────────────────────────────────────────────────┐
│  Header: [지하철 N행시] [서울|부산 탭]      [범례] [관리자]  │
├────────────────────────────────────────────────────────┤
│  ViewToggle: [목록] [지도]                               │
├────────────────────────────────────────────────────────┤
│  LineFilter: [전체] [1호선] [2호선] ... (데스크톱 버튼 행)  │
├────────────────────────────────────────────────────────┤
│                                                        │
│          지도 (aspect-square) 또는 목록 카드             │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Footer: [© 2026 지하철 N행시]            [개발 노트]    │
└────────────────────────────────────────────────────────┘
```

**헤더**: `flex items-center justify-between px-4 py-3` - 고정 높이 없음, shrink-0으로 축소 방지.
**지도 영역**: `w-full aspect-square rounded-xl` - 정사각형 비율 강제. PC에서 뷰포트 너비를 그대로 사용해 좌우 여백 없음.
**목록 영역**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` - max-w-5xl 적용되어 있으나, 컨테이너 정렬은 왼쪽 정렬(mx-auto 없음).
**최대 너비 제한 없음**: 전체 레이아웃에 max-w 컨테이너가 없어 4K 모니터에서 지도가 전체 화면을 차지함.

### 1-2. 모바일 레이아웃 현황

```
┌─────────────────────┐
│  Header (px-4 py-3) │  ← CityTabs가 header 내부에 inline 배치
├─────────────────────┤
│  ViewToggle          │
├─────────────────────┤
│  LineFilter (select) │  ← md:hidden으로 모바일에서 select UI
├─────────────────────┤
│                     │
│  지도(정사각형)       │  ← 375px 폰에서 375×375 = 화면의 60%+
│                     │
├─────────────────────┤
│  Footer              │
└─────────────────────┘
```

**현재 반응형 브레이크포인트**: `sm(640px)`, `md(768px)` 두 단계만 활용.
**모바일 지도**: aspect-square로 정사각형 고정 — 모바일에서는 화면 높이의 절반이 넘는 영역을 지도가 차지. 남은 공간이 footer뿐이라 스크롤 없이 지도 탐색이 강요됨.
**헤더 혼잡**: h1 텍스트 + CityTabs + 범례 + 관리자 버튼이 한 줄에 몰림. 375px에서 압박 심함.
**모바일 범례**: `hidden sm:flex`로 640px 미만에서 범례가 완전히 숨겨짐 — 사용자가 색상 의미를 파악할 수 없음.

### 1-3. 컬러 시스템 현황

`globals.css`에 정의된 CSS 변수:
```css
--background: #ffffff
--foreground: #171717
```

실제 코드에서 사용되는 색상 (Tailwind 유틸리티 직접 사용):

| 역할 | 값 | 사용 위치 |
|------|-----|-----------|
| 브랜드 그린 (Primary) | `emerald-500` (#10b981) | 역 마커 (N행시 있음), 포커스링 |
| 브랜드 그린 진 | `emerald-600` (#059669) | 저장 버튼, 로그인 버튼 |
| 브랜드 그린 연 | `emerald-100` | 편집 모드 글자 뱃지 배경 |
| 텍스트 주 | `gray-900` (#111827) | 제목, 강조 텍스트 |
| 텍스트 부 | `gray-500` (#6b7280) | 설명 텍스트 |
| 텍스트 약 | `gray-400` (#9ca3af) | 비활성, 푸터 |
| 배경 | `gray-50` (#f9fafb) | 앱 배경, 목록 헤더 |
| 카드 배경 | `white` | 카드, 헤더, 푸터 |
| 경계선 | `gray-200` (#e5e7eb) | 구분선 |
| 에러 | `red-500` (#ef4444) | 에러 메시지 |
| 삭제 버튼 | `red-600` (#dc2626) | 삭제 텍스트 |

**문제**: Design Token이 없음. 동일한 색상 값이 컴포넌트 전반에 하드코딩. 브랜드 색상이 `emerald`로 고정되어 있으나 CSS 변수화되지 않음.

### 1-4. 타이포그래피 현황

```
body font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
                  (layout.tsx에서 Geist Sans 로드 후 globals.css에서 시스템 폰트로 덮어씀)
```

| 역할 | 클래스 | 픽셀 환산 |
|------|---------|-----------|
| 페이지 제목 (h1) | `text-lg font-bold` | 18px |
| 섹션 제목 (h2) | `text-xl font-bold` | 20px |
| 카드 제목 | `text-sm font-bold` | 14px |
| 본문 | `text-sm` | 14px |
| 보조 | `text-xs` | 12px |
| 지도 마커 레이블 | 인라인 `font-size:10px` | 10px |

**문제**: 타이포그래피 스케일이 정의되지 않음. `text-lg` 헤더와 `text-xl` 모달 제목 간 위계 혼란. Geist 폰트를 로드하지만 body에서 시스템 폰트로 override되는 버그 존재.

### 1-5. 컴포넌트별 UX 현황

| 컴포넌트 | 현황 | 비고 |
|----------|------|------|
| **CityTabs** | pill 스타일 탭, 전환 즉각 반응 | 도시 전환 시 지도 뷰포트 이동은 있으나 애니메이션 없음 |
| **SubwayMap** | aspect-square 정사각형 지도 | 로딩 시 animate-pulse 스켈레톤 있음 |
| **AcrosticEditor** | 모달 다이얼로그, ESC 닫기 지원 | 로딩 상태는 텍스트만 표시 |
| **AcrosticList** | 노선별 그룹핑, 카드 그리드 | 빈 상태 텍스트 처리 있음 |
| **LoginForm** | 모달, 비밀번호만 입력 | 로딩 상태 없음, 제출 중 버튼 비활성화 없음 |

---

## 2. 문제점 도출

### 2-1. PC 디자인 문제점

**P1 - 지도 비율 문제**
`aspect-square`로 고정되어 와이드 화면에서 지도가 정사각형으로만 표시됨. 1440px 이상 해상도에서는 지도가 전체 너비를 차지해 좌우 여백이 없는 답답한 레이아웃.

**P2 - 레이아웃 최대 너비 없음**
page.tsx 전체에 `max-w-*` 컨테이너가 없음. 4K 모니터에서 헤더, 필터, 지도가 전체 너비로 늘어남. 가독성 저하.

**P3 - 노선 필터 바 오버플로우**
서울의 경우 22+개 노선 버튼이 `flex-wrap`으로 표시되어 필터 바가 2~3행으로 줄바꿈. 콘텐츠 영역이 비정형적으로 축소됨.

**P4 - 헤더 요소 밀도**
헤더 단일 줄에 서비스명 + CityTabs + 범례 + 관리자 메뉴가 모두 배치. 시각적 위계가 평탄함.

**P5 - 빈 모달 닫기 버튼 크기**
`&times;` 텍스트 버튼의 클릭 영역이 작음(묵시적 크기). WCAG 기준 44×44px 터치 타겟 미달.

### 2-2. 모바일 디자인 문제점

**M1 - 지도가 화면 대부분 차지**
375px 폰에서 `aspect-square`로 375×375px 지도가 렌더링됨. 헤더(~56px) + 뷰토글(~44px) + 노선필터(~44px) + 지도(375px) + 푸터(~36px) = 555px → 세로로 스크롤 없이 지도 외에 콘텐츠를 볼 수 없음.

**M2 - 헤더 레이아웃 붕괴 가능성**
CityTabs의 `px-6 py-2` 버튼이 서비스명 우측에 inline 배치. 375px에서 서비스명 + 탭(2개×76px) + 관리자 버튼 = 공간 부족으로 레이아웃 압박.

**M3 - 범례 숨김**
`hidden sm:flex` — 640px 미만 모든 기기에서 N행시 있음/없음 범례가 숨겨짐. 신규 사용자가 초록 마커의 의미를 알 수 없음.

**M4 - 노선 select 옵션 가독성**
모바일 노선 필터는 native `<select>`. 노선 색상 정보를 표시할 수 없어 시각적 식별이 어려움.

**M5 - 목록 뷰 스크롤 컨테이너**
`viewMode === "list"` 시 `h-screen` + `flex-1 min-h-0`으로 AcrosticList가 화면 높이에 맞게 스크롤. 구조는 올바르나, 모바일에서 헤더/뷰토글/푸터가 화면 15~20%를 차지해 카드 표시 영역이 좁음.

**M6 - AcrosticEditor 모달 뷰포트 초과 위험**
`max-w-sm mx-4`로 고정. 역 이름이 5글자 이상인 경우(예: "불암산역") 편집 폼이 화면 높이를 초과할 수 있으나 모달에 overflow-y-auto가 없음.

### 2-3. 접근성(a11y) 문제점

| 항목 | 현황 | WCAG 기준 |
|------|------|-----------|
| 헤더 닫기 버튼 | `&times;` 텍스트, aria-label 없음 | 2.4.6 (레이블) |
| CityTabs | `role="tablist"` 없음, 활성 탭 `aria-selected` 없음 | 1.3.1 (정보 구조) |
| ViewMode 토글 | aria-pressed 없음 | 4.1.2 (상태) |
| 지도 마커 | Leaflet DivIcon, alt/aria-label 없음 | 1.1.1 (비텍스트 콘텐츠) |
| 에러 메시지 | `role="alert"` 없음 | 4.1.3 (상태 메시지) |
| 컬러 대비 | gray-400 (#9ca3af) on white = 2.85:1 | AA 기준 4.5:1 미달 |
| 컬러 대비 | gray-500 (#6b7280) on white = 4.48:1 | AA 기준 4.5:1 간신히 통과 |
| 포커스 링 | 일부 버튼 `focus:ring-2 focus:ring-emerald-500` 있음 | 일관성 없음 |
| 노선 범례 색상 | 색상만으로 구분 | 1.4.1 (색상에만 의존 금지) |

### 2-4. 인터랙션/애니메이션 부재

| 부재 항목 | 영향 |
|-----------|------|
| 모달 등장/퇴장 애니메이션 | 갑작스러운 출현으로 context loss |
| 도시 탭 전환 트랜지션 | 지도 뷰포트 순간 이동, 어색함 |
| 카드 hover 효과 | `hover:border-emerald-300 hover:shadow-sm`만 존재, 규모 작음 |
| 버튼 클릭 피드백 | active 상태 스타일 없음 |
| 저장 성공 피드백 | 성공 후 모달이 닫히기만 함, 성공 토스트 없음 |
| 페이지 전환 | Next.js 기본, 커스텀 없음 |
| 지도 초기 로드 | animate-pulse 있음 (양호) |

### 2-5. 빈 상태(Empty State) 처리

| 상황 | 현재 처리 | 개선 필요 |
|------|-----------|-----------|
| 목록 - N행시 없음 | "아직 N행시가 없습니다" 텍스트 | 일러스트/CTA 없음 |
| 역 모달 - N행시 없음 | "아직 N행시가 없습니다" 텍스트 (gray-400) | 비로그인 사용자에게 설명 없음 |
| 지도 로딩 | animate-pulse + 텍스트 | 양호 |
| 데이터 로딩 오류 | 없음 | 네트워크 오류 처리 없음 |

---

## 3. 개선안 제안

### 3-1. 컬러 시스템 개선 (Design Tokens)

`globals.css`에 CSS 변수 기반 Design Token을 정의합니다.

```css
/* globals.css - Design Tokens */
:root {
  /* === Brand Colors === */
  --color-brand-50:  #ecfdf5;   /* emerald-50 */
  --color-brand-100: #d1fae5;   /* emerald-100 */
  --color-brand-500: #10b981;   /* emerald-500 - 마커, 강조 */
  --color-brand-600: #059669;   /* emerald-600 - 버튼 배경 */
  --color-brand-700: #047857;   /* emerald-700 - 버튼 hover */

  /* === Semantic Colors === */
  --color-success: #10b981;
  --color-error:   #ef4444;
  --color-warning: #f59e0b;

  /* === Neutral Scale === */
  --color-neutral-50:  #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-700: #374151;
  --color-neutral-900: #111827;

  /* === Surface === */
  --color-surface:       #ffffff;
  --color-surface-muted: #f9fafb;
  --color-border:        #e5e7eb;
  --color-border-muted:  #f3f4f6;

  /* === Text === */
  --color-text-primary:   #111827;
  --color-text-secondary: #374151;
  --color-text-muted:     #6b7280;
  --color-text-disabled:  #9ca3af; /* 주의: AA 대비 미달 → 비활성에만 사용 */
}

/* Dark Mode */
.dark {
  --color-surface:       #0f172a;
  --color-surface-muted: #1e293b;
  --color-border:        #334155;
  --color-border-muted:  #1e293b;
  --color-text-primary:  #f1f5f9;
  --color-text-secondary:#cbd5e1;
  --color-text-muted:    #94a3b8;
  --color-text-disabled: #64748b;
}
```

**컬러 대비 보정**: `gray-400`(#9ca3af) 사용 위치를 `gray-500`(#6b7280, 대비 4.48:1) 이상으로 교체. 범례, 카운터 등 정보를 전달하는 텍스트는 최소 `gray-600`(4.54:1) 사용.

### 3-2. 타이포그래피 스케일 정의

현재 Geist 폰트 로드 후 globals.css에서 시스템 폰트로 override되는 버그를 수정합니다.

```css
/* globals.css */
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* body에서 CSS 변수 참조 */
body {
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif;
}
```

타이포그래피 스케일:

| 토큰명 | Tailwind 클래스 | 픽셀 | line-height | 사용처 |
|--------|----------------|------|-------------|--------|
| `display` | `text-2xl font-bold` | 24px | 1.25 | 통계 카드 수치 |
| `heading-1` | `text-xl font-bold` | 20px | 1.3 | 모달 제목 |
| `heading-2` | `text-lg font-semibold` | 18px | 1.4 | 섹션 제목 |
| `body-lg` | `text-base` | 16px | 1.6 | 본문 주 |
| `body` | `text-sm` | 14px | 1.5 | 본문 부, 카드 |
| `caption` | `text-xs` | 12px | 1.4 | 보조, 범례 |
| `micro` | `text-[10px]` | 10px | 1.2 | 지도 마커 레이블 |

**헤더 h1 수정**: 현재 `text-lg` → `text-xl font-bold`로 격상해 모달 h2와 위계 역전 해소.

### 3-3. 컴포넌트별 개선 방향

#### Header (page.tsx)

현재: 단일 flex row에 모든 요소 배치
개선: 2단 헤더 또는 모바일에서 CityTabs를 별도 행으로 분리

```tsx
/* 개선된 헤더 구조 */
<header className="bg-white border-b border-gray-200 shrink-0">
  {/* 주 헤더 행 */}
  <div className="flex items-center justify-between px-4 h-14">
    <h1 className="text-xl font-bold text-gray-900 tracking-tight">지하철 N행시</h1>
    <div className="flex items-center gap-2">
      {/* 관리자 버튼 */}
    </div>
  </div>
  {/* 서브 헤더 행 - 탭 + 범례 */}
  <div className="flex items-center justify-between px-4 pb-2">
    <CityTabs activeCity={city} onChange={setCity} />
    <div className="flex gap-3 text-xs text-gray-500">
      {/* 범례 - 모바일에서도 표시 */}
    </div>
  </div>
</header>
```

#### SubwayMap

현재: `aspect-square` → 모바일/PC 모두 정사각형
개선: 뷰포트 기반 높이 지정으로 지도가 화면에 맞게 표시

```tsx
/* SubwayMap.tsx */
<div className="w-full h-[calc(100dvh-theme(spacing.44))] rounded-xl overflow-hidden border border-gray-200">
  {/* 44는 헤더(56) + 뷰토글(44) + 노선필터(44) + 푸터(36) 합산 예시 */}
  <LeafletMap {...props} />
</div>
```

또는 CSS 사용자 지정 속성 방식:

```tsx
/* 더 유연한 방법: style prop */
<div
  className="w-full overflow-hidden rounded-xl border border-gray-200"
  style={{ height: "calc(100dvh - var(--header-total-h, 180px))" }}
>
```

#### AcrosticEditor (모달)

현재: 고정 `max-w-sm`, overflow 없음
개선: 최대 높이 + 스크롤 + 등장 애니메이션

```tsx
/* 개선 방향 */
<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40
               animate-in fade-in duration-200">
  <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl
                  w-full sm:max-w-sm mx-0 sm:mx-4
                  max-h-[90dvh] flex flex-col
                  animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
    {/* 헤더 - shrink-0 */}
    <div className="flex items-start justify-between p-6 pb-4 shrink-0">
      ...
    </div>
    {/* 스크롤 가능 콘텐츠 */}
    <div className="overflow-y-auto flex-1 px-6 pb-4">
      ...
    </div>
    {/* 하단 버튼 - shrink-0 */}
    <div className="px-6 pb-6 pt-2 shrink-0 border-t border-gray-100">
      ...
    </div>
  </div>
</div>
```

**모바일 Bottom Sheet 패턴**: 모바일에서는 하단에서 올라오는 Bottom Sheet, 태블릿/PC에서는 중앙 다이얼로그로 분리.

#### AcrosticList

현재: `px-4 py-3 max-w-5xl` (mx-auto 없어 좌측 정렬)
개선: 목록 그리드에 `mx-auto` 추가, 카드 hover 상태 강화

```tsx
/* 개선 */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
               px-4 py-3 max-w-5xl mx-auto">
```

카드 개선 방향:

```tsx
<button
  className="text-left bg-white border border-gray-200 rounded-xl p-4
             hover:border-emerald-300 hover:shadow-md
             transition-all duration-150
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
             active:scale-[0.98]"
>
```

#### CityTabs

현재: role 없음, aria-selected 없음
개선: 시맨틱 마크업 추가

```tsx
<div role="tablist" aria-label="도시 선택" className="flex gap-1 bg-gray-100 rounded-lg p-1">
  {TABS.map(({ city, label }) => (
    <button
      key={city}
      role="tab"
      aria-selected={activeCity === city}
      onClick={() => onChange(city)}
      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
        ${activeCity === city
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"}
      `}
    >
      {label}
    </button>
  ))}
</div>
```

#### LoginForm

현재: 제출 중 로딩 상태 없음
개선:
- `submitting` 상태 추가, 버튼 비활성화 및 스피너 표시
- `aria-busy`, `aria-live` 에러 영역 추가

#### 닫기 버튼 (AcrosticEditor, LoginForm)

현재: `&times;` 텍스트 버튼
개선:

```tsx
<button
  onClick={onClose}
  aria-label="닫기"
  className="absolute top-4 right-4 p-2 rounded-lg
             text-gray-400 hover:text-gray-600 hover:bg-gray-100
             transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
>
  <svg aria-hidden="true" ... />  {/* 44×44 터치 타겟 보장 */}
</button>
```

### 3-4. 모바일 우선(Mobile-First) 재설계 방향

**레이아웃 재구조**:

```
Mobile (< 768px):
┌─────────────────────┐
│ h1 + 관리자 버튼      │  h-12
├─────────────────────┤
│ CityTabs + 범례      │  h-10
├─────────────────────┤
│ ViewToggle           │  h-10
├─────────────────────┤
│ 지도 (dvh 기반)      │  flex-1
│ 또는 목록 스크롤     │
└─────────────────────┘  (푸터 제거 - 정보 최소화)

Desktop (>= 1024px):
┌────────────────────────────────────────┐
│ max-w-screen-xl mx-auto              │
├──────────────┬─────────────────────────┤
│              │                         │
│  지도(flex)  │  사이드바: ViewToggle +  │
│              │  노선필터 + 목록         │
│              │                         │
└──────────────┴─────────────────────────┘
```

**dvh(Dynamic Viewport Height) 사용**: iOS Safari 주소창 이슈 해결을 위해 `100dvh` 사용.

```tsx
/* 지도 높이 Mobile */
className="h-[calc(100dvh-8rem)]"  /* 전체 높이 - 헤더+컨트롤 */
```

**터치 타겟 최소 크기**: 모든 인터랙티브 요소 최소 44×44px. 현재 view toggle 버튼(`px-3 py-1.5`)은 약 32px 높이로 미달.

```tsx
/* 개선: py-2.5 이상 */
className="px-4 py-2.5 text-sm rounded-lg ..."
```

### 3-5. 다크모드 지원

현재: 다크모드 미지원 (globals.css `.dark` 없음)
지원 방향:

1. CSS 변수 기반 토큰 정의 (3-1 참조)
2. layout.tsx에서 `<html>` 태그에 `class="light"` 기본 적용
3. 시스템 설정 연동: `media (prefers-color-scheme: dark)` 자동 전환
4. 수동 토글 버튼 추가 (헤더 우측)

```css
/* globals.css - 시스템 설정 자동 대응 */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --color-surface:       #0f172a;
    --color-surface-muted: #1e293b;
    --color-border:        #334155;
    --color-text-primary:  #f1f5f9;
    --color-text-secondary:#cbd5e1;
    --color-text-muted:    #94a3b8;
  }
}
```

지도 타일도 다크모드 대응 필요:
- 현재: `https://{s}.basemaps.cartocdn.com/light_all/...`
- 다크 전환: `carto.com/dark_all/` 또는 `dark_nolabels` 타일로 교체

### 3-6. 로딩/스켈레톤 UI

| 현재 위치 | 현재 처리 | 개선 |
|-----------|-----------|------|
| 지도 초기화 | `animate-pulse` + 텍스트 | 양호 |
| 역 N행시 로딩 | "불러오는 중..." 텍스트 | 스켈레톤 라인 3개 |
| 전체 N행시 목록 | 없음 (즉시 렌더) | 초기 fetch 시 스켈레톤 카드 |
| 저장 중 | 버튼 텍스트 변경만 | 스피너 아이콘 추가 |

AcrosticEditor 로딩 스켈레톤 예시:

```tsx
/* loading 상태 */
<div className="space-y-3 animate-pulse">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200" />
      <div className="flex-1 h-9 rounded-lg bg-gray-100" />
    </div>
  ))}
</div>
```

### 3-7. 마이크로인터랙션 추가 포인트

| 위치 | 현재 | 추가할 인터랙션 | 구현 방법 |
|------|------|----------------|-----------|
| 모달 열기/닫기 | 즉각 | fade + scale | `transition-opacity`, `transition-transform` 또는 `animate-in` (tailwindcss-animate) |
| 모달 모바일 | 즉각 | slide-up | `translate-y` transition |
| 저장 성공 | 없음 | 체크마크 애니메이션 + 토스트 | `setTimeout` + CSS animation |
| N행시 있는 역 마커 | 정적 | 파동(ripple) 효과 | CSS `@keyframes ping` (Tailwind `animate-ping`) |
| 카드 클릭 | 없음 | scale down 피드백 | `active:scale-95` |
| 노선 필터 선택 | 색 변경만 | 필터 적용 시 지도 fade | 투명도 transition 이미 있음 |
| CityTabs 전환 | 즉각 | 슬라이드 인디케이터 | `translate-x` absolute indicator |

---

## 4. 우선순위별 액션 아이템

### 즉시 적용 가능 (1일 내)

**임팩트 대비 공수가 낮은 항목**

1. **[접근성] 닫기 버튼 aria-label + 패딩 추가**
   - 파일: `AcrosticEditor.tsx`, `LoginForm.tsx`
   - 변경: `aria-label="닫기"` + `p-2` 래핑으로 44px 터치 타겟 확보

2. **[접근성] CityTabs role 추가**
   - 파일: `CityTabs.tsx`
   - 변경: `role="tablist"`, `role="tab"`, `aria-selected` 추가 (3줄 변경)

3. **[버그] 폰트 override 수정**
   - 파일: `globals.css`
   - 변경: body의 `font-family: -apple-system...` 를 `font-family: var(--font-sans), -apple-system...` 으로 수정

4. **[접근성] 에러 메시지 role="alert" 추가**
   - 파일: `AcrosticEditor.tsx`, `LoginForm.tsx`
   - 변경: `<p role="alert" aria-live="polite" ...>`

5. **[UX] 모바일 범례 표시**
   - 파일: `page.tsx`
   - 변경: `hidden sm:flex` → `flex` (항상 표시)

6. **[UX] AcrosticList 카드 그리드 중앙 정렬**
   - 파일: `AcrosticList.tsx`
   - 변경: `max-w-5xl` 에 `mx-auto` 추가

7. **[UX] 카드 active 피드백**
   - 파일: `AcrosticList.tsx`
   - 변경: 버튼 className에 `active:scale-[0.98]` 추가

8. **[접근성] ViewMode 토글 aria-pressed**
   - 파일: `page.tsx`
   - 변경: 토글 버튼에 `aria-pressed={viewMode === "list"}` 추가

### 단기 (1주 내)

**레이아웃/UX 핵심 개선**

1. **[레이아웃] 지도 높이를 dvh 기반으로 변경**
   - `SubwayMap.tsx`: `aspect-square` → `h-[calc(100dvh-11rem)]`
   - 모바일에서 지도가 뷰포트를 채우도록 개선

2. **[레이아웃] 헤더 2행 분리 (모바일 최적화)**
   - `page.tsx`: 주 헤더 행(h1+관리자)과 서브 행(CityTabs+범례) 분리

3. **[UX] AcrosticEditor Bottom Sheet 패턴 (모바일)**
   - 모달에 `max-h-[90dvh] overflow-y-auto` 추가 (안전 최소 대응)
   - 모바일에서 `items-end rounded-t-2xl slide-in-from-bottom` 적용

4. **[UX] 저장 성공 토스트 알림**
   - 간단한 토스트 컴포넌트 구현 또는 sonner 라이브러리 도입
   - handleSaved 후 "저장되었습니다" 2초 표시

5. **[UX] LoginForm 로딩 상태**
   - `submitting` useState 추가
   - 버튼 비활성화 + "로그인 중..." 텍스트 변경

6. **[Design Token] globals.css 토큰 정의**
   - 3-1에서 제안한 CSS 변수 추가 (기존 Tailwind 클래스 유지, 변수만 추가)

7. **[타이포그래피] 헤더 h1 `text-xl`로 격상**
   - `page.tsx` 헤더 `text-lg` → `text-xl`

8. **[UX] 노선 필터 줄바꿈 방지 (데스크톱)**
   - 필터 바를 `overflow-x-auto scrollbar-hide` 한 줄 스크롤로 변경
   - 22+개 노선 버튼이 2~3행으로 감기는 문제 해소

### 중기 (1개월 내)

**아키텍처 수준 개선 및 신규 기능**

1. **[레이아웃] PC 사이드바 레이아웃 도입**
   - 768px 이상에서 지도 + 우측 패널(노선필터 + 목록) 2열 레이아웃
   - 지도와 목록을 동시에 볼 수 있는 UX

2. **[Design System] Tailwind CSS 4 `@theme` 블록 활용**
   - 모든 색상/타이포그래피/스페이싱을 `@theme` 블록에서 관리
   - 하드코딩된 Tailwind 클래스를 토큰 기반으로 점진적 마이그레이션

3. **[다크모드] 시스템 설정 연동 다크모드**
   - CSS 변수 + `prefers-color-scheme` 미디어쿼리
   - Leaflet 타일 다크 버전 대응

4. **[애니메이션] tailwindcss-animate 도입**
   - 모달 fade-in/slide-up 애니메이션
   - 카드 로딩 스켈레톤 pulse
   - `npm install tailwindcss-animate` 후 플러그인 등록

5. **[UX] 모바일 지도 인터랙션 개선**
   - 역 마커 탭 시 하단 Sheet가 올라오는 네이티브 앱 유사 UX
   - Sheet에서 스와이프 다운으로 닫기

6. **[UX] N행시 있는 역 마커 시각 강화**
   - `animate-ping`을 사용한 펄스 효과 (첫 방문 시 또는 hover 시)
   - SVG 별 아이콘으로 N행시 있는 역 차별화

7. **[접근성] 지도 접근성 대안 콘텐츠**
   - 키보드만으로 역 탐색이 가능한 역 검색 인풋 추가
   - 지도 외 텍스트 기반 역 목록 접근 경로 확보

8. **[성능] 페이지 레벨 Suspense + 스켈레톤**
   - 전체 N행시 목록 최초 로드 시 스켈레톤 카드 UI
   - 도시 전환 시 Optimistic UI (즉시 도시 전환, 데이터는 비동기 로드)

9. **[SEO/OG] 메타데이터 강화**
   - `layout.tsx`에 og:image, og:title, twitter:card 추가
   - 서비스 특성(지하철 + 시) 반영한 구체적 description

---

## 부록: 현재 코드 품질 요약

| 항목 | 평가 | 비고 |
|------|------|------|
| TypeScript 타입 안전성 | 양호 | 전체 TypeScript, Props 인터페이스 명확 |
| 컴포넌트 분리 | 양호 | 단일 책임 원칙 준수 |
| 성능 최적화 | 양호 | useMemo, useCallback 적절히 활용 |
| 상태 관리 | 양호 | 단순한 서비스에 적합한 useState |
| 접근성 | 미흡 | aria 속성, 역할 전반적으로 부재 |
| 반응형 | 보통 | 모바일 레이아웃 개선 필요 |
| 디자인 토큰 | 미흡 | 하드코딩된 Tailwind 클래스 |
| 애니메이션 | 미흡 | 전환 효과 거의 없음 |
| 다크모드 | 없음 | 미구현 |
| 에러 처리 UI | 미흡 | 네트워크 오류 화면 없음 |

---

*보고서 생성: Frontend Architect Agent (Claude Sonnet 4.6) / 2026-03-04*
