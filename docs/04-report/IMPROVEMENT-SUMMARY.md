# 개선사항 보고서 - 요약본

> **Date**: 2026-03-04
> **Source**: bkit:code-analyzer (CRITICAL 4, WARNING 17, INFO 11)
> **Total Issues**: 32개
> **Estimated Timeline**: 4-5주
> **Status**: 우선순위 분류 완료

---

## 빠른 시작 가이드

### 1분 요약

**코드 분석 결과**:
- **CRITICAL (4)**: 보안 문제 (인증, 권한, 환경변수)
- **WARNING (17)**: 기능 버그 및 코드 품질
- **INFO (11)**: 개선 권장사항

**담당자별 작업 배분**:
1. **보안/백엔드** (3-4주): JWT 인증, API 권한 체크, 데이터 유효성
2. **프론트엔드** (4-5주): useEffect 버그, 에러 처리, God Component 분해
3. **데이터 관리자** (2주): 파일 모듈화, 색상 통일, 스키마 중앙화
4. **QA** (3-4주): 수동 테스트, 자동화 테스트 작성
5. **DevOps** (2주): CI/CD, 의존성 정리, 테스트 파이프라인

---

## 역할별 우선순위

### 보안/백엔드 담당자

**최우선 (P0 - 1-2주)**
| 이슈 | 작업 | 예상 시간 |
|------|------|---------|
| C-01 | NEXT_PUBLIC_ADMIN_PASSWORD 제거 | 3일 |
| C-02 | 약한 비밀번호 제거 | 1일 |
| C-03 | localStorage 인증 우회 방지 | 3-5일 |
| C-04 | API 권한 체크 추가 | 5-7일 |

**High Priority (P1 - 1-2주)**
| 이슈 | 작업 | 예상 시간 |
|------|------|---------|
| W-03 | loadAcrostics 에러 핸들링 | 2-3일 |
| W-05 | 입력 데이터 유효성 검사 (Zod) | 3-5일 |
| W-06 | localStorage 스키마 검증 | 3-5일 |

**구체적 조치**:
```bash
# 1. 환경변수 분리
.env.local (서버 only):
  ADMIN_PASSWORD=강력한_비밀번호
  JWT_SECRET=jwt_secret_key

# 2. 백엔드 API 구현
/app/api/auth/login → JWT 토큰 발급

# 3. 미들웨어 추가
middleware.ts → 요청 인증 검증

# 4. 클라이언트 정리
localStorage 토큰 저장 제거 → HttpOnly 쿠키만 사용
```

**Success Criteria**:
- [ ] NEXT_PUBLIC_ADMIN_PASSWORD 제거 확인
- [ ] 모든 쓰기 API에 권한 체크
- [ ] 보안 테스트 통과

---

### 프론트엔드 개발자

**최우선 (P0 - 1주)**
| 이슈 | 파일 | 작업 | 예상 시간 |
|------|------|------|---------|
| W-01 | AcrosticEditor.tsx | useEffect 의존성 추가 | 1-2일 |
| W-04 | page.tsx | try-catch-finally 추가 | 2-3일 |
| W-17 | page.tsx | 도시 전환 시 상태 초기화 | 1일 |

**High Priority (P1 - 2-3주)**
| 이슈 | 작업 | 예상 시간 |
|------|------|---------|
| W-07 | page.tsx God Component 분해 | 5-7일 |
| W-02 | AcrosticModal.tsx 데드 코드 제거 | 1-2일 |
| W-09 | 중복 코드 통합 | 2-3일 |

**구체적 조치**:
```typescript
// 1. useEffect 의존성 수정 (AcrosticEditor.tsx)
useEffect(() => {
  setStationColor(/* ... */);
}, [station.name, lineColor]);  // 의존성 추가

// 2. 에러 핸들링 (page.tsx)
const handleStationClick = async (stationName: string) => {
  setLoadingAcrostic(true);
  try {
    // 작업
  } catch (error) {
    // 에러 처리
  } finally {
    setLoadingAcrostic(false);
  }
};

// 3. 상태 초기화 (page.tsx)
const handleCityChange = (city: 'seoul' | 'busan') => {
  setCity(city);
  setSelectedLine(null);
  setSelectedStationAcrostics([]);
};

// 4. God Component 분해
// page.tsx (254줄) → MapSection, SidebarSection, ModalSection
```

