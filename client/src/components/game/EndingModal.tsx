import { useState } from "react";
import { ENDINGS } from "../../data/endings";
import { Ending, Stats } from "../../types/game";
import { STAT_META, STAT_KEYS } from "../../hooks/useGameState";

interface EndingModalProps {
  open: boolean;
  ending?: Ending;
  stats: Stats;
  traits: string[];
  day: number;
  unlockedEndings: string[];
  onRestart: () => void;
  onContinue: () => void;
  onClose: () => void;
}

export default function EndingModal({
  open,
  ending,
  stats,
  day,
  unlockedEndings,
  onRestart,
  onContinue,
  onClose,
}: EndingModalProps) {
  const [tab, setTab] = useState<"result" | "collection">("result");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-xl w-full p-5 sm:p-6 my-auto text-center relative max-h-[92vh] overflow-y-auto">
        {/* Confetti sparkle header */}
        <div className="text-3xl mb-1">🎉 👑 🌸</div>
        <div className="text-xs font-bold text-pink-600 tracking-wider">
          SSOSSO ENDING
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 my-3">
          <button
            onClick={() => setTab("result")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              tab === "result" ? "princess-btn" : "princess-btn-secondary"
            }`}
          >
            이번 엔딩 결과
          </button>
          <button
            onClick={() => setTab("collection")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              tab === "collection" ? "princess-btn" : "princess-btn-secondary"
            }`}
          >
            엔딩 도감 ({unlockedEndings.length}/{ENDINGS.length})
          </button>
        </div>

        {tab === "result" && ending && (
          <div>
            {/* Royal certificate style frame */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-pink-400 bg-gradient-to-b from-white via-pink-50 to-pink-100/80 shadow-xs mb-3 text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold mb-2">
                {ending.badge}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-pink-950 mb-1 leading-tight">
                {ending.title}
              </h2>
              <div className="text-xs text-pink-600 font-semibold mb-3">
                {ending.subtitle}
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line text-left bg-white/90 p-3.5 rounded-xl border border-pink-200">
                {ending.description}
              </p>
              <div className="mt-3 text-xs text-pink-900 font-semibold italic">
                💌 육성 총평: {ending.review}
              </div>
            </div>

            {/* Stats snapshot */}
            <div className="mb-3 text-left">
              <div className="text-xs font-bold text-pink-800 mb-1.5">
                Day {day} 최종 능력치 기록
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs text-center">
                {STAT_KEYS.map((k) => (
                  <div
                    key={k}
                    className="p-1.5 rounded-xl bg-white border border-pink-200"
                  >
                    <div className="text-base">{STAT_META[k].icon}</div>
                    <div className="text-[10px] text-gray-500">{STAT_META[k].label}</div>
                    <div className="font-bold text-pink-900 text-sm">{stats[k]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4 pt-3 border-t border-pink-200">
              <button
                onClick={onRestart}
                className="princess-btn px-6 py-2.5 rounded-full text-xs font-bold"
              >
                다른 엔딩 도전하기 (새로 시작) 🔄
              </button>
              <button
                onClick={onContinue}
                className="princess-btn-secondary px-5 py-2 rounded-full text-xs"
              >
                더 키우기 (계속)
              </button>
              <button
                onClick={onClose}
                className="text-xs text-pink-400 hover:text-pink-700 py-1"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {tab === "collection" && (
          <div>
            <p className="text-xs text-pink-500 mb-3">
              다양한 능력치와 특성 조합으로 총 {ENDINGS.length}가지 엔딩을 모아보세요!
            </p>
            <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1 text-left">
              {ENDINGS.map((e, i) => {
                const unlocked = unlockedEndings.includes(e.id);
                return (
                  <div
                    key={e.id}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm transition ${
                      unlocked
                        ? "bg-white border-pink-300 shadow-2xs"
                        : "bg-gray-100/90 border-gray-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-display font-bold text-pink-950 text-sm">
                        {unlocked ? e.title : `🔒 No.${i + 1} ???`}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          unlocked
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {unlocked ? "해금 완료" : "미해금"}
                      </span>
                    </div>
                    <div className="text-[11px] text-pink-600 line-clamp-1 mb-1">
                      {unlocked ? e.subtitle : "능력치와 특성을 다르게 해보세요"}
                    </div>
                    {unlocked && (
                      <div className="text-[11px] text-gray-600 line-clamp-2">
                        {e.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setTab("result")}
              className="princess-btn px-6 py-2 rounded-full text-xs font-bold mt-3"
            >
              결과로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
