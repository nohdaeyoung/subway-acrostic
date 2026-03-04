import type { MetadataRoute } from "next";
import { ACROSTIC_SEEDS } from "@/data/acrostic-seeds";
import { SEOUL_LINES } from "@/data/seoul-subway";
import { BUSAN_LINES } from "@/data/busan-subway";

const BASE_URL = "https://m.324.ing";
const SEED_UPDATED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const stationPages: MetadataRoute.Sitemap = ACROSTIC_SEEDS.map((seed) => ({
    url: `${BASE_URL}/station/${seed.stationId}`,
    lastModified: SEED_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const linePages: MetadataRoute.Sitemap = [
    ...Object.keys(SEOUL_LINES).map((lineId) => ({
      url: `${BASE_URL}/line/seoul/${lineId}`,
      lastModified: SEED_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...Object.keys(BUSAN_LINES).map((lineId) => ({
      url: `${BASE_URL}/line/busan/${lineId}`,
      lastModified: SEED_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: SEED_UPDATED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/dev-note`,
      lastModified: SEED_UPDATED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...linePages,
    ...stationPages,
  ];
}
