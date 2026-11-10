import { useEffect } from "react";
import { AvatarReaction, StatDeltas, StatKey } from "../../types/game";
import { STAT_META } from "../../hooks/useGameState";

interface OutcomeDialogProps {
  open: boolean;
  chosenLabel: string;
  immediateText: string;
  immediateDeltas: StatDeltas;
  morningText?: string;
  morningDeltas?: StatDeltas;
  reaction?: AvatarReaction;
  hasNightConsequence: boolean;
  onNext: () => void;
}

function DeltaChips({ deltas }: { deltas: StatDeltas }) {
  const entries = Object.entries(deltas) as [StatKey, number][];
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 my-2">
      {entries.map(([k, v]) => {
        if (v === undefined || v === 0) return null;
        const meta = STAT_META[k];
        const positive = meta.goodIfHigh ? v > 0 : v < 0;
        return (
          <span
            key={k}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              positive
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-rose-50 text-rose-800 border-rose-300"
            }`}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
            <span>{v > 0 ? `+${v}` : v}</span>
          </span>
        );
      })}
    </div>
  );
}

export default function OutcomeDialog({
  open,
  chosenLabel,
  immediateText,
  immediateDeltas,
  morningText,
  morningDeltas,
  reaction,
  hasNightConsequence,
  onNext,
}: OutcomeDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onNext]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-lg w-full p-5 sm:p-6 my-auto text-left relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold truncate max-w-[80%]">
            선택: {chosenLabel}
          </span>
          <span className="text-xl">✨</span>
        </div>

        {/* Immediate outcome section */}
        <div className="mb-4">
          <div className="text-xs font-bold text-pink-700 mb-1 flex items-center gap-1">
            <span>🌸</span>
            <span>선택의 결과</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed bg-pink-50/70 p-3.5 rounded-xl border border-pink-100">
            {immediateText}
          </div>
          <DeltaChips deltas={immediateDeltas} />
        </div>

        {/* Delayed morning consequence preview / reveal */}
        {morningText && (
          <div className="mb-4">
            <div className="text-xs font-bold text-purple-700 mb-1 flex items-center gap-1">
              <span>🌅</span>
              <span>지연 효과 (다음 날의 여파)</span>
            </div>
            <div className="text-xs sm:text-sm text-purple-950 whitespace-pre-line leading-relaxed bg-purple-50 p-3.5 rounded-xl border border-purple-200">
              {morningText}
            </div>
            {morningDeltas && <DeltaChips deltas={morningDeltas} />}
          </div>
        )}

        {hasNightConsequence && !morningText && (
          <div className="mb-3 text-xs text-purple-700 bg-purple-50 border border-purple-200 p-2.5 rounded-xl flex items-center gap-2">
            <span className="text-base">🌙</span>
            <span>밤 선택의 진짜 결과는 <strong>다음 날 아침</strong>에 드러납니다...</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-pink-200 pt-3">
          <span className="text-[11px] text-pink-400">
            Enter 또는 스페이스바를 누르면 다음으로 넘어가요
          </span>
          <button
            onClick={onNext}
            className="princess-btn px-6 py-2.5 rounded-full text-sm font-bold w-full sm:w-auto text-center"
          >
            다음 시간대로 💖
          </button>
        </div>
      </div>
    </div>
  );
}
