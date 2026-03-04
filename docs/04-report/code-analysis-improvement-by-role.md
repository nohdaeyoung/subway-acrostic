# Code Analysis 개선사항 보고서 (역할별)

> **Summary**: Code-analyzer 분석 결과(CRITICAL 4, WARNING 17, INFO 11)를 담당자 역할별로 분류하여 우선순위와 작업 계획을 제시
>
> **Date**: 2026-03-04
> **Analysis Source**: bkit:code-analyzer v1.5.6
> **Status**: Draft

---

## 1. 보안/백엔드 담당자

### 담당 이슈 분류

#### CRITICAL - 즉시 해결 필요 (1~2주)

| Issue ID | 제목 | 심각도 | 예상 작업량 | 우선순위 |
|----------|------|--------|-----------|---------|
| C-01 | 클라이언트 번들에 NEXT_PUBLIC_ADMIN_PASSWORD 노출 | CRITICAL | L | P0 |
| C-02 | 약한 비밀번호 admin1234! 하드코딩 | CRITICAL | M | P0 |
| C-03 | 클라이언트 인증 우회 - localStorage 한 줄 조작 | CRITICAL | L | P0 |
| C-04 | create/update/delete 함수 권한 체크 누락 | CRITICAL | M | P0 |

#### WARNING - 높은 우선순위 (2~3주)

| Issue ID | 제목 | 심각도 | 예상 작업량 | 우선순위 |
|----------|------|--------|-----------|---------|
| W-03 | loadAcrostics 에러 핸들링 부재 | WARNING | S | P1 |
| W-04 | handleStationClick 에러 핸들링 부재 (영구 로딩 버그) | WARNING | S | P1 |
| W-05 | acrostic 입력 데이터 유효성 검사 없음 | WARNING | M | P1 |
| W-06 | localStorage 스키마 유효성 검사 없음 | WARNING | M | P1 |

### 구체적 조치 방법

#### 1단계: 환경변수 및 인증 아키텍처 재설계

**Current State (취약)**
```typescript
// .env.local (클라이언트에 노출됨)
NEXT_PUBLIC_ADMIN_PASSWORD=admin1234!

// auth.ts (클라이언트 사이드 검증만 수행)
function verifyPassword(pwd: string): boolean {
  return pwd === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
}

// page.tsx (localStorage 직접 조작)
localStorage.setItem("admin", "true");  // 우회 가능
```

**Target State (보안강화)**
```typescript
// 1. 백엔드 API 엔드포인트 추가 (src/app/api/auth/login/route.ts)
export async function POST(req: Request) {
  const { password } = await req.json();

  // 서버사이드에서만 검증
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // JWT 토큰 발급 (세션 방식 또는 JWT)
  const token = jwt.sign(
    { admin: true, iat: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return NextResponse.json(
    { success: true },
    {
      headers: {
        'Set-Cookie': `auth=${token}; HttpOnly; Secure; SameSite=Strict`
      }
    }
  );
}

// 2. 미들웨어로 요청 검증 (middleware.ts)
export function middleware(request: Request) {
  const token = request.cookies.get('auth')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/api/acrostic')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

// 3. 클라이언트: localStorage 제거
// localStorage.setItem("admin", "true") -> 삭제
// 대신 서버에서 쿠키로 관리
```

**Action Items**:
- [ ] `/app/api/auth/login` 엔드포인트 구현
- [ ] JWT/세션 미들웨어 추가
- [ ] ADMIN_PASSWORD를 .env.local (서버 only)로 이동
- [ ] NEXT_PUBLIC_* 제거
- [ ] 클라이언트 인증 로직 재구현 (쿠키 기반)
- [ ] 모든 API 엔드포인트에 권한 체크 미들웨어 적용

**Estimated Time**: 1-2주

---

#### 2단계: API 엔드포인트 권한 체크 추가

**현재 상태** (src/app/api/acrostic/route.ts 예상)
```typescript
// 권한 체크 없음
export async function POST(req: Request) {
  const data = await req.json();
  // 바로 저장
  return saveAcrostic(data);
}
```

**개선 대안**
```typescript
// 1. 권한 검증 유틸리티
function requireAdmin(request: Request): boolean {
  const token = request.cookies.get('auth')?.value;
  if (!token) return false;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// 2. 모든 쓰기 작업에 적용
export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  return saveAcrostic(data);
}

export async function PUT(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}

export async function DELETE(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

**Action Items**:
- [ ] 권한 검증 미들웨어 함수 작성
- [ ] POST/PUT/DELETE 엔드포인트에 적용
- [ ] 권한 없이 접근 시 401 반환 확인
- [ ] 통합 테스트 작성

**Estimated Time**: 1주

---

#### 3단계: 데이터 유효성 검사 추강화

**현재 상태** (W-05, W-06)
```typescript
// 유효성 검사 없음
function loadAcrostics() {
  const data = localStorage.getItem('acrostics');
  return JSON.parse(data);  // 에러 가능, 스키마 검증 없음
}
```

**개선 대안**
```typescript
// 1. Zod 또는 io-ts를 이용한 스키마 정의
import { z } from 'zod';

const AcrosticSchema = z.object({
  id: z.string().uuid(),
  stationName: z.string().min(1),
  acrostic: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  createdAt: z.string().datetime(),
});

type Acrostic = z.infer<typeof AcrosticSchema>;

