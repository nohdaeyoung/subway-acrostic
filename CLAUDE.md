# subway-acrostic — Claude Code 작업 지침

## 프로젝트 정보

- **이름**: 지하철역 시짓기 놀이
- **URL**: https://m.324.ing
- **GitHub**: nohdaeyoung/subway-acrostic
- **스택**: Next.js 16 (App Router, webpack), Firebase Firestore, Vercel

상세 인수인계는 [docs/HANDOVER.md](docs/HANDOVER.md), [README.md](README.md) 참고.

---

## 자동 아카이빙 규칙 (필수)

이 프로젝트에서 의미 있는 작업(기능 추가, 버그 수정, 디자인 변경, 데이터 작업 등)을 완료할 때마다 **반드시** 옵시디언 vault에 작업 로그를 저장한다.

### 저장 위치

```
/Users/dyno/Library/Mobile Documents/iCloud~md~obsidian/Documents/daeyoung note/324.ing/지하철역 시짓기 놀이/Worklog/{YYYY-MM-DD} - {제목}.md
```

### 동작 규칙

1. **트리거**: 사용자가 작업을 마무리하거나, 커밋을 만들거나, "끝났어/완료" 등의 마무리 멘트를 할 때마다 자동 실행
2. **파일 생성/업데이트**:
   - 같은 날짜 파일이 있으면 → 해당 파일에 섹션 추가
   - 없으면 → 새 파일 생성
3. **파일명 형식**: `YYYY-MM-DD - {핵심 주제}.md`
4. **사용자에게 묻지 않음**: 자동으로 처리 후 결과만 간단히 알림

### 파일 템플릿

```markdown
---
date: YYYY-MM-DD
project: 지하철역 시짓기 놀이
tags:
  - worklog
  - subway-acrostic
  - {feature|fix|design|data|infra|security|docs}
---

# YYYY-MM-DD — {제목}

## 작업 요약

{1~2문단 설명}

## 주요 변경

### {섹션}
- 변경 내용 1
- 변경 내용 2

## 트러블슈팅 (해당 시)

- 이슈와 해결법

## 커밋

- `{hash}` {커밋 메시지}
```

### 인덱스 갱신

새 작업 로그를 추가했으면 [README.md](file:///Users/dyno/Library/Mobile%20Documents/iCloud~md~obsidian/Documents/daeyoung%20note/Projects/지하철역%20시짓기%20놀이/README.md)의 "작업 로그" 섹션에 위키링크를 추가한다 (날짜 내림차순 정렬).

### 예외

- 단순 조회/질문 응답만 한 경우 → 아카이빙 안 함
- 사용자가 명시적으로 "기록하지 마"라고 한 경우 → 안 함

---

## 작업 규칙

- 배포는 명시적 요청 시에만 (`vercel --prod`)
- 빌드는 반드시 `--webpack` 플래그 (next-pwa Turbopack 비호환)
- AI 시 추가/재생성: `scripts/generate-ai-acrostics.ts --line N --merge [--include-user]`
- 응답 언어: 한글
