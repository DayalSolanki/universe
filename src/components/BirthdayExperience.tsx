"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Heart, Menu, X } from "lucide-react";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { MusicPlayer } from "@/components/MusicPlayer";
import { site } from "@/lib/site";
import { yearsTogether } from "@/lib/date";
import youAndMe from "@/assets/images/year7/you+me.jpeg";
import favourite from "@/assets/images/year7/favourite.jpeg";
import devil from "@/assets/images/year4/devil.jpeg";
import home1 from "@/assets/images/WhatsApp Image 2026-11-12 at 10.15.33 PM.jpeg";
import peaceLook from "@/assets/images/peaceLook.jpeg";
import trio from "@/assets/images/year4/trio.jpeg";

/* Hero polaroids: a new one comes to the front every 4 seconds */
const POLAROIDS = [
  { src: youAndMe.src, caption: "you + me, always", tone: "photo-rose" },
  { src: favourite.src, caption: "the little things", tone: "photo-sage" },
  { src: devil.src, caption: "my little devil", tone: "photo-rose" },
  { src: home1.src, caption: "home is you", tone: "photo-sage" },
  { src: peaceLook.src, caption: "peace out ✌", tone: "photo-rose" },
  { src: trio.src, caption: "the three of us", tone: "photo-sage" },
];

function HeroPolaroids() {
  const [frontIndex, setFrontIndex] = useState(0);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    // the top card moves to the bottom, so the next photo in order comes on top
    const t = setInterval(() => setFrontIndex((i) => (i + 1) % POLAROIDS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // match the CSS slot offsets for phones (≤650px) and larger screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width:650px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const n = POLAROIDS.length;
  const s = small ? 0.75 : 1;
  const pull = 200 * s;
  // a loosely fanned pile: slot 0 is the top card, the last slot is the bottom card
  const slot = (pos: number) => {
    const t = pos / (n - 1);
    return {
      x: (-48 + 96 * t) * s,
      y: (36 - 56 * t) * s,
      rotate: (pos % 2 === 0 ? -1 : 1) * (4 + 5 * t),
    };
  };

  return (
    <>
      {POLAROIDS.map((p, i) => {
        // 0 = top of the pile … n-1 = bottom
        const pos = (i - frontIndex + n) % n;
        const to = slot(pos);
        const from = slot(0);
        const leaving = pos === n - 1; // the card that was just on top
        return (
          <motion.div
            key={p.src}
            className="hero-polaroid"
            initial={false}
            animate={
              leaving
                ? // slide off the top to the side, then tuck under the pile
                  {
                    x: [from.x, from.x + pull, to.x],
                    y: [from.y, from.y - 14, to.y],
                    rotate: [from.rotate, 14, to.rotate],
                    zIndex: [n + 1, n + 1, 1],
                  }
                : // everyone else moves one step up the pile
                  { x: to.x, y: to.y, rotate: to.rotate, zIndex: n - pos }
            }
            transition={
              leaving
                ? { duration: 1.2, ease: "easeInOut", zIndex: { duration: 1.2, times: [0, 0.5, 0.5] } }
                : { duration: 0.9, ease: "easeInOut", zIndex: { duration: 0 } }
            }
          >
            <div className={`hero-photo ${p.tone}`}><img src={p.src} alt={p.caption} /></div>
            <span>{p.caption}</span>
          </motion.div>
        );
      })}
    </>
  );
}

export function BirthdayExperience() {
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const years = yearsTogether(site.relationshipStartDate);

  const nav = [
    { label: "Our story", href: "#story" },
    { label: "The journey", href: "#journey" },
    { label: "Memories", href: "#memories" },
    { label: "A wish", href: "#wish" },
  ];

  return (
    <>
      <AnimatePresence>{!entered && <EnvelopeIntro onContinue={() => setEntered(true)} />}</AnimatePresence>
      {entered && <motion.main className="site-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <header className="site-header">
          <a href="/" className="brand-mark"><span className="brand-icon"><Heart size={15} fill="currentColor"/></span><span>our little universe</span></a>
          {/* <nav className="desktop-nav">{nav.map((n) => <a href={n.href} key={n.href}>{n.label}</a>)}</nav> */}
          <div className="header-right"><MusicPlayer/><button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button></div>
          {menuOpen && <nav className="mobile-nav">{nav.map((n) => <a href={n.href} key={n.href} onClick={() => setMenuOpen(false)}>{n.label}</a>)}</nav>}
        </header>

        <section className="hero section" id="top">
          <div className="hero-copy" id="story">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>A SCRAPBOOK OF US · EST. 2017</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Our little<br/><em>universe.</em></motion.h1>
            <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{site.subtitle}</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <a className="primary-button" href="#journey">WANDER THROUGH OUR STORY <ArrowDown size={15}/></a>
              <span className="hero-handwritten">made for {site.herName} <Heart size={13} fill="currentColor"/></span>
            </motion.div>
            <div className="hero-stats"><div><strong>{years}</strong><span>years together*</span></div><i/><div><strong>∞</strong><span>little moments</span></div><i/><div><strong>1</strong><span>favourite person</span></div></div>
            <span className="stats-footnote">*Calculated from 04 November 2017.</span>
          </div>
          <div className="hero-art" aria-label="Decorative scrapbook photo placeholders">
            <div className="paper-note"><span>MY FAVOURITE</span><strong>kind of<br/>forever.</strong><Heart size={18} fill="currentColor"/></div>
            <HeroPolaroids/>
            <span className="hero-doodle doodle-one">✳</span><span className="hero-doodle doodle-two">♡</span><span className="hero-caption">a thousand tiny<br/>reasons to smile</span>
          </div>
          <a className="scroll-cue" href="#journey">SCROLL TO TURN THE PAGE <ArrowDown size={13}/></a>
        </section>

        <section className="quote-band"><span>“</span><p>Some people make ordinary moments feel like <em>the whole world.</em></p><span>”</span></section>
        <JourneyTimeline/>
        <footer className="site-footer"><span>MADE WITH A LITTLE EXTRA LOVE</span><Heart size={13} fill="currentColor"/><span>OUR LITTLE UNIVERSE · {new Date().getFullYear()}</span></footer>
      </motion.main>}
    </>
  );
}