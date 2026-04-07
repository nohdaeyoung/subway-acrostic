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
  acrostics: Acrostic[];
  loading: boolean;
  loggedIn: boolean;
  onClose: () => void;
  onSaved: () => void;
  onRandomView?: () => void;
}

export default function AcrosticEditor({
  station,
  acrostics,
  loading,
  loggedIn,
  onClose,
  onSaved,
  onRandomView,
}: AcrosticEditorProps) {
  const chars = station.name.split("");
  const [pageIndex, setPageIndex] = useState(0);
  const acrostic: Acrostic | null = acrostics[pageIndex] ?? null;
  const [lines, setLines] = useState<string[]>(chars.map(() => ""));
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // station 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setPageIndex(0);
  }, [station.id]);

  useEffect(() => {
    if (acrostic) {
      setLines(acrostic.lines);
    } else {
      setLines(chars.map(() => ""));
    }
  }, [acrostic, station.name]);

  useEffect(() => {
    if (!loading && acrostics.length === 0 && loggedIn) {
      setIsEditing(true);
    }
  }, [loading, acrostics.length, loggedIn]);

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
      // AI 시는 Firestore에 실제 없으므로 새로 생성 (사용자 시로 승격)
      if (acrostic && !acrostic.isAi) {
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
    if (!acrostic || acrostic.isAi) return;
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
      onClick={onClose}
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
              {/* 페이징 인디케이터 + 뱃지 */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  {acrostic.isAi ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                      style={{
                        background: "rgba(232, 93, 4, 0.08)",
                        color: "var(--accent-vermillion)",
                        border: "1px solid rgba(232, 93, 4, 0.2)",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                      }}
                    >
                      <span>✨ AI</span>
                      <span style={{ opacity: 0.7 }}>·</span>
                      <span>
                        {acrostic.aiConcept === "love" && "❤️ 사랑"}
                        {acrostic.aiConcept === "philosophy" && "🧠 철학"}
                        {acrostic.aiConcept === "humor" && "😄 유머"}
                      </span>
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                      style={{
                        background: "rgba(28, 24, 21, 0.06)",
                        color: "var(--text-body)",
                        border: "1px solid var(--border-rule)",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                      }}
                    >
                      ✍️ 324
                    </span>
                  )}
                </div>
                {acrostics.length > 1 && (
                  <span className="text-xs font-serif" style={{ color: "var(--text-faded)" }}>
                    {pageIndex + 1} / {acrostics.length}
                  </span>
                )}
              </div>

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

              {/* 작성자 안내 */}
              <p className="text-xs pt-3" style={{ color: "var(--text-faded)", fontStyle: "italic" }}>
                {acrostic.isAi
                  ? "AI가 임시로 작성한 시입니다."
                  : "324님이 지은 시입니다."}
              </p>

              {/* 페이징 컨트롤 */}
              {acrostics.length > 1 && (
                <div className="flex items-center justify-between gap-2 pt-3 mt-1" style={{ borderTop: "1px solid var(--border-soft)" }}>
                  <button
                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                    disabled={pageIndex === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all disabled:opacity-30"
                    style={{
                      color: "var(--text-body)",
                      background: "var(--bg-paper)",
                      border: "1px solid var(--border-rule)",
                    }}
                    aria-label="이전 시"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    이전
                  </button>
                  <div className="flex gap-1">
                    {acrostics.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPageIndex(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{
                          background: i === pageIndex ? "var(--accent-vermillion)" : "var(--border-rule)",
                        }}
                        aria-label={`${i + 1}번째 시`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setPageIndex((p) => Math.min(acrostics.length - 1, p + 1))}
                    disabled={pageIndex === acrostics.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all disabled:opacity-30"
                    style={{
                      color: "var(--text-body)",
                      background: "var(--bg-paper)",
                      border: "1px solid var(--border-rule)",
                    }}
                    aria-label="다음 시"
                  >
                    다음
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}
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
              {onRandomView && (
                <button
                  onClick={onRandomView}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-serif transition-all active:scale-[0.97]"
                  style={{
                    background: "var(--bg-deep)",
                    color: "var(--bg-card)",
                    fontWeight: 700,
                  }}
                >
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/><polyline points="4 20 9 20 4 15"/>
                    <path d="M21 3l-7 7M3 21l7-7M21 16v5h-5M3 8V3h5"/>
                  </svg>
                  랜덤 감상
                </button>
              )}
              <div className="flex-1" />
              {loggedIn && (
                <button
                  onClick={() => {
                    // AI 시에서 편집 진입 시 빈 상태로 시작
                    if (acrostic?.isAi) {
                      setLines(chars.map(() => ""));
                    }
                    setIsEditing(true);
                  }}
                  className="px-6 py-2 text-sm rounded-lg font-serif transition-colors"
                  style={{
                    background: "var(--bg-paper)",
                    color: "var(--text-body)",
                    border: "1px solid var(--border-rule)",
                    fontWeight: 700,
                  }}
                >
                  {acrostic?.isAi ? "직접 쓰기" : "수정"}
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
