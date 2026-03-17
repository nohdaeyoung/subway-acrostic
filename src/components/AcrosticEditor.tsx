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
        } else if (!isEditing) {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, showDeleteConfirm, isEditing]);

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(28, 24, 21, 0.5)" }}
      onClick={isEditing ? undefined : onClose}
    >
      <div
        ref={modalRef}
        className="modal-animate w-full sm:max-w-sm sm:mx-4 max-h-[90dvh] overflow-y-auto p-6 relative rounded-t-2xl sm:rounded-2xl"
        style={{
          background: "var(--bg-card)",
          boxShadow: "0 -4px 30px rgba(42, 33, 24, 0.15), 0 0 0 1px var(--border-soft)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${stationLabel(station.name)} N행시`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{ color: "var(--text-ghost)" }}
          aria-label="닫기"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="font-serif text-xl" style={{ color: "var(--text-ink)", fontWeight: 800 }}>
            {stationLabel(station.name)}
            {isEditing && (
              <span className="text-sm font-sans" style={{ color: "var(--text-ghost)", fontWeight: 400, marginLeft: "8px" }}>집필</span>
            )}
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-faded)", letterSpacing: "0.05em" }}>
            {station.lines.map((id) => getLineName(id, station.city)).join(" · ")}
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "16px" }}>
          {loading ? (
            <p className="text-center py-6 font-serif" style={{ color: "var(--text-ghost)" }}>
              불러오는 중...
            </p>
          ) : isEditing ? (
            /* ─── 편집 모드 ─── */
            <div className="space-y-3">
              {chars.map((char, i) => (
                <div key={`${char}-${i}`} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-serif text-lg shrink-0"
                      style={{
                        color: "var(--accent-vermillion)",
                        fontWeight: 800,
                        width: "1.5em",
                        textAlign: "center",
                      }}
                    >
                      {char}
                    </span>
                    <input
                      type="text"
                      value={lines[i] || ""}
                      onChange={(e) => updateLine(i, e.target.value)}
                      placeholder={`${char}...`}
                      className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-shadow"
                      style={{
                        background: "var(--bg-paper)",
                        color: "var(--text-ink)",
                        border: `1px solid ${fieldErrors[i] ? "#b05a5a" : "var(--border-rule)"}`,
                      }}
                    />
                  </div>
                  {fieldErrors[i] && (
                    <p className="text-xs pl-10" style={{ color: "#b05a5a" }}>{fieldErrors[i]}</p>
                  )}
                </div>
              ))}
            </div>
          ) : acrostic ? (
            /* ─── 감상 모드 ─── */
            <div className="space-y-3 py-2">
              {chars.map((char, i) => (
                <div key={`${char}-${i}`} className="flex items-start gap-3">
                  <span
                    className="font-serif text-lg shrink-0 mt-0.5"
                    style={{
                      color: "var(--accent-vermillion)",
                      fontWeight: 800,
                      width: "1.2em",
                      textAlign: "center",
                    }}
                  >
                    {char}
                  </span>
                  <span className="font-serif leading-relaxed pt-0.5" style={{ color: "var(--text-body)", fontSize: "15px" }}>
                    {acrostic.lines[i] || ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 font-serif" style={{ color: "var(--text-ghost)" }}>
              아직 N행시가 없습니다
            </p>
          )}
        </div>

        {error && (
          <p role="alert" aria-live="polite" className="mt-3 text-sm text-center" style={{ color: "#b05a5a" }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-2">
          {isEditing ? (
            <>
              {acrostic && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                  style={{ color: "#b05a5a" }}
                >
                  삭제
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                style={{ color: "var(--text-faded)" }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 text-sm rounded-lg font-serif transition-colors disabled:opacity-50"
                style={{
                  background: "var(--accent-vermillion)",
                  color: "#fff",
                  fontWeight: 700,
                }}
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
                  className="px-6 py-2 text-sm rounded-lg font-serif transition-colors"
                  style={{
                    background: "var(--bg-paper)",
                    color: "var(--text-body)",
                    border: "1px solid var(--border-rule)",
                    fontWeight: 700,
                  }}
                >
                  수정
                </button>
              )}
            </>
          )}
        </div>

        {/* Delete confirm overlay */}
        {showDeleteConfirm && (
          <div
            className="absolute inset-0 rounded-t-2xl sm:rounded-2xl flex flex-col items-center justify-center p-8 z-10"
            style={{ background: "rgba(250, 247, 242, 0.97)" }}
          >
            <p className="font-serif text-center mb-2" style={{ color: "var(--text-ink)", fontWeight: 700 }}>
              정말 삭제하시겠습니까?
            </p>
            <p className="text-sm text-center mb-6" style={{ color: "var(--text-faded)" }}>
              삭제한 N행시는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={saving}
                className="px-5 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                style={{ background: "var(--bg-paper)", color: "var(--text-body)", border: "1px solid var(--border-rule)" }}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-5 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                style={{ background: "#b05a5a", color: "#fff" }}
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