// 2. 로드 함수에 검증 추가
function loadAcrostics(): Acrostic[] {
  try {
    const raw = localStorage.getItem('acrostics');
    if (!raw) return [];

    const data = JSON.parse(raw);
    return z.array(AcrosticSchema).parse(data);
  } catch (error) {
    console.error('Failed to load acrostics:', error);
    return [];
  }
}

// 3. 저장 함수에 검증 추가
function saveAcrostic(data: unknown): Acrostic {
  const validated = AcrosticSchema.parse(data);
  localStorage.setItem('acrostics', JSON.stringify([
    ...loadAcrostics(),
    validated
  ]));
  return validated;
}
```

**Action Items**:
- [ ] `zod` 라이브러리 설치
- [ ] Acrostic 스키마 정의 (src/types/schemas.ts)
- [ ] bkend.ts의 모든 함수에 입력 검증 추가
- [ ] loadAcrostics/handleStationClick 에러 핸들링 추가
- [ ] 통합 테스트 작성

**Estimated Time**: 1주

---

### 보안 검토 체크리스트

```markdown
## Pre-Deployment Security Checklist

- [ ] NEXT_PUBLIC_ADMIN_PASSWORD 환경변수 제거 확인
- [ ] ADMIN_PASSWORD는 .env.local (서버 only)에 있는지 확인
- [ ] 모든 API 엔드포인트에 권한 체크 있는지 확인
- [ ] JWT/세션 토큰 만료 시간 설정 확인 (권장: 24시간)
- [ ] localStorage에 민감정보 저장 안 하는지 확인
- [ ] CORS 설정 검토 (필요한 도메인만 허용)
- [ ] Rate limiting 설정 (브루트포스 공격 방어)
- [ ] 로그인 시도 실패 횟수 제한 추가
- [ ] 비밀번호 강도 요구사항 추가 (최소 8자, 특수문자 포함)
- [ ] 보안 헤더 설정 확인 (CSP, X-Frame-Options 등)
```

**Estimated Time (전체 보안 개선)**: 2-3주

---

## 2. 프론트엔드 개발자

### 담당 이슈 분류

#### CRITICAL

| Issue ID | 제목 | 파일 | 예상 작업량 | 우선순위 |
|----------|------|------|-----------|---------|
| W-01 | useEffect 의존성 누락 (station.name) | AcrosticEditor.tsx | S | P0 |
| W-04 | handleStationClick 에러 핸들링 부재 | page.tsx | S | P0 |
| W-17 | 도시 전환 시 selectedLine 미초기화 | page.tsx | S | P0 |

#### WARNING - 높은 우선순위

| Issue ID | 제목 | 파일 | 예상 작업량 | 우선순위 |
|----------|------|------|-----------|---------|
| W-02 | AcrosticModal.tsx 데드 코드 | AcrosticModal.tsx | S | P1 |
| W-07 | page.tsx God Component (10 state, 254줄) | page.tsx | L | P1 |
| W-09 | AcrosticEditor/AcrosticModal 중복 코드 | AcrosticEditor/Modal | M | P1 |
| W-15 | confirm() 브라우저 기본 UI | page.tsx | M | P2 |

#### INFO - 개선 권장

| Issue ID | 제목 | 파일 | 예상 작업량 | 우선순위 |
|----------|------|------|-----------|---------|
| I-10 | 모달 focus trap 없음 (접근성) | AcrosticEditor.tsx | M | P3 |
| I-11 | LeafletMap 미사용 import | LeafletMap.tsx | S | P3 |

### 구체적 조치 방법

#### Phase 1: Critical Bug 해결 (1주)

**W-01: useEffect 의존성 누락**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/components/AcrosticEditor.tsx`

```typescript
// BEFORE (버그)
useEffect(() => {
  setStationColor(/* color lookup */);
  // station.name 변경 시 색상 자동 업데이트 안 됨
}, []);  // 의존성 배열 비어있음

// AFTER (수정)
useEffect(() => {
  setStationColor(/* color lookup */);
}, [station.name, lineColor]);  // 의존성 추가
```

**Action Items**:
- [ ] AcrosticEditor.tsx의 모든 useEffect 검토
- [ ] 외부 값 참조 시 의존성 배열에 추가
- [ ] React Hook 린터 규칙 활성화: `eslint-plugin-react-hooks`
- [ ] 테스트: 역 이름 변경 시 색상 동기화 확인

---

**W-04: handleStationClick 에러 핸들링**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/page.tsx`

```typescript
// BEFORE (버그: loadingAcrostic 영구 true)
const handleStationClick = async (stationName: string) => {
  setLoadingAcrostic(true);
  const acrostics = await loadAcrostics(stationName);
  setSelectedStationAcrostics(acrostics);
  // setLoadingAcrostic(false) 누락 시 스핀 영구 표시
};

// AFTER (수정: try-catch-finally)
const handleStationClick = async (stationName: string) => {
  setLoadingAcrostic(true);
  try {
    const acrostics = await loadAcrostics(stationName);
    setSelectedStationAcrostics(acrostics);
  } catch (error) {
    console.error('Failed to load acrostics:', error);
    setSelectedStationAcrostics([]);
    // 사용자에게 에러 메시지 표시
    setErrorMessage('N행시 로드에 실패했습니다.');
  } finally {
    setLoadingAcrostic(false);
  }
};
```

**Action Items**:
- [ ] 모든 async 함수에 try-catch-finally 추가
- [ ] 에러 발생 시 사용자 피드백 UI 추가 (토스트 메시지 등)
- [ ] W-03 (loadAcrostics 에러 핸들링)과 함께 처리

---

**W-17: 도시 전환 시 selectedLine 미초기화**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/page.tsx`

