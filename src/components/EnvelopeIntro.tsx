"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, Camera, Heart, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import birthdayPic from "@/assets/images/birthdayPic.jpeg";
import { TRACKS, playTrack } from "@/lib/audio";

const COLORS = ["#e8453c", "#f5a623", "#3a8fd9", "#5cb85c", "#e84a8a", "#f2c94c", "#8e5bd0", "#2fb5a8"];
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/* ───────────────────────── Party poppers + confetti + streamers ───────────────────────── */

function Cone({ id, a, b }: { id: string; a: string; b: string }) {
  const body = "M48 118 L12 20 Q48 6 84 20 Z";
  return (
    <svg viewBox="0 0 96 120" aria-hidden>
      <defs><clipPath id={id}><path d={body} /></clipPath></defs>
      <path d={body} fill={b} />
      <g clipPath={`url(#${id})`}>
        {[-20, 4, 28, 52, 76].map((x) => (
          <path key={x} d={`M${x} 0 L${x + 36} 122`} stroke={a} strokeWidth="11" />
        ))}
      </g>
      <ellipse cx="48" cy="20" rx="36" ry="8" fill="#6b1c24" />
    </svg>
  );
}

type PieceData = {
  id: number;
  ox: number;
  oy: number;
  tx: number;
  peak: number;
  bottom: number;
  fallX: number;
  spin: number;
  sway: number;
  swayDur: number;
  color: string;
  w: number;
  h: number;
  round: boolean;
  delay: number;
  dur: number;
  fallDur: number;
};

/* Burst out of the popper, drift down, then keep falling from the top forever */
function ConfettiPiece({ p, H }: { p: PieceData; H: number }) {
  const [falling, setFalling] = useState(false);
  const look = { width: p.w, height: p.h, background: p.color, borderRadius: p.round ? "50%" : 1, display: "block" } as const;

  if (!falling) {
    return (
      <motion.span
        className="confetti-piece"
        style={{ left: p.ox, top: p.oy }}
        initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
        animate={{ x: [0, p.tx, p.tx + p.sway], y: [0, p.peak, p.bottom], rotate: p.spin, opacity: 1 }}
        transition={{
          x: { duration: p.dur, delay: p.delay, times: [0, 0.2, 1], ease: ["easeOut", "easeInOut"] },
          y: { duration: p.dur, delay: p.delay, times: [0, 0.2, 1], ease: ["easeOut", "linear"] },
          rotate: { duration: p.dur, delay: p.delay, ease: "linear" },
          opacity: { duration: 0.1, delay: p.delay },
        }}
        onAnimationComplete={() => setFalling(true)}
      >
        <span style={look} />
      </motion.span>
    );
  }

  return (
    <motion.span
      className="confetti-piece"
      style={{ left: p.fallX, top: -24 }}
      initial={{ x: 0, y: 0, rotate: 0 }}
      animate={{ y: H + 48, x: [0, p.sway, -p.sway, 0], rotate: p.spin }}
      transition={{
        y: { duration: p.fallDur, ease: "linear", repeat: Infinity },
        x: { duration: p.swayDur, ease: "easeInOut", repeat: Infinity },
        rotate: { duration: p.fallDur / 1.6, ease: "linear", repeat: Infinity },
      }}
    >
      <span style={look} />
    </motion.span>
  );
}

function PartyBlast() {
  const { W, H, pieces, streamers } = useMemo(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    // approx. position of each popper's mouth
    const origins = { left: { x: 110, y: H - 80 }, right: { x: W - 110, y: H - 80 } };
    const count = W < 500 ? 60 : 100;

    const pieces: PieceData[] = Array.from({ length: count }, (_, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      const o = origins[side];
      const targetX = side === "left" ? rand(10, W * 0.7) : rand(W * 0.3, W - 10);
      const targetY = rand(30, H * 0.7);
      const w = rand(6, 13);
      const shape = Math.random();
      return {
        id: i,
        ox: o.x,
        oy: o.y,
        tx: targetX - o.x,
        peak: targetY - o.y,
        bottom: H + 30 - o.y,
        fallX: rand(0, W),
        spin: (Math.random() < 0.5 ? -1 : 1) * 360 * Math.ceil(rand(1, 3)),
        sway: rand(15, 45),
        swayDur: rand(2.5, 4.5),
        color: pick(COLORS),
        w,
        h: shape > 0.7 ? w : shape > 0.4 ? rand(3, 5) : rand(5, 9),
        round: shape > 0.7,
        delay: 0.3 + rand(0, 0.25),
        dur: rand(6, 11),
        fallDur: rand(7, 14),
      };
    });

    const streamers = Array.from({ length: 12 }, (_, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      const o = origins[side];
      const dir = side === "left" ? 1 : -1;
      const ex = o.x + dir * rand(W * 0.08, W * 0.45);
      const ey = rand(H * 0.06, H * 0.5);
      const amp = rand(18, 42);
      const phase = rand(0, Math.PI * 2);
      const waves = rand(2, 3.5);
      const N = 30;
      let d = "";
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        const x = o.x + (ex - o.x) * t + Math.sin(t * Math.PI * waves + phase) * amp * t * dir;
        const y = o.y + (ey - o.y) * t;
        d += `${k === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      return {
        id: i,
        d,
        ox: o.x,
        oy: o.y,
        color: COLORS[i % COLORS.length],
        width: rand(3.5, 6),
        delay: 0.3 + rand(0, 0.3),
        dur: rand(0.9, 1.6),
        waveAmp: rand(2, 4.5),
        waveDur: rand(2.5, 4.5),
      };
    });

    return { W, H, pieces, streamers };
  }, []);

  return (
    <div className="party-layer" aria-hidden>
      {/* streamers: drawn outward from the poppers, then vanish together with the cones */}
      <motion.svg
        className="party-streamers"
        viewBox={`0 0 ${W} ${H}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.7, 1], ease: "easeInOut" }}
      >
        {streamers.map((s) => (
          <g
            key={s.id}
            className="streamer-wave"
            style={
              {
                transformOrigin: `${s.ox}px ${s.oy}px`,
                "--amp": `${s.waveAmp}deg`,
                animationDuration: `${s.waveDur}s`,
                animationDelay: `${s.delay + s.dur}s`,
              } as React.CSSProperties
            }
          >
            <motion.path
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ pathLength: { duration: s.dur, delay: s.delay, ease: "easeOut" }, opacity: { duration: 0.1, delay: s.delay } }}
            />
          </g>
        ))}
      </motion.svg>

      {pieces.map((p) => (
        <ConfettiPiece key={p.id} p={p} H={H} />
      ))}

      {/* poppers: slide in, pop, then vanish */}
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          className={`popper popper-${side}`}
          initial={{ y: 130, opacity: 1, scale: 1 }}
          animate={{ y: [130, -10, 0, 0, 130], scale: [1, 1.12, 1, 1, 0.85], opacity: [1, 1, 1, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.1, 0.18, 0.7, 1], ease: "easeInOut" }}
        >
          {side === "left" ? <Cone id="cone-l" a="#d93a42" b="#fff8f2" /> : <Cone id="cone-r" a="#2f7fc4" b="#fff8f2" />}
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── Intro ───────────────────────── */

