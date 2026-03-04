"use client";

import { useState, useEffect, useRef } from "react";
import type { Station, Acrostic } from "@/types/subway";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { stationLabel } from "@/lib/subway-utils";
import {
  createAcrostic,
  updateAcrostic,
  deleteAcrostic,
} from "@/lib/bkend";
import { lineSchema } from "@/lib/acrostic-schema";
import { SEOUL_LINES } from "@/data/seoul-subway";
import { BUSAN_LINES } from "@/data/busan-subway";

function getLineName(lineId: string, city: "seoul" | "busan"): string {
  if (city === "seoul") return SEOUL_LINES[lineId]?.name ?? lineId;
  return BUSAN_LINES[lineId]?.name ?? lineId;
}

interface AcrosticEditorProps {
  station: Station;
  acrostic: Acrostic | null;
  loading: boolean;
  loggedIn: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function AcrosticEditor({
  station,
  acrostic,
  loading,
  loggedIn,
  onClose,
  onSaved,
}: AcrosticEditorProps) {
  const chars = station.name.split("");
  const [lines, setLines] = useState<string[]>(chars.map(() => ""));
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (acrostic) {
      setLines(acrostic.lines);
    } else {
      setLines(chars.map(() => ""));
    }
  }, [acrostic, station.name]);

  useEffect(() => {
    if (!loading && !acrostic && loggedIn) {
      setIsEditing(true);
    }
  }, [loading, acrostic, loggedIn]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, showDeleteConfirm]);

  useFocusTrap(modalRef);

  function updateLine(index: number, value: string) {
    setLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setFieldErrors((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  }

  function validateLines(): boolean {
    const errors = lines.map((line) => {
      const result = lineSchema.safeParse(line);
      return result.success ? "" : (result.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.");
    });
    setFieldErrors(errors);
    return errors.every((e) => e === "");
  }

  async function handleSave() {
    if (!validateLines()) return;
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
    setSaving(true);
    try {
      await deleteAcrostic(acrostic._id);
      onSaved();
    } catch {
      setError("삭제에 실패했습니다.");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="modal-animate bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm sm:mx-4 max-h-[90dvh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${stationLabel(station.name)} N행시`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="닫기"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            🚇 {stationLabel(station.name)}
            {isEditing && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500"> (편집)</span>
            )}
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {station.lines.map((id) => getLineName(id, station.city)).join(" · ")}
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          {loading ? (
            <p className="text-gray-400 dark:text-gray-500 text-center py-4">불러오는 중...</p>
          ) : isEditing ? (
            <div className="space-y-3">
              {chars.map((char, i) => (
                <div key={`${char}-${i}`} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm shrink-0">
                      {char}
                    </span>
                    <input
                      type="text"
                      value={lines[i] || ""}
                      onChange={(e) => updateLine(i, e.target.value)}
                      placeholder={`${char}...`}
                      className={`flex-1 border rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-700/60 dark:text-gray-100 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                        fieldErrors[i]
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
                      }`}
                    />
                  </div>
                  {fieldErrors[i] && (
                    <p className="text-xs text-red-500 pl-11">{fieldErrors[i]}</p>
                  )}
                </div>
              ))}
            </div>
          ) : acrostic ? (
            <div className="space-y-3">
              {chars.map((char, i) => (
                <div key={`${char}-${i}`} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm shrink-0">
                    {char}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 pt-1 leading-relaxed">
                    {acrostic.lines[i] || ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-center py-4">
              아직 N행시가 없습니다
            </p>
          )}
        </div>

        {error && (
          <p role="alert" aria-live="polite" className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="mt-6 flex gap-2">
          {isEditing ? (
            <>
              {acrostic && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving}
                  className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  삭제
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => {
                  if (acrostic) setLines(acrostic.lines);
                  else setLines(chars.map(() => ""));
                  setIsEditing(false);
                }}
                disabled={saving}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </>
          ) : (
            <>
              <div className="flex-1" />
              {loggedIn && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  수정
                </button>
              )}
            </>
          )}
        </div>

        {/* Delete confirm overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-t-2xl sm:rounded-2xl flex flex-col items-center justify-center p-8 z-10">
            <p className="text-gray-900 dark:text-gray-100 font-semibold text-center mb-2">
              정말 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              삭제한 N행시는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={saving}
                className="px-5 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-5 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
