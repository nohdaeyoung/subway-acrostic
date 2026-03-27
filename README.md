# 지하철역 시짓기 놀이

서울·부산 지하철역 이름으로 만든 **N행시**를 실제 노선도 위에서 감상하는 한국어 언어유희 웹 서비스.

**서비스 URL:** https://m.324.ing

---

## 서비스 소개

- 서울 22개 노선 / 부산 5개 노선 수록
- 전체 역 700개+ 좌표 기반 지도 표시
- 시드 N행시 119편+ 수록, 추가 작성 가능
- 역 이름 클릭으로 N행시 감상 및 작성
- 다크모드 지원

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js App Router |
| 언어 | TypeScript strict |
| 스타일 | Tailwind CSS v4 |
| 지도 | Leaflet + react-leaflet |
| 데이터베이스 | Firebase Firestore |
| 인증 | Firebase Auth (Google) + JWT |
| 배포 | Vercel |

---

## 개발 환경 설정

```bash
npm install
npm run dev   # http://localhost:3000
```

### 환경변수 (`.env.local`)

```env
ADMIN_PASSWORD=<어드민 비밀번호>
JWT_SECRET=<32자 이상 랜덤 문자열>
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

## 배포

`main` 브랜치에 push 하면 Vercel이 자동 빌드·배포합니다.

```bash
git push origin main
```

Vercel 프로젝트의 환경변수가 위 목록과 일치하는지 확인하세요.

---

## Firestore 보안 규칙 배포

`firestore.rules` 파일이 프로젝트 루트에 포함되어 있습니다.
규칙을 변경한 경우 Firebase CLI로 배포하세요.

```bash
firebase deploy --only firestore:rules
```

---

## 프로젝트 구조

```
src/
├── app/               # Next.js App Router 페이지 및 API 라우트
├── components/        # UI 컴포넌트
├── data/              # 역 좌표·노선 데이터 (서울·부산)
├── hooks/             # 상태 관리 훅
├── lib/               # Firestore CRUD, 인증, 유틸
└── types/             # TypeScript 타입 정의
```

자세한 구조 및 아키텍처 설명은 [docs/HANDOVER.md](docs/HANDOVER.md)를 참고하세요.

---

## 시드 N행시 추가

`src/data/acrostic-seeds.ts`에 항목을 추가합니다.

```ts
{
  stationId: "s-gangnam",
  lines: ["강으로 시작하는 문장", "남으로 시작하는 문장"],
}
```

`lines` 배열 길이는 역 이름 글자 수와 일치해야 합니다.