```typescript
// BEFORE (버그: 빈 지도)
const handleCityChange = (city: 'seoul' | 'busan') => {
  setCity(city);
  // selectedLine이 초기화되지 않음 -> 이전 도시의 라인 표시 불가
};

// AFTER (수정)
const handleCityChange = (city: 'seoul' | 'busan') => {
  setCity(city);
  setSelectedLine(null);  // 라인 초기화
  setSelectedStationAcrostics([]);  // 선택된 역 초기화
};
```

**Action Items**:
- [ ] 도시 변경 시 모든 선택 상태 초기화
- [ ] 테스트: 도시 전환 후 라인 선택 가능 확인

---

#### Phase 2: 컴포넌트 리팩토링 (2-3주)

**W-07: God Component 분해**

Current: `page.tsx` (254줄, 10개 state)

```typescript
// page.tsx의 10개 state
const [city, setCity] = useState<City>('seoul');
const [selectedLine, setSelectedLine] = useState<string | null>(null);
const [selectedStation, setSelectedStation] = useState<Station | null>(null);
const [acrostics, setAcrostics] = useState<Acrostic[]>([]);
const [isEditing, setIsEditing] = useState(false);
const [editingAcrostic, setEditingAcrostic] = useState<Acrostic | null>(null);
const [loadingAcrostic, setLoadingAcrostic] = useState(false);
const [selectedStationAcrostics, setSelectedStationAcrostics] = useState<Acrostic[]>([]);
const [authToken, setAuthToken] = useState<string | null>(null);
const [errorMessage, setErrorMessage] = useState<string>('');

// 컴포넌트 분해 계획
// page.tsx (상위): 전체 레이아웃, 상태 오케스트레이션
// - MapContainer (지도 영역)
// - SidebarContainer (사이드바)
// - ModalContainer (모달)
```

**Refactoring Plan**:

```
Page.tsx (76줄)
├── MapSection (상태: city, selectedLine)
│   ├── CityTabs.tsx (기존)
│   ├── SubwayMap.tsx (기존)
│   └── LineSelector.tsx (신규)
│
├── SidebarSection (상태: selectedStation, acrostics)
│   ├── StationDetails.tsx (신규)
│   ├── AcrosticList.tsx (기존, props 추가)
│   └── AcrosticStats.tsx (신규)
│
├── ModalSection (상태: isEditing, editingAcrostic)
│   └── AcrosticEditor.tsx (기존, props 추가)
│
└── 공유 상태
    ├── auth (authToken) → useAuth 훅 분리
    ├── error (errorMessage) → useErrorHandler 훅 분리
    └── loading (loadingAcrostic) → 컴포넌트 레벨로 분리
```

**Action Items**:
- [ ] 컴포넌트 구조 설계
- [ ] MapSection 컴포넌트 분리
- [ ] SidebarSection 컴포넌트 분리
- [ ] ModalSection 컴포넌트 분리
- [ ] useAuth 커스텀 훅 작성
- [ ] useErrorHandler 커스텀 훅 작성
- [ ] 상태 관리 리팩토링 (Zustand/Context API 검토)

**Estimated Time**: 2-3주

---

**W-02: AcrosticModal.tsx 데드 코드 제거**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/components/AcrosticModal.tsx`

Action Items:
- [ ] AcrosticModal.tsx 불필요한 import 제거
- [ ] 사용되지 않는 prop/함수 제거
- [ ] 78줄 → ~30줄로 축약
- [ ] 또는 파일 자체 삭제 후 AcrosticEditor로 통합

---

**W-09: 중복 코드 제거**

Files: `AcrosticEditor.tsx`, `AcrosticModal.tsx`

```typescript
// 공통 로직 추출
// src/lib/acrosticFormLogic.ts (신규)

export const useAcrosticForm = (initialValue?: Acrostic) => {
  const [text, setText] = useState(initialValue?.acrostic || '');
  const [color, setColor] = useState(initialValue?.color || '#000000');

  const isValid = text.trim().length > 0;

  return { text, setText, color, setColor, isValid };
};

// 두 컴포넌트에서 사용
function AcrosticEditor() {
  const form = useAcrosticForm(editingAcrostic);
  // ...
}

function AcrosticModal() {
  const form = useAcrosticForm();
  // ...
}
```

**Action Items**:
- [ ] 공통 로직 추출 (폼 검증, 상태 관리)
- [ ] 커스텀 훅 또는 유틸 함수로 분리
- [ ] 두 컴포넌트에서 재사용

---

#### Phase 3: 접근성 및 UX 개선 (1-2주)

**W-15: 커스텀 confirm() 대체**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/app/page.tsx`

```typescript
// BEFORE
if (!confirm('정말 삭제하시겠습니까?')) return;

// AFTER: 커스텀 ConfirmDialog 컴포넌트
const [confirmDialog, setConfirmDialog] = useState<{
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}>({ isOpen: false, title: '', onConfirm: () => {}, onCancel: () => {} });

const showConfirm = (title: string, onConfirm: () => void) => {
  setConfirmDialog({
    isOpen: true,
    title,
    onConfirm,
    onCancel: () => setConfirmDialog({ ...confirmDialog, isOpen: false })
  });
};

// 사용
const handleDelete = (id: string) => {
  showConfirm('정말 삭제하시겠습니까?', async () => {
    await deleteAcrostic(id);
  });
};
```

