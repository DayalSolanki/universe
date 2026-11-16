"use client";

import { useRef, useState } from "react";
import { Music2, Pause, Play, Volume2 } from "lucide-react";

// Add a licensed audio file at public/music/our-song.mp3 to enable playback.
const AUDIO_SRC = "";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  async function toggle() {
    if (!AUDIO_SRC) {
      setUnavailable(true);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        setUnavailable(false);
      } catch {
        setUnavailable(true);
      }
    }
  }

  return (
    <div className="music-control">
      {AUDIO_SRC && <audio ref={audioRef} src={AUDIO_SRC} loop onEnded={() => setPlaying(false)} />}
      <button className="music-button" onClick={toggle} aria-label={playing ? "Pause music" : "Play music"}>
        {playing ? <Pause size={15} /> : <Play size={15} />}
        <Music2 size={15} />
        <span>{playing ? "Playing our song" : "Our little soundtrack"}</span>
      </button>
      {unavailable && <span className="music-hint"><Volume2 size={12} /> Add your audio file to enable music.</span>}
    </div>
  );
}
