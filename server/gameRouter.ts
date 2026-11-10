import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { publicProcedure, router } from "./_core/trpc";

const LLM_MODEL = "gpt-6-luna";

// Stat keys used across the game
const STAT_KEYS = [
  "health",
  "fatigue",
  "fullness",
  "intelligence",
  "fitness",
  "happiness",
  "stress",
] as const;

function clampStat(v: number, min = -50, max = 50): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(min, Math.min(max, Math.round(v)));
}

function sanitizeDeltas(obj: unknown): Record<string, number> {
  const result: Record<string, number> = {};
  if (obj && typeof obj === "object") {
    for (const key of STAT_KEYS) {
      const v = (obj as Record<string, unknown>)[key];
      if (typeof v === "number") result[key] = clampStat(v);
    }
  }
  return result;
}

// Fallback choice generator when LLM is unavailable
function fallbackOptions(dilemma: string) {
  return {
    title: dilemma.slice(0, 30) + (dilemma.length > 30 ? "..." : ""),
    scenarioText: `“${dilemma}” — 쏘쏘 앞에 새로운 고민이 찾아왔습니다. 어떤 길을 선택할까요?`,
    options: [
      { id: "opt1", label: "안전하고 안정적인 길을 택한다 (스트레스 줄이기)" },
      { id: "opt2", label: "도전적인 길을 택한다 (성장과 성취에 집중)" },
      { id: "opt3", label: "나 자신을 먼저 챙기는 길을 택한다 (휴식과 힐링)" },
    ],
    advice: "어떤 선택이든 쏘쏘만의 이유가 있다면 괜찮아요!",
  };
}

function fallbackEvaluation(dilemma: string, chosenText: string) {
  const isEating = /먹|야식|음식|저녁|치킨|피자|라면|밥/.test(chosenText);
  const isSleeping = /자|자다|취침|눕|이불|휴식/.test(chosenText);
  const isExercising = /운동|헬스|뜀|러닝|산책/.test(chosenText);
  const isStudying = /공부|책|읽|배우|자격/.test(chosenText);

  let immediateDeltas: Record<string, number> = { happiness: 10, stress: -5 };
  let morningDeltas: Record<string, number> = { fatigue: -5 };
  let reaction = "happy";

  if (isEating) {
    immediateDeltas = { fullness: 15, fatigue: 8, happiness: 12, health: -3 };
    morningDeltas = { fatigue: 20, health: -8, fullness: -8 };
    reaction = "full";
  } else if (isSleeping) {
    immediateDeltas = { fatigue: -25, stress: -15, happiness: 10 };
    morningDeltas = { fatigue: -15, health: 8, happiness: 8 };
    reaction = "proud";
  } else if (isExercising) {
    immediateDeltas = { fitness: 15, health: 8, fatigue: 15, stress: -10, happiness: 12 };
    morningDeltas = { fitness: 6, health: 6, fatigue: -8 };
    reaction = "athletic";
  } else if (isStudying) {
    immediateDeltas = { intelligence: 15, fatigue: 10, stress: 5, happiness: 8 };
    morningDeltas = { intelligence: 8, stress: -5 };
    reaction = "studious";
  }

  return {
    immediateText: `쏘쏘는 “${chosenText}”(으)로 결정했다! 마음을 정하니 한결 개운하다.`,
    morningText: `[다음 날 아침]\n어제의 선택이 오늘을 만들었다. 쏘쏘는 한 걸음 더 성장한 기분이다.`,
    immediateDeltas,
    morningDeltas,
    reaction,
  };
}

