import { useMemo, useState } from "react";
import { TRAITS } from "../../data/traits";
import { Trait } from "../../types/game";

interface TraitSelectionDialogProps {
  open: boolean;
  onConfirm: (traitIds: string[]) => void;
}

const PRESETS: { name: string; icon: string; ids: string[]; desc: string }[] = [
  {
    name: "축복받은 공주",
    icon: "👑",
    ids: ["princess_soul", "positive_mind", "deep_sleeper"],
    desc: "잘 쉬고 긍정적인 완성형 공주님 체질",
  },
  {
    name: "천재 올빼미",
    icon: "🧠",
    ids: ["genius_spark", "night_owl", "caffeine_addict", "screen_addict"],
    desc: "밤마다 두뇌 풀가동하는 공부형 쏘쏘",
  },
  {
    name: "헬스장 공주 전사",
    icon: "🏃‍♀️",
    ids: ["iron_body", "quick_reflexes", "big_eater"],
    desc: "운동 좋아하고 먹는 것도 좋아하는 건강파",
  },
  {
    name: "미식가 요정",
    icon: "🍰",
    ids: ["gourmet", "positive_mind", "big_eater", "sensitive_stomach"],
    desc: "맛있는 음식에 진심인 행복파",
  },
];

export default function TraitSelectionDialog({ open, onConfirm }: TraitSelectionDialogProps) {
  const [selected, setSelected] = useState<string[]>(PRESETS[0].ids);
  const [tab, setTab] = useState<"positive" | "negative">("positive");

  const positives = useMemo(() => TRAITS.filter((t) => t.category === "positive"), []);
  const negatives = useMemo(() => TRAITS.filter((t) => t.category === "negative"), []);

  const positivePicks = selected.filter((id) =>
    positives.some((t) => t.id === id)
  ).length;
  const negativePicks = selected.filter((id) =>
    negatives.some((t) => t.id === id)
  ).length;

  // Zomboid point budget: 3 free + 1 per negative
  const allowedPositive = 3 + negativePicks;
  const pointsLeft = allowedPositive - positivePicks;

  const toggle = (trait: Trait) => {
    const has = selected.includes(trait.id);
    if (has) {
      setSelected(selected.filter((x) => x !== trait.id));
    } else {
      if (trait.category === "positive" && pointsLeft <= 0) return;
      setSelected([...selected, trait.id]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-2xl w-full p-4 sm:p-6 my-auto text-center relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <span className="text-3xl">🌸</span>
        <h2 className="font-display text-xl sm:text-2xl text-pink-950 mt-1">
          쏘쏘의 시작 특성 고르기
        </h2>
        <p className="text-xs sm:text-sm text-pink-600 mt-1">
          좀보이드처럼 <strong className="text-pink-800">긍정 특성</strong>과{" "}
          <strong className="text-purple-800">부정 특성</strong>을 골라 세상에 하나뿐인 쏘쏘를 만들어주세요!
        </p>

        {/* Zomboid point budget */}
        <div className="my-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full princess-pill font-semibold text-pink-800">
            남은 특성 포인트:{" "}
            <strong className={pointsLeft < 0 ? "text-rose-600" : "text-emerald-700"}>
              {pointsLeft}
            </strong>
          </span>
          <span className="text-pink-400">
            (부정 특성 1개 선택 시 +1 포인트)
          </span>
        </div>

        {/* Quick presets */}
        <div className="mb-3 text-left">
          <div className="text-xs font-semibold text-pink-800 mb-1.5 flex items-center gap-1">
            <span>✨</span>
            <span>추천 프리셋</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {PRESETS.map((p) => {
              const active = JSON.stringify(p.ids.slice().sort()) === JSON.stringify(selected.slice().sort());
              return (
                <button
                  key={p.name}
                  onClick={() => setSelected(p.ids)}
                  className={`p-2 rounded-xl text-left border text-xs transition ${
                    active
                      ? "bg-pink-100 border-pink-400 shadow-2xs font-bold"
                      : "bg-white/80 border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <div className="text-base">{p.icon}</div>
                  <div className="font-semibold text-pink-900 truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-1">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex justify-center gap-2 mb-3">
          <button
            onClick={() => setTab("positive")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              tab === "positive"
                ? "bg-emerald-500 text-white shadow-xs"
                : "princess-btn-secondary"
            }`}
          >
            💚 긍정 특성 ({positivePicks}/{allowedPositive})
          </button>
          <button
            onClick={() => setTab("negative")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              tab === "negative"
                ? "bg-purple-600 text-white shadow-xs"
                : "princess-btn-secondary"
            }`}
          >
            💜 부정 특성 ({negativePicks})
          </button>
        </div>

        {/* Trait grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-h-[38vh] overflow-y-auto pr-1">
          {(tab === "positive" ? positives : negatives).map((t) => {
            const has = selected.includes(t.id);
            const disabled = t.category === "positive" && !has && pointsLeft <= 0;
            return (
              <button
                key={t.id}
                onClick={() => toggle(t)}
                disabled={disabled}
                className={`p-2.5 rounded-xl border text-xs transition flex items-start gap-2 ${
                  has
                    ? t.category === "positive"
                      ? "bg-emerald-100 border-emerald-400 text-emerald-950 font-medium"
                      : "bg-purple-100 border-purple-400 text-purple-950 font-medium"
                    : disabled
                    ? "bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
                    : "bg-white/90 border-pink-200 hover:bg-pink-50 text-gray-700"
                }`}
              >
                <span className="text-xl shrink-0">{t.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold flex items-center gap-1 truncate">
                    <span>{t.name}</span>
                    {has && (
                      <span className="text-[10px] px-1 rounded-full bg-white text-pink-700 font-semibold shrink-0">
                        선택됨
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-pink-800 line-clamp-1">
                    {t.description}
                  </div>
                  <div className="text-[10px] text-gray-400 italic line-clamp-1 mt-0.5">
                    {t.flavor}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-pink-200 pt-3">
          <span className="text-xs text-pink-500">
            총 {selected.length}개 특성 선택 중 · 언제든 게임 중 추가 특성이 생길 수 있어요
          </span>
          <button
            onClick={() => onConfirm(selected)}
            disabled={pointsLeft < 0}
            className="princess-btn px-6 py-2 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {pointsLeft < 0 ? "포인트를 맞춰주세요" : "이 특성으로 키우기 시작! 💖"}
          </button>
        </div>
      </div>
    </div>
  );
}
