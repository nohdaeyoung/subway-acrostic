"use client";

import type { City } from "@/types/subway";

interface CityTabsProps {
  activeCity: City;
  onChange: (city: City) => void;
}

const TABS: { city: City; label: string }[] = [
  { city: "seoul", label: "서울" },
  { city: "busan", label: "부산" },
];

export default function CityTabs({ activeCity, onChange }: CityTabsProps) {
  return (
    <div role="tablist" aria-label="도시 선택" className="flex gap-0.5 rounded-lg p-0.5" style={{ background: "var(--border-soft)" }}>
      {TABS.map(({ city, label }) => (
        <button
          key={city}
          role="tab"
          aria-selected={activeCity === city}
          aria-label={`${label} 탭`}
          onClick={() => onChange(city)}
          className="px-5 py-3 rounded-md text-sm font-serif transition-all duration-150"
          style={{
            background: activeCity === city ? "var(--bg-card)" : "transparent",
            color: activeCity === city ? "var(--text-ink)" : "var(--text-faded)",
            fontWeight: activeCity === city ? 700 : 400,
            boxShadow: activeCity === city ? "0 1px 3px rgba(42, 33, 24, 0.08)" : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
