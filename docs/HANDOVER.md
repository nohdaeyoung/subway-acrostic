# 지하철 N행시 — 인수인계서

> 최종 업데이트: 2026-03-28
> 배포 URL: https://m.324.ing
> GitHub: https://github.com/nohdaeyoung/subway-acrostic
> 최신 커밋: `a0ba8d9`

---

## 1. 서비스 개요

서울·부산 지하철역 이름으로 만든 **N행시(삼행시·사행시 등)**를 실제 지도 위 노선도에서 감상하는 한국어 언어유희 웹 서비스.

- 서울 22개 노선 / 부산 5개 노선 수록
- 전체 역 700개+ 좌표 기반 지도 표시
- 시드 N행시 119편+ 수록 (추가 작성 가능)

---

## 2. 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js App Router | 16.1.6 |
| UI 라이브러리 | React | 19.2.3 |
| 언어 | TypeScript strict | ^5 |
| 스타일 | Tailwind CSS v4 | ^4 |
| 지도 | Leaflet + react-leaflet | 1.9.4 / 5.0.0 |
| 인증 | jose (JWT 검증) | ^6.1.3 |
| 유효성 검사 | zod | ^4.3.6 |
| 배포 | Vercel (자동 배포) | — |

### 다크모드 설정

Tailwind v4에서 클래스 기반 다크모드를 사용합니다.

```css
/* globals.css */
@custom-variant dark (&:where(.dark, .dark *));
```

`<html>` 태그에 `.dark` 클래스를 붙이면 다크모드 활성화. `layout.tsx`에서 `localStorage`의 `theme` 값을 읽어 초기 적용.

---

## 3. 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                  # 메인 페이지 (지도 + 목록)
│   ├── layout.tsx                # 루트 레이아웃 (다크모드, AdminScripts)
│   ├── globals.css               # 전역 스타일, Leaflet 커스텀
│   ├── about/page.tsx            # 서비스 소개
│   ├── admin/page.tsx            # 관리자 설정
│   ├── dev-note/page.tsx         # 개발 노트
│   ├── line/[city]/[lineId]/     # 노선별 N행시 목록
│   ├── station/[stationId]/      # 역별 N행시 상세 (SSG)
│   ├── api/auth/login/route.ts   # 어드민 패스워드 로그인 API
│   ├── api/auth/google/route.ts  # Google OAuth 콜백 (Firebase ID 토큰 검증)
│   ├── og/route.tsx              # OG 이미지 동적 생성
│   ├── llms-full.txt/route.ts    # AI 인덱스 파일
│   ├── robots.ts                 # robots.txt
│   └── sitemap.ts                # sitemap.xml
│
├── components/
│   ├── AcrosticEditor.tsx        # N행시 작성/수정/삭제 모달
│   ├── AcrosticList.tsx          # N행시 목록 (검색, 노선별 그룹)
│   ├── AdminScripts.tsx          # GA4 등 관리자 스크립트 삽입
│   ├── CityTabs.tsx              # 서울/부산 탭
│   ├── JsonLd.tsx                # JSON-LD 구조화 데이터
│   ├── LeafletMap.tsx            # 지도 컴포넌트 (Leaflet)
│   ├── LoginForm.tsx             # 관리자 로그인 모달
│   ├── SubwayMap.tsx             # LeafletMap 동적 import 래퍼
│   └── Toast.tsx                 # 토스트 알림
│
├── data/
│   ├── acrostic-seeds.ts         # 초기 시드 N행시 데이터
│   ├── seoul-subway.ts           # 서울 노선 진입점 (re-export)
│   ├── seoul/
│   │   ├── lines.ts              # 서울 노선 정보 (이름, 색상)
│   │   ├── stations.ts           # 서울 역 좌표 데이터
│   │   └── routes.ts             # 서울 노선별 역 순서
│   ├── busan-subway.ts           # 부산 노선·역·라우트 통합
│   ├── line-order.ts             # 목록 표시 노선 정렬 순서
│   └── subway-types.ts           # StationData 타입 정의
│
├── hooks/
│   ├── useSubwayPageState.ts     # 메인 페이지 전체 상태 관리
│   ├── useCurvePoints.ts         # 커브포인트 Firestore 훅 (enabled 플래그로 인증 후 로드)
│   └── useFocusTrap.ts           # 모달 포커스 트랩 훅
│
├── lib/
│   ├── bkend.ts                  # N행시 CRUD (Firestore + 시드 폴백)
│   ├── auth.ts                   # 로그인/로그아웃/토큰 검증
│   ├── firebase.ts               # Firebase 앱 초기화 (db, auth, googleProvider)
│   ├── curvePoints.ts            # 커브포인트 Firestore CRUD
│   ├── subway-utils.ts           # toStation(), stationLabel() 유틸
│   ├── acrostic-schema.ts        # N행시 입력 zod 스키마
│   └── admin-settings.ts        # 관리자 설정 저장/불러오기
│
└── types/
    └── subway.ts                 # Station, Acrostic, City 타입
