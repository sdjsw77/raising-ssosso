import { STAT_KEYS, STAT_META } from "../../hooks/useGameState";
import { StatDeltas, StatKey, Stats } from "../../types/game";

interface StatsPanelProps {
  stats: Stats;
  lastDeltas?: StatDeltas | null;
  compact?: boolean;
}

function getBarGradient(key: StatKey, value: number): string {
  if (key === "fatigue" || key === "stress") {
    // Bad when high
    if (value > 80) return "linear-gradient(90deg, #f87171, #ef4444)";
    if (value > 60) return "linear-gradient(90deg, #fbbf24, #f87171)";
    return "linear-gradient(90deg, #c084fc, #ec4899)";
  }
  // Good when high
  if (value < 20) return "linear-gradient(90deg, #f87171, #ef4444)";
  if (value < 40) return "linear-gradient(90deg, #fbbf24, #f87171)";
  return "linear-gradient(90deg, #fb7185, #ec4899)";
}

function getWarning(key: StatKey, value: number): string | null {
  if (key === "fatigue" && value > 80) return "수면 부족!";
  if (key === "fatigue" && value > 60) return "피곤 누적";
  if (key === "fullness" && value < 20) return "꼬르륵!";
  if (key === "health" && value < 20) return "건강 위험!";
  if (key === "stress" && value > 80) return "스트레스 과다";
  if (key === "happiness" && value < 25) return "우울 경보";
  if (key === "intelligence" && value >= 80) return "뇌섹 모드";
  if (key === "fitness" && value >= 80) return "체력 여제";
  return null;
}

export default function StatsPanel({ stats, lastDeltas, compact = false }: StatsPanelProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm sm:text-base text-pink-900 flex items-center gap-1.5">
          <span>👑</span>
          <span>쏘쏘의 상태</span>
        </h3>
        <span className="text-[11px] text-pink-400">선택마다 변해요</span>
      </div>

      <div
        className={
          compact
            ? "grid grid-cols-2 sm:grid-cols-4 gap-2"
            : "grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5"
        }
      >
        {STAT_KEYS.map((key) => {
          const meta = STAT_META[key];
          const value = stats[key] ?? 0;
          const delta = lastDeltas?.[key];
          const warning = getWarning(key, value);

          return (
            <div
              key={key}
              className="relative p-2 sm:p-2.5 rounded-xl bg-white/80 border border-pink-200 shadow-2xs hover:shadow-xs transition"
            >
              {/* Delta chip pop */}
              {delta !== undefined && delta !== 0 && (
                <span
                  key={`${key}-${delta}-${Date.now()}`}
                  className={`animate-pop-delta absolute -top-1 right-2 text-xs font-bold px-1.5 py-0.2 rounded-full ${
                    (meta.goodIfHigh ? delta > 0 : delta < 0)
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-rose-100 text-rose-700 border border-rose-300"
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-gray-700">
                  <span className="text-sm">{meta.icon}</span>
                  <span>{meta.label}</span>
                </span>
                <span className="font-bold text-pink-800 text-xs sm:text-sm">
                  {value}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-1.5 w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${value}%`,
                    background: getBarGradient(key, value),
                  }}
                />
              </div>

              {/* Warning badge */}
              {warning && (
                <div className="mt-1 text-[10px] font-semibold text-rose-600 truncate">
                  {warning}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
