"use client";

import { useEffect } from "react";
import type { Station, Acrostic } from "@/types/subway";

interface AcrosticModalProps {
  station: Station;
  acrostic: Acrostic | null;
  loading: boolean;
  onClose: () => void;
}

export default function AcrosticModal({
  station,
  acrostic,
  loading,
  onClose,
}: AcrosticModalProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const chars = station.name.split("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            🚇 {station.name}역
          </h2>
          <p className="text-sm text-gray-500">{station.line}</p>
        </div>

        <div className="border-t pt-4">
          {loading ? (
            <p className="text-gray-400 text-center py-4">불러오는 중...</p>
          ) : acrostic ? (
            <div className="space-y-3">
              {chars.map((char, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0">
                    {char}
                  </span>
                  <span className="text-gray-800 pt-1">
                    {acrostic.lines[i] || ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              아직 N행시가 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
