import { DelayedConsequence, StatDeltas, StatKey } from "../../types/game";
import { STAT_META } from "../../hooks/useGameState";

interface MorningReportModalProps {
  open: boolean;
  day: number;
  consequences: DelayedConsequence[];
  totalDeltas: StatDeltas;
  onClose: () => void;
}

export default function MorningReportModal({
  open,
  day,
  consequences,
  totalDeltas,
  onClose,
}: MorningReportModalProps) {
  if (!open) return null;

  const entries = Object.entries(totalDeltas) as [StatKey, number][];

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-lg w-full p-5 sm:p-6 my-auto text-left relative max-h-[92vh] overflow-y-auto">
        {/* Morning header */}
        <div className="text-center mb-3">
          <span className="text-4xl animate-bounce inline-block">🌅</span>
          <h2 className="font-display text-xl sm:text-2xl text-pink-950 mt-1">
            Day {day} 아침이 밝았습니다!
          </h2>
          <p className="text-xs text-pink-500">
            밤사이 쌓인 일들과 수면 효과가 정산되었습니다
          </p>
        </div>

        {/* Consequences list */}
        {consequences.length > 0 ? (
          <div className="space-y-3 mb-4">
            <div className="text-xs font-bold text-pink-700 flex items-center gap-1">
              <span>💤</span>
              <span>어젯밤의 여파 ([다음 날 아침] 효과)</span>
            </div>
            {consequences.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs sm:text-sm"
              >
                <div className="font-bold text-purple-900 mb-1 flex items-center gap-1 truncate text-xs">
                  <span>🌙</span>
                  <span>{c.sourceTitle}</span>
                </div>
                <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-700 text-center mb-4">
            평화로운 밤이었어요. 별다른 여파 없이 푹 잤습니다 ✨
          </div>
        )}

        {/* Total morning delta summary */}
        <div className="mb-4">
          <div className="text-xs font-bold text-pink-700 mb-1 flex items-center gap-1">
            <span>📊</span>
            <span>오늘 아침 최종 변화</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
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
        </div>

        <button
          onClick={onClose}
          className="princess-btn w-full py-2.5 rounded-full text-sm font-bold text-center"
        >
          오늘 하루도 화이팅! ☀️💖
        </button>
      </div>
    </div>
  );
}
