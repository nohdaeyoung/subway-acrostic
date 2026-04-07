/**
 * AI 기반 N행시 생성 스크립트
 *
 * 사용법:
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/generate-ai-acrostics.ts [--sample N] [--out path]
 *
 * 동작:
 *   1. 미작성 역 목록 추출
 *   2. 각 역에 대해 3개 컨셉(사랑/철학/유머) N행시 생성
 *   3. ai-acrostic-seeds.ts 형식으로 출력
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { SEOUL_STATIONS } from "../src/data/seoul-subway";
import { BUSAN_STATIONS } from "../src/data/busan-subway";
import { ACROSTIC_SEEDS } from "../src/data/acrostic-seeds";

interface StationInput {
  id: string;
  name: string;
}

type Concept = "love" | "philosophy" | "humor";

interface AiAcrostic {
  stationId: string;
  concept: Concept;
  lines: string[];
}

const CONCEPT_PROMPTS: Record<Concept, string> = {
  love: "사랑, 연애, 그리움, 설렘 등의 감정을 담은 따뜻한 톤",
  philosophy: "삶의 철학, 인생의 통찰, 성찰을 담은 깊이 있는 톤",
  humor: "재치있고 유머러스한, 가볍게 웃을 수 있는 톤",
};

/** 숫자를 한글로 변환 (첫 글자용) */
const NUM_TO_KOR: Record<string, string[]> = {
  "0": ["영"],
  "1": ["일", "한", "하나"],
  "2": ["이", "두", "둘"],
  "3": ["삼", "세"],
  "4": ["사", "네"],
  "5": ["오", "다섯"],
  "6": ["육"],
  "7": ["칠", "일곱"],
  "8": ["팔", "여덟"],
  "9": ["구", "아홉"],
};

function buildPrompt(name: string, concept: Concept): string {
  const chars = [...name];
  const lineSpec = chars
    .map((c, i) => {
      const alt = NUM_TO_KOR[c];
      if (alt) {
        return `${i + 1}. "${c}"번째 줄: 숫자이므로 "${alt.join("/")}" 같은 한글로 시작`;
      }
      return `${i + 1}. "${c}"으로 시작`;
    })
    .join("\n");

  return `역 이름 "${name}"으로 ${chars.length}행시를 작성해줘.

## 가장 중요한 원칙
**억지스러운 표현은 절대 금지.** 첫 글자를 맞추려고 "량손", "리본처럼", "로즈", "3번의" 같은 부자연스러운 단어를 쓰면 완전히 실패한 것.
진짜 한국어 화자가 일상적으로 쓰는 자연스러운 문장이어야 해. 소리 내어 읽었을 때 어색하면 다시 써.

## 규칙
- 각 줄은 정확히 지정된 글자로 시작 (첫 글자가 그 글자여야 함)
- 한 줄당 12~22자의 자연스러운 한국어 문장
- 톤: ${CONCEPT_PROMPTS[concept]}
- 역 이름 자체를 문장에 그대로 넣지 말 것 (예: "대방" 시에 "대방역" 언급 금지)

## 줄 구성
${lineSpec}

## 자주 쓰는 자연스러운 시작 단어 예시
- "량" → 량껏, 량보다는, 량이... (이런 단어는 부자연스러우니 피하고, 정말 쓸 수 없으면 차라리 "양"으로 의역한 "양손 가득"도 안 되고... 솔직히 "량"은 거의 불가능하니 최대한 애써봐)
- "로" → 로망이, 로마는, 로그인... (일상어 우선)
- "리" → 리듬, 리허설, 리어카... (부자연스러우면 재작성)
- 숫자는 위 스펙대로 한글 읽기로 시작

## 좋은 예 (자연스러움)
역: "강남" / 사랑 톤
{"lines": ["강물처럼 흘러가는 이 시간도 너와 함께라면 좋겠어", "남몰래 품은 마음이 오늘은 조금 더 커졌나 봐"]}

## 나쁜 예 (억지스러움 - 절대 이렇게 쓰지 마)
역: "노량진" / 사랑 톤
{"lines": ["노을 지는 강가에서 너를 기다리던 그날", "량손 가득 담아도 모자랄 만큼 네 사랑이", "진심으로 사랑한다고 오늘은 꼭 말하고 싶어"]}
→ "량손"이 억지스러움. "량"은 한국어에서 단어 시작으로 거의 안 쓰임.

## 생성 절차
1. 먼저 초안을 마음속으로 작성
2. 소리 내어 읽어보고 어색한 줄이 있는지 확인
3. 어색하면 처음부터 다시 써
4. 완성된 것만 출력

## 출력 형식
JSON만 출력, 다른 텍스트 금지:
{"lines": ["첫 줄", "둘째 줄", ...]}`;
}

