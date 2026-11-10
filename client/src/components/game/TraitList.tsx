import { useState } from "react";
import { getTrait } from "../../data/traits";
import { Trait } from "../../types/game";

interface TraitListProps {
  traitIds: string[];
  onOpenSelection?: () => void;
  showManageButton?: boolean;
}

export default function TraitList({
  traitIds,
  onOpenSelection,
  showManageButton = false,
}: TraitListProps) {
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);

  const traits = traitIds
    .map(getTrait)
    .filter((t): t is Trait => !!t);

  const positives = traits.filter((t) => t.category === "positive");
  const negatives = traits.filter((t) => t.category === "negative");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm sm:text-base text-pink-900 flex items-center gap-1.5">
          <span>🧬</span>
          <span>쏘쏘의 특성</span>
          <span className="text-xs font-normal text-pink-500">
            ({traits.length})
          </span>
        </h3>
        {showManageButton && onOpenSelection && (
          <button
            onClick={onOpenSelection}
            className="text-xs font-semibold text-pink-700 hover:text-pink-900 underline"
          >
            특성 변경
          </button>
        )}
      </div>

      {traits.length === 0 ? (
        <p className="text-xs text-pink-400 italic py-1">
          아직 획득한 특성이 없어요. 선택을 이어가면 특성이 붙을 수도 있어요!
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {positives.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrait(t)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
          {negatives.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrait(t)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100 transition shadow-2xs"
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Trait detail popover */}
      {selectedTrait && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedTrait(null)}
        >
          <div
            className="princess-card max-w-sm w-full p-5 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-2">{selectedTrait.icon}</div>
            <div
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 ${
                selectedTrait.category === "positive"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-purple-100 text-purple-900 border border-purple-300"
              }`}
            >
              {selectedTrait.category === "positive" ? "긍정 특성" : "부정 특성"}
            </div>
            <h4 className="font-display text-lg text-pink-950 mb-1">
              {selectedTrait.name}
            </h4>
            <p className="text-xs text-pink-700 font-medium mb-3">
              {selectedTrait.description}
            </p>
            <p className="text-xs text-gray-500 italic bg-pink-50 p-3 rounded-xl border border-pink-200">
              “{selectedTrait.flavor}”
            </p>
            <button
              onClick={() => setSelectedTrait(null)}
              className="mt-4 princess-btn px-4 py-1.5 rounded-full text-xs"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
