import { Scenario } from "../types/game";

export const SCENARIOS: Scenario[] = [
  // 1. 유저 예시 (밤 11시 야식)
  {
    id: "late_night_meal",
    category: "diet",
    timeSlot: "night",
    title: "🌙 밤 11시 야식의 유혹",
    context:
      "쏘쏘가 늦게 집에 와서 집안일 후에 저녁을 11시에 먹으려고 한다. 배에서는 꼬르륵 소리가 요란한데... 어떻게 할까?",
    choices: [
      {
        id: "eat",
        label: "먹는다! 오늘은 먹고 살아야지",
        outcome: {
          immediateText:
            "쏘쏘가 따뜻한 저녁을 야무지게 먹는다! 입안 가득 행복이 퍼진다.\n혈당 스파이크가 몰려와 나른해지기 시작한다...",
          immediateDeltas: { fullness: 15, fatigue: 10, happiness: 10, stress: -5 },
          morningText:
            "[다음 날 아침]\n밤새 장기들이 소화를 하느라 제대로 잠을 못 잤다. 얼굴도 살짝 부었고 밤에 먹어서 살이 찐 느낌...",
          morningDeltas: { fatigue: 30, health: -10, stress: 5 },
          reaction: "full",
        },
      },
      {
        id: "skip",
        label: "안 먹는다. 물만 마시고 눕자",
        outcome: {
          immediateText:
            "꾹 참았다! 배는 고프지만 내일의 쏘쏘를 위해 이불을 뒤집어썼다.\n공복감에 잠들기까지 조금 뒤척였다.",
          immediateDeltas: { fullness: -10, stress: 8, fatigue: 5, health: 5 },
          morningText:
            "[다음 날 아침]\n속이 가볍고 상쾌하다! 거울 속 얼굴도 붓지 않았다. 나 자신 칭찬해~",
          morningDeltas: { fatigue: -15, health: 10, happiness: 10, fullness: -10 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 2. 넷플릭스
  {
    id: "netflix_one_more",
    category: "leisure",
    timeSlot: "night",
    title: "📺 '한 편만 더...' 넷플릭스 유혹",
    context:
      "새벽 1시. 지금 자면 6시간은 잘 수 있다. 하지만 방금 시즌 최종화가 시작됐다! 다음 화 예고가 너무 궁금한데...",
    choices: [
      {
        id: "watch",
        label: "한 편만 더 보고 기절한다!",
        outcome: {
          immediateText:
            "반전의 반전! 도파민 폭발로 시간 가는 줄 몰랐다. 하지만 엔딩 크레딧이 올라가자마자 눈이 안 떠진다.",
          immediateDeltas: { fatigue: 20, stress: -10, happiness: 15 },
          morningText:
            "[다음 날 아침]\n알람 5개를 다 끄고 겨우 일어났다. 다크서클이 턱 밑까지 내려왔다...",
          morningDeltas: { fatigue: 35, health: -8, intelligence: -5 },
          reaction: "tired",
        },
      },
      {
        id: "sleep",
        label: "리모컨 끄고 즉시 취침",
        outcome: {
          immediateText:
            "궁금해 미치겠지만 어른답게 TV를 껐다. 나 자신이 기특하다.",
          immediateDeltas: { fatigue: -10, stress: 5, happiness: 5 },
          morningText:
            "[다음 날 아침]\n꿀잠을 잤다! 출근길에 넷플릭스 결말을 찾아보는 쏠쏠한 재미까지.",
          morningDeltas: { fatigue: -20, health: 10, intelligence: 5 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 3. 주말 약속 취소 고민
  {
    id: "weekend_plans",
    category: "leisure",
    timeSlot: "morning",
    title: "😴 주말 아침 약속 취소의 유혹",
    context:
      "토요일 아침, 2주 전 잡아둔 친구 약속이 3시간 뒤다. 하지만 온몸이 침대와 하나가 되어버렸다...",
    choices: [
      {
        id: "cancel",
        label: "정중히 양해를 구하고 눕는다",
        outcome: {
          immediateText:
            "“미안해 다음엔 내가 쏠게!” 친구는 이해해줬지만 약간의 죄책감은 남았다.\n그래도 침대 속은 너무나 천국...",
          immediateDeltas: { fatigue: -25, stress: -15, happiness: 10 },
          morningText:
            "[오후]\n온종일 뒹굴뒹굴 충전 완료! 에너지가 다시 차오른다.",
          morningDeltas: { fatigue: -10, fullness: -5 },
          reaction: "happy",
        },
      },
      {
        id: "go",
        label: "일어나서 준비하고 나간다!",
        outcome: {
          immediateText:
            "씻고 화장하고 외출 완료. 막상 친구를 만나 수다를 떠니 너무 즐겁다!",
          immediateDeltas: { happiness: 25, stress: -10, fatigue: 15, fullness: 10 },
          morningText:
            "[다음 날 아침]\n나가길 잘했다는 뿌듯함이 가슴에 남았다. 사진도 많이 건졌다!",
          morningDeltas: { happiness: 10, stress: -5 },
          reaction: "happy",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 4. 헬스장 vs 침대
  {
    id: "gym_vs_bed",
    category: "health",
    timeSlot: "evening",
    title: "🏋️‍♀️ 헬스장 가방 vs 침대",
    context:
      "운동복은 이미 다 챙겨놨다. 현관만 나가면 되는데, 침대가 쏘쏘를 부르고 있다. “오늘 하루쯤 쉬어도 괜찮지 않아?”",
    choices: [
      {
        id: "gym",
        label: "가방 메고 헬스장으로 직행!",
        outcome: {
          immediateText:
            "러닝머신 30분에 근력운동까지 완벽 소화! 땀 흘리고 샤워하니 다시 태어난 기분이다.",
          immediateDeltas: { fitness: 12, health: 8, fatigue: 15, happiness: 15, stress: -12 },
          morningText:
            "[다음 날 아침]\n기분 좋은 근육통과 함께 몸이 가뿐하다! 거울 속 라인이 달라진 느낌.",
          morningDeltas: { fitness: 5, health: 8, fatigue: -10 },
          reaction: "athletic",
        },
      },
      {
        id: "bed",
        label: "오늘은 푹 쉬자, 침대로 다이빙",
        outcome: {
          immediateText:
            "침대에 눕는 순간 모든 긴장이 녹아내린다. 쉬는 것도 실력이지~",
          immediateDeltas: { fatigue: -20, stress: -10, fitness: -3 },
          morningText:
            "[다음 날 아침]\n푹 쉬어서 피로는 덜하지만, 마음 한구석의 죄책감이 살짝 스친다.",
          morningDeltas: { stress: 6, fullness: -5 },
          reaction: "normal",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 5. 충동구매
  {
    id: "dress_shopping",
    category: "lifestyle",
    timeSlot: "afternoon",
    title: "👗 위시리스트 원피스 세일",
    context:
      "월급이 갓 들어온 오후, 지난달부터 찜해둔 파스텔 핑크 공주 원피스가 30% 플래시 세일 중이다. 이번 달도 생활비가 빠듯한데...",
    choices: [
      {
        id: "buy",
        label: "나를 위한 선물! 결제한다",
        outcome: {
          immediateText:
            "결제 완료 알림에 심장이 콩닥콩닥! 배송 기다리는 하루하루가 설렐 것 같다.",
          immediateDeltas: { happiness: 30, stress: -15, fatigue: -5 },
          morningText:
            "[다음 날]\n카드 명세서를 보고 잠시 굳었지만... 예쁘니까 괜찮아, 열심히 살면 되지!",
          morningDeltas: { stress: 10, intelligence: 3 },
          reaction: "happy",
        },
      },
      {
        id: "save",
        label: "장바구니에 두고 24시간 뒤 결정",
        outcome: {
          immediateText:
            "냉정하게 창을 닫았다. 성숙한 소비자의 면모를 뽐내는 쏘쏘.",
          immediateDeltas: { intelligence: 10, stress: 5, happiness: -5 },
          morningText:
            "[다음 날]\n신기하게도 갖고 싶은 마음이 반으로 줄었다. 나 좀 똑똑한 듯?",
          morningDeltas: { stress: -8, intelligence: 5, happiness: 8 },
          reaction: "studious",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 6. 감기 기운 출근
  {
    id: "cold_morning",
    category: "health",
    timeSlot: "morning",
    title: "🤧 감기 기운이 슬슬 오는 날",
    context:
      "목이 칼칼하고 이마가 뜨끈하다. 중요한 일정이 있는 날이지만 몸은 누워있으라고 비명을 지른다. 어쩌지?",
    choices: [
      {
        id: "rest",
        label: "연차/병가를 내고 병원 다녀와 쉰다",
        outcome: {
          immediateText:
            "병원 진료 후 따뜻한 죽을 먹고 약을 먹었다. 죄송하지만 내 몸이 먼저다.",
          immediateDeltas: { health: 15, fatigue: -15, stress: -10, fullness: 8 },
          morningText:
            "[다음 날 아침]\n열도 내리고 컨디션이 회복됐다! 초기에 잡길 정말 잘했다.",
          morningDeltas: { health: 12, fatigue: -10, happiness: 10 },
          reaction: "happy",
        },
      },
      {
        id: "work",
        label: "종합감기약 먹고 버텨본다",
        outcome: {
          immediateText:
            "마스크를 쓰고 힘겹게 일정을 소화했다. 멍한 머리로 하루가 어떻게 갔는지 모르겠다.",
          immediateDeltas: { fatigue: 25, stress: 15, intelligence: 5, health: -10 },
          morningText:
            "[다음 날 아침]\n목소리가 아예 잠겼다... 무리한 대가가 고스란히 돌아왔다.",
          morningDeltas: { health: -18, fatigue: 20, stress: 10 },
          reaction: "dizzy",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 7. 친구 고민 상담
  {
    id: "friend_call",
    category: "romance",
    timeSlot: "night",
    title: "📞 밤늦은 친구의 고민 상담 전화",
    context:
      "밤 11시 반, 친한 친구에게서 울먹이는 목소리로 전화가 왔다. 내일 일정이 있지만 친구가 힘들어 보인다.",
    choices: [
      {
        id: "listen",
        label: "끝까지 들어주고 같이 울고 위로해준다",
        outcome: {
          immediateText:
            "2시간 동안 통화하며 친구 마음을 안아줬다. 친구는 “너 덕분에 살았다”고 했다.",
          immediateDeltas: { happiness: 15, fatigue: 15, stress: 8 },
          morningText:
            "[다음 날 아침]\n조금 졸리지만, 친구의 고맙다는 카톡에 마음이 따뜻해진다.",
          morningDeltas: { fatigue: 15, happiness: 12, stress: -5 },
          reaction: "happy",
        },
      },
      {
        id: "delay",
        label: "“내일 바로 만나서 얘기하자”로 약속 잡기",
        outcome: {
          immediateText:
            "친구를 다독이며 내일 점심 약속을 잡았다. 둘 다에게 현명한 선택이었다.",
          immediateDeltas: { intelligence: 8, fatigue: -5, stress: 3 },
          morningText:
            "[다음 날 아침]\n친구 만날 준비를 하며 어떤 말로 위로할지 차분히 생각했다.",
          morningDeltas: { intelligence: 5, stress: -3 },
          reaction: "studious",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 8. 카페 음료
  {
    id: "cafe_drink",
    category: "diet",
    timeSlot: "afternoon",
    title: "☕ 아이스 아메리카노 vs 달콤한 딸기 라떼",
    context:
      "오후 나른한 시간, 카페 카운터 앞. 칼로리 제로 아메리카노냐, 행복 충전 딸기 라떼냐... 인생 최대 난제다.",
    choices: [
      {
        id: "strawberry",
        label: "오늘만큼은 달콤한 딸기 라떼!",
        outcome: {
          immediateText:
            "달달한 딸기 청과 우유의 환상 조합! 스트레스가 한 번에 녹아내린다.",
          immediateDeltas: { happiness: 22, fullness: 12, stress: -12, health: -3 },
          reaction: "happy",
        },
      },
      {
        id: "americano",
        label: "절제의 아이스 아메리카노",
        outcome: {
          immediateText:
            "깔끔한 맛에 정신이 번쩍! 오후 집중력이 200% 상승했다.",
          immediateDeltas: { intelligence: 10, fatigue: -10, health: 3 },
          morningText: "[다음 날] 군것질 줄이기 성공으로 몸이 가볍다.",
          morningDeltas: { health: 4 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 9. 숏폼 중독
  {
    id: "shortform_doom",
    category: "leisure",
    timeSlot: "evening",
    title: "📱 숏폼 영상 3시간째의 위기",
    context:
      "알고리즘의 늪에 빠져 3시간이 순삭됐다. 눈은 뻑뻑하고 목은 뻐근하다. 이 늪에서 탈출할 수 있을까?",
    choices: [
      {
        id: "stop",
        label: "스마트폰을 거실에 두고 스트레칭 시작!",
        outcome: {
          immediateText:
            "과감하게 탈출! 몸을 쭉 펴고 물 한잔 마시니 머리가 맑아진다.",
          immediateDeltas: { health: 8, fatigue: -8, intelligence: 8, stress: -10 },
          morningText: "[다음 날] 목 결림도 없고 눈도 덜 피로하다.",
          morningDeltas: { health: 5 },
          reaction: "proud",
        },
      },
      {
        id: "continue",
        label: "조금만 더... 딱 세 개만 더 보고!",
        outcome: {
          immediateText:
            "그렇게 2시간이 또 흘렀다. 멍때리며 웃었지만 끝나고 나니 묘한 허탈감이...",
          immediateDeltas: { fatigue: 18, intelligence: -8, happiness: 5, stress: 10 },
          morningText:
            "[다음 날 아침]\n안구건조증 폭발. 인공눈물부터 찾았다.",
          morningDeltas: { fatigue: 15, health: -8 },
          reaction: "dizzy",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 10. 시험 벼락치기
  {
    id: "cramming_exam",
    category: "work",
    timeSlot: "night",
    title: "📚 자격증 시험 전날 밤 벼락치기",
    context:
      "내일 중요한 시험이다. 범위는 반밖에 못 봤다. 밤을 새워서라도 다 볼 것인가, 컨디션을 챙길 것인가?",
    choices: [
      {
        id: "allnight",
        label: "커피 탑을 쌓고 밤샘 벼락치기!",
        outcome: {
          immediateText:
            "형광펜과 카페인의 힘으로 예상 문제를 거의 다 훑었다! 단기 기억력 풀가동.",
          immediateDeltas: { intelligence: 25, fatigue: 30, stress: 20 },
          morningText:
            "[다음 날 아침]\n눈이 풀린 채 시험장 입장. 벼락치기한 데서 문제가 꽤 많이 나왔다... 하지만 몸은 너덜너덜.",
          morningDeltas: { intelligence: 10, fatigue: 25, health: -15, stress: -15 },
          reaction: "shocked",
        },
      },
      {
        id: "sleep",
        label: "핵심만 빠르게 복습하고 푹 잔다",
        outcome: {
          immediateText:
            "요약본만 세 번 읽고 누웠다. 잠이 보약이라는 믿음으로...",
          immediateDeltas: { intelligence: 10, stress: 5, fatigue: -10 },
          morningText:
            "[다음 날 아침]\n머리가 맑아 문제 읽는 속도가 빨랐다. 실수 없이 안정적으로 풀었다!",
          morningDeltas: { intelligence: 12, health: 8, happiness: 15 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 11. 방 청소
  {
    id: "room_cleaning",
    category: "lifestyle",
    timeSlot: "afternoon",
    title: "🧹 청소 대폭발의 날",
    context:
      "빨래는 산더미, 책상은 난장판. 청소기를 돌릴까, “사람 사는 집이 다 그렇지” 하며 흐린 눈 할까?",
    choices: [
      {
        id: "clean",
        label: "신나는 음악 틀고 대청소 시작!",
        outcome: {
          immediateText:
            "음악에 맞춰 춤추며 청소 완료! 향초까지 켜니 공주 방이 따로 없다.",
          immediateDeltas: { fitness: 8, happiness: 20, stress: -15, fatigue: 12 },
          morningText: "[다음 날] 눈뜨자마자 보이는 깨끗한 방에 기분이 날아갈 듯.",
          morningDeltas: { happiness: 10, stress: -5 },
          reaction: "happy",
        },
      },
      {
        id: "defer",
        label: "눈에 보이는 것만 치우고 주말로 미룬다",
        outcome: {
          immediateText:
            "대충 정리는 했다. 완벽하진 않지만 이만하면 살만하다.",
          immediateDeltas: { fatigue: -5, stress: 3 },
          reaction: "normal",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 12. 비 오는 날 배달
  {
    id: "rainy_food",
    category: "diet",
    timeSlot: "evening",
    title: "🌧️ 비 오는 날, 배달음식의 유혹",
    context:
      "창밖에 빗소리가 후두둑. 떡볶이와 김치전 냄새가 뇌를 지배한다. 배달비 4천원이 조금 아깝지만...",
    choices: [
      {
        id: "delivery",
        label: "비 오는 날엔 떡볶이가 국룰! 배달 주문",
        outcome: {
          immediateText:
            "매콤달콤 떡볶이에 튀김까지 흡입 완료. 비 오는 날의 완벽한 힐링이었다.",
          immediateDeltas: { fullness: 20, happiness: 25, stress: -15, health: -5 },
          morningText:
            "[다음 날 아침]\n맵고 짠 음식 탓에 아침에 얼굴이 조금 빵빵해졌다.",
          morningDeltas: { fatigue: 12, health: -5 },
          reaction: "full",
        },
      },
      {
        id: "cook",
        label: "냉장고를 털어 김치전을 직접 부쳐 먹는다",
        outcome: {
          immediateText:
            "지글지글 소리와 함께 완성된 김치전! 요리 실력도 늘고 돈도 아꼈다.",
          immediateDeltas: { fullness: 15, happiness: 18, intelligence: 5, fitness: 4, stress: -10 },
          morningText:
            "[다음 날 아침]\n직접 해먹어서 그런지 속도 편안하다.",
          morningDeltas: { health: 6, happiness: 6 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 13. 직장 억울한 일
  {
    id: "workplace_unfair",
    category: "work",
    timeSlot: "evening",
    title: "💢 억울한 한 마디를 들은 날",
    context:
      "하지도 않은 일로 지적을 받았다. 하루 종일 속에서 천불이 난다. 이 분노를 어떻게 소화할까?",
    choices: [
      {
        id: "vent",
        label: "남자친구/절친에게 1시간 폭풍 수다로 털어낸다",
        outcome: {
          immediateText:
            "“쏘쏘 잘못 아니야!” 내 편이 되어준 사람 덕분에 묵은 체증이 싹 내려갔다.",
          immediateDeltas: { stress: -25, happiness: 15, fatigue: 5 },
          reaction: "happy",
        },
      },
      {
        id: "exercise",
        label: "분노의 홈트레이닝으로 땀으로 태운다",
        outcome: {
          immediateText:
            "스쿼트 100개, 플랭크 3분! 땀을 흘리니 나쁜 생각도 같이 빠져나갔다. 복근도 생길 기세.",
          immediateDeltas: { fitness: 15, stress: -20, health: 8, fatigue: 12 },
          morningText: "[다음 날] 어제 일 따위 가볍게 넘길 수 있는 멘탈 근육 장착 완료.",
          morningDeltas: { happiness: 8 },
          reaction: "athletic",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 14. 피부 트러블
  {
    id: "skin_trouble",
    category: "health",
    timeSlot: "morning",
    title: "🚨 이마에 뾰루지 발견!",
    context:
      "아침 거울을 보니 왕 뾰루지가 떡하니 자리잡았다. 주말에 중요한 일정이 있는데 비상사태다!",
    choices: [
      {
        id: "pimple",
        label: "짜고 싶은 욕망을 참고 패치 붙이고 물 2L 마시기",
        outcome: {
          immediateText:
            "성숙하게 참아냈다! 피부 진정 팩까지 올려주며 극진히 모셨다.",
          immediateDeltas: { health: 10, stress: -5, intelligence: 5 },
          morningText:
            "[다음 날 아침]\n붉은 기가 많이 가라앉았다. 손 안 댄 과거의 나, 너무 칭찬해!",
          morningDeltas: { happiness: 15, health: 5 },
          reaction: "proud",
        },
      },
      {
        id: "pop",
        label: "못 참고 톡 터뜨려버린다...",
        outcome: {
          immediateText:
            "시원한 것도 잠시, 붉은 자국이 더 커졌다. 눈앞이 깜깜하다...",
          immediateDeltas: { stress: 15, happiness: -15, health: -8 },
          morningText:
            "[다음 날 아침]\n흉터 관리 모드 돌입. 컨실러 두껍게 올리느라 출근 준비 늦었다.",
          morningDeltas: { stress: 10, fatigue: 10 },
          reaction: "shocked",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 15. 데이트룩 고민
  {
    id: "date_look",
    category: "romance",
    timeSlot: "afternoon",
    title: "🎀 데이트 날인데 입을 옷이 없다?!",
    context:
      "옷장이 터질 것 같은데 진짜 거짓말처럼 입을 옷이 하나도 없다. 약속 시간은 다가온다!",
    choices: [
      {
        id: "princess",
        label: "오늘은 공주풍 레이스 원피스 풀착장!",
        outcome: {
          immediateText:
            "공주 그 자체! 거울 속 자신에게 반해 셀카만 50장 찍었다. 남자친구 반응도 폭발적.",
          immediateDeltas: { happiness: 28, stress: -10 },
          morningText: "[다음 날] 어제 예뻤던 기억에 하루 종일 입꼬리가 올라간다.",
          morningDeltas: { happiness: 10 },
          reaction: "happy",
        },
      },
      {
        id: "casual",
        label: "편안한 청바지에 니트, 꾸안꾸로 간다",
        outcome: {
          immediateText:
            "편안하고 자연스러운 매력 폭발! 활동하기도 편해서 더 즐겁게 놀았다.",
          immediateDeltas: { happiness: 15, fatigue: -8, stress: -8 },
          reaction: "normal",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 16. 책 발견
  {
    id: "bookstore_find",
    category: "work",
    timeSlot: "afternoon",
    title: "📖 서점에서 꽂힌 자기계발서",
    context:
      "서점 구경 중 제목이 마음에 콕 박히는 책을 발견했다. “사서 진짜 읽을까, 아니면 또 장식용일까...”",
    choices: [
      {
        id: "buy_read",
        label: "구매하고 근처 카페에서 바로 100쪽 완독!",
        outcome: {
          immediateText:
            "밑줄 긋고 메모하며 몰입했다. 뇌가 업그레이드되는 짜릿한 기분!",
          immediateDeltas: { intelligence: 18, stress: -10, happiness: 12, fatigue: 5 },
          morningText:
            "[다음 날 아침]\n책에서 읽은 팁을 아침 루틴에 바로 적용해봤다. 똑똑해진 쏘쏘.",
          morningDeltas: { intelligence: 8, health: 5 },
          reaction: "studious",
        },
      },
      {
        id: "photo",
        label: "제목만 찍어두고 전자책으로 고민해본다",
        outcome: {
          immediateText:
            "일단 사진으로 킵! 충동구매는 막았지만 책 내용은 자꾸 아른거린다.",
          immediateDeltas: { intelligence: 3 },
          reaction: "normal",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 17. 흑역사 이불킥
  {
    id: "blanket_kick",
    category: "leisure",
    timeSlot: "night",
    title: "🛌 밤에 갑자기 떠오른 흑역사",
    context:
      "불 끄고 누웠는데 7년 전 그 말이 떠올랐다. 왜 그랬을까? 머리가 뜨거워지고 이불을 차기 시작한다.",
    choices: [
      {
        id: "overthink",
        label: "새벽 3시까지 자책 굴레에 빠진다...",
        outcome: {
          immediateText:
            "그때 그 사람 표정까지 재생되며 괴로움의 늪에 빠졌다. 흑역사는 잠들지 않는다.",
          immediateDeltas: { stress: 25, fatigue: 20, happiness: -15 },
          morningText:
            "[다음 날 아침]\n수면 부족으로 하루 종일 멍하다. “과거는 과거일 뿐...” 늦은 후회.",
          morningDeltas: { fatigue: 25, intelligence: -8 },
          reaction: "dizzy",
        },
      },
      {
        id: "laugh",
        label: "“ㅋㅋㅋ 내가 좀 귀여웠네” 하고 넘긴다",
        outcome: {
          immediateText:
            "피식 웃고 털어냈다. 사람 쏘쏘도 성장한 거다. 멘탈 갑으로 진화 중!",
          immediateDeltas: { stress: -12, intelligence: 10, happiness: 10 },
          morningText:
            "[다음 날 아침]\n개운하게 눈을 떴다. 과거의 쏘쏘에게 셀프 토닥토닥.",
          morningDeltas: { happiness: 12 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 18. SNS 비교
  {
    id: "sns_comparison",
    category: "romance",
    timeSlot: "evening",
    title: "💔 SNS 속 완벽한 사람들을 보며...",
    context:
      "동년배들은 다 성공하고 예쁘고 여행 다니는 것처럼 보인다. 왠지 나만 제자리걸음인 것 같아 울적해진다.",
    choices: [
      {
        id: "detox",
        label: "앱을 삭제하고 오늘 내가 해낸 것 3가지 적기",
        outcome: {
          immediateText:
            "나만의 기록을 보니 나도 꽤 잘 살고 있었다. 비교는 도둑이다, 내 삶을 사랑하자!",
          immediateDeltas: { happiness: 20, stress: -20, intelligence: 8 },
          morningText:
            "[다음 날 아침]\nSNS 대신 좋아하는 음악으로 아침을 열었다. 마음이 평화롭다.",
          morningDeltas: { happiness: 15, stress: -8 },
          reaction: "happy",
        },
      },
      {
        id: "scroll",
        label: "계속 스크롤하며 더 깊은 우울 속으로...",
        outcome: {
          immediateText:
            "눈은 아프고 마음은 쪼그라들었다. 완벽해 보이는 삶은 편집된 하이라이트일 뿐인데.",
          immediateDeltas: { happiness: -22, stress: 22, fatigue: 12 },
          morningText:
            "[다음 날 아침]\n기운 없이 시작한 하루. 따뜻한 차 한 잔이 절실하다.",
          morningDeltas: { fatigue: 15, stress: 10 },
          reaction: "tired",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 19. 낮잠의 딜레마
  {
    id: "nap_dilemma",
    category: "lifestyle",
    timeSlot: "afternoon",
    title: "😴 달콤한 낮잠 20분 vs 2시간 기절",
    context:
      "휴일 오후, 눈꺼풀이 천근만근. 20분 파워 낮잠일까, 아니면 영혼까지 내려놓고 잘까?",
    choices: [
      {
        id: "powernap",
        label: "알람 20분 맞춰두고 칼같이 일어난다",
        outcome: {
          immediateText:
            "눈이 번쩍! 뇌가 재부팅된 듯한 상쾌함. 남은 하루도 알차게 쓸 수 있다.",
          immediateDeltas: { fatigue: -30, intelligence: 10, happiness: 10 },
          reaction: "proud",
        },
      },
      {
        id: "longsleep",
        label: "알람 없이 세상 끝까지 잔다",
        outcome: {
          immediateText:
            "일어나니 벌써 해가 졌다. 여기가 어디지? 나는 누구? 몸이 물먹은 솜처럼 무겁다.",
          immediateDeltas: { fatigue: 15, intelligence: -5, stress: 5 },
          morningText:
            "[다음 날 아침]\n낮잠 여파로 밤에 잠을 설쳤다. 사이클이 완전 꼬였다...",
          morningDeltas: { fatigue: 20, health: -6 },
          reaction: "dizzy",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 20. 길고양이
  {
    id: "street_cat",
    category: "leisure",
    timeSlot: "evening",
    title: "🐱 저녁 산책길의 길고양이",
    context:
      "이어폰 꽂고 걷던 중, 공원 벤치 밑에서 동그란 눈 두 개가 쏘쏘를 올려다본다. “야옹~”",
    choices: [
      {
        id: "play",
        label: "쪼그려 앉아 츄르를 사고 눈인사를 나눈다",
        outcome: {
          immediateText:
            "할짝할짝 먹더니 쏘쏘 발목에 뺨을 비빈다. 심장이 녹아내렸다...",
          immediateDeltas: { happiness: 32, stress: -22, fatigue: 3 },
          morningText:
            "[다음 날 아침]\n고양이 영상 보며 웃는 쏘쏘. 하루의 시작이 행복으로 가득하다.",
          morningDeltas: { happiness: 12 },
          reaction: "happy",
        },
      },
      {
        id: "photo",
        label: "사진만 멀리서 예쁘게 찍고 발길을 돌린다",
        outcome: {
          immediateText:
            "폰 배경화면 감 귀여운 사진 획득! 랜선 집사로서 만족스러운 산책.",
          immediateDeltas: { happiness: 12, fitness: 5, stress: -8 },
          reaction: "happy",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 21. 새 취미
  {
    id: "new_hobby",
    category: "lifestyle",
    timeSlot: "afternoon",
    title: "🩰 성인 발레 원데이 클래스 신청?",
    context:
      "예쁜 발레복과 우아한 동작에 마음이 빼앗겼다. 유연성 제로인 내가 할 수 있을까? 수강료도 조금 있는데...",
    choices: [
      {
        id: "apply",
        label: "인생은 한 번! 핑크 발레복과 함께 신청",
        outcome: {
          immediateText:
            "첫 수업에서 다리는 후들거렸지만 너무 예쁘고 재밌었다! 공주력 최대치 충전 완료.",
          immediateDeltas: { fitness: 16, happiness: 24, stress: -12, fatigue: 14 },
          morningText:
            "[다음 날 아침]\n허벅지 안쪽이 당기지만 바른 자세로 걷는 내 모습이 제법 우아하다.",
          morningDeltas: { fitness: 6, health: 6 },
          reaction: "athletic",
        },
      },
      {
        id: "home",
        label: "유튜브 홈트 영상으로 먼저 맛만 본다",
        outcome: {
          immediateText:
            "거실에서 매트 깔고 따라 해봤다. 무료인데 꽤 알차다! 꾸준히 해볼까?",
          immediateDeltas: { fitness: 9, intelligence: 6, happiness: 10, stress: -8 },
          reaction: "studious",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 22. 엄마 반찬
  {
    id: "mom_food",
    category: "diet",
    timeSlot: "evening",
    title: "📦 엄마의 반찬 상자 도착",
    context:
      "집 앞에 묵직한 아이스박스가 와있다. 김치, 장조림, 불고기, 멸치볶음... 엄마 냄새가 난다.",
    choices: [
      {
        id: "cook_eat",
        label: "즉시 밥을 지어 엄마 반찬으로 풍성한 저녁 한상!",
        outcome: {
          immediateText:
            "한 입 먹는 순간 눈물이 핑. 진짜 집밥의 힘은 위대하다. 배도 마음도 꽉 찬 밤.",
          immediateDeltas: { fullness: 24, happiness: 26, health: 10, stress: -18 },
          morningText:
            "[다음 날 아침]\n속이 너무 편안하다. 역시 엄마 밥이 최고! 엄마한테 전화도 드렸다.",
          morningDeltas: { health: 8, happiness: 10 },
          reaction: "happy",
        },
      },
      {
        id: "save",
        label: "밀폐용기에 소분 정리하고 다음 식사로 킵",
        outcome: {
          immediateText:
            "냉장고가 든든해졌다! 앞으로 일주일 밥 걱정 끝. 살림 실력 레벨업.",
          immediateDeltas: { intelligence: 10, happiness: 14, fatigue: 6, stress: -8 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 23. 하루 종일 뒹굴
  {
    id: "lazy_day",
    category: "leisure",
    timeSlot: "night",
    title: "💤 하루 종일 아무것도 안 한 일요일 밤",
    context:
      "세수도 안 하고 침대에서 하루가 끝났다. 쉬어서 좋기도 하지만 '오늘 뭐 했지?' 자책감이 살짝 든다.",
    choices: [
      {
        id: "accept",
        label: "“완벽한 충전이었다!” 자기합리화 성공",
        outcome: {
          immediateText:
            "아무것도 안 하는 것도 용기다. 다음 주 달릴 연료를 가득 채웠다.",
          immediateDeltas: { fatigue: -35, stress: -15, happiness: 8 },
          morningText:
            "[다음 날 아침]\n월요일 아침인데 전혀 피곤하지 않다. 풀충전의 힘!",
          morningDeltas: { fatigue: -15, health: 6, happiness: 8 },
          reaction: "happy",
        },
      },
      {
        id: "regret",
        label: "내일부터 갓생 살겠다며 새벽까지 플래너 작성",
        outcome: {
          immediateText:
            "동기부여는 폭발! 하지만 플래너를 덮으니 새벽 2시... 몸이 계획을 못 따라간다.",
          immediateDeltas: { intelligence: 12, fatigue: 15, stress: 10 },
          morningText:
            "[다음 날 아침]\n알람 끄고 첫 미션부터 실패. 역시 계획은 짧게!",
          morningDeltas: { fatigue: 20, stress: 12 },
          reaction: "shocked",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },

  // 24. 헬스장 자존심
  {
    id: "gym_pride",
    category: "health",
    timeSlot: "afternoon",
    title: "🔥 옆 사람 때문에 붙은 헬스장 자존심",
    context:
      "평소 10kg 들던 덤벨. 옆자리의 고수가 가볍게 20kg을 드는 걸 본 순간 왠지 지기 싫어졌다.",
    choices: [
      {
        id: "push",
        label: "15kg에 도전! 나는야 공주 전사",
        outcome: {
          immediateText:
            "겨우 들었다! 표정 관리는 실패했지만 해냈다는 쾌감이 온몸을 감싼다.",
          immediateDeltas: { fitness: 20, health: 6, fatigue: 22, happiness: 14, stress: -8 },
          morningText:
            "[다음 날 아침]\n팔을 못 올리겠다... 근육통 폭풍이 찾아왔지만 거울 속 어깨 라인이 달라졌다.",
          morningDeltas: { fitness: 8, fatigue: 20 },
          reaction: "shocked",
        },
      },
      {
        id: "safe",
        label: "내 페이스대로 10kg 정석 자세에 집중",
        outcome: {
          immediateText:
            "다치지 않는 게 진짜 실력! 부상 없이 깔끔하게 운동을 마무리했다.",
          immediateDeltas: { fitness: 12, health: 10, intelligence: 6, fatigue: 10, stress: -10 },
          morningText:
            "[다음 날 아침]\n개운하고 통증 없이 하루를 시작한다. 롱런하는 지혜!",
          morningDeltas: { health: 6, happiness: 6 },
          reaction: "proud",
        },
      },
      {
        id: "custom",
        label: "기타 (직접 입력)",
        isCustomInput: true,
      },
    ],
  },
];
