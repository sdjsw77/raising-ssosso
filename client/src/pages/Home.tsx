import { useMemo, useState } from "react";
import { useGameState, TIME_LABELS } from "../hooks/useGameState";
import { SCENARIOS } from "../data/scenarios";
import { ScenarioChoice, Scenario } from "../types/game";
import PrincessAvatar from "../components/game/PrincessAvatar";
import StatsPanel from "../components/game/StatsPanel";
import TraitList from "../components/game/TraitList";
import TraitSelectionDialog from "../components/game/TraitSelectionDialog";
import ScenarioCard from "../components/game/ScenarioCard";
import OutcomeDialog from "../components/game/OutcomeDialog";
import MorningReportModal from "../components/game/MorningReportModal";
import AIDilemmaModal from "../components/game/AIDilemmaModal";
import DiaryModal from "../components/game/DiaryModal";
import EndingModal from "../components/game/EndingModal";
import SaveModal from "../components/game/SaveModal";
import SoundToggle from "../components/game/SoundToggle";
import { sound } from "../lib/sound";

const COVER_IMAGE = "/manus-storage/async-images/NKmyWpquEV64EQYZw4Bfts/image-1.webp";

export default function Home() {
  const {
    state,
    lastDeltas,
    currentReaction,
    morningReport,
    traitGainNotice,
    clearTraitGainNotice,
    closeMorningReport,
    startGame,
    makeChoice,
    advanceTime,
    triggerEnding,
    resetGame,
    exportSave,
    importSave,
    previewEnding,
  } = useGameState();

  // Scenario rotation: pick scenario matching current timeSlot when possible
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const availableScenarios = useMemo(() => {
    const list = SCENARIOS.filter(
      (s) => s.timeSlot === "any" || s.timeSlot === state.timeSlot
    );
    return list.length > 0 ? list : SCENARIOS;
  }, [state.timeSlot]);

  const currentScenario: Scenario =
    availableScenarios[scenarioIndex % availableScenarios.length] ?? SCENARIOS[0];

  const handleNextScenario = () => {
    setScenarioIndex((i) => i + 1);
    sound.playClick();
  };

  // Outcome dialog state
  const [outcomeData, setOutcomeData] = useState<{
    open: boolean;
    chosenLabel: string;
    immediateText: string;
    immediateDeltas: Record<string, number>;
    morningText?: string;
    morningDeltas?: Record<string, number>;
    reaction?: string;
    hasNight: boolean;
  }>({
    open: false,
    chosenLabel: "",
    immediateText: "",
    immediateDeltas: {},
    hasNight: false,
  });

  // Modal open states
  const [openTraitSelect, setOpenTraitSelect] = useState(false);
  const [openAIDilemma, setOpenAIDilemma] = useState(false);
  const [openDiary, setOpenDiary] = useState(false);
  const [openEnding, setOpenEnding] = useState(false);
  const [openSave, setOpenSave] = useState(false);

  // Apply preset choice
  const handleSelectPreset = (choice: ScenarioChoice) => {
    if (!choice.outcome) return;
    const o = choice.outcome;
    const isNight = state.timeSlot === "night";
    makeChoice({
      scenarioTitle: currentScenario.title,
      choiceLabel: choice.label,
      immediateText: o.immediateText,
      immediateDeltas: o.immediateDeltas,
      morningText: o.morningText,
      morningDeltas: o.morningDeltas,
      unlockTrait: o.unlockTrait,
      reaction: o.reaction,
    });
    setOutcomeData({
      open: true,
      chosenLabel: choice.label,
      immediateText: o.immediateText,
      immediateDeltas: o.immediateDeltas,
      morningText: o.morningText,
      morningDeltas: o.morningDeltas,
      reaction: o.reaction,
      hasNight: isNight,
    });
  };

  // Apply custom outcome (from ScenarioCard custom input OR AIDilemmaModal)
  const handleApplyCustom = (outcome: {
    label: string;
    immediateText: string;
    morningText?: string;
    immediateDeltas: Record<string, number>;
    morningDeltas?: Record<string, number>;
    reaction?: string;
  }) => {
    const isNight = state.timeSlot === "night";
    makeChoice({
      scenarioTitle: currentScenario.title,
      choiceLabel: outcome.label,
      immediateText: outcome.immediateText,
      immediateDeltas: outcome.immediateDeltas,
      morningText: outcome.morningText,
      morningDeltas: outcome.morningDeltas,
      reaction: (outcome.reaction as any) ?? "happy",
    });
    setOutcomeData({
      open: true,
      chosenLabel: outcome.label,
      immediateText: outcome.immediateText,
      immediateDeltas: outcome.immediateDeltas,
      morningText: outcome.morningText,
      morningDeltas: outcome.morningDeltas,
      reaction: outcome.reaction,
      hasNight: isNight,
    });
  };

  // Apply outcome from AIDilemmaModal (may have custom scenario title)
  const handleApplyAIOutcome = (outcome: {
    title: string;
    choiceLabel: string;
    immediateText: string;
    morningText?: string;
    immediateDeltas: Record<string, number>;
    morningDeltas?: Record<string, number>;
    reaction?: any;
  }) => {
    const isNight = state.timeSlot === "night";
    makeChoice({
      scenarioTitle: outcome.title,
      choiceLabel: outcome.choiceLabel,
      immediateText: outcome.immediateText,
      immediateDeltas: outcome.immediateDeltas,
      morningText: outcome.morningText,
      morningDeltas: outcome.morningDeltas,
      reaction: outcome.reaction ?? "happy",
    });
    setOutcomeData({
      open: true,
      chosenLabel: outcome.choiceLabel,
      immediateText: outcome.immediateText,
      immediateDeltas: outcome.immediateDeltas,
      morningText: outcome.morningText,
      morningDeltas: outcome.morningDeltas,
      reaction: outcome.reaction,
      hasNight: isNight,
    });
  };

  const handleNextTurnFromOutcome = () => {
    setOutcomeData((prev) => ({ ...prev, open: false }));
    advanceTime();
    setScenarioIndex((i) => i + 1);
  };

  // -------------------------------------------------------------
  // TITLE / COVER SCREEN (when game not yet started)
  // -------------------------------------------------------------
  if (!state.gameStarted) {
    return (
      <div className="min-h-screen flex flex-col justify-between safe-pb">
        <main className="container py-4 sm:py-8 flex-1 flex flex-col items-center">
          {/* Hero cover card */}
          <div className="princess-card max-w-3xl w-full p-4 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500" />

            <div className="relative mb-3 rounded-2xl overflow-hidden shadow-xs max-h-72 w-full bg-pink-100">
              <img
                src={COVER_IMAGE}
                alt="쏘쏘 키우기 커버"
                className="w-full h-48 sm:h-72 object-cover object-center"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                }}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
              <span>👑</span>
              <span>15년 차 개발자가 정성껏 만든 공주 육성 게임</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl text-pink-950 mb-2 tracking-tight">
              쏘쏘 키우기 👑
            </h1>
            <p className="text-xs sm:text-base text-pink-600 max-w-xl mx-auto mb-5 leading-relaxed">
              파스텔 핑크빛 동화 속 공주가 된 여자친구 쏘쏘를 선택지로 키워보세요.
              건강·피곤함·배부름·지능·운동신경을 관리하고, 좀보이드 스타일 특성과 멀티 엔딩을 만나보세요!
            </p>

            {/* Feature chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-6 max-w-2xl mx-auto text-left">
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <div className="text-base mb-0.5">🧬</div>
                <div className="font-bold text-pink-900">Zomboid 특성</div>
                <div className="text-[10px] text-gray-500">긍정·부정 특성 빌드</div>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <div className="text-base mb-0.5">🌅</div>
                <div className="font-bold text-pink-900">[다음 날 아침] 효과</div>
                <div className="text-[10px] text-gray-500">밤 선택의 지연 연쇄</div>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <div className="text-base mb-0.5">🔮</div>
                <div className="font-bold text-pink-900">현실 고민 AI 상담</div>
                <div className="text-[10px] text-gray-500">선택지·결과 자동생성</div>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <div className="text-base mb-0.5">👑</div>
                <div className="font-bold text-pink-900">8가지 멀티 엔딩</div>
                <div className="text-[10px] text-gray-500">엔딩 도감 수집</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
              <button
                onClick={() => setOpenTraitSelect(true)}
                className="princess-btn px-8 py-3.5 rounded-full text-base sm:text-lg font-bold"
              >
                특성 고르고 키우기 시작! 💖
              </button>
              <button
                onClick={() => setOpenEnding(true)}
                className="princess-btn-secondary px-5 py-3 rounded-full text-xs sm:text-sm font-bold"
              >
                👑 엔딩 도감 미리보기
              </button>
            </div>

            <div className="flex justify-center gap-2 text-xs">
              <button
                onClick={() => setOpenSave(true)}
                className="text-pink-600 hover:text-pink-900 underline"
              >
                💾 저장 데이터 불러오기
              </button>
              <span className="text-pink-300">·</span>
              <SoundToggle />
            </div>
          </div>
        </main>

        <footer className="text-center text-[11px] text-pink-400 py-3">
          쏘쏘 키우기 · 세상에서 가장 사랑스러운 공주 육성 시뮬레이션
        </footer>

        <TraitSelectionDialog
          open={openTraitSelect}
          onConfirm={(traits) => {
            setOpenTraitSelect(false);
            startGame(traits);
          }}
        />
        <EndingModal
          open={openEnding}
          ending={previewEnding}
          stats={state.stats}
          traits={state.traits}
          day={state.day}
          unlockedEndings={state.unlockedEndings}
          onRestart={resetGame}
          onContinue={() => setOpenEnding(false)}
          onClose={() => setOpenEnding(false)}
        />
        <SaveModal
          open={openSave}
          day={state.day}
          onReset={resetGame}
          onExport={exportSave}
          onImport={importSave}
          onClose={() => setOpenSave(false)}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN GAMEPLAY SCREEN
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col justify-between safe-pb">
      {/* Dynamic trait gain notice toast */}
      {traitGainNotice && (
        <div
          onClick={clearTraitGainNotice}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-40 princess-btn px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce cursor-pointer flex items-center gap-2"
        >
          <span>✨</span>
          <span>{traitGainNotice}</span>
          <span className="text-[10px] opacity-80">(터치하여 닫기)</span>
        </div>
      )}

      {/* Top princess navigation bar */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-pink-200">
        <div className="container py-2 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="font-display text-base sm:text-lg text-pink-950 font-bold">
              쏘쏘 키우기
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-black">
              Day {state.day}
            </span>
            <span className="princess-pill px-2.5 py-0.5 rounded-full text-xs font-semibold text-pink-700">
              {TIME_LABELS[state.timeSlot]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            <button
              onClick={() => setOpenAIDilemma(true)}
              className="princess-btn px-3 py-1 rounded-full text-xs font-bold shrink-0"
              title="현실 고민을 직접 입력해보세요"
            >
              💌 현실 고민 AI
            </button>
            <button
              onClick={() => setOpenDiary(true)}
              className="princess-btn-secondary px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
            >
              📖 일기장 ({state.diary.length})
            </button>
            <button
              onClick={() => setOpenEnding(true)}
              className="princess-btn-secondary px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
            >
              👑 엔딩 ({state.unlockedEndings.length})
            </button>
            <button
              onClick={() => setOpenSave(true)}
              className="princess-btn-secondary px-2.5 py-1 rounded-full text-xs shrink-0"
              title="저장 및 데이터"
            >
              💾
            </button>
            <SoundToggle />
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <main className="container py-3 sm:py-5 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
          {/* LEFT: Princess avatar card + traits */}
          <aside className="lg:col-span-4 space-y-3">
            <div className="princess-card p-4 sm:p-5 text-center relative overflow-hidden">
              <PrincessAvatar reaction={currentReaction} size={190} />

              {/* Day / time advance bar */}
              <div className="mt-3 pt-3 border-t border-pink-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-pink-800">
                  {state.timeSlot === "night"
                    ? "밤의 선택은 다음 날 아침으로 이어집니다 🌙"
                    : "선택 완료 후 시간대를 넘겨보세요"}
                </span>
                <button
                  onClick={advanceTime}
                  className="princess-btn px-3 py-1 rounded-full text-xs font-bold shrink-0"
                >
                  시간 넘기기 ➜
                </button>
              </div>

              {/* Ending preview hint */}
              <div className="mt-3 text-[11px] text-pink-500 bg-pink-50 p-2 rounded-xl border border-pink-200 text-left">
                <span className="font-bold text-pink-700">현재 유력 엔딩: </span>
                {previewEnding.title}
                <div className="text-[10px] text-gray-400 mt-0.5">
                  능력치와 특성을 바꾸면 엔딩도 달라집니다
                </div>
              </div>
            </div>

            {/* Trait list */}
            <div className="princess-card p-4 sm:p-5 text-left">
              <TraitList
                traitIds={state.traits}
                onOpenSelection={() => setOpenTraitSelect(true)}
                showManageButton
              />
            </div>
          </aside>

          {/* RIGHT: Stats panel + Scenario card */}
          <section className="lg:col-span-8 space-y-3">
            {/* Stats */}
            <div className="princess-card p-4 sm:p-5">
              <StatsPanel stats={state.stats} lastDeltas={lastDeltas} />
            </div>

            {/* Scenario choice card */}
            <ScenarioCard
              scenario={currentScenario}
              currentDay={state.day}
              timeSlot={state.timeSlot}
              traits={state.traits}
              currentStats={state.stats}
              onSelectPreset={handleSelectPreset}
              onApplyCustomOutcome={handleApplyCustom}
              onRefreshScenario={handleNextScenario}
              disabled={outcomeData.open}
            />

            {/* AI dilemma mode banner CTA */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔮</span>
                <div>
                  <div className="font-bold text-purple-950">
                    지금 진짜 고민 중인 일이 있다면?
                  </div>
                  <div className="text-purple-700">
                    현실 고민을 직접 입력하면 AI가 경우의 수 선택지와 결과를 만들어줍니다
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpenAIDilemma(true)}
                className="princess-btn px-4 py-2 rounded-full text-xs font-bold shrink-0 w-full sm:w-auto"
              >
                고민 입력하러 가기 💌
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="text-center text-[11px] text-pink-400 py-3">
        👑 쏘쏘 키우기 · 선택으로 만들어가는 공주님의 매일
      </footer>

      {/* Outcome dialog */}
      <OutcomeDialog
        open={outcomeData.open}
        chosenLabel={outcomeData.chosenLabel}
        immediateText={outcomeData.immediateText}
        immediateDeltas={outcomeData.immediateDeltas}
        morningText={outcomeData.morningText}
        morningDeltas={outcomeData.morningDeltas}
        reaction={outcomeData.reaction as any}
        hasNightConsequence={outcomeData.hasNight}
        onNext={handleNextTurnFromOutcome}
      />

      {/* Morning wake-up report */}
      <MorningReportModal
        open={!!morningReport}
        day={state.day}
        consequences={morningReport?.consequences ?? []}
        totalDeltas={morningReport?.totalDeltas ?? {}}
        onClose={closeMorningReport}
      />

      {/* AI custom dilemma solver */}
      <AIDilemmaModal
        open={openAIDilemma}
        traits={state.traits}
        currentStats={state.stats}
        timeSlot={state.timeSlot}
        onApplyOutcome={handleApplyAIOutcome}
        onClose={() => setOpenAIDilemma(false)}
      />

      {/* Diary */}
      <DiaryModal
        open={openDiary}
        diary={state.diary}
        onClose={() => setOpenDiary(false)}
      />

      {/* Ending certificate + collection */}
      <EndingModal
        open={openEnding}
        ending={state.currentEnding ?? previewEnding}
        stats={state.stats}
        traits={state.traits}
        day={state.day}
        unlockedEndings={state.unlockedEndings}
        onRestart={resetGame}
        onContinue={() => setOpenEnding(false)}
        onClose={() => setOpenEnding(false)}
      />

      {/* Save & Load */}
      <SaveModal
        open={openSave}
        day={state.day}
        onReset={resetGame}
        onExport={exportSave}
        onImport={importSave}
        onClose={() => setOpenSave(false)}
      />

      {/* Trait pick dialog */}
      <TraitSelectionDialog
        open={openTraitSelect}
        onConfirm={(traits) => {
          setOpenTraitSelect(false);
          startGame(traits);
        }}
      />
    </div>
  );
}
