import { useState } from "react";

// gameRouter.ts 원본의 fallbackOptions & fallbackEvaluation 로직 100% 보존
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

export const trpc = {
  game: {
    generateDilemmaOptions: {
      useMutation: (opts?: { onSuccess?: (data: ReturnType<typeof fallbackOptions>) => void; onError?: (err: unknown) => void }) => {
        const [isPending, setIsPending] = useState(false);
        return {
          isPending,
          mutate: (vars: { dilemma: string; traits?: string[]; currentStats?: Record<string, number> }) => {
            setIsPending(true);
            setTimeout(() => {
              setIsPending(false);
              const res = fallbackOptions(vars.dilemma);
              opts?.onSuccess?.(res);
            }, 500);
          },
        };
      },
    },
    evaluateCustomChoice: {
      useMutation: (opts?: { onSuccess?: (data: ReturnType<typeof fallbackEvaluation>, vars: { dilemma: string; chosenText: string; traits?: string[]; currentStats?: Record<string, number>; timeSlot?: string }) => void; onError?: (err: unknown) => void }) => {
        const [isPending, setIsPending] = useState(false);
        return {
          isPending,
          mutate: (vars: { dilemma: string; chosenText: string; traits?: string[]; currentStats?: Record<string, number>; timeSlot?: string }) => {
            setIsPending(true);
            setTimeout(() => {
              setIsPending(false);
              const res = fallbackEvaluation(vars.dilemma, vars.chosenText);
              opts?.onSuccess?.(res, vars);
            }, 500);
          },
        };
      },
    },
  },
};
