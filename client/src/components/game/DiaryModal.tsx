import { DiaryEntry, StatKey } from "../../types/game";
import { STAT_META, TIME_LABELS } from "../../hooks/useGameState";

interface DiaryModalProps {
  open: boolean;
  diary: DiaryEntry[];
  onClose: () => void;
}

export default function DiaryModal({ open, diary, onClose }: DiaryModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-xl w-full p-5 sm:p-6 my-auto text-left relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-3xl">📖</span>
            <h2 className="font-display text-xl sm:text-2xl text-pink-950 mt-1">
              쏘쏘의 비밀 일기장
            </h2>
            <p className="text-xs text-pink-500">
              지금까지 쏘쏘와 함께 만들어온 모든 선택과 이야기들이에요
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-700 text-xl font-bold p-1 shrink-0"
          >
            ✕
          </button>
        </div>

        {diary.length === 0 ? (
          <div className="p-6 rounded-2xl bg-pink-50 border border-pink-200 text-center text-xs text-pink-500">
            아직 기록된 일기가 없어요. 첫 선택을 해보세요!
          </div>
        ) : (
          <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
            {diary.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-white/90 border border-pink-200 shadow-2xs text-xs sm:text-sm"
              >
                <div className="flex items-center justify-between text-xs text-pink-500 mb-1 flex-wrap gap-1">
                  <span className="font-bold text-pink-800">
                    Day {entry.day} · {TIME_LABELS[entry.timeSlot]}
                  </span>
                  <span>{new Date(entry.timestamp).toLocaleTimeString("ko-KR")}</span>
                </div>
                <div className="font-display text-sm sm:text-base text-pink-950 mb-1 truncate">
                  {entry.scenarioTitle}
                </div>
                <div className="text-[11px] font-semibold text-rose-700 mb-1.5">
                  ➜ 선택: {entry.choiceLabel}
                </div>
                <div className="text-gray-800 whitespace-pre-line leading-relaxed mb-2 bg-pink-50/60 p-2.5 rounded-xl border border-pink-100">
                  {entry.immediateText}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(Object.entries(entry.immediateDeltas) as [StatKey, number][]).map(
                    ([k, v]) => {
                      if (v === undefined || v === 0) return null;
                      const meta = STAT_META[k];
                      return (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-900"
                        >
                          {meta?.label} {v > 0 ? `+${v}` : v}
                        </span>
                      );
                    }
                  )}
                </div>
                {entry.morningText && (
                  <div className="text-xs text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200 whitespace-pre-line leading-relaxed">
                    {entry.morningText}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="princess-btn px-6 py-2 rounded-full text-xs font-bold"
          >
            닫기 💖
          </button>
        </div>
      </div>
    </div>
  );
}