```

---

## 4. 데이터 구조

### Station 타입

```ts
interface Station {
  id: string;        // "s-gangnam", "b-seomyeon" (s=서울, b=부산)
  name: string;      // "강남" (역 자 제외, stationLabel()로 표시)
  lat: number;
  lng: number;
  lines: string[];   // 해당 역을 지나는 노선 ID 배열
  city: "seoul" | "busan";
}
```

### Acrostic 타입

```ts
interface Acrostic {
  _id: string;         // "seed-s-gangnam" | UUID
  stationId: string;   // Station.id와 매핑
  lines: string[];     // 역 이름 글자 수만큼의 문장 배열
  createdAt: string;
  updatedAt: string;
}
```

### 데이터 저장 방식

- **Firebase Firestore** (`acrostics` 컬렉션): 관리자가 작성한 N행시 (크로스 디바이스 동기화)
- **acrostic-seeds.ts**: 빌드 타임 번들에 포함된 초기 시드 (Firestore 실패 시 오프라인 폴백)
- **커브포인트**: Firestore `curvePoints` 컬렉션 (어드민 로그인 시에만 로드)
- 읽기는 비인증 허용, 쓰기는 Firebase Auth 어드민 이메일 검증 (`firestore.rules`)

---

## 5. 인증 방식

```
환경변수: ADMIN_PASSWORD (평문 비밀번호)
         JWT_SECRET (토큰 서명 키, 32자 이상 랜덤)
```

- POST `/api/auth/login` → 비밀번호 검증 후 JWT 발급 (7일 만료)
- POST `/api/auth/google` → Firebase ID 토큰 검증 후 JWT 발급
- JWT는 `localStorage`의 `subway-acrostic-token` 키에 저장
- `auth.ts`의 `isLoggedIn()`: JWT exp 클레임 확인 (UI 게이트, 서명 미검증)
- **Firestore 쓰기 보호**: `firestore.rules`에서 `request.auth.token.email` 검증 (서버사이드 실질 보호)

### Vercel 환경변수 설정

| 키 | 설명 |
|----|------|
| `ADMIN_PASSWORD` | 어드민 평문 비밀번호 |
| `JWT_SECRET` | 최소 32자 랜덤 문자열 (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API 키 (공개값) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth 도메인 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID |
| `SEOUL_SUBWAY_API_KEY` | 서울 공공데이터 실시간 열차 API 키 |
| `GOOGLE_SITE_VERIFICATION` | 구글 서치콘솔 인증 코드 |
| `NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 인증 코드 |

---

## 6. 주요 유틸리티

### `stationLabel(name: string): string`

역 이름에 "역" 중복 방지. 이미 "역"으로 끝나면 그대로, 아니면 "역" 추가.

```ts
stationLabel("강남")  // → "강남역"
stationLabel("부산역") // → "부산역" (중복 방지)
```

**모든 UI 출력 시 이 함수를 사용해야 함.** 사용 위치: AcrosticEditor, AcrosticList, station/page, line/page, llms-full.txt/route.

### `toStation(sd: StationData, city: City): Station`

원시 데이터(`StationData`)를 컴포넌트용 `Station` 타입으로 변환.

---

## 7. 지도 컴포넌트 (LeafletMap)