**Action Items**:
- [ ] ConfirmDialog.tsx 컴포넌트 작성
- [ ] 모든 confirm() 호출 대체
- [ ] 스타일 및 애니메이션 추가

---

**I-10: 모달 접근성 (Focus Trap, ARIA)**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/components/AcrosticEditor.tsx`

```typescript
// 라이브러리: react-focus-lock, react-aria
import { useFocusAuto } from 'react-aria';

export function AcrosticEditor() {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <dialog role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <h2 id="modal-title">N행시 수정</h2>
      <input ref={firstInputRef} />
      {/* ... */}
    </dialog>
  );
}
```

**Action Items**:
- [ ] `react-aria` 또는 `react-focus-lock` 설치
- [ ] 모달에 role="dialog", aria-modal 추가
- [ ] 포커스 트랩 구현
- [ ] 스크린 리더 테스트

---

### 프론트엔드 작업 타임라인

```
Week 1: Critical Bugs (W-01, W-04, W-17)
├── useEffect 의존성 수정
├── 에러 핸들링 추가
└── 테스트

Week 2-3: Component Refactoring (W-07)
├── 컴포넌트 분해 및 분리
├── 커스텀 훅 작성
└── 상태 관리 최적화

Week 3-4: UX 및 접근성 (W-15, I-10)
├── 커스텀 ConfirmDialog 구현
├── 모달 접근성 개선
└── 통합 테스트

Ongoing: Code Quality (W-02, W-09)
├── 데드 코드 제거
└── 중복 코드 통합
```

---

## 3. 데이터 관리자

### 담당 이슈 분류

| Issue ID | 제목 | 파일 | 심각도 | 우선순위 |
|----------|------|------|--------|---------|
| W-08 | seoul-subway.ts 939줄 단일 파일 | seoul-subway.ts | WARNING | P1 |
| W-10 | deleteAcrostic 존재하지 않는 ID도 true 반환 | bkend.ts | WARNING | P2 |
| W-11 | 동해선 색상 불일치 및 라인 키 매핑 취약 | seoul-subway.ts | WARNING | P1 |
| W-12 | AcrosticList LINE_ORDER 하드코딩 | AcrosticList.tsx | WARNING | P2 |

### 구체적 조치 방법

#### Phase 1: 데이터 파일 모듈화 (1-2주)

**W-08: seoul-subway.ts 939줄 분해**

Current Structure:
```typescript
// src/data/seoul-subway.ts (939줄)
export const stations = [
  { name: '서울역', line: '1호선', lat: 37.55, lng: 126.97, ... },
  // ... 500+ 역
];
```

Target Structure:
```
src/data/
├── seoul/
│   ├── line-1.ts      // 서울 1호선
│   ├── line-2.ts      // 서울 2호선
│   ├── line-3.ts      // 서울 3호선
│   ├── line-4.ts      // 서울 4호선
│   ├── line-5.ts      // 서울 5호선
│   ├── line-6.ts      // 서울 6호선
│   ├── line-7.ts      // 서울 7호선
│   ├── line-8.ts      // 서울 8호선
│   ├── lines-9-bundang-sinbundang.ts  // 경전철
│   └── index.ts       // 모든 역 통합
│
├── busan/
│   ├── line-1.ts
│   ├── line-2.ts
│   ├── line-3.ts
│   ├── line-4.ts
│   └── index.ts
│
└── __types__.ts       // 공용 타입

// src/data/seoul/index.ts
import * as line1 from './line-1';
import * as line2 from './line-2';
// ...
export const stations = [
  ...line1.stations,
  ...line2.stations,
  // ...
];
```

**Action Items**:
- [ ] `src/data/seoul/` 디렉토리 생성
- [ ] 호선별로 데이터 분해 (1~9호선)
- [ ] `src/data/seoul/index.ts` 통합 파일 작성
- [ ] 기존 `src/data/seoul-subway.ts` 삭제 또는 import 리다이렉트
- [ ] Busan도 동일 구조로 변경
- [ ] 임포트 경로 일관성 확인

**Estimated Time**: 1주

---

#### Phase 2: 데이터 무결성 검증 (1주)

**W-11: 동해선 색상 불일치 및 라인 키 매핑**

Issue: 동해선 색상이 두 가지 (#00ACED vs #0054A6)로 표시됨

```typescript
// 1단계: 통일된 LINE_COLORS 정의
// src/data/__types__.ts

export const LINE_COLORS: Record<string, string> = {
  '1호선': '#0052A4',
  '2호선': '#00A537',
  '3호선': '#EF7C1C',
  '4호선': '#0066B2',
  '5호선': '#996644',
  '6호선': '#CD7C2F',
  '7호선': '#747F00',
  '8호선': '#E6186C',
  '9호선': '#BBCDEF',
  '경의중앙선': '#77C737',
  '공항철도': '#0066A9',
  '경춘선': '#00AF96',
  '신분당선': '#D4003B',
  '동해선': '#0054A6',  // 통일
  '수인분당선': '#FF6F1B',
  '용인경전철': '#C60C30',
  '의정부경전철': '#FF6E1A',
  '우이신설선': '#B8860B',
  '서해선': '#8B4513',
};

// 2단계: 데이터에서 색상 하드코딩 제거
// BEFORE
export const stations = [
  { name: '동해역', line: '동해선', color: '#00ACED', ... },
  { name: '청량리역', line: '동해선', color: '#0054A6', ... },
];

