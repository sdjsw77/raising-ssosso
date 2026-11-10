import { Ending, Stats, DiaryEntry } from "../types/game";

export const ENDINGS: Ending[] = [
  {
    id: "royal_pink_princess",
    title: "👑 완벽한 로열 핑크 프린세스",
    subtitle: "모든 영역에서 반짝이는 완성형 공주",
    badge: "👑 로열 프린세스",
    description:
      "건강도, 마음도, 배움도, 체력도 무엇 하나 놓치지 않은 쏘쏘! 균형 잡힌 하루하루가 모여 세상에서 가장 사랑스럽고 단단한 공주가 되었습니다. 오늘의 쏘쏘는 그 어떤 동화 속 주인공보다 눈부십니다.",
    review: "모든 능력치 균형 고득점 달성! 진정한 완성형 육성의 정석을 보여주셨습니다.",
    check: (stats) =>
      stats.health >= 65 &&
      stats.fullness >= 55 &&
      stats.intelligence >= 65 &&
      stats.fitness >= 60 &&
      stats.happiness >= 70 &&
      stats.fatigue <= 45 &&
      stats.stress <= 40,
    priority: 100,
  },
  {
    id: "harvard_princess",
    title: "🎓 하버드 수석 공주님",
    subtitle: "지성과 우아함을 겸비한 뇌섹 공주",
    badge: "🎓 수석 졸업",
    description:
      "읽고 배우고 성장하는 기쁨을 온전히 누린 쏘쏘. 책과 메모, 깊은 생각들이 차곡차곡 쌓여 언제 어디서나 명쾌한 해답을 내놓는 멋진 사람이 되었습니다. 지적인 매력에 왕관까지 얹으니 완벽!",
    review: "지능 85 이상 달성! 매 턴 현명한 선택으로 지식을 축적한 결과입니다.",
    check: (stats) => stats.intelligence >= 85,
    priority: 90,
  },
  {
    id: "fitness_empress",
    title: "🏃‍♀️ 프린세스 피트니스 여제",
    subtitle: "복근에 왕관을 얹은 체력 최강 공주",
    badge: "🏃‍♀️ 체력 여제",
    description:
      "침대의 유혹을 이겨내고 흘린 땀방울들이 쏘쏘를 강철처럼 빚어냈습니다. 체력도 지구력도 최상급, 어떤 일정도 가볍게 소화하는 에너지 넘치는 공주님의 탄생입니다. 헬스장이 쏘쏘의 성(城)!",
    review: "운동신경 85 이상 & 건강 75 이상 달성! 꾸준한 운동과 자기관리의 승리입니다.",
    check: (stats) => stats.fitness >= 85 && stats.health >= 75,
    priority: 85,
  },
  {
    id: "michelin_gourmet",
    title: "🍰 미슐랭 3스타 미식 공주",
    subtitle: "맛있는 행복으로 세상을 채우는 공주",
    badge: "🍰 미식 여왕",
    description:
      "좋은 음식 앞에서 솔직하고, 먹는 즐거움을 아낌없이 누린 쏘쏘. 맛있는 것들을 행복하게 즐기면서도 건강을 지켜낸, 세상에서 제일 복스러운 공주님이 되었습니다. 쏘쏘의 미소가 최고의 디저트!",
    review: "배부름 75 이상 & 행복 80 이상 달성! 미식과 행복의 완벽한 조화입니다.",
    check: (stats) => stats.fullness >= 75 && stats.happiness >= 80,
    priority: 80,
  },
  {
    id: "zen_fairy",
    title: "🧘‍♀️ 스트레스 제로 힐링 요정",
    subtitle: "바람결처럼 평온하고 따뜻한 공주",
    badge: "🧘‍♀️ 힐링 요정",
    description:
      "불필요한 비교와 걱정을 내려놓고, 자신만의 속도로 하루하루를 채운 쏘쏘. 곁에만 있어도 주변 사람들까지 편안해지는 마법 같은 치유력을 지닌 공주님이 되었습니다. 마음이 부자인 쏘쏘!",
    review: "스트레스 15 이하 & 행복 85 이상 달성! 내면의 평화를 완벽히 지켜냈습니다.",
    check: (stats) => stats.stress <= 15 && stats.happiness >= 85,
    priority: 75,
  },
  {
    id: "bed_phantom_master",
    title: "🛌 프로 침대 지박령",
    subtitle: "이불 밖은 위험하다는 철학의 대가",
    badge: "🛌 지박령 마스터",
    description:
      "휴식에 진심이었던 쏘쏘. 비록 세상과의 연결고리는 조금 헐거워졌지만, 가장 포근하고 안전한 나만의 왕국에서 한없는 평화를 누렸습니다. 쉬는 것도 훌륭한 능력입니다. 다음 시즌엔 밖으로 나와볼까요?",
    review: "피로도 누적 및 침대 지박령 스타일 엔딩! 진정한 휴식 마니아의 길을 걸었습니다.",
    check: (stats, traits) => stats.fatigue >= 70 && traits.includes("bed_phantom"),
    priority: 70,
  },
  {
    id: "pink_workaholic",
    title: "💼 핑크빛 워커홀릭 슈퍼우먼",
    subtitle: "열정이 불타올라 멈출 줄 모르는 공주",
    badge: "💼 워커홀릭",
    description:
      "일도 공부도 목표도 모두 정복해낸 멋진 쏘쏘! 다만 다크서클이 왕관만큼 길어졌네요. 능력치는 정상급이지만 이제는 조금 쉬어갈 시간입니다. 당신의 열정은 충분히 빛났으니까요.",
    review: "지능 75 이상이면서 피로도 65 이상! 쉬지 않고 달린 열정의 결과입니다.",
    check: (stats) => stats.intelligence >= 75 && stats.fatigue >= 65,
    priority: 65,
  },
  {
    id: "cozy_everyday_princess",
    title: "💖 행복한 일상의 작은 공주",
    subtitle: "소소하지만 확실한 행복을 찾은 공주",
    badge: "💖 소소한 행복",
    description:
      "때로는 실수하고, 때로는 뒹굴고, 때로는 작은 결심을 해내며 지나온 시간들. 거창한 목표 없이도 매일의 쏘쏘는 사랑스러웠습니다. 평범한 하루들을 특별하게 만드는 힘, 그것이 쏘쏘만의 진짜 왕관입니다.",
    review: "모든 순간을 성실히 살아낸 따뜻한 일상 엔딩. 쏘쏘의 여정은 앞으로도 계속됩니다!",
    check: () => true, // fallback
    priority: 10,
  },
];

export function evaluateEnding(
  stats: Stats,
  traits: string[],
  diary: DiaryEntry[]
): Ending {
  const sorted = [...ENDINGS].sort((a, b) => b.priority - a.priority);
  for (const ending of sorted) {
    if (ending.check(stats, traits, diary)) {
      return ending;
    }
  }
  return ENDINGS[ENDINGS.length - 1];
}