- `SubwayMap.tsx`에서 `dynamic(() => import("./LeafletMap"), { ssr: false })`로 감싸 서버 렌더링 방지
- 타일: CartoDB Light (`light_all`)
- 마커: `buildIcon()` — DivIcon으로 점 + 역명 레이블 생성
- 성능 최적화:
  - `polylines`: 좌표 계산 memoized
  - `polylineOptions`: 노선 선택 상태별 색상/두께 memoized
  - `stationIcons`: 역별 DivIcon memoized
  - `visibleStations`: 노선 필터 memoized

### 지도 CSS (globals.css)

```css
.leaflet-container { background: #f9fafb; }       /* 라이트 배경 */
.dark .leaflet-container { background: #030712; }  /* 다크 배경 */
```

---

## 8. 메인 페이지 상태 관리

`useSubwayPageState.ts` 훅이 메인 페이지(`page.tsx`)의 모든 상태를 관리.

```ts
// 반환 값
{
  city, setCity,              // "seoul" | "busan"
  viewMode, setViewMode,      // "map" | "list"
  selectedLine, setSelectedLine, // 노선 필터
  stations, lines, lineRoutes, stationDataMap,  // 현재 도시 데이터
  allStations,                // 서울+부산 전체 (목록 검색용)
  allAcrostics, acrosticStationIds,
  selectedStation, currentAcrostic, loadingAcrostic,
  loggedIn, showLogin, setShowLogin,
  toast,
  handleStationClick,   // 역 클릭 → 모달 오픈
  handleCloseModal,
  handleLoginSuccess,   // 로그인 후 미입력 역 랜덤 팝업
  handleLogout,
  handleSaved,          // 저장 후 데이터 리로드
}
```

---

## 9. SEO 구조

| 경로 | 방식 | 설명 |
|------|------|------|
| `/` | Static | 메인 지도 |
| `/about` | Static | 서비스 소개 |
| `/dev-note` | Static | 개발 노트 |
| `/station/[stationId]` | SSG | 역별 N행시 (시드 보유 역만) |
| `/line/[city]/[lineId]` | SSG | 노선별 역 목록 |
| `/og` | Dynamic | OG 이미지 생성 |
| `/sitemap.xml` | Static | 자동 생성 |
| `/robots.txt` | Static | 자동 생성 |
| `/llms.txt` | Static | AI 크롤러 안내 |
| `/llms-full.txt` | Dynamic | AI용 전체 시드 인덱스 |

JSON-LD 구조화 데이터: `CreativeWork`, `BreadcrumbList`, `AboutPage`, `Organization`

---

## 10. 관리자 기능

### 접근

1. 메인 페이지 우상단 열쇠 아이콘 클릭
2. 비밀번호 입력 (환경변수 `ADMIN_PASSWORD_HASH`와 대조)
3. 로그인 성공 시 미입력 역 중 랜덤 팝업 표시

### 기능

- **N행시 작성**: 역 클릭 → 편집 모드 → 각 글자별 문장 입력 → 저장
- **N행시 수정**: 모달의 "수정" 버튼
- **N행시 삭제**: 모달의 "삭제" 버튼 → 확인 오버레이
- **관리자 설정** (`/admin`): 검색엔진 인증코드, GA4 ID, 커스텀 head/body 코드

---

## 11. 역 데이터 관리 규칙

### 파일 위치

| 도시 | 파일 |
|------|------|
| 서울 역 좌표 | `src/data/seoul/stations.ts` |
| 서울 노선 정보 | `src/data/seoul/lines.ts` |
| 서울 라우트 순서 | `src/data/seoul/routes.ts` |
| 부산 전체 | `src/data/busan-subway.ts` |

### 역 ID 규칙

- 서울: `s-{영문소문자}` (예: `s-gangnam`, `s-euljiro-3ga`)
- 부산: `b-{영문소문자}` (예: `b-seomyeon`, `b-haeundae`)
- 환승역은 하나의 ID, `lines` 배열에 복수 노선 ID 포함

### 라우트 형식

```ts
SEOUL_LINE_ROUTES["2"] = [
  ["s-city-hall", "s-euljiro-1ga", ...],  // 본선
  ["s-sinjeong", "s-sinjeong-naebangi", ...],  // 지선
]
```

