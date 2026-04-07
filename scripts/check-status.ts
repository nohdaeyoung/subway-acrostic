import { SEOUL_STATIONS } from "../src/data/seoul-subway";
import { ACROSTIC_SEEDS } from "../src/data/acrostic-seeds";
import { AI_ACROSTIC_SEEDS } from "../src/data/ai-acrostic-seeds";

const userIds = new Set(ACROSTIC_SEEDS.map((s) => s.stationId));
const aiIds = new Set(AI_ACROSTIC_SEEDS.map((s) => s.stationId));

for (const lineId of ["1", "2", "3"]) {
  const line = SEOUL_STATIONS.filter((s) => s.lines.includes(lineId));
  const userCount = line.filter((s) => userIds.has(s.id)).length;
  const aiCount = line.filter((s) => aiIds.has(s.id)).length;
  const missing = line.filter((s) => !userIds.has(s.id) && !aiIds.has(s.id));
  console.log(
    `[${lineId}호선] 전체 ${line.length} / 사용자 ${userCount} / AI ${aiCount} / 미작성 ${missing.length}`,
  );
  missing.slice(0, 5).forEach((s) => console.log(`    - ${s.id} / ${s.name}`));
  if (missing.length > 5) console.log(`    ... +${missing.length - 5}`);
}
