import { useState } from "react";
import { sound } from "../../lib/sound";

export default function SoundToggle() {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggle = () => {
    const next = sound.toggleMute();
    setMuted(next);
    if (!next) sound.playClick();
  };

  return (
    <button
      onClick={handleToggle}
      className="princess-btn-secondary px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shrink-0"
      title={muted ? "효과음 켜기" : "효과음 끄기"}
    >
      <span>{muted ? "🔇" : "🔔"}</span>
      <span className="hidden sm:inline">{muted ? "소리 켬" : "소리 끔"}</span>
    </button>
  );
}
