"use client";

import { useState, useEffect } from "react";
import type { Station, Acrostic } from "@/types/subway";
import {
  createAcrostic,
  updateAcrostic,
  deleteAcrostic,
} from "@/lib/bkend";
import { isLoggedIn } from "@/lib/auth";

interface AcrosticEditorProps {
  station: Station;
  acrostic: Acrostic | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AcrosticEditor({
  station,
  acrostic,
  onClose,
  onSaved,
}: AcrosticEditorProps) {
  const chars = station.name.split("");
  const [lines, setLines] = useState<string[]>(
    acrostic?.lines ?? chars.map(() => "")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function updateLine(index: number, value: string) {
    setLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSave() {
    if (!isLoggedIn()) {
      setError("로그인이 필요합니다");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (acrostic) {
        await updateAcrostic(acrostic._id, lines);
      } else {
        await createAcrostic(station.id, lines);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!acrostic) return;
    if (!isLoggedIn()) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setSaving(true);
    try {
      await deleteAcrostic(acrostic._id);
      onSaved();
    } catch {
      setError("삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

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
            🚇 {station.name}역{" "}
            <span className="text-sm font-normal text-gray-500">(편집)</span>
          </h2>
          <p className="text-sm text-gray-500">{station.lines.join(", ")}</p>
        </div>

        <div className="border-t pt-4 space-y-3">
          {chars.map((char, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0">
                {char}
              </span>
              <input
                type="text"
                value={lines[i] || ""}
                onChange={(e) => updateLine(i, e.target.value)}
                placeholder={`${char}...`}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="mt-6 flex gap-2">
          {acrostic && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              삭제
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