// AFTER
export const stations = [
  { name: '동해역', line: '동해선', ... },
  { name: '청량리역', line: '동해선', ... },
];

// 색상은 runtime에 조회
export function getLineColor(lineName: string): string {
  return LINE_COLORS[lineName] || '#808080';
}

// 3단계: 라인 키 매핑 강화
export const LINE_KEYS: Record<string, string> = {
  '1호선': 'line-1',
  '2호선': 'line-2',
  // ...
  '동해선': 'line-donghae',
};

// 사용
const lineKey = LINE_KEYS[line] || line;
const color = LINE_COLORS[line];
```

**Action Items**:
- [ ] LINE_COLORS 통일 (동해선 #0054A6로 정의)
- [ ] 데이터 파일에서 색상 하드코딩 제거
- [ ] getLineColor() 함수 작성
- [ ] LINE_KEYS 매핑 테이블 생성
- [ ] 모든 역 데이터 검증 스크립트 작성 (자동 색상 확인)

**Estimated Time**: 1주

---

**W-10: deleteAcrostic 버그 수정**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/lib/bkend.ts`

```typescript
// BEFORE (버그: 존재하지 않는 ID도 true 반환)
export function deleteAcrostic(id: string): boolean {
  const acrostics = loadAcrostics();
  const index = acrostics.findIndex(a => a.id === id);
  acrostics.splice(index, 1);
  saveAcrostics(acrostics);
  return true;  // index가 -1이어도 true!
}

// AFTER (수정: 실제 삭제 여부 반환)
export function deleteAcrostic(id: string): boolean {
  const acrostics = loadAcrostics();
  const index = acrostics.findIndex(a => a.id === id);

  if (index === -1) {
    console.warn(`Acrostic not found: ${id}`);
    return false;
  }

  acrostics.splice(index, 1);
  saveAcrostics(acrostics);
  return true;
}

// 호출 코드도 수정
const handleDelete = async (id: string) => {
  const success = await deleteAcrostic(id);
  if (!success) {
    setErrorMessage('N행시를 찾을 수 없습니다.');
    return;
  }
  setSelectedStationAcrostics(prev => prev.filter(a => a.id !== id));
};
```

**Action Items**:
- [ ] deleteAcrostic 수정 (index === -1 체크)
- [ ] 호출 코드에서 반환값 처리
- [ ] 에러 메시지 사용자 표시

**Estimated Time**: 2-3일

---

**W-12: LINE_ORDER 하드코딩 제거**

File: `/Volumes/Dev/daeyoung-openclaw-main/subway-acrostic/src/components/AcrosticList.tsx`

```typescript
// BEFORE (하드코딩)
const LINE_ORDER = [
  '1호선', '2호선', '3호선', '4호선', '5호선',
  '6호선', '7호선', '8호선', '9호선',
  '경의중앙선', '공항철도', '신분당선',
  // ...
];

// AFTER (중앙 집중식 정의)
// src/data/__types__.ts
export const METRO_LINE_ORDER: Record<'seoul' | 'busan', string[]> = {
  seoul: [
    '1호선', '2호선', '3호선', '4호선', '5호선',
    '6호선', '7호선', '8호선', '9호선',
    '경의중앙선', '공항철도', '신분당선',
    '동해선', '수인분당선',
  ],
  busan: [
    '1호선', '2호선', '3호선', '4호선',
    '동해선', '경전철',
  ],
};

// AcrosticList.tsx에서 import
import { METRO_LINE_ORDER } from '@/data/__types__';

export function AcrosticList({ city, acrostics }: Props) {
  const lineOrder = METRO_LINE_ORDER[city];

  const sortedAcrostics = [...acrostics].sort((a, b) => {
    const aIdx = lineOrder.indexOf(a.line);
    const bIdx = lineOrder.indexOf(b.line);
    return aIdx - bIdx;
  });

  return (
    <div>
      {sortedAcrostics.map(a => (
        <div key={a.id}>{a.acrostic}</div>
      ))}
    </div>
  );
}
```

**Action Items**:
- [ ] METRO_LINE_ORDER 정의 (중앙화)
- [ ] AcrosticList에서 import 사용
- [ ] 다른 컴포넌트에서도 일관성 있게 사용

**Estimated Time**: 2-3일

---

### 데이터 관리자 타임라인

```
Week 1: 데이터 파일 모듈화 (W-08)
├── seoul 호선별 분해
├── busan 호선별 분해
└── 통합 인덱스 작성

Week 2: 데이터 무결성 (W-11, W-10, W-12)
├── 색상 통일 및 검증
├── deleteAcrostic 버그 수정
└── LINE_ORDER 중앙화
```

---

## 4. QA 담당자

### 담당 이슈 분류

| Issue ID | 제목 | 테스트 범위 | 우선순위 |
|----------|------|-----------|---------|
| C-01~C-04 | 보안 테스트 | 인증, 권한, 데이터 유효성 | P0 |
| W-01 | useEffect 버그 | 역 선택 시 색상 동기화 | P0 |
| W-04 | 에러 핸들링 | 네트워크 오류 복구 | P0 |
| W-17 | 도시 전환 | 상태 초기화 확인 | P0 |
| W-05, W-06 | 데이터 유효성 | localStorage 스키마 | P1 |
| W-10 | deleteAcrostic | 존재하지 않는 ID 처리 | P1 |
| I-09 | 테스트 커버리지 | 0% → 80%+ | P2 |