async function generateOneAttempt(
  client: Anthropic,
  station: StationInput,
  concept: Concept,
): Promise<AiAcrostic | null> {
  const prompt = buildPrompt(station.name, concept);
  try {
    const res = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // JSON 추출 (```json 블록 대응)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`  ✗ JSON not found: ${station.name}/${concept}`);
      return null;
    }
    const parsed = JSON.parse(jsonMatch[0]) as { lines: string[] };

    // 글자 수 검증
    const chars = [...station.name];
    if (parsed.lines.length !== chars.length) {
      console.error(`  ✗ Line count mismatch: ${station.name}/${concept} (expected ${chars.length}, got ${parsed.lines.length})`);
      return null;
    }

    // 첫 글자 검증 (숫자는 한글 대체 허용)
    for (let i = 0; i < chars.length; i++) {
      const expected = chars[i];
      const line = parsed.lines[i];
      const alts = NUM_TO_KOR[expected];
      const validStarts = alts ? [expected, ...alts] : [expected];
      const startsOk = validStarts.some((s) => line.startsWith(s));
      if (!startsOk) {
        console.error(`  ✗ First char mismatch: ${station.name}/${concept} line ${i + 1}: "${line}" (expected "${validStarts.join("/")}...")`);
        return null;
      }
    }

    // 억지 패턴 감지 (어색한 시작어)
    const AWKWARD_PATTERNS = [
      /^량/,       // "량"은 한국어 단어 시작으로 매우 부자연스러움
      /^리[어로]/,  // "리어카", "리로..." 등
      /^로즈/,
    ];
    for (const line of parsed.lines) {
      for (const pat of AWKWARD_PATTERNS) {
        if (pat.test(line)) {
          console.error(`  ✗ Awkward pattern: ${station.name}/${concept} "${line}"`);
          return null;
        }
      }
    }

    return {
      stationId: station.id,
      concept,
      lines: parsed.lines,
    };
  } catch (err) {
    console.error(`  ✗ API error: ${station.name}/${concept}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function generateOne(
  client: Anthropic,
  station: StationInput,
  concept: Concept,
): Promise<AiAcrostic | null> {
  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await generateOneAttempt(client, station, concept);
    if (result) {
      if (attempt > 1) console.log(`  ↻ retry ${attempt - 1} succeeded: ${station.name}/${concept}`);
      return result;
    }
  }
  console.error(`  ✗ Failed after ${MAX_ATTEMPTS} attempts: ${station.name}/${concept}`);
  return null;
}

function getMissingStations(
  lineFilter?: string,
  includeUserWritten = false,
): StationInput[] {
  const seedIds = new Set(ACROSTIC_SEEDS.map((s) => s.stationId));
  // 이미 AI seed가 있는 역도 중복 생성 방지
  let existingAi: Set<string>;
  try {
    // 동적 import로 기존 AI seed 파일 로드 (없으면 빈 Set)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../src/data/ai-acrostic-seeds");
    existingAi = new Set(
      (mod.AI_ACROSTIC_SEEDS as { stationId: string }[]).map((s) => s.stationId),
    );
  } catch {
    existingAi = new Set();
  }

  const all = [...SEOUL_STATIONS, ...BUSAN_STATIONS];
  return all
    .filter((s) => {
      // 사용자 시 역도 포함하는 모드면 seedIds 필터 건너뜀
      const userOk = includeUserWritten || !seedIds.has(s.id);
      return userOk && !existingAi.has(s.id);
    })
    .filter((s) => {
      if (!lineFilter) return true;
      return (s as { lines: string[] }).lines.includes(lineFilter);
    })
    .map((s) => ({ id: s.id, name: s.name }));
}

function pickSample(missing: StationInput[], n: number): StationInput[] {
  // 2자/3자/4자 섞어서 다양성 확보
  const by2 = missing.filter((s) => s.name.length === 2);
  const by3 = missing.filter((s) => s.name.length === 3);
  const by4 = missing.filter((s) => s.name.length === 4);
  const by5 = missing.filter((s) => s.name.length >= 5);

  const perBucket = Math.ceil(n / 4);
  const sample = [
    ...by2.slice(0, perBucket),
    ...by3.slice(0, perBucket),
    ...by4.slice(0, perBucket),
    ...by5.slice(0, perBucket),
  ].slice(0, n);

  return sample;
}

async function main() {
  const args = process.argv.slice(2);
  const sampleIdx = args.indexOf("--sample");
  const sampleSize = sampleIdx >= 0 ? parseInt(args[sampleIdx + 1], 10) : 0;
  const outIdx = args.indexOf("--out");
  const outPath = outIdx >= 0 ? args[outIdx + 1] : "src/data/ai-acrostic-seeds.ts";
  const lineIdx = args.indexOf("--line");
  const lineFilter = lineIdx >= 0 ? args[lineIdx + 1] : undefined;
  const mergeFlag = args.includes("--merge");
  const includeUser = args.includes("--include-user");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("✗ ANTHROPIC_API_KEY not set");
    process.exit(1);
  }
  const client = new Anthropic({ apiKey });

  const missing = getMissingStations(lineFilter, includeUser);
  const targets = sampleSize > 0 ? pickSample(missing, sampleSize) : missing;

  console.log(`전체 미작성: ${missing.length}역`);
  console.log(`이번 생성 대상: ${targets.length}역 × 3컨셉 = ${targets.length * 3}개 시`);
  console.log("");

  const concepts: Concept[] = ["love", "philosophy", "humor"];
  const results: AiAcrostic[] = [];
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < targets.length; i++) {
    const station = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${station.name} (${station.id})`);

    // 컨셉 3개 병렬 생성
    const promises = concepts.map((c) => generateOne(client, station, c));
    const settled = await Promise.all(promises);

    for (const r of settled) {
      if (r) {
        results.push(r);
        ok++;
        const conceptLabel = { love: "❤️", philosophy: "🧠", humor: "😄" }[r.concept];
        console.log(`  ${conceptLabel} ${r.lines.join(" / ")}`);
      } else {
        fail++;
      }
    }
  }

  console.log("");
  console.log(`✓ 성공: ${ok} / 실패: ${fail}`);

  // 기존 AI seed와 병합
  let merged = results;
  if (mergeFlag) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("../src/data/ai-acrostic-seeds");
      const existing = mod.AI_ACROSTIC_SEEDS as AiAcrostic[];
      merged = [...existing, ...results];
      console.log(`\n병합: 기존 ${existing.length} + 신규 ${results.length} = ${merged.length}`);
    } catch {
      console.log("(기존 seed 파일 없음, 신규만 저장)");
    }
  }

  // 파일 출력
  const fileContent = `// Auto-generated by scripts/generate-ai-acrostics.ts
// Do not edit manually. Regenerate to update.

export interface AiAcrosticSeed {
  stationId: string;
  concept: "love" | "philosophy" | "humor";
  lines: string[];
}

export const AI_ACROSTIC_SEEDS: AiAcrosticSeed[] = ${JSON.stringify(merged, null, 2)};
`;

  const fullPath = path.resolve(outPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, fileContent, "utf-8");
  console.log(`\n✓ 저장: ${fullPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
