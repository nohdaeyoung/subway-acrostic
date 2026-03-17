import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByVuYDKbzbQ8w7yKE6TEDLX32rkLfPo88",
  authDomain: "subwayn-90c6b.firebaseapp.com",
  projectId: "subwayn-90c6b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SEEDS = JSON.parse(readFileSync(new URL("./seeds.json", import.meta.url), "utf-8"));

async function migrate() {
  const snapshot = await getDocs(collection(db, "acrostics"));
  const existingStationIds = new Set(snapshot.docs.map(d => d.data().stationId));

  let created = 0;
  let skipped = 0;

  for (const seed of SEEDS) {
    if (existingStationIds.has(seed.stationId)) {
      skipped++;
      continue;
    }
    const id = crypto.randomUUID();
    await setDoc(doc(db, "acrostics", id), {
      stationId: seed.stationId,
      lines: seed.lines,
      createdAt: seed.createdAt,
      updatedAt: seed.updatedAt,
    });
    created++;
  }

  console.log(`Migration complete: ${created} created, ${skipped} skipped (already exist)`);
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