### 구체적 조치 방법

#### Phase 1: 수동 테스트 시나리오 (1주)

**테스트 체크리스트**

```markdown
## 1. 보안 테스트 (CRITICAL)

### 1.1 인증 테스트
- [ ] 로그인 없이 관리자 기능 접근 불가
- [ ] 잘못된 비밀번호로 로그인 실패
- [ ] 로그인 후 JWT/세션 토큰 발급 확인
- [ ] 토큰 만료 후 재인증 필요
- [ ] localStorage에 토큰 저장 안 함 (HttpOnly 쿠키만)
- [ ] localStorage.setItem("admin", "true") 우회 불가능

### 1.2 권한 테스트
- [ ] 인증된 사용자만 N행시 생성 가능
- [ ] 인증된 사용자만 N행시 수정 가능
- [ ] 인증된 사용자만 N행시 삭제 가능
- [ ] 권한 없이 API 호출 시 401 반환

### 1.3 데이터 유효성 테스트
- [ ] 빈 N행시 생성 불가
- [ ] 특수문자 포함된 역명 처리
- [ ] 색상 값 형식 검증 (HEX)
- [ ] 잘못된 JSON 저장 방지

---

## 2. 기능 테스트 (WARNING)

### 2.1 역 선택 및 색상 (W-01)
- [ ] 역 선택 시 색상 자동 표시
- [ ] 호선 변경 시 색상 업데이트
- [ ] 색상 표시 지연 없음 (useEffect 정상 작동)

### 2.2 도시 전환 (W-17)
- [ ] 서울 → 부산 전환 시 지도 업데이트
- [ ] 전환 후 이전 도시 라인 선택 불가
- [ ] 새 도시의 라인만 표시

### 2.3 에러 핸들링 (W-04)
- [ ] 네트워크 오류 시 로딩 상태 해제
- [ ] 오류 메시지 사용자에게 표시
- [ ] 재시도 버튼 동작

### 2.4 삭제 기능 (W-10)
- [ ] 존재하는 N행시 삭제 성공
- [ ] 존재하지 않는 N행시 삭제 시 에러 메시지
- [ ] 삭제 후 목록 업데이트

---

## 3. 사용성 테스트

### 3.1 모달 (I-10)
- [ ] 모달 열기/닫기 정상 작동
- [ ] ESC 키로 모달 닫기
- [ ] 배경 클릭으로 모달 닫기 (선택)
- [ ] 모달 내 포커스 이동 (Tab 키)

### 3.2 확인 대화 (W-15)
- [ ] 커스텀 ConfirmDialog 표시
- [ ] "확인" 클릭 시 작업 진행
- [ ] "취소" 클릭 시 작업 중단

### 3.3 접근성
- [ ] 스크린 리더 호환성
- [ ] 키보드 네비게이션
- [ ] ARIA 라벨 적절성

---

## 4. 데이터 무결성 테스트

### 4.1 localStorage 검증 (W-06)
- [ ] 유효한 JSON만 저장
- [ ] 스키마 미일치 시 복구 또는 거부
- [ ] 용량 초과 시 처리

### 4.2 색상 일관성 (W-11)
- [ ] 모든 호선 색상 일치 확인
- [ ] 동해선 색상 통일 (#0054A6)

---

## 5. 성능 테스트

### 5.1 로딩 성능
- [ ] 초기 로딩 < 2초
- [ ] 지도 렌더링 < 1초
- [ ] 역 목록 로딩 < 500ms

### 5.2 메모리 누수
- [ ] 컴포넌트 언마운트 시 이벤트 리스너 정리
- [ ] 장시간 사용 후 메모리 증가 없음
```

**Action Items**:
- [ ] 테스트 계획서 작성
- [ ] 수동 테스트 실행 및 기록
- [ ] 버그 리포트 작성 (Jira/GitHub Issues)
- [ ] 개발팀과 협력 검증

---

#### Phase 2: 자동화 테스트 작성 (2-3주)

**테스트 프레임워크 선택**

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "jsdom": "^24.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "cypress": "^13.0.0"
  }
}
```

**유닛 테스트 예시**

File: `src/lib/bkend.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadAcrostics,
  saveAcrostic,
  deleteAcrostic,
  updateAcrostic,
} from './bkend';

