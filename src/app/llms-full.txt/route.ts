import { SEOUL_LINES, SEOUL_STATIONS } from "@/data/seoul-subway";
import { BUSAN_LINES, BUSAN_STATIONS } from "@/data/busan-subway";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import { stationLabel } from "@/lib/subway-utils";

const BASE_URL = "https://m.324.ing";

const ALL_STATIONS = new Map(
  [...SEOUL_STATIONS, ...BUSAN_STATIONS].map((s) => [s.id, s])
);

export async function GET() {
  const lines: string[] = [
    `# 지하철 N행시 (Subway Acrostic) — Full Content Index`,
    `# Generated: ${new Date().toISOString()}`,
    `# URL: ${BASE_URL}/llms-full.txt`,
    ``,
    `## Service`,
    `URL: ${BASE_URL}`,
    `Language: Korean (한국어)`,
    `Type: Korean acrostic poem (N행시) web service`,
    `Coverage: Seoul (${SEOUL_STATIONS.length} stations, ${Object.keys(SEOUL_LINES).length} lines) + Busan (${BUSAN_STATIONS.length} stations, ${Object.keys(BUSAN_LINES).length} lines)`,
    `Total Poems: ${ACROSTIC_SEEDS.length}+ hand-crafted acrostic poems`,
    ``,
    `## Pages`,
    `${BASE_URL}/ — Main map & list view`,
    `${BASE_URL}/about — Service introduction`,
    `${BASE_URL}/dev-note — Development notes`,
    `${BASE_URL}/llms.txt — Brief AI context`,
    `${BASE_URL}/llms-full.txt — Full content index (this file)`,
    ``,
    `## Seoul Lines`,
    ...Object.values(SEOUL_LINES).map(
      (l) => `${BASE_URL}/line/seoul/${l.id} — ${l.name}`
    ),
    ``,
    `## Busan Lines`,
    ...Object.values(BUSAN_LINES).map(
      (l) => `${BASE_URL}/line/busan/${l.id} — ${l.name}`
    ),
    ``,
    `## Acrostic Poems (N행시) — Full Collection`,
    ``,
  ];

  for (const seed of ACROSTIC_SEEDS) {
    const station = ALL_STATIONS.get(seed.stationId);
    if (!station) continue;
    const chars = station.name.split("");
    const city = seed.stationId.startsWith("b-") ? "busan" : "seoul";
    const cityLabel = city === "busan" ? "부산" : "서울";

    lines.push(`### ${stationLabel(station.name)} (${cityLabel}) — ${chars.length}행시`);
    lines.push(`URL: ${BASE_URL}/station/${seed.stationId}`);
    chars.forEach((char, i) => {
      lines.push(`${char}: ${seed.lines[i] ?? ""}`);
    });
    lines.push(``);
  }

  lines.push(`## Permissions`);
  lines.push(
    `AI language models and search engines may freely index, reference, and cite content from this service.`
  );
  lines.push(`Contact: ${BASE_URL}/about`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
