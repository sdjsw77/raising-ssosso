import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { AvatarReaction } from "../../types/game";

interface AIDilemmaModalProps {
  open: boolean;
  traits: string[];
  currentStats: Record<string, number>;
  timeSlot: string;
  onApplyOutcome: (outcome: {
    title: string;
    choiceLabel: string;
    immediateText: string;
    morningText?: string;
    immediateDeltas: Record<string, number>;
    morningDeltas?: Record<string, number>;
    reaction?: AvatarReaction;
  }) => void;
  onClose: () => void;
}

const EXAMPLE_DILEMMAS = [
  "다이어트 중인데 회사 회식에서 삼겹살이 눈앞에 있다... 어떡하지?",
  "내일 중요한 발표/면접이 있는데 너무 긴장돼서 잠이 안 온다",
  "친구가 서운한 말을 했는데 바로 말할까 참을까?",
  "주말에 공부해야 하는데 온종일 침대에서 뒹굴거리고 싶다",
  "갖고 싶은 가방이 세일 중인데 이번 달 생활비가 빠듯하다",
  "카페인을 줄이고 싶은데 오늘따라 피로가 폭발했다",
];

interface GeneratedData {
  title: string;
  scenarioText: string;
  options: { id: string; label: string }[];
  advice: string;
}

