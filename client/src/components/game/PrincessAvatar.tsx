import { useMemo } from "react";
import { AvatarReaction } from "../../types/game";

interface PrincessAvatarProps {
  reaction: AvatarReaction;
  moodText?: string;
  className?: string;
  size?: number;
}

const REACTION_LABELS: Record<AvatarReaction, string> = {
  happy: "행복해요 ✨",
  proud: "자랑스러워요 👑",
  tired: "피곤해요 💤",
  dizzy: "눈이 핑핑 돌아요 😵",
  starving: "배고파요 꼬르륵... 🍰",
  full: "너무 배불러요 🍓",
  shocked: "세상에 깜짝이야! 😱",
  studious: "집중 모드 작동 중 📚",
  athletic: "에너지 폭발! 🏃‍♀️",
  sleeping: "쿨쿨 숙면 중 😴",
  normal: "오늘도 좋은 하루 💖",
};

const RANDOM_SPEECHES: Record<AvatarReaction, string[]> = {
  happy: ["헤헤, 오늘 기분 진짜 최고야!", "핑크빛 에너지 풀충전 완료~", "이렇게만 살면 좋겠다!"],
  proud: ["역시 나야, 나 좀 멋있지?", "오늘 선택은 신의 한 수였어 👑", "셀프 칭찬 타임!"],
  tired: ["침대가 나를 부르고 있어...", "잠깐만 눈 좀 붙일게 zzz", "내일의 나야 부탁해..."],
  dizzy: ["머리가 빙글빙글...", "잠시 멍때리기 타임이 필요해", "에러 404: 정신을 찾을 수 없음"],
  starving: ["배에서 천둥소리 나는 중...", "달콤한 디저트 생각뿐...", "꼬르륵이 멈추지 않아!"],
  full: ["배 빵빵! 움직이기 싫다~", "먹는 게 남는 거야, 그치?", "행복한 식곤증이 몰려온다..."],
  shocked: ["말도 안 돼 진짜?!", "심장이 쿵쾅거려...", "예상 밖의 전개에 당황!"],
  studious: ["뇌 세포들이 열일 중!", "하나씩 차근차근 해보자", "오늘 읽은 거 메모해둬야지"],
  athletic: ["운동하니까 살아있는 느낌!", "체력은 곧 실력이다!", "땀 흘리고 샤워하는 게 최고~"],
  sleeping: ["쿨쿨... zzz...", "꿈에서도 공주님...", "깨우지 마세요 😴"],
  normal: ["오늘은 어떤 하루를 보낼까?", "내 편이 되어줘서 고마워 🌸", "작은 것부터 하나씩 해보자!"],
};

