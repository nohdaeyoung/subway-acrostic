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
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {TABS.map(({ city, label }) => (
        <button
          key={city}
          onClick={() => onChange(city)}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeCity === city
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
