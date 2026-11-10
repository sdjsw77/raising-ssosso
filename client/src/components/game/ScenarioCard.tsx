import { useState } from "react";
import { Scenario, ScenarioChoice } from "../../types/game";
import { trpc } from "../../lib/trpc";
import { TimeOfDay } from "../../types/game";

interface ScenarioCardProps {
  scenario: Scenario;
  currentDay: number;
  timeSlot: TimeOfDay;
  traits: string[];
  currentStats: Record<string, number>;
  onSelectPreset: (choice: ScenarioChoice) => void;
  onApplyCustomOutcome: (outcome: {
    label: string;
    immediateText: string;
    morningText?: string;
    immediateDeltas: Record<string, number>;
    morningDeltas?: Record<string, number>;
    reaction?: string;
  }) => void;
  onRefreshScenario?: () => void;
  disabled?: boolean;
}

const CATEGORY_META: Record<
  Scenario["category"],
  { label: string; icon: string; bg: string }
> = {
  diet: { label: "식단·야식", icon: "🍰", bg: "bg-rose-100 text-rose-800" },
  lifestyle: { label: "생활 루틴", icon: "🎀", bg: "bg-pink-100 text-pink-800" },
  work: { label: "일·공부", icon: "📚", bg: "bg-sky-100 text-sky-800" },
  romance: { label: "관계·마음", icon: "💌", bg: "bg-purple-100 text-purple-800" },
  leisure: { label: "휴식·놀이", icon: "✨", bg: "bg-amber-100 text-amber-800" },
  health: { label: "건강·피트니스", icon: "🏃‍♀️", bg: "bg-emerald-100 text-emerald-800" },
  custom: { label: "현실 고민 AI", icon: "🔮", bg: "bg-indigo-100 text-indigo-800" },
};

export default function ScenarioCard({
  scenario,
  currentDay,
  timeSlot,
  traits,
  currentStats,
  onSelectPreset,
  onApplyCustomOutcome,
  onRefreshScenario,
  disabled = false,
}: ScenarioCardProps) {
  const [customText, setCustomText] = useState("");
  const [showCustomBox, setShowCustomBox] = useState(false);

  const evalMutation = trpc.game.evaluateCustomChoice.useMutation({
    onSuccess: (data) => {
      onApplyCustomOutcome({
        label: `기타: ${customText.trim()}`,
        immediateText: data.immediateText,
        morningText: data.morningText,
        immediateDeltas: data.immediateDeltas,
        morningDeltas: data.morningDeltas,
        reaction: data.reaction,
      });
      setCustomText("");
      setShowCustomBox(false);
    },
    onError: () => {
      // Fallback handled in router; if total network failure, simple safe outcome
      onApplyCustomOutcome({
        label: `기타: ${customText.trim()}`,
        immediateText: `쏘쏘는 “${customText.trim()}”(으)로 결정했다! 마음이 한결 편안해졌다.`,
        immediateDeltas: { happiness: 10, stress: -5 },
      });
      setCustomText("");
      setShowCustomBox(false);
    },
  });

  const handleCustomSubmit = () => {
    if (!customText.trim() || evalMutation.isPending || disabled) return;
    evalMutation.mutate({
      dilemma: `${scenario.title} — ${scenario.context}`,
      chosenText: customText.trim(),
      traits,
      currentStats,
      timeSlot,
    });
  };

  const cat = CATEGORY_META[scenario.category] ?? CATEGORY_META.lifestyle;

  return (
    <div className="princess-card p-4 sm:p-6 w-full text-left relative overflow-hidden">
      {/* Decorative top ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400" />

      {/* Header chips */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat.bg}`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
            Day {currentDay}
          </span>
          {onRefreshScenario && (
            <button
              onClick={onRefreshScenario}
              disabled={disabled || evalMutation.isPending}
              className="text-xs text-pink-500 hover:text-pink-700 font-semibold px-2 py-0.5 rounded-md hover:bg-pink-100/60 transition"
              title="다른 딜레마 보기"
            >
              🎲 다른 상황
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h2 className="font-display text-lg sm:text-xl md:text-2xl text-pink-950 mb-2 leading-snug">
        {scenario.title}
      </h2>

      {/* Story narrative */}
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 bg-pink-50/60 p-3 sm:p-3.5 rounded-xl border border-pink-100">
        {scenario.context}
      </p>

      {/* Choices list - numbered 1., 2., 3. 기타 (직접 입력) matching user example */}
      <div className="space-y-2">
        {scenario.choices.map((choice, index) => {
          if (choice.isCustomInput) {
            return (
              <div
                key={choice.id}
                className="rounded-2xl border border-pink-300 bg-white/95 p-3 transition shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-pink-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-900 text-xs font-black inline-flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{choice.label}</span>
                  </span>
                  <button
                    onClick={() => setShowCustomBox(!showCustomBox)}
                    disabled={disabled || evalMutation.isPending}
                    className="princess-btn-secondary px-3 py-1 rounded-full text-xs"
                  >
                    {showCustomBox ? "접기" : "직접 쓰기 ✍️"}
                  </button>
                </div>

                {showCustomBox && (
                  <div className="mt-2.5 pt-2.5 border-t border-pink-200">
                    <p className="text-[11px] text-pink-500 mb-1.5">
                      원하는 행동을 직접 적어주세요. AI가 그 선택의 결과와 스탯 변화를 자동으로 만들어줍니다!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            handleCustomSubmit();
                          }
                        }}
                        placeholder="예) 물 한잔 마시고 넷플릭스 끄고 누워서 유튜브 조금 보다가 잔다"
                        maxLength={200}
                        disabled={disabled || evalMutation.isPending}
                        className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm border border-pink-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                      />
                      <button
                        onClick={handleCustomSubmit}
                        disabled={
                          !customText.trim() || evalMutation.isPending || disabled
                        }
                        className="princess-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {evalMutation.isPending ? "결과 생각 중... ✨" : "이걸로 결정! 💖"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={choice.id}
              onClick={() => onSelectPreset(choice)}
              disabled={disabled || evalMutation.isPending}
              className="w-full text-left p-3 sm:p-3.5 rounded-2xl border border-pink-300 bg-white/95 hover:bg-pink-50 transition shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-900 text-xs font-black inline-flex items-center justify-center shrink-0 group-hover:bg-pink-300 transition">
                  {index + 1}
                </span>
                <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-pink-950 transition line-clamp-2">
                  {choice.label}
                </span>
              </div>
              <span className="text-pink-400 group-hover:text-pink-600 text-sm shrink-0">
                →
              </span>
            </button>
          );
        })}
      </div>

      {evalMutation.isPending && (
        <div className="mt-3 p-3 rounded-xl bg-pink-100/70 border border-pink-300 text-center text-xs text-pink-800 font-semibold flex items-center justify-center gap-2">
          <span className="animate-spin text-sm">✨</span>
          <span>쏘쏘가 결과를 기다리는 중... 다음 날 아침 결과까지 계산하고 있어요!</span>
        </div>
      )}
    </div>
  );
}