export default function PrincessAvatar({
  reaction,
  moodText,
  className = "",
  size = 180,
}: PrincessAvatarProps) {
  const speech = useMemo(() => {
    const list = RANDOM_SPEECHES[reaction] || RANDOM_SPEECHES.normal;
    return list[Math.floor(Math.random() * list.length)];
  }, [reaction]);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble */}
      <div className="relative mb-2 max-w-[280px]">
        <div className="princess-pill px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium text-pink-900 shadow-sm text-center leading-relaxed">
          {moodText ?? speech}
        </div>
        <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#fce7f3] border-r border-b border-pink-300" />
      </div>

      {/* Princess character stage */}
      <div className="relative animate-float">
        {/* Sparkles */}
        <span className="absolute -top-1 -left-2 text-xl animate-sparkle">✨</span>
        <span className="absolute -top-3 right-0 text-2xl animate-sparkle" style={{ animationDelay: "1s" }}>
          🌸
        </span>
        <span className="absolute bottom-2 -right-2 text-lg animate-sparkle" style={{ animationDelay: "1.5s" }}>
          💖
        </span>

        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="drop-shadow-lg overflow-visible"
        >
          <defs>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8d5a3f" />
              <stop offset="100%" stopColor="#5b341f" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffeedd" />
              <stop offset="100%" stopColor="#fed7c0" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="50%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <radialGradient id="stageGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fce7f3" stopOpacity="1" />
              <stop offset="85%" stopColor="#ffe4ec" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft aura stage */}
          <ellipse cx="100" cy="188" rx="80" ry="10" fill="#f9a8d4" opacity="0.3" />
          <circle cx="100" cy="100" r="92" fill="url(#stageGrad)" />

          {/* Back hair waves */}
          <path
            d="M52 108 Q38 135 62 170 Q78 185 86 160 Q80 130 84 100 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M148 108 Q162 135 138 170 Q122 185 114 160 Q120 130 116 100 Z"
            fill="url(#hairGrad)"
          />

          {/* Body / Princess dress */}
          <path
            d="M80 148 Q70 156 64 190 L136 190 Q130 156 120 148 Q100 152 80 148 Z"
            fill="url(#dressGrad)"
          />
          {/* Dress lace trim */}
          <path
            d="M66 188 Q80 184 100 188 Q120 184 134 188"
            stroke="#ffffff"
            strokeWidth="3"
            fill="none"
          />
          {/* Neck */}
          <rect x="94" y="128" width="12" height="24" rx="4" fill="url(#skinGrad)" />

          {/* Head */}
          <ellipse cx="100" cy="104" rx="38" ry="40" fill="url(#skinGrad)" />

          {/* Ears */}
          <ellipse cx="61" cy="106" rx="5" ry="7" fill="url(#skinGrad)" />
          <ellipse cx="139" cy="106" rx="5" ry="7" fill="url(#skinGrad)" />
          <circle cx="61" cy="108" r="2" fill="#f43f5e" opacity="0.4" />
          <circle cx="139" cy="108" r="2" fill="#f43f5e" opacity="0.4" />

          {/* Front hair / bangs */}
          <path
            d="M62 96 Q68 70 100 70 Q132 70 138 96 Q128 86 108 88 Q100 84 94 88 Q78 86 62 96 Z"
            fill="url(#hairGrad)"
          />
          {/* Side hair locks */}
          <path
            d="M63 94 Q56 116 66 142 Q72 136 70 114 Q70 98 63 94 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M137 94 Q144 116 134 142 Q128 136 130 114 Q130 98 137 94 Z"
            fill="url(#hairGrad)"
          />

          {/* Crown */}
          <g>
            <path
              d="M78 66 L86 52 L100 60 L114 52 L122 66 Z"
              fill="url(#crownGrad)"
              stroke="#d97706"
              strokeWidth="1.2"
            />
            <ellipse cx="100" cy="67" rx="22" ry="3.5" fill="#f59e0b" />
            <circle cx="86" cy="51" r="2.8" fill="#f43f5e" />
            <circle cx="100" cy="59" r="3" fill="#60a5fa" />
            <circle cx="114" cy="51" r="2.8" fill="#f43f5e" />
            <circle cx="93" cy="66" r="1.5" fill="#ffffff" />
            <circle cx="100" cy="66" r="1.5" fill="#ffffff" />
            <circle cx="107" cy="66" r="1.5" fill="#ffffff" />
          </g>

          {/* Blushing cheeks */}
          <ellipse cx="80" cy="116" rx="7" ry="4" fill="#fb7185" opacity="0.45" />
          <ellipse cx="120" cy="116" rx="7" ry="4" fill="#fb7185" opacity="0.45" />

          {/* Eyebrows */}
          <path d="M78 92 Q88 90 94 93" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M122 92 Q112 90 106 93" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* EXPRESSION LAYERS */}
          {reaction === "sleeping" ? (
            // Sleeping closed eyes + Zs
            <>
              <path d="M79 104 Q88 110 95 104" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M121 104 Q112 110 105 104" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M96 119 Q100 121 104 119" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
              <text x="142" y="80" fontSize="16" fill="#a855f7" fontWeight="bold" opacity="0.85">Z</text>
              <text x="156" y="68" fontSize="20" fill="#ec4899" fontWeight="bold" opacity="0.85">Z</text>
              <text x="170" y="52" fontSize="24" fill="#f43f5e" fontWeight="bold" opacity="0.9">Z</text>
            </>
          ) : reaction === "tired" ? (
            // Tired half-closed drooping eyes
            <>
              <path d="M78 103 Q86 109 96 106" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M122 103 Q114 109 104 106" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="87" cy="108" r="4" fill="#5b341f" />
              <circle cx="113" cy="108" r="4" fill="#5b341f" />
              <path d="M96 122 Q100 119 104 122" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* sweat drop */}
              <path d="M136 96 Q142 106 142 112 Q142 118 136 118 Q130 118 130 112 Q130 106 136 96 Z" fill="#60a5fa" opacity="0.8" />
            </>
          ) : reaction === "dizzy" ? (
            // Dizzy spiral eyes
            <>
              <g stroke="#5b341f" strokeWidth="2" fill="none" strokeLinecap="round">
                <path d="M84 104 A4 4 0 0 1 90 104 A6 6 0 0 1 84 110 A8 8 0 0 1 80 102" />
                <path d="M116 104 A4 4 0 0 1 122 104 A6 6 0 0 1 116 110 A8 8 0 0 1 112 102" />
              </g>
              <path d="M95 120 Q100 117 105 120" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
              <text x="140" y="86" fontSize="16" fill="#a855f7">💫</text>
            </>
          ) : reaction === "starving" ? (
            // Teary puppy eyes
            <>
              <circle cx="87" cy="104" r="7" fill="#5b341f" />
              <circle cx="85" cy="102" r="3" fill="#ffffff" />
              <circle cx="89" cy="106" r="1.5" fill="#ffffff" />
              <circle cx="113" cy="104" r="7" fill="#5b341f" />
              <circle cx="111" cy="102" r="3" fill="#ffffff" />
              <circle cx="115" cy="106" r="1.5" fill="#ffffff" />
              <path d="M96 123 Q100 118 104 123" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="116" rx="9" ry="5" fill="#fb7185" opacity="0.6" />
              <ellipse cx="120" cy="116" rx="9" ry="5" fill="#fb7185" opacity="0.6" />
              <text x="142" y="92" fontSize="20">🧁</text>
            </>
          ) : reaction === "full" ? (
            // Full content happy face
            <>
              <path d="M79 104 Q88 98 95 104" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M121 104 Q112 98 105 104" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M92 118 Q100 128 108 118 Z" fill="#f43f5e" />
              <path d="M95 120 Q100 126 105 120" stroke="#5b341f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="114" rx="10" ry="6" fill="#fb7185" opacity="0.6" />
              <ellipse cx="120" cy="114" rx="10" ry="6" fill="#fb7185" opacity="0.6" />
              <text x="136" y="88" fontSize="18">🍓</text>
            </>
          ) : reaction === "shocked" ? (
            // Shocked wide eyes + O mouth
            <>
              <circle cx="87" cy="104" r="8" fill="#ffffff" stroke="#5b341f" strokeWidth="2" />
              <circle cx="87" cy="104" r="3.5" fill="#5b341f" />
              <circle cx="113" cy="104" r="8" fill="#ffffff" stroke="#5b341f" strokeWidth="2" />
              <circle cx="113" cy="104" r="3.5" fill="#5b341f" />
              <ellipse cx="100" cy="123" rx="5" ry="8" fill="#5b341f" />
              <ellipse cx="100" cy="124" rx="3.5" ry="6" fill="#f43f5e" />
              <text x="140" y="86" fontSize="22" fontWeight="bold" fill="#f43f5e">!</text>
              <text x="148" y="80" fontSize="18" fontWeight="bold" fill="#f59e0b">!</text>
            </>
          ) : reaction === "studious" ? (
            // Round wire glasses + book
            <>
              <circle cx="87" cy="104" r="6" fill="#5b341f" />
              <circle cx="85" cy="102" r="2" fill="#ffffff" />
              <circle cx="113" cy="104" r="6" fill="#5b341f" />
              <circle cx="111" cy="102" r="2" fill="#ffffff" />
              <path d="M96 119 Q100 122 104 119" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Glasses */}
              <circle cx="87" cy="104" r="11" fill="none" stroke="#d97706" strokeWidth="2" />
              <circle cx="113" cy="104" r="11" fill="none" stroke="#d97706" strokeWidth="2" />
              <line x1="98" y1="104" x2="102" y2="104" stroke="#d97706" strokeWidth="2" />
              <line x1="76" y1="104" x2="68" y2="101" stroke="#d97706" strokeWidth="2" />
              <line x1="124" y1="104" x2="132" y2="101" stroke="#d97706" strokeWidth="2" />
              <text x="140" y="88" fontSize="20">📖</text>
            </>
          ) : reaction === "athletic" ? (
            // Pink sweatband + energetic
            <>
              {/* sweatband */}
              <rect x="70" y="77" width="60" height="7" rx="3" fill="#ec4899" />
              <circle cx="100" cy="80" r="4" fill="#fbbf24" />
              <circle cx="87" cy="104" r="6" fill="#5b341f" />
              <circle cx="85" cy="101" r="2.5" fill="#ffffff" />
              <circle cx="113" cy="104" r="6" fill="#5b341f" />
              <circle cx="111" cy="101" r="2.5" fill="#ffffff" />
              <path d="M93 118 Q100 127 107 118 Z" fill="#f43f5e" />
              <path d="M95 121 Q100 125 105 121" stroke="#5b341f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <text x="138" y="88" fontSize="20">⚡</text>
            </>
          ) : reaction === "proud" ? (
            // Smug closed eyes + tiny smirk
            <>
              <path d="M79 105 Q88 100 95 105" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M121 105 Q112 100 105 105" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M97 121 Q102 118 107 120" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
              <text x="140" y="86" fontSize="18">✨</text>
            </>
          ) : reaction === "happy" ? (
            // Happy sparkling eyes
            <>
              <path d="M78 103 Q87 97 96 103" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M122 103 Q113 97 104 103" stroke="#5b341f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M92 118 Q100 128 108 118 Z" fill="#f43f5e" />
              <path d="M95 120 Q100 126 105 120" stroke="#5b341f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <text x="136" y="88" fontSize="18">💖</text>
            </>
          ) : (
            // Normal gentle face
            <>
              <circle cx="87" cy="104" r="6" fill="#5b341f" />
              <circle cx="85" cy="102" r="2.5" fill="#ffffff" />
              <circle cx="113" cy="104" r="6" fill="#5b341f" />
              <circle cx="111" cy="102" r="2.5" fill="#ffffff" />
              <path d="M96 119 Q100 123 104 119" stroke="#5b341f" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Tiny nose */}
          <circle cx="100" cy="112" r="1.3" fill="#d4a58c" />
        </svg>
      </div>

      {/* Mood status pill */}
      <span className="mt-1 px-3 py-1 rounded-full text-xs font-semibold princess-pill text-pink-700 shadow-xs">
        {REACTION_LABELS[reaction]}
      </span>
    </div>
  );
}