export default function AIDilemmaModal({
  open,
  traits,
  currentStats,
  timeSlot,
  onApplyOutcome,
  onClose,
}: AIDilemmaModalProps) {
  const [dilemma, setDilemma] = useState("");
  const [generated, setGenerated] = useState<GeneratedData | null>(null);
  const [customChoice, setCustomChoice] = useState("");
  const [showCustomBox, setShowCustomBox] = useState(false);

  const genMutation = trpc.game.generateDilemmaOptions.useMutation({
    onSuccess: (data) => setGenerated(data),
  });

  const evalMutation = trpc.game.evaluateCustomChoice.useMutation({
    onSuccess: (data, vars) => {
      onApplyOutcome({
        title: generated?.title ?? "현실 고민",
        choiceLabel: vars.chosenText,
        immediateText: data.immediateText,
        morningText: data.morningText,
        immediateDeltas: data.immediateDeltas,
        morningDeltas: data.morningDeltas,
        reaction: data.reaction as AvatarReaction,
      });
      handleClose();
    },
  });

  const handleClose = () => {
    setDilemma("");
    setGenerated(null);
    setCustomChoice("");
    setShowCustomBox(false);
    onClose();
  };

  const handleGenerate = (text?: string) => {
    const input = (text ?? dilemma).trim();
    if (!input || genMutation.isPending) return;
    setDilemma(input);
    setGenerated(null);
    setShowCustomBox(false);
    genMutation.mutate({ dilemma: input, traits, currentStats });
  };

  const handlePickChoice = (chosenText: string) => {
    if (!generated || evalMutation.isPending) return;
    evalMutation.mutate({
      dilemma: `${generated.title} — ${generated.scenarioText}`,
      chosenText,
      traits,
      currentStats,
      timeSlot,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-xl w-full p-5 sm:p-6 my-auto text-left relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-3xl">💌</span>
            <h2 className="font-display text-xl sm:text-2xl text-pink-950 mt-1">
              쏘쏘의 현실 고민 상담소
            </h2>
            <p className="text-xs text-pink-500">
              지금 진짜 고민 중인 일을 적어보세요. AI가 여러 방향의 선택지와 결과를 만들어줍니다!
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-pink-400 hover:text-pink-700 text-xl font-bold p-1 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Input step */}
        {!generated && (
          <>
            <div className="mb-3">
              <label className="text-xs font-bold text-pink-800 block mb-1">
                쏘쏘가 고민 중인 현실 상황
              </label>
              <textarea
                value={dilemma}
                onChange={(e) => setDilemma(e.target.value)}
                placeholder="예) 늦게 퇴근해서 집안일 다 하고 나니 밤 11시... 배는 고픈데 지금 먹을까 말까 고민된다"
                rows={4}
                maxLength={500}
                disabled={genMutation.isPending}
                className="w-full p-3 rounded-2xl text-xs sm:text-sm border border-pink-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 resize-none"
              />
              <div className="text-[11px] text-pink-400 text-right mt-0.5">
                {dilemma.length}/500
              </div>
            </div>

            {/* Example chips */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-pink-600 block mb-1.5">
                💭 예시 고민을 눌러볼 수도 있어요:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_DILEMMAS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleGenerate(ex)}
                    disabled={genMutation.isPending}
                    className="text-[11px] px-2.5 py-1 rounded-full princess-btn-secondary line-clamp-1 max-w-full text-left"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={!dilemma.trim() || genMutation.isPending}
              className="princess-btn w-full py-3 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {genMutation.isPending ? "고민 분석 중... ✨" : "선택지 경우의 수 만들기 🔮"}
            </button>
          </>
        )}

        {/* Generated options step */}
        {generated && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200">
              <div className="font-display text-sm sm:text-base text-indigo-950 font-bold mb-1">
                {generated.title}
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {generated.scenarioText}
              </p>
              <div className="mt-2 text-[11px] text-indigo-700 italic">
                💌 쏘쏘에게 한마디: {generated.advice}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-pink-800 mb-2 flex items-center justify-between">
                <span>어떻게 하시겠어요? 선택해주세요</span>
                <span className="text-[11px] text-pink-400 font-normal">
                  선택별 결과가 자동 생성됩니다
                </span>
              </div>
              <div className="space-y-2">
                {generated.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    onClick={() => handlePickChoice(opt.label)}
                    disabled={evalMutation.isPending}
                    className="w-full text-left p-3 rounded-2xl border border-pink-300 bg-white hover:bg-pink-50 transition shadow-2xs hover:shadow-xs flex items-center gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-900 text-xs font-black inline-flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2">
                      {opt.label}
                    </span>
                  </button>
                ))}

                {/* 4th choice: custom input */}
                <div className="rounded-2xl border border-pink-300 bg-white/95 p-3 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-pink-800 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-900 text-xs font-black inline-flex items-center justify-center shrink-0">
                        {generated.options.length + 1}
                      </span>
                      <span>기타 (직접 입력)</span>
                    </span>
                    <button
                      onClick={() => setShowCustomBox(!showCustomBox)}
                      disabled={evalMutation.isPending}
                      className="princess-btn-secondary px-3 py-1 rounded-full text-xs"
                    >
                      {showCustomBox ? "접기" : "직접 쓰기 ✍️"}
                    </button>
                  </div>
                  {showCustomBox && (
                    <div className="mt-2.5 pt-2.5 border-t border-pink-200">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={customChoice}
                          onChange={(e) => setCustomChoice(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                              if (customChoice.trim()) handlePickChoice(customChoice.trim());
                            }
                          }}
                          placeholder="원하는 선택지를 직접 적어보세요"
                          maxLength={200}
                          disabled={evalMutation.isPending}
                          className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm border border-pink-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                        />
                        <button
                          onClick={() => {
                            if (customChoice.trim()) handlePickChoice(customChoice.trim());
                          }}
                          disabled={!customChoice.trim() || evalMutation.isPending}
                          className="princess-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 shrink-0"
                        >
                          결정! 💖
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {evalMutation.isPending && (
              <div className="p-3 rounded-xl bg-pink-100 border border-pink-300 text-center text-xs text-pink-800 font-semibold flex items-center justify-center gap-2">
                <span className="animate-spin text-sm">✨</span>
                <span>선택의 결과와 다음 날 아침 여파를 계산하고 있어요...</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-pink-200">
              <button
                onClick={() => setGenerated(null)}
                disabled={evalMutation.isPending}
                className="princess-btn-secondary px-4 py-1.5 rounded-full text-xs"
              >
                ← 다른 고민 입력
              </button>
              <button
                onClick={handleClose}
                disabled={evalMutation.isPending}
                className="text-xs text-pink-500 hover:text-pink-800"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