describe('bkend', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('deleteAcrostic', () => {
    it('should delete existing acrostic', () => {
      const acrostic = {
        id: '1',
        stationName: 'Seoul Station',
        acrostic: 'Test',
        color: '#000000',
        createdAt: new Date().toISOString(),
      };
      saveAcrostic(acrostic);

      const result = deleteAcrostic('1');
      expect(result).toBe(true);
      expect(loadAcrostics()).toHaveLength(0);
    });

    it('should return false for non-existent acrostic', () => {
      const result = deleteAcrostic('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('loadAcrostics', () => {
    it('should return empty array when localStorage is empty', () => {
      const result = loadAcrostics();
      expect(result).toEqual([]);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('acrostics', 'invalid-json');
      expect(() => loadAcrostics()).not.toThrow();
    });
  });
});
```

**컴포넌트 테스트 예시**

File: `src/components/AcrosticEditor.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AcrosticEditor } from './AcrosticEditor';

describe('AcrosticEditor', () => {
  it('should render editor modal', () => {
    render(
      <AcrosticEditor
        station={{ name: 'Seoul Station', line: '1호선' }}
        onClose={() => {}}
        onSave={() => {}}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should update color when station changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <AcrosticEditor
        station={{ name: 'Seoul Station', line: '1호선' }}
        onClose={() => {}}
        onSave={() => {}}
      />
    );

    // 색상 확인 (1호선 파란색)
    expect(screen.getByDisplayValue('#0052A4')).toBeInTheDocument();

    // 역 변경
    rerender(
      <AcrosticEditor
        station={{ name: 'Gangnam Station', line: '2호선' }}
        onClose={() => {}}
        onSave={() => {}}
      />
    );

    // 색상 업데이트 (2호선 녹색)
    expect(screen.getByDisplayValue('#00A537')).toBeInTheDocument();
  });

  it('should call onSave when form is submitted', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <AcrosticEditor
        station={{ name: 'Seoul Station', line: '1호선' }}
        onClose={() => {}}
        onSave={onSave}
      />
    );

    const input = screen.getByPlaceholderText(/N행시/i);
    await user.type(input, 'Seoul');

    const submitButton = screen.getByRole('button', { name: /저장/i });
    await user.click(submitButton);

    expect(onSave).toHaveBeenCalledWith({
      text: 'Seoul',
      color: '#0052A4',
    });
  });
});
```

**E2E 테스트 예시 (Cypress)**

File: `cypress/e2e/auth.cy.ts`

```typescript
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not allow admin actions without login', () => {
    // localStorage 토큰 제거
    cy.clearLocalStorage();

    // API 호출 시도
    cy.request({
      method: 'POST',
      url: '/api/acrostic',
      body: { acrostic: 'test' },
      failOnStatusCode: false,
    }).then(res => {
      expect(res.status).to.equal(401);
    });
  });

  it('should allow admin actions after login', () => {
    // 로그인
    cy.visit('/login');
    cy.get('input[type="password"]').type('admin1234!');
    cy.get('button[type="submit"]').click();

    // JWT 토큰 확인
    cy.getAllCookies().should('have.length.greaterThan', 0);

    // N행시 생성
    cy.visit('/');
    cy.get('[data-testid="add-acrostic"]').click();
    cy.get('input[name="text"]').type('Seoul');
    cy.get('button[type="submit"]').click();

    cy.contains('Seoul').should('be.visible');
  });

  it('should recover from network errors', () => {
    cy.intercept('/api/acrostics', {
      statusCode: 500,
      body: { error: 'Server error' },
    });

    cy.get('[data-testid="load-acrostics"]').click();
    cy.contains('로드 실패').should('be.visible');
    cy.get('[data-testid="retry"]').should('be.visible');
  });
});
```

**Action Items**:
- [ ] Vitest + React Testing Library 설정
- [ ] 유닛 테스트 작성 (bkend.ts, util 함수)
- [ ] 컴포넌트 테스트 작성 (주요 컴포넌트)
- [ ] E2E 테스트 작성 (Cypress)
- [ ] 테스트 커버리지 80%+ 달성

**Estimated Time**: 2-3주

---

### QA 타임라인

```
Week 1: 수동 테스트 (테스트 계획, 실행, 버그 리포트)
Week 2-3: 자동화 테스트 (유닛, 컴포넌트, E2E)
```

---

## 5. DevOps 담당자

### 담당 이슈 분류

| Issue ID | 제목 | 범위 | 우선순위 |
|----------|------|------|---------|
| W-13 | 의미없이 async 선언된 함수 | bkend.ts | P2 |
| W-16 | @types/leaflet이 dependencies에 있음 | package.json | P2 |
| I-09 | 테스트 프레임워크 없음 | CI/CD 파이프라인 | P2 |

### 구체적 조치 방법

#### 1단계: 의존성 정리 (1-2일)

**W-16: 타입 패키지를 devDependencies로 이동**

```bash
# BEFORE
npm ls | grep @types/leaflet
@types/leaflet@1.9.0 (in dependencies)

# AFTER
npm install --save-dev @types/leaflet
npm uninstall @types/leaflet

# package.json 검증
cat package.json | grep -A5 devDependencies
```

**검증 스크립트**: `scripts/check-deps.sh`

```bash
#!/bin/bash

echo "Checking @types/* in dependencies..."
npm ls | grep "@types/" | grep -v devDependencies && {
  echo "❌ Found @types/* in dependencies. Moving to devDependencies..."
  exit 1
} || echo "✅ All @types/* in devDependencies"
```

**Action Items**:
- [ ] @types/* 패키지를 모두 devDependencies로 이동
- [ ] 의존성 검증 스크립트 추가
- [ ] CI에서 실행

**Estimated Time**: 1일

---

#### 2단계: 코드 품질 자동화 (1주)

**W-13: 의미없는 async 제거**

```typescript
// BEFORE (bkend.ts)
export async function loadAcrostics() {
  return JSON.parse(localStorage.getItem('acrostics') || '[]');
}