**Success Criteria**:
- [ ] useEffect 모든 의존성 추가
- [ ] 모든 async 함수에 try-catch
- [ ] 도시 전환 후 지도 정상 표시
- [ ] page.tsx < 100줄로 축약

---

### 데이터 관리자

**우선 작업 (2주)**
| 이슈 | 작업 | 예상 시간 |
|------|------|---------|
| W-08 | seoul-subway.ts 939줄 분해 | 3-5일 |
| W-11 | 동해선 색상 통일 | 2-3일 |
| W-10 | deleteAcrostic 버그 수정 | 1일 |
| W-12 | LINE_ORDER 중앙화 | 1-2일 |

**구체적 조치**:
```
데이터 파일 구조:
src/data/
├── __types__.ts (LINE_COLORS, LINE_ORDER)
├── seoul/
│   ├── line-1.ts ~ line-9.ts
│   └── index.ts
└── busan/
    ├── line-1.ts ~ line-4.ts
    └── index.ts

색상 통일:
동해선: #0054A6 (일관성 유지)

중앙 집중식 정의:
export const LINE_COLORS = { '1호선': '#0052A4', ... };
export const LINE_ORDER = ['1호선', '2호선', ...];
```

**Success Criteria**:
- [ ] 호선별 파일 분해 완료
- [ ] 색상 검증 자동화 스크립트
- [ ] deleteAcrostic 존재 여부 체크

---

### QA 담당자

**Phase 1: 수동 테스트 (1주)**
```
테스트 영역:
├── 보안: 인증, 권한, 데이터 유효성
├── 기능: useEffect, 에러 핸들링, 도시 전환
├── 사용성: 모달, 확인 대화, 접근성
└── 데이터: localStorage, 색상 일관성
```

**Phase 2: 자동화 테스트 (2-3주)**
```
테스트 피라미드:
유닛 테스트: bkend.ts, util 함수
컴포넌트 테스트: 주요 컴포넌트 (AcrosticEditor, AcrosticList)
E2E 테스트: 전체 flow (인증 → 역 선택 → N행시 작성)

목표: 커버리지 80%+
```

**Success Criteria**:
- [ ] 수동 테스트 체크리스트 완료
- [ ] 자동화 테스트 80%+ 커버리지
- [ ] CI 파이프라인 통과

---

### DevOps 담당자

**빠른 정리 (1-2일)**
| 이슈 | 작업 |
|------|------|
| W-16 | @types/leaflet → devDependencies |
| W-13 | 의미없는 async 제거 |

**CI/CD 구축 (1-2주)**
```bash
CI 파이프라인:
├── Lint: eslint src/
├── Type Check: tsc --noEmit
├── Unit Test: vitest run
├── Coverage: codecov
├── Build: npm run build

주요 설정:
.github/workflows/test.yml
.eslintrc.json (require-await 규칙)
vitest.config.ts
```

**Success Criteria**:
- [ ] 의존성 정리 완료
- [ ] CI 파이프라인 자동 실행
- [ ] 모든 PR에서 테스트 통과 확인

---

## 전체 타임라인

```
Week 1-2: Critical Security Fixes (3/04 ~ 3/18)
├── [보안] 환경변수 및 JWT 인증
├── [프론트엔드] useEffect, 에러 핸들링, 상태 초기화
├── [데이터] 색상 통일
└── [DevOps] CI/CD 기초 구축

Week 2-3: Component Refactoring (3/18 ~ 4/01)
├── [프론트엔드] God Component 분해
├── [데이터] 파일 모듈화
└── [QA] 수동 테스트

Week 3-4: Automation (3/31 ~ 4/14)
├── [QA] 자동화 테스트 작성
└── [DevOps] 배포 파이프라인

전체 완료: 2026-04-30
```

