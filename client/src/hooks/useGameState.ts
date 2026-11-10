import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AvatarReaction,
  StatDeltas,
  StatKey,
  Stats,
  TimeOfDay,
  DelayedConsequence,
  DiaryEntry,
  GameState,
  Ending,
} from "../types/game";
import { getTrait } from "../data/traits";
import { evaluateEnding } from "../data/endings";
import { sound } from "../lib/sound";

const STORAGE_KEY = "ssosso_game_state_v1";
const ENDINGS_KEY = "ssosso_unlocked_endings_v1";

export const STAT_KEYS: StatKey[] = [
  "health",
  "fatigue",
  "fullness",
  "intelligence",
  "fitness",
  "happiness",
  "stress",
];

export const INITIAL_STATS: Stats = {
  health: 80,
  fatigue: 20,
  fullness: 55,
  intelligence: 40,
  fitness: 35,
  happiness: 70,
  stress: 25,
};

export const TIME_SLOTS: TimeOfDay[] = ["morning", "afternoon", "evening", "night"];

export const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: "아침 ☀️",
  afternoon: "오후 🌤️",
  evening: "저녁 🌅",
  night: "밤 🌙",
};

export const STAT_META: Record<
  StatKey,
  { label: string; icon: string; goodIfHigh: boolean; color: string }
> = {
  health: { label: "건강", icon: "💖", goodIfHigh: true, color: "#FB7185" },
  fatigue: { label: "피곤함", icon: "😴", goodIfHigh: false, color: "#C084FC" },
  fullness: { label: "배부름", icon: "🍰", goodIfHigh: true, color: "#F472B6" },
  intelligence: { label: "지능", icon: "🧠", goodIfHigh: true, color: "#60A5FA" },
  fitness: { label: "운동신경", icon: "🏃‍♀️", goodIfHigh: true, color: "#34D399" },
  happiness: { label: "기분", icon: "✨", goodIfHigh: true, color: "#FBBF24" },
  stress: { label: "스트레스", icon: "⚡", goodIfHigh: false, color: "#F87171" },
};

