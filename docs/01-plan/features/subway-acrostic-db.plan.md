# Plan: N행시 서버 DB 연동

## 문제
N행시 데이터가 브라우저 localStorage에만 저장되어 디바이스 간 동기화 불가.

## 해결
Supabase PostgreSQL에 `acrostics` 테이블 추가, API 라우트 생성, `bkend.ts`를 서버 API 호출로 전환.

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

## 변경 파일
- `src/lib/supabase.ts` (신규)
- `src/app/api/acrostics/route.ts` (신규)
- `src/app/api/acrostics/[id]/route.ts` (신규)
- `src/lib/bkend.ts` (전면 수정)
- `scripts/migrate-seeds.ts` (신규, 일회성)
