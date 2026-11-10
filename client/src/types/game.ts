// Core game type definitions for '쏘쏘 키우기'

export type StatKey =
  | "health"        // 건강
  | "fatigue"       // 피곤함 (낮을수록 좋음)
  | "fullness"      // 배부름
  | "intelligence"  // 지능
  | "fitness"       // 운동신경
  | "happiness"     // 기분/행복
  | "stress";       // 스트레스 (낮을수록 좋음)

export type Stats = Record<StatKey, number>;

export type StatDeltas = Partial<Record<StatKey, number>>;

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface TraitModifier {
  statMultiplier?: Partial<Record<StatKey, number>>; // scales positive gains
  statGainBonus?: Partial<Record<StatKey, number>>;
  delayedEffectBonus?: { nightFatigueBonus?: number; sleepRecoveryBonus?: number };
  hungerDecayMultiplier?: number;
  stressGainMultiplier?: number;
  fatigueRecoveryMultiplier?: number;
}

export interface Trait {
  id: string;
  name: string;
  category: "positive" | "negative";
  icon: string;
  description: string;
  flavor: string;
  modifiers: TraitModifier;
}

export interface ChoiceOutcome {
  immediateText: string;
  immediateDeltas: StatDeltas;
  morningText?: string;          // [다음 날 아침] delayed consequence
  morningDeltas?: StatDeltas;
  unlockTrait?: string;           // trait id acquired on this choice
  reaction?: AvatarReaction;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  outcome?: ChoiceOutcome;        // undefined for custom-input choice
  isCustomInput?: boolean;
}

export interface Scenario {
  id: string;
  category: "diet" | "lifestyle" | "work" | "romance" | "leisure" | "health" | "custom";
  timeSlot?: TimeOfDay | "any";
  title: string;
  context: string;
  choices: ScenarioChoice[];
}

export interface DelayedConsequence {
  id: string;
  triggerDay: number;
  triggerTime: TimeOfDay;
  sourceTitle: string;
  text: string;
  deltas: StatDeltas;
}

export interface DiaryEntry {
  id: string;
  day: number;
  timeSlot: TimeOfDay;
  scenarioTitle: string;
  choiceLabel: string;
  immediateText: string;
  immediateDeltas: StatDeltas;
  morningText?: string;
  morningDeltas?: StatDeltas;
  timestamp: number;
}

export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  review: string;
  check: (stats: Stats, traits: string[], diary: DiaryEntry[]) => boolean;
  priority: number;
}

export type AvatarReaction =
  | "happy"
  | "proud"
  | "tired"
  | "dizzy"
  | "starving"
  | "full"
  | "shocked"
  | "studious"
  | "athletic"
  | "sleeping"
  | "normal";

export interface GameState {
  day: number;
  timeSlot: TimeOfDay;
  stats: Stats;
  traits: string[];
  delayedQueue: DelayedConsequence[];
  diary: DiaryEntry[];
  unlockedEndings: string[];
  gameStarted: boolean;
  gameOver: boolean;
  currentEnding?: Ending;
  version: number;
}
