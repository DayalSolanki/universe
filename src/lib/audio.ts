"use client";

import { useSyncExternalStore } from "react";

export const TRACKS = {
  birthday: "/music/happy-birthday-piano.mp3",
  lofi: "/music/bairan-lofi.mp3",
} as const;

let audio: HTMLAudioElement | null = null;
let playing = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
    audio.addEventListener("play", () => { playing = true; emit(); });
    audio.addEventListener("pause", () => { playing = false; emit(); });
  }
  return audio;
}

/** Switch to a track and start it. Call from a click handler so browsers allow playback. */
export async function playTrack(src: string) {
  const a = getAudio();
  if (!a.src.endsWith(src)) {
    a.pause();
    a.src = src;
    a.currentTime = 0;
  }
  try {
    await a.play();
  } catch {
    // Autoplay blocked or file missing; the header button can retry.
  }
}

export async function toggleMusic(fallbackSrc: string) {
  const a = getAudio();
  if (playing) {
    a.pause();
  } else {
    await playTrack(a.src ? a.src : fallbackSrc);
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useMusicPlaying() {
  return useSyncExternalStore(subscribe, () => playing, () => false);
}