// AFTER (동기 함수로 변경)
export function loadAcrostics(): Acrostic[] {
  try {
    const data = localStorage.getItem('acrostics');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse acrostics:', error);
    return [];
  }
}
```

**검증 도구**: ESLint 규칙 추가

```javascript
// .eslintrc.json
{
  "rules": {
    "require-await": "warn",
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

**Action Items**:
- [ ] bkend.ts의 동기 함수에서 async 제거
- [ ] require-await ESLint 규칙 활성화
- [ ] 기존 코드 검증 (`eslint src/`)

**Estimated Time**: 2-3일

---

#### 3단계: CI/CD 파이프라인 강화 (1-2주)

**I-09: 테스트 프레임워크 통합**

GitHub Actions 워크플로우: `.github/workflows/test.yml`

```yaml
name: Test and Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Check dependencies
        run: npm run check:deps

      - name: Unit tests
        run: npm run test:unit

      - name: Coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Build
        run: npm run build

      - name: Type check
        run: npm run type-check

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: E2E tests
        run: npm run test:e2e

      - name: Upload E2E videos
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos
```

**package.json 스크립트 추가**

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "check:deps": "bash scripts/check-deps.sh",
    "type-check": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

**Action Items**:
- [ ] `.github/workflows/test.yml` 작성
- [ ] Vitest 설정
- [ ] Cypress 설정
- [ ] codecov 통합
- [ ] PR 템플릿에 테스트 체크리스트 추가

**Estimated Time**: 1-2주

---

#### 4단계: 배포 파이프라인 (선택사항)

**배포 전 체크리스트**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  security-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for hardcoded secrets
        run: |
          grep -r "NEXT_PUBLIC_ADMIN_PASSWORD" src/ && exit 1 || true
          grep -r "admin1234!" src/ && exit 1 || true
          echo "✅ No hardcoded secrets found"

      - name: Check environment variables
        run: |
          test -n "$ADMIN_PASSWORD" || exit 1
          test -n "$JWT_SECRET" || exit 1

  deploy:
    needs: security-check
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: |
          npx vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

### DevOps 타임라인

```
Day 1-2: 의존성 정리 (W-16)
└── package.json 검증 및 CI 체크

Day 3-4: 코드 품질 (W-13)
└── ESLint 규칙, bkend.ts 수정

Week 2: CI/CD 파이프라인 (I-09)
├── Vitest 통합
├── GitHub Actions 워크플로우
└── 커버리지 리포팅

Week 3: 배포 파이프라인 (선택)
└── 보안 검증, Vercel 배포
```

---

## 6. 통합 타임라인 및 우선순위

### Phase 1: Critical Security Fixes (Week 1-2)
```
보안/백엔드 담당자
├── 환경변수 및 인증 재설계
├── API 엔드포인트 권한 체크
└── 데이터 유효성 검사

프론트엔드 개발자 (병렬)
├── useEffect 의존성 수정
├── 에러 핸들링 추가
└── 도시 전환 상태 초기화

QA 담당자
└── 보안 테스트 (수동)
```

### Phase 2: Component Refactoring & Data (Week 2-4)
```
프론트엔드 개발자
└── God Component 분해 (page.tsx)

데이터 관리자
├── 데이터 파일 모듈화 (seoul-subway.ts)
├── 색상 통일 (동해선)
└── LINE_ORDER 중앙화

DevOps 담당자 (병렬)
├── 의존성 정리
└── CI/CD 파이프라인
```

### Phase 3: Testing & Quality (Week 3-5)
```
QA 담당자
├── 자동화 테스트 (유닛, 컴포넌트, E2E)
└── 커버리지 80%+ 달성

DevOps 담당자
└── 배포 파이프라인 (선택)
```

---

## 7. 완료 기준 및 검증

### Definition of Done

각 이슈별 완료 기준:

| Issue | 완료 기준 | 검증 방법 |
|-------|---------|---------|
| C-01~C-04 | 환경변수 제거, JWT 인증 적용 | 보안 테스트 통과 |
| W-01 | useEffect 의존성 추가 | 색상 동기화 테스트 |
| W-04 | try-catch-finally 적용 | 에러 핸들링 테스트 |
| W-17 | 도시 전환 시 상태 초기화 | 지도 업데이트 확인 |
| W-07 | God Component 분해 | page.tsx < 100줄 |
| W-08 | 호선별 파일 분해 | 939줄 → 평균 100줄/파일 |
| W-11 | 색상 통일 | 동해선 #0054A6 일관성 |
| I-09 | 테스트 커버리지 | 80%+ 달성 |

---

## 8. 보고서 요약

### 우선순위 및 작업량 요약

| 역할 | Critical | Warning | Info | 총 시간 | 시작일 | 완료일 |
|------|----------|---------|------|--------|--------|--------|
| 보안/백엔드 | 4 | 4 | 0 | 3-4주 | 3/04 | 3/24 |
| 프론트엔드 | 3 | 4 | 2 | 4-5주 | 3/04 | 4/01 |
| 데이터 관리자 | 0 | 4 | 0 | 2주 | 3/04 | 3/18 |
| QA | - | - | - | 3-4주 | 3/11 | 3/31 |
| DevOps | 0 | 2 | 1 | 2주 | 3/04 | 3/18 |

### 전체 프로젝트 완료 예상
- **시작일**: 2026-03-04
- **Phase 1 (보안)**: 2026-03-18
- **Phase 2 (리팩토링)**: 2026-03-31
- **Phase 3 (테스팅)**: 2026-04-14
- **완료일**: 2026-04-30

---

## 9. 다음 단계

1. **담당자별 회의**: 각 역할별로 상세 계획 수립
2. **우선순위 조정**: 비즈니스 요구사항에 따라 순서 조정
3. **주간 스탠드업**: 진도 추적 및 블로커 해결
4. **릴리스 계획**: Phase별 릴리스 버전 정의 (v1.1.0, v1.2.0, v1.3.0)

---

**Report Generated**: 2026-03-04
**Status**: Draft
**Next Review**: 2026-03-11