---

## 이슈별 체크리스트

### 보안 (Critical)
- [ ] C-01: NEXT_PUBLIC_ADMIN_PASSWORD 제거
- [ ] C-02: 약한 비밀번호 제거 및 강화
- [ ] C-03: localStorage 우회 방지
- [ ] C-04: API 권한 체크 추가

### 프론트엔드 (Warning)
- [ ] W-01: useEffect 의존성 누락
- [ ] W-02: AcrosticModal 데드 코드
- [ ] W-04: handleStationClick 에러 처리
- [ ] W-07: page.tsx God Component
- [ ] W-09: 중복 코드 제거
- [ ] W-15: confirm() 커스텀 대체
- [ ] W-17: 도시 전환 상태 초기화

### 데이터 (Warning)
- [ ] W-08: seoul-subway.ts 모듈화
- [ ] W-10: deleteAcrostic 버그 수정
- [ ] W-11: 동해선 색상 통일
- [ ] W-12: LINE_ORDER 중앙화

### 기능 (Warning)
- [ ] W-03: loadAcrostics 에러 처리
- [ ] W-05: 입력 데이터 유효성 검사
- [ ] W-06: localStorage 스키마 검증

### 접근성 (Info)
- [ ] I-10: 모달 focus trap

### 코드 품질 (Info)
- [ ] I-09: 테스트 커버리지 80%+
- [ ] I-11: 미사용 import 제거

---

## 리소스 할당 제안

```
보안/백엔드: 1-2명 (3-4주)
프론트엔드: 2명 (4-5주)
데이터 관리자: 1명 (2주)
QA: 1-2명 (3-4주)
DevOps: 1명 (2주)

총 팀 규모: 6-8명
총 작업 기간: 4-5주 (병렬 진행)
```

---

## 비용-효과 분석

### 현재 상태 (개선 전)
- **보안 위험도**: CRITICAL (접근 가능한 비밀번호)
- **기술 부채**: HIGH (939줄 단일 파일, God Component)
- **테스트 커버리지**: 0%
- **운영 비용**: 높음 (버그 수정 시간 증가)

### 개선 후
- **보안 위험도**: LOW (JWT, 권한 체크)
- **기술 부채**: LOW (모듈화, 단일책임)
- **테스트 커버리지**: 80%+
- **운영 비용**: 감소 (자동화, CI/CD)

**ROI**: 4-5주 투자로 향후 유지보수 비용 50%+ 절감

---

## 문서 위치

**상세 보고서**: `/docs/04-report/code-analysis-improvement-by-role.md`

### 담당자별 상세 내용

#### 보안/백엔드 담당자
- [x] 환경변수 및 인증 아키텍처 재설계
- [x] API 엔드포인트 권한 체크
- [x] 데이터 유효성 검사 강화

#### 프론트엔드 개발자
- [x] Critical Bug 해결 (W-01, W-04, W-17)
- [x] 컴포넌트 리팩토링 (W-07)
- [x] 접근성 및 UX 개선 (W-15, I-10)

#### 데이터 관리자
- [x] 데이터 파일 모듈화 (W-08)
- [x] 데이터 무결성 검증 (W-11, W-10, W-12)

#### QA 담당자
- [x] 수동 테스트 시나리오
- [x] 자동화 테스트 작성 (Vitest, Cypress)

#### DevOps 담당자
- [x] 의존성 정리 (W-16)
- [x] 코드 품질 자동화 (W-13)
- [x] CI/CD 파이프라인 강화 (I-09)

---

## 다음 단계

1. **확인**: 각 담당자가 상세 보고서 검토
2. **계획**: 담당자별 상세 일정 수립
3. **착수**: 3월 4일 주간부터 Phase 1 시작
4. **추적**: 주간 스탠드업 회의 (매주 월요일)

---

**생성일**: 2026-03-04
**상태**: Draft
**다음 리뷰**: 2026-03-11
**담당자 회의**: 2026-03-05 오후 2시
