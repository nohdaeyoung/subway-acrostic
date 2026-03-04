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
    <div role="tablist" aria-label="도시 선택" className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {TABS.map(({ city, label }) => (
        <button
          key={city}
          role="tab"
          aria-selected={activeCity === city}
          aria-label={`${label} 탭`}
          onClick={() => onChange(city)}
          className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activeCity === city
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