export const gameRouter = router({
  /**
   * Generates 3 realistic scenario choices + advice for a user-typed dilemma.
   */
  generateDilemmaOptions: publicProcedure
    .input(
      z.object({
        dilemma: z.string().min(2).max(1000),
        traits: z.array(z.string()).optional(),
        currentStats: z.record(z.string(), z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const traitList = (input.traits ?? []).join(", ");
      const statsSummary = input.currentStats
        ? Object.entries(input.currentStats)
            .map(([k, v]) => `${k}:${v}`)
            .join(" ")
        : "";

      try {
        const res = await invokeLLM({
          model: LLM_MODEL,
          reasoning: { effort: "low" },
          messages: [
            {
              role: "system",
              content:
                "You are the AI narrative engine of '쏘쏘 키우기', a cute pastel-pink princess-themed Korean raising simulation game for the developer's girlfriend Ssosso. " +
                "Given a real-life dilemma the player is facing, create a whimsical yet relatable Korean scenario summary and exactly 3 distinct realistic choices that reflect different life approaches (e.g. cautious/safe, bold/ambitious, self-care/healing). " +
                "Also provide one short, warm encouraging advice sentence. Return JSON only.",
            },
            {
              role: "user",
              content:
                `고민: ${input.dilemma}\n` +
                (traitList ? `쏘쏘의 특성: ${traitList}\n` : "") +
                (statsSummary ? `현재 능력치: ${statsSummary}\n` : ""),
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "dilemma_options",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Short cute title with one emoji, 20 chars max",
                  },
                  scenarioText: {
                    type: "string",
                    description: "3-4 sentence charming context description in Korean",
                  },
                  option1: { type: "string", description: "First choice label in Korean" },
                  option2: { type: "string", description: "Second choice label in Korean" },
                  option3: { type: "string", description: "Third choice label in Korean" },
                  advice: {
                    type: "string",
                    description: "One warm encouraging line in Korean",
                  },
                },
                required: ["title", "scenarioText", "option1", "option2", "option3", "advice"],
                additionalProperties: false,
              },
            },
          },
        });

        const raw = res.choices[0]?.message?.content;
        const text = typeof raw === "string" ? raw : "";
        const data = JSON.parse(text);

        return {
          title: String(data.title ?? fallbackOptions(input.dilemma).title),
          scenarioText: String(
            data.scenarioText ?? fallbackOptions(input.dilemma).scenarioText
          ),
          options: [
            { id: "opt1", label: String(data.option1) },
            { id: "opt2", label: String(data.option2) },
            { id: "opt3", label: String(data.option3) },
          ],
          advice: String(data.advice ?? fallbackOptions(input.dilemma).advice),
        };
      } catch (err) {
        console.warn("[game.generateDilemmaOptions] LLM failed, using fallback:", err);
        return fallbackOptions(input.dilemma);
      }
    }),

  /**
   * Evaluates the outcome of a user choice (preset or custom free-text).
   * Returns immediate consequence + delayed morning consequence with stat deltas.
   */
  evaluateCustomChoice: publicProcedure
    .input(
      z.object({
        dilemma: z.string().min(2).max(1000),
        chosenText: z.string().min(1).max(500),
        traits: z.array(z.string()).optional(),
        currentStats: z.record(z.string(), z.number()).optional(),
        timeSlot: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const traitList = (input.traits ?? []).join(", ");
      const statsSummary = input.currentStats
        ? Object.entries(input.currentStats)
            .map(([k, v]) => `${k}:${v}`)
            .join(" ")
        : "";

      try {
        const res = await invokeLLM({
          model: LLM_MODEL,
          reasoning: { effort: "low" },
          messages: [
            {
              role: "system",
              content:
                "You are the AI narrator of '쏘쏘 키우기', a cute pastel princess Korean simulation game. " +
                "Evaluate the player's choice in context. Output in Korean: " +
                "immediateText (what happens right now, 2-3 affectionate witty sentences), " +
                "morningText (delayed consequence next morning, starts with '[다음 날 아침]\\n', realistic chain effects), " +
                "reaction (one of: happy, proud, tired, dizzy, starving, full, shocked, studious, athletic), " +
                "and realistic stat changes (-30 to +30 integers): " +
                "health, fatigue (higher=worse), fullness, intelligence, fitness, happiness, stress (higher=worse) for both immediate and morning stages. " +
                "Example of good morning consequence: eating late at night causes indigestion -> next morning fatigue+30, health-10. " +
                "Return JSON only.",
            },
            {
              role: "user",
              content:
                `상황: ${input.dilemma}\n` +
                `선택: ${input.chosenText}\n` +
                `현재 시간대: ${input.timeSlot ?? "evening"}\n` +
                (traitList ? `특성: ${traitList}\n` : "") +
                (statsSummary ? `능력치: ${statsSummary}\n` : ""),
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "choice_outcome",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  immediateText: { type: "string" },
                  morningText: { type: "string" },
                  reaction: { type: "string" },
                  imm_health: { type: "number" },
                  imm_fatigue: { type: "number" },
                  imm_fullness: { type: "number" },
                  imm_intelligence: { type: "number" },
                  imm_fitness: { type: "number" },
                  imm_happiness: { type: "number" },
                  imm_stress: { type: "number" },
                  morn_health: { type: "number" },
                  morn_fatigue: { type: "number" },
                  morn_fullness: { type: "number" },
                  morn_intelligence: { type: "number" },
                  morn_fitness: { type: "number" },
                  morn_happiness: { type: "number" },
                  morn_stress: { type: "number" },
                },
                required: [
                  "immediateText",
                  "morningText",
                  "reaction",
                  "imm_health",
                  "imm_fatigue",
                  "imm_fullness",
                  "imm_intelligence",
                  "imm_fitness",
                  "imm_happiness",
                  "imm_stress",
                  "morn_health",
                  "morn_fatigue",
                  "morn_fullness",
                  "morn_intelligence",
                  "morn_fitness",
                  "morn_happiness",
                  "morn_stress",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const raw = res.choices[0]?.message?.content;
        const text = typeof raw === "string" ? raw : "";
        const data = JSON.parse(text);

        const immediateDeltas = sanitizeDeltas({
          health: data.imm_health,
          fatigue: data.imm_fatigue,
          fullness: data.imm_fullness,
          intelligence: data.imm_intelligence,
          fitness: data.imm_fitness,
          happiness: data.imm_happiness,
          stress: data.imm_stress,
        });

        const morningDeltas = sanitizeDeltas({
          health: data.morn_health,
          fatigue: data.morn_fatigue,
          fullness: data.morn_fullness,
          intelligence: data.morn_intelligence,
          fitness: data.morn_fitness,
          happiness: data.morn_happiness,
          stress: data.morn_stress,
        });

        return {
          immediateText: String(data.immediateText),
          morningText: String(data.morningText),
          reaction: String(data.reaction ?? "happy"),
          immediateDeltas,
          morningDeltas,
        };
      } catch (err) {
        console.warn("[game.evaluateCustomChoice] LLM failed, using fallback:", err);
        return fallbackEvaluation(input.dilemma, input.chosenText);
      }
    }),
});
