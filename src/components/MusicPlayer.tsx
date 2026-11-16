"use client";

import { Music2, Pause, Play } from "lucide-react";
import { TRACKS, toggleMusic, useMusicPlaying } from "@/lib/audio";

export function MusicPlayer() {
  const playing = useMusicPlaying();

  return (
    <div className="music-control">
      <button className="music-button" onClick={() => toggleMusic(TRACKS.lofi)} aria-label={playing ? "Pause music" : "Play music"}>
        {playing ? <Pause size={15} /> : <Play size={15} />}
        <Music2 size={15} />
        <span>{playing ? "Playing our song" : "Our little soundtrack"}</span>
      </button>
    </div>
  );
}
