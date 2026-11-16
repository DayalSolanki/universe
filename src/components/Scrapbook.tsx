"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { pages, TOTAL_PAGES, chapterRanges, type Item, type Look } from "@/data/scrapbook";
import "./scrapbook.css";

type Chapter = { year: number | string; number: number | string; title: string };

/* ───────────── main overlay ───────────── */

export function Scrapbook({ chapters, startPage, onClose }: { chapters: readonly Chapter[]; startPage: number; onClose: () => void }) {
  const [[index, dir], setState] = useState<[number, number]>([startPage, 0]);
  const ranges = chapterRanges(chapters.length);
  const chapterIdx = Math.max(0, ranges.findIndex((r) => index >= r.start && index < r.start + r.count));
  const chapter = chapters[chapterIdx];
  const range = ranges[chapterIdx];
  const page = pages[index];

  const step = (d: number) =>
    setState(([i]) => {
      const n = i + d;
      return n < 0 || n >= TOTAL_PAGES ? [i, 0] : [n, d];
    });
  const goTo = (n: number) => setState(([i]) => (n === i ? [i, 0] : [n, n > i ? 1 : -1]));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div className="sb-overlay" role="dialog" aria-modal="true" aria-label="Scrapbook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="sb-top">
        <button className="sb-back" onClick={onClose}><ArrowLeft size={15} /> BACK TO TIMELINE</button>
        <div className="sb-heading">
          <small>CHAPTER {chapter?.number} · {chapter?.year} · PAGE {index - range.start + 1} OF {range.count}</small>
          <strong>{page.title}</strong>
        </div>
        <button className="sb-close" onClick={onClose} aria-label="Close scrapbook"><X size={16} /></button>
      </div>

      <div className="sb-stage">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={index}
            className="sb-frame"
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 70, opacity: 0, rotate: d * 1.2 }),
              center: { x: 0, opacity: 1, rotate: 0 },
              exit: (d: number) => ({ x: -d * 70, opacity: 0, rotate: -d * 1.2 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <div className={`sb-board bg-${page.bg}`}>
              {page.items.map((it, i) => <ItemView key={i} it={it} z={i + 1} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sb-bottom">
        <button className="sb-arrow" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous page"><ChevronLeft size={18} /></button>
        <div className="sb-dots">
          {pages.map((p, i) => (
            <button key={i} className={`sb-dot ${i === index ? "on" : ""}`} onClick={() => goTo(i)} aria-label={`Page ${i + 1}: ${p.title}`} title={p.title} />
          ))}
        </div>
        <span className="sb-counter">{index + 1} / {TOTAL_PAGES}</span>
        <button className="sb-arrow" onClick={() => step(1)} disabled={index === TOTAL_PAGES - 1} aria-label="Next page"><ChevronRight size={18} /></button>
      </div>
    </motion.div>
  );
}

/* ───────────── items ───────────── */

function ItemView({ it, z }: { it: Item; z: number }) {
  const style: CSSProperties = { left: `${it.x}%`, top: `${it.y}%`, zIndex: it.z ?? z };
  if (it.w != null) {
    const grow = it.k === "photo" || it.k === "film" || it.k === "booth";
    const scale = !grow ? 1 : it.w > 40 ? 1.12 : 1.38;
    const w = Math.min(it.w * scale, 92);
    style.width = `${w}%`;
    if (it.x + w > 97) style.left = `${Math.max(2, 97 - w)}%`;
  }
  if (it.h != null) style.height = `${it.h}%`;
  if (it.r) style.transform = `rotate(${it.r}deg)`;

  let body: React.ReactNode = null;
  switch (it.k) {
    case "photo":
      body = <Photo src={it.src!} look={it.look!} ar={it.ar} cap={it.cap} />;
      break;
    case "film":
      body = (
        <div className="sb-film">
          {it.srcs!.map((s) => <Photo key={s} src={s} look="plain" ar={1.35} />)}
        </div>
      );
      break;
    case "booth":
      body = (
        <div className="sb-booth">
          {it.srcs!.map((s) => <Photo key={s} src={s} look="plain" ar={1.15} />)}
        </div>
      );
      break;
    case "note": {
      const lines = it.text as string[];
      body = (
        <div className={`sb-note tone-${it.tone ?? "paper"} n-${it.font ?? "hand"}${it.torn ? " torn" : ""}${it.center ? " center" : ""}`} style={{ "--fs": it.fs ?? 1.8 } as CSSProperties}>
          {lines.map((l, i) => (
            <p key={i} className={it.list && i === 0 ? "n-head" : undefined}>{it.list && i > 0 ? `♡ ${l}` : l}</p>
          ))}
        </div>
      );
      break;
    }
    case "title":
      body = (
        <div className="sb-title" style={{ "--fs": it.fs ?? 5 } as CSSProperties}>
          <h4>{it.text as string}<br />{it.em && <em>{it.em}</em>}</h4>
          {it.sub && <span>{it.sub}</span>}
        </div>
      );
      break;
    case "sheet":
      body = <div className={`sb-sheet tone-${it.tone ?? "paper"}${it.torn ? " torn" : ""}`} />;
      break;
    case "deco":
      body = <Deco it={it} />;
      break;
    case "video":
      body = <Video src={it.src!} cap={it.cap} ar={it.ar} />;
      break;
  }
  return <div className={`sb-item k-${it.k}`} style={style}>{body}</div>;
}

function Photo({ src, look, ar = 0.6, cap }: { src: string; look: Look; ar?: number; cap?: string }) {
  const [missing, setMissing] = useState(false);
  const [ratio, setRatio] = useState(Math.min(Math.max(ar, 0.5), 1.8));
  const hasCaptionSlot = look === "polaroid" || look === "clip" || look === "postcard";
  const isPhone = look === "phone";
  if (missing) return null;
  return (
    <figure className={`sb-photo sb-${look}`}>
      <div className="sb-img" style={{ aspectRatio: ratio }}>
        {isPhone && (
          // video-call overlay: caller name + timer on top, call buttons at the bottom
          <div className="sb-call" aria-hidden>
            <div className="sb-call-top"><strong>{cap ?? " "}</strong><span>● 02:47:15</span></div>
            <div className="sb-call-bar"><i className="c-btn" /><i className="c-btn c-end" /><i className="c-btn" /></div>
          </div>
        )}
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setMissing(true)}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (!naturalWidth || !naturalHeight) return;
            const natural = naturalWidth / naturalHeight;
            setRatio(Math.min(Math.max(natural, 0.5), 1.8));
          }}
        />
      </div>
      {isPhone ? null : hasCaptionSlot ? <figcaption>{cap ?? "\u00A0"}</figcaption> : cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  );
}