function clamp(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function loadUnlockedEndings(): string[] {
  try {
    const raw = localStorage.getItem(ENDINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUnlockedEndings(list: string[]) {
  try {
    localStorage.setItem(ENDINGS_KEY, JSON.stringify(Array.from(new Set(list))));
  } catch {
    // ignore
  }
}

function buildInitialState(): GameState {
  return {
    day: 1,
    timeSlot: "morning",
    stats: { ...INITIAL_STATS },
    traits: [],
    delayedQueue: [],
    diary: [],
    unlockedEndings: loadUnlockedEndings(),
    gameStarted: false,
    gameOver: false,
    version: 1,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(buildInitialState);
  const [lastDeltas, setLastDeltas] = useState<StatDeltas | null>(null);
  const [currentReaction, setCurrentReaction] = useState<AvatarReaction>("normal");
  const [morningReport, setMorningReport] = useState<
    { consequences: DelayedConsequence[]; totalDeltas: StatDeltas } | null
  >(null);
  const [traitGainNotice, setTraitGainNotice] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: GameState = JSON.parse(raw);
        setState({
          ...parsed,
          unlockedEndings: Array.from(
            new Set([...loadUnlockedEndings(), ...(parsed.unlockedEndings || [])])
          ),
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Compute modified deltas based on traits
  const applyTraitModifiers = useCallback(
    (deltas: StatDeltas, isNight: boolean): StatDeltas => {
      const modified: StatDeltas = { ...deltas };
      const traits = state.traits.map(getTrait).filter((t): t is NonNullable<typeof t> => !!t);

      for (const t of traits) {
        const m = t.modifiers;

        // Stat multipliers on positive gains
        if (m.statMultiplier) {
          for (const [key, mult] of Object.entries(m.statMultiplier) as [StatKey, number][]) {
            const v = modified[key];
            if (v !== undefined && v > 0) modified[key] = Math.round(v * mult);
          }
        }
        // Stat gain bonus
        if (m.statGainBonus) {
          for (const [key, bonus] of Object.entries(m.statGainBonus) as [StatKey, number][]) {
            const v = modified[key];
            if (v !== undefined && v > 0) modified[key] = (modified[key] ?? 0) + bonus;
          }
        }
        // Stress gain multiplier
        if (m.stressGainMultiplier && modified.stress && modified.stress > 0) {
          modified.stress = Math.round(modified.stress * m.stressGainMultiplier);
        }
        // Fatigue recovery multiplier (when fatigue goes down)
        if (m.fatigueRecoveryMultiplier && modified.fatigue && modified.fatigue < 0) {
          modified.fatigue = Math.round(modified.fatigue * m.fatigueRecoveryMultiplier);
        }
        // Night fatigue bonus/penalty
        if (isNight && m.delayedEffectBonus?.nightFatigueBonus) {
          modified.fatigue = (modified.fatigue ?? 0) + m.delayedEffectBonus.nightFatigueBonus;
        }
      }

      // Trait-specific iron_body health reduction mitigation
      if (state.traits.includes("iron_body") && modified.health && modified.health < 0) {
        modified.health = Math.round(modified.health * 0.7);
      }
      // positive_mind
      if (state.traits.includes("positive_mind") && modified.happiness && modified.happiness > 0) {
        modified.happiness = Math.round(modified.happiness * 1.15);
      }
      return modified;
    },
    [state.traits]
  );

  const applyDeltasToStats = useCallback((current: Stats, deltas: StatDeltas): Stats => {
    const next = { ...current };
    for (const [k, d] of Object.entries(deltas) as [StatKey, number][]) {
      if (d !== undefined) next[k] = clamp((next[k] ?? 0) + d);
    }
    return next;
  }, []);

  // Check dynamic trait unlocks based on diary & stats
  const checkDynamicTraits = useCallback(
    (nextState: GameState): GameState => {
      const { diary, stats, traits } = nextState;
      const newTraits = new Set(traits);
      const candidates: { id: string; condition: boolean }[] = [
        {
          id: "big_eater",
          condition:
            diary.filter((d) => d.scenarioTitle.includes("야식")).length >= 3 &&
            !newTraits.has("big_eater"),
        },
        {
          id: "night_owl",
          condition:
            diary.filter((d) => d.choiceLabel.includes("밤샘") || d.scenarioTitle.includes("넷플릭스")).length >= 3 &&
            !newTraits.has("night_owl"),
        },
        {
          id: "iron_body",
          condition:
            diary.filter((d) => d.scenarioTitle.includes("헬스") || d.scenarioTitle.includes("홈트")).length >= 3 &&
            !newTraits.has("iron_body"),
        },
        {
          id: "genius_spark",
          condition: stats.intelligence >= 80 && !newTraits.has("genius_spark"),
        },
        {
          id: "fragile_heart",
          condition: stats.stress >= 70 && !newTraits.has("fragile_heart"),
        },
        {
          id: "screen_addict",
          condition:
            diary.filter((d) => d.scenarioTitle.includes("스마트폰")).length >= 2 &&
            !newTraits.has("screen_addict"),
        },
      ];
      for (const c of candidates) {
        if (c.condition) {
          newTraits.add(c.id);
          const t = getTrait(c.id);
          if (t) setTraitGainNotice(`새로운 특성 획득! [${t.icon} ${t.name}]`);
          sound.playPrincess();
        }
      }
      return { ...nextState, traits: Array.from(newTraits) };
    },
    []
  );

  // Natural passive shifts per turn
  const passiveShift = useCallback((current: Stats, traits: string[]): Stats => {
    let hungerLoss = -6;
    if (traits.includes("big_eater")) hungerLoss = -10;
    const next: Stats = {
      ...current,
      fullness: clamp(current.fullness + hungerLoss),
      fatigue: clamp(current.fatigue + 3),
      stress: clamp(current.stress - 2),
    };
    return next;
  }, []);

  // Sleep recovery when transitioning from night -> next morning
  const sleepRecovery = useCallback(
    (current: Stats, traits: string[]): { stats: Stats; deltas: StatDeltas } => {
      let fatigueRecovery = -35;
      if (traits.includes("princess_soul")) fatigueRecovery = -45;
      if (traits.includes("deep_sleeper")) fatigueRecovery = -55;
      if (traits.includes("night_owl")) fatigueRecovery = -25;
      const deltas: StatDeltas = {
        fatigue: fatigueRecovery,
        stress: -10,
        health: 5,
        happiness: 5,
        fullness: -15,
      };
      return { stats: applyDeltasToStats(current, deltas), deltas };
    },
    [applyDeltasToStats]
  );

  // Start new game with chosen traits
  const startGame = useCallback((chosenTraits: string[]) => {
    const base = buildInitialState();
    let stats = { ...INITIAL_STATS };
    const traits = [...chosenTraits];

    // Some traits give starting stat nudges
    if (traits.includes("iron_body")) stats.health += 10;
    if (traits.includes("genius_spark")) stats.intelligence += 10;
    if (traits.includes("quick_reflexes")) stats.fitness += 10;
    if (traits.includes("big_eater")) stats.fullness += 10;
    if (traits.includes("bed_phantom")) {
      stats.fitness -= 10;
      stats.fatigue -= 10;
    }
    stats = Object.fromEntries(
      Object.entries(stats).map(([k, v]) => [k, clamp(v)])
    ) as Stats;

    setState({
      ...base,
      stats,
      traits,
      gameStarted: true,
    });
    sound.playPrincess();
  }, []);

  // Make a choice
  const makeChoice = useCallback(
    (params: {
      scenarioTitle: string;
      choiceLabel: string;
      immediateText: string;
      immediateDeltas: StatDeltas;
      morningText?: string;
      morningDeltas?: StatDeltas;
      unlockTrait?: string;
      reaction?: AvatarReaction;
    }) => {
      sound.playClick();
      const isNight = state.timeSlot === "night";
      const finalImmediateDeltas = applyTraitModifiers(params.immediateDeltas, isNight);

      // Play positive/negative sound
      const netPositive =
        (finalImmediateDeltas.health ?? 0) +
        (finalImmediateDeltas.happiness ?? 0) -
        (finalImmediateDeltas.stress ?? 0) -
        (finalImmediateDeltas.fatigue ?? 0) * 0.5;
      if (netPositive >= 5) sound.playPositive();
      else if (netPositive <= -8) sound.playNegative();

      setState((prev) => {
        let stats = applyDeltasToStats(prev.stats, finalImmediateDeltas);
        stats = passiveShift(stats, prev.traits);

        const newDelayed: DelayedConsequence[] = [...prev.delayedQueue];
        if (params.morningText && params.morningDeltas) {
          const modMorningDeltas = applyTraitModifiers(params.morningDeltas, false);
          newDelayed.push({
            id: `del_${Date.now()}`,
            triggerDay: isNight ? prev.day + 1 : prev.day,
            triggerTime: "morning",
            sourceTitle: params.scenarioTitle,
            text: params.morningText,
            deltas: modMorningDeltas,
          });
        }

        const entry: DiaryEntry = {
          id: `diary_${Date.now()}`,
          day: prev.day,
          timeSlot: prev.timeSlot,
          scenarioTitle: params.scenarioTitle,
          choiceLabel: params.choiceLabel,
          immediateText: params.immediateText,
          immediateDeltas: finalImmediateDeltas,
          morningText: params.morningText,
          morningDeltas: params.morningDeltas,
          timestamp: Date.now(),
        };

        const newTraits = params.unlockTrait && !prev.traits.includes(params.unlockTrait)
          ? [...prev.traits, params.unlockTrait]
          : prev.traits;

        const next: GameState = {
          ...prev,
          stats,
          traits: newTraits,
          delayedQueue: newDelayed,
          diary: [entry, ...prev.diary],
        };
        return checkDynamicTraits(next);
      });

      setLastDeltas(finalImmediateDeltas);
      if (params.reaction) setCurrentReaction(params.reaction);
    },
    [state.timeSlot, applyTraitModifiers, applyDeltasToStats, passiveShift, checkDynamicTraits]
  );

 // Advance time slot (morning -> afternoon -> evening -> night -> next day morning)
 const advanceTime = useCallback(() => {
   sound.playClick();
    const prev = state;
    const idx = TIME_SLOTS.indexOf(prev.timeSlot);
    const isLastSlot = idx === TIME_SLOTS.length - 1;
    const nextSlot = TIME_SLOTS[(idx + 1) % TIME_SLOTS.length];
    const nextDay = isLastSlot ? prev.day + 1 : prev.day;
    let stats = { ...prev.stats };
    if (isLastSlot) {
      const sleep = sleepRecovery(stats, prev.traits);
      stats = sleep.stats;
      const due = prev.delayedQueue.filter(
        (d) => d.triggerDay <= nextDay && d.triggerTime === "morning"
      );
      const remaining = prev.delayedQueue.filter((d) => !due.includes(d));
      const totalDeltas: StatDeltas = { ...sleep.deltas };
      for (const c of due) {
        stats = applyDeltasToStats(stats, c.deltas);
        for (const [k, v] of Object.entries(c.deltas) as [StatKey, number][]) {
          if (v !== undefined) totalDeltas[k] = (totalDeltas[k] ?? 0) + v;
        }
      }
      const nextState = checkDynamicTraits({
        ...prev,
        day: nextDay,
        timeSlot: nextSlot,
        stats,
        delayedQueue: remaining,
      });
      setState(nextState);
      setMorningReport({ consequences: due, totalDeltas });
      sound.playMorning();
      return;
    }
    setState({
      ...prev,
      day: nextDay,
      timeSlot: nextSlot,
    });
  }, [state, sleepRecovery, applyDeltasToStats, checkDynamicTraits]);

  // Hook up morningReport after advanceTime resolves a morning
  const closeMorningReport = useCallback(() => {
    setMorningReport(null);
  }, []);

  // End game and evaluate ending
  const triggerEnding = useCallback(() => {
    const ending = evaluateEnding(state.stats, state.traits, state.diary);
    const unlocked = Array.from(new Set([...state.unlockedEndings, ending.id]));
    saveUnlockedEndings(unlocked);
    setState((prev) => ({
      ...prev,
      gameOver: true,
      currentEnding: ending,
      unlockedEndings: unlocked,
    }));
    sound.playPrincess();
  }, [state.stats, state.traits, state.diary, state.unlockedEndings]);

  // Reset
  const resetGame = useCallback(() => {
    sound.playClick();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(buildInitialState());
  }, []);

  // Export/import save
  const exportSave = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importSave = useCallback((raw: string) => {
    try {
      const parsed: GameState = JSON.parse(raw);
      if (!parsed.stats || parsed.day === undefined) return false;
      setState({
        ...parsed,
        unlockedEndings: Array.from(
          new Set([...loadUnlockedEndings(), ...(parsed.unlockedEndings || [])])
        ),
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const endingResult = useMemo(
    () => evaluateEnding(state.stats, state.traits, state.diary),
    [state.stats, state.traits, state.diary]
  );

  return {
    state,
    lastDeltas,
    currentReaction,
    setCurrentReaction,
    morningReport,
    traitGainNotice,
    clearTraitGainNotice: () => setTraitGainNotice(null),
    closeMorningReport,
    startGame,
    makeChoice,
    advanceTime,
    triggerEnding,
    resetGame,
    exportSave,
    importSave,
    previewEnding: endingResult,
  };
}