각 노선은 세그먼트 배열의 배열. 지선·별선은 별도 세그먼트로 분리.

---

## 12. 시드 N행시 추가 방법

`src/data/acrostic-seeds.ts` 파일에 추가:

```ts
{
  stationId: "s-강남역id",
  lines: ["강으로 시작하는 문장", "남으로 시작하는 문장"],
}
```

- `stationId`는 `SEOUL_STATIONS` / `BUSAN_STATIONS`에 존재하는 ID여야 함
- `lines` 배열 길이는 역 이름 글자 수와 일치해야 함

---

## 13. 알려진 구조적 제약

| 항목 | 내용 |
|------|------|
| Firestore 직접 쓰기 | API 라우트 경유 없이 클라이언트 SDK로 직접 쓰기. `firestore.rules`로 보호 |
| JWT UI 게이트 | `isLoggedIn()`은 서명 미검증. 실질 쓰기 보호는 Firestore 규칙에 의존 |
| 전체 역 데이터 번들 | Seoul ~500개 역 초기 로딩. 성능 개선 여지 있음 |
| Leaflet SSR 불가 | `dynamic(..., { ssr: false })` 필수 |
| 서울 API HTTP | `http://swopenapi.seoul.go.kr` — HTTPS 미지원 외부 제약 |

---

## 14. 개발 환경 실행

```bash
npm install
npm run dev       # http://localhost:3000
```

### 환경변수 설정 (`.env.local`)

```env
ADMIN_PASSWORD=<어드민 비밀번호>
JWT_SECRET=<32자 이상 랜덤>
NEXT_PUBLIC_FIREBASE_API_KEY=<Firebase 콘솔에서 복사>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<프로젝트>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<프로젝트 ID>
SEOUL_SUBWAY_API_KEY=<서울 공공데이터 포털 API 키>
```

JWT 시크릿 생성:

```bash
openssl rand -base64 32
```

---

## 15. 배포

Vercel 자동 배포. `main` 브랜치에 push 시 자동 빌드 및 배포.

```bash
git push origin main
```

Vercel 프로젝트 설정에서 환경변수 확인 필요 (§5 참고).

---

## 16. 작업 이력 요약

| 버전 | 주요 작업 |
|------|-----------|
| v1.0 | 초기 구현 (N행시 작성·열람, 서울·부산 탭) |
| v1.1 | Leaflet 실제 지도 기반 리디자인 |
| v1.2 | 역 클릭 에디터, 노선 필터, 8개 노선 추가 |
| v1.3 | 반응형 노선 UI, 성능 최적화 |
| v1.4 | 신분당선·서해선·GTX-A 등 노선 데이터 확장 |
| v1.5 | bkend.ai 제거 → localStorage + 환경변수 인증 전환 |
| v1.6 | Wikidata 기반 좌표 전면 수정, 누락역 113개 추가 |
| v1.7 | 별내선·하남선 등 세부 데이터 수정 |
| v1.8 | UI 전면 개선, 다크모드, SEO, 성능 최적화, OG 이미지 |
| v1.9 | localStorage → Firebase Firestore 마이그레이션, Google 로그인 |
| v2.0 | 보안 강화 (Firestore 규칙, JWT 시크릿 교체), 폰트 preload 최적화 (2.98MB 감소) |

### 이번 세션 주요 변경

- **UI**: 지도 3:2 비율 고정, 캔버스 배경 일치, 커스텀 모바일 노선 드롭다운, 노선별 N행시 수 표시, 랜덤 쓰기 버튼
- **다크모드**: about / dev-note / admin 페이지 완성
- **SEO**: OG 이미지, sitemap, robots.txt, JSON-LD, llms.txt, station/line 정적 페이지
- **버그 수정**: `부산역역` → `stationLabel()`, `b-geoyeo` 잘못된 시드 제거, 빈 배열 크래시 방지
- **성능**: `buildIcon` memoized, `polylineOptions` memoized, `filteredItems` memoized, `useCallback` 핸들러, 안정적 React key

---

*이 문서는 Claude Code (Sonnet 4.6)와 협업하여 자동 생성되었습니다.*