/* A video framed like a polaroid: plays muted on loop, tap to unmute */
function Video({ src, cap, ar }: { src: string; cap?: string; ar?: number }) {
  // with `ar` the frame keeps that shape (video is cropped to fill it); otherwise it follows the video
  const [ratio, setRatio] = useState(ar ?? 0.5625);
  const [muted, setMuted] = useState(true);
  return (
    <figure className="sb-photo sb-polaroid">
      <div className="sb-img" style={{ aspectRatio: ratio, cursor: "pointer" }} onClick={() => setMuted((m) => !m)} title={muted ? "Tap for sound" : "Tap to mute"}>
        <video
          src={src}
          autoPlay
          loop
          muted={muted}
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onLoadedMetadata={(event) => {
            const { videoWidth, videoHeight } = event.currentTarget;
            if (!ar && videoWidth && videoHeight) setRatio(Math.min(Math.max(videoWidth / videoHeight, 0.5), 1.4));
          }}
        />
      </div>
      <figcaption>{cap ?? " "}</figcaption>
    </figure>
  );
}

/* ───────────── decorations ───────────── */

function Flower({ c, n, center, thin }: { c: string; n: number; center: string; thin?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx="50" cy="25" rx={thin ? 5.5 : 12} ry={thin ? 21 : 22} fill={c} opacity=".93" stroke="#00000014" strokeWidth=".6" transform={`rotate(${(i * 360) / n} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r={thin ? 9 : 10} fill={center} />
    </svg>
  );
}

function Lavender() {
  return (
    <svg viewBox="0 0 40 120" aria-hidden>
      <path d="M20 120C20 80 19 40 20 6" stroke="#7d8f6a" strokeWidth="1.6" fill="none" />
      {Array.from({ length: 8 }, (_, i) => {
        const y = 16 + i * 9;
        return (
          <g key={i}>
            <ellipse cx="14.5" cy={y + 3} rx="4.2" ry="2.4" transform={`rotate(-30 14.5 ${y + 3})`} fill="#8e72b8" />
            <ellipse cx="25.5" cy={y} rx="4.2" ry="2.4" transform={`rotate(30 25.5 ${y})`} fill="#a58bc9" />
          </g>
        );
      })}
      <ellipse cx="20" cy="7" rx="2.4" ry="4" fill="#8e72b8" />
    </svg>
  );
}

function Leaf() {
  return (
    <svg viewBox="0 0 60 100" aria-hidden>
      <path d="M30 100C28 70 32 40 30 6" stroke="#8a9c80" strokeWidth="1.4" fill="none" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <ellipse cx="20" cy={22 + i * 13} rx="9" ry="6.5" fill="#a9bfa0" opacity=".95" transform={`rotate(-20 20 ${22 + i * 13})`} />
          <ellipse cx="40" cy={28 + i * 13} rx="9" ry="6.5" fill="#bcd0b3" opacity=".95" transform={`rotate(20 40 ${28 + i * 13})`} />
        </g>
      ))}
    </svg>
  );
}

function Deco({ it }: { it: Item }) {
  const c = it.c;
  const lines = (it.text as string[] | undefined) ?? [];
  switch (it.d) {
    case "flower": return <Flower c={c ?? "#c9585f"} n={8} center="#f1c35a" />;
    case "daisy": return <Flower c={c ?? "#fffaf0"} n={13} center="#f0c24b" thin />;
    case "lavender": return <Lavender />;
    case "leaf": return <Leaf />;
    case "heart":
      return <svg viewBox="0 0 24 24" aria-hidden><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill={c ?? "#d98c97"} /></svg>;
    case "sparkle":
      return <span className="d-sparkle" style={{ color: c, fontSize: `${it.w ?? 3}cqw` }}>✦</span>;
    case "tape":
      return <div className="d-tape" style={{ "--c": c } as CSSProperties} />;
    case "lace":
      return <div className="d-lace" />;
    case "string":
      return <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }} aria-hidden><path d="M0 1 Q50 9 100 1" fill="none" stroke="#8a6b57" strokeWidth="1.6" vectorEffect="non-scaling-stroke" /></svg>;
    case "ribbon":
      return (
        <svg viewBox="0 0 200 44" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }} aria-hidden>
          <path d="M0 30C30 0 60 0 90 22S150 44 200 10" fill="none" stroke={c ?? "#f0c0b6"} strokeWidth="16" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d="M0 26C30 -4 60 -4 90 18S150 40 200 6" fill="none" stroke="#ffffff55" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "seal":
      return <div className="d-seal" style={{ "--c": c } as CSSProperties}><Heart fill="currentColor" /></div>;
    case "envelope":
      return (
        <div className="d-env" style={{ "--c": c } as CSSProperties}>
          <i className="e-flap" /><i className="e-front" />
          <span className="e-seal"><Heart fill="currentColor" /></span>
        </div>
      );
    case "postmark":
      return <div className="d-postmark">{lines.map((l, i) => <span key={i}>{l}</span>)}</div>;
    case "passport":
      return <div className="d-passport" style={{ "--c": c } as CSSProperties}>{lines.map((l, i) => <span key={i}>{l}</span>)}</div>;
    case "ticket":
      return <div className="d-ticket">{lines.map((l, i) => <span key={i}>{l}</span>)}</div>;
    case "route": {
      const [top = "", bottom = "", dist = ""] = lines;
      const pin = (x: number, y: number, fill: string) => (
        <g transform={`translate(${x} ${y})`}>
          <path d="M0 0C-7-10-9-14-9-18a9 9 0 0 1 18 0c0 4-2 8-9 18z" fill={fill} />
          <circle cy="-18" r="3.4" fill="#fffaf0" />
        </g>
      );
      return (
        <svg viewBox="0 0 200 128" aria-hidden className="d-route">
          <rect x="1" y="1" width="198" height="126" rx="6" fill="#fffaf0" stroke="#d9c6af" strokeDasharray="4 3" />
          <path d="M52 38C120 30 150 60 120 76S70 96 148 106" fill="none" stroke="#b87580" strokeWidth="2.2" strokeDasharray="1 6" strokeLinecap="round" />
          {pin(52, 40, "#c0616b")}
          {pin(148, 108, "#3f6f8f")}
          <text x="66" y="28" fontSize="11" fill="#7a5a52" fontFamily="'Playfair Display',serif" letterSpacing="1.5">{top}</text>
          <text x="66" y="40" fontSize="9" fill="#a07e74" fontFamily="Caveat,cursive">she&apos;s here ♡</text>
          <text x="24" y="104" fontSize="11" fill="#7a5a52" fontFamily="'Playfair Display',serif" letterSpacing="1.5">{bottom}</text>
          <text x="24" y="116" fontSize="9" fill="#a07e74" fontFamily="Caveat,cursive">I&apos;m here</text>
          <g transform="translate(134 60)">
            <path d="M0 6s-7-4.5-7-9.5a3.9 3.9 0 0 1 7-2.4 3.9 3.9 0 0 1 7 2.4C7 1.5 0 6 0 6z" fill="#d98c97" />
          </g>
          <text x="146" y="66" fontSize="10" fill="#8a6b57" fontFamily="Caveat,cursive">{dist}</text>
        </svg>
      );
    }
    default:
      return null;
  }
}