export function EnvelopeIntro({ onContinue }: { onContinue: () => void }) {
  const [opened, setOpened] = useState(false);

  // 5 seconds after opening, glide down to the birthday wish
  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(() => {
      document.getElementById("wish")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 5000);
    return () => clearTimeout(t);
  }, [opened]);

  return (
    <motion.section className="intro-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.02 }}>
      <div className="intro-grain" />
      {opened && <PartyBlast />}
      <div className="intro-topline"><span>A LITTLE SOMETHING FOR YOU</span><span>✳</span><span>MADE WITH LOVE</span></div>
      <div className="intro-center">
        <motion.div className="intro-kicker" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <Sparkles size={14} /> A note for my favourite person
        </motion.div>
        <motion.h1 initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
          Dear <em>{site.herName},</em>
        </motion.h1>
        <p className="intro-subtitle">I made a little place for all the pieces of us.</p>

        <button className={`envelope-stage ${opened ? "is-open" : ""}`} onClick={() => { if (!opened) { setOpened(true); playTrack(TRACKS.birthday); } }} aria-label="Open the birthday letter">
          <div className="envelope-body">
            <div className="envelope-back" />

            {/* letter now lives INSIDE the envelope, between back and front panels */}
            <motion.div
              className="letter-paper"
              animate={opened ? { y: -85 } : { y: 0 }}
              transition={{ duration: 0.9, delay: opened ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="letter-small">FOR YOU, ALWAYS</span>
              <Heart className="letter-heart" size={23} fill="currentColor" />
              <h2>Happy birthday,<br/><em>My Love.</em></h2>
            </motion.div>

            <div className="envelope-left" />
            <div className="envelope-right" />
            <div className="envelope-front" />
            <motion.div
              className="envelope-flap"
              animate={opened ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <motion.div className="wax-seal" animate={opened ? { scale: 0.4, opacity: 0, y: -15 } : { scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Heart size={21} fill="currentColor" />
            </motion.div>
          </div>
          <span className="envelope-click-label">{opened ? "YOUR LETTER IS OPEN" : "TAP TO OPEN"}</span>
        </button>

        <AnimatePresence mode="wait">
          {opened && (
              <>
              <BirthdayWish/>
              <motion.div className="intro-letter-copy" key="letter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.35 }}>
              <p>Some stories are too special to live only in our camera rolls.</p>
              <p>So I gathered a few little pieces of ours into one place — the smiles, the silly moments, the adventures, and everything in between.</p>
              <p className="signature">This is our story, {site.herName}. <Heart size={13} fill="currentColor" /></p>
              <button className="primary-button" onClick={(event) => { event.stopPropagation(); playTrack(TRACKS.lofi); onContinue(); }}>STEP INTO OUR WORLD <ArrowDown size={15} /></button>
            </motion.div>
            </>            
          )}
        </AnimatePresence>
      </div>
      <div className="intro-footer"><span>EST. 04 NOVEMBER 2017</span><span>ONE STORY · TWO HEARTS</span></div>
    </motion.section>
  );
}

function BirthdayWish() {
  const [photoMissing, setPhotoMissing] = useState(false);

  return (
    <section className="closing-note section" id="wish">
      {/* <div className="closing-stamp">
        <Heart size={23} fill="currentColor"/><span>ALWAYS & FOREVER</span>
      </div> */}
      {/* <span className="eyebrow">A BIRTHDAY LETTER</span> */}
      <div className="wish-layout">
        <figure className="wish-polaroid">
          {photoMissing ? (
            <div className="wish-photo wish-photo-placeholder" aria-label="Add a birthday photo">
              <Camera size={28}/>
              <small>ADD HER PHOTO HERE</small>
              <span>public/memories/birthday.jpg</span>
            </div>
          ) : (
            <img className="wish-photo" src={birthdayPic.src} alt={`${site.herName} on her birthday`} onError={() => setPhotoMissing(true)}/>
          )}
          <figcaption>{site.birthdayPhotoCaption}</figcaption>
        </figure>
        <div className="wish-letter">
          {site.birthdayWish.map((line) => <p key={line}>{line}</p>)}
          <div className="closing-signature">With all my love, <span>♡</span></div>
        </div>
      </div>
    </section>
  );
}