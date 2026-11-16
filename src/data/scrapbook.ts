/**
 * Scrapbook data: one page per year of us (04 Nov 2017 → today), plus a finale.
 *
 * Photos come straight from src/assets/images/yearN (and storyContinues).
 * Videos are served from public/memories/videos (copies of the .mp4 files in those folders).
 *
 * Coordinates: x / y = top-left corner in % of the page, w = width in % of the page width,
 * r = rotation in degrees. The page is a 4:5 portrait board.
 * Photos up to w=40 are drawn ~1.38× wider than w (see Scrapbook.tsx), videos are drawn at w.
 */

// ── year 1 · Nov 2017 – Nov 2018
import y1a from "@/assets/images/year1/WhatsApp Image 2026-11-12 at 10.04.09 PM.jpeg";
import y1b from "@/assets/images/year1/begin1.jpeg";
import y1c from "@/assets/images/year1/begin2.jpeg";
import y1d from "@/assets/images/year1/together.jpeg";
// ── year 2
import y2a from "@/assets/images/year2/WhatsApp Image 2026-11-12 at 10.40.41 PM (1).jpeg";
import y2b from "@/assets/images/year2/begin3.jpeg";
import y2c from "@/assets/images/year2/close2.jpeg";
import y2d from "@/assets/images/year2/close3.jpeg";
// ── year 3
import y3a from "@/assets/images/year3/adventure1.jpeg";
import y3b from "@/assets/images/year3/adventure2.jpeg";
import y3c from "@/assets/images/year3/valentineSurprize.jpeg";
// ── year 4
import y4a from "@/assets/images/year4/WhatsApp Image 2026-11-12 at 10.15.34 PM.jpeg";
import y4b from "@/assets/images/year4/WhatsApp Image 2026-11-14 at 11.45.33 PM (2).jpeg";
import y4c from "@/assets/images/year4/devil.jpeg";
import y4d from "@/assets/images/year4/trio.jpeg";
// ── year 5 (+ mathura.mp4)
import y5a from "@/assets/images/year5/FirstTrip.jpeg";
import y5b from "@/assets/images/year5/WhatsApp Image 2026-11-12 at 10.40.42 PM (3).jpeg";
// ── year 6
import y6a from "@/assets/images/year6/celebrationParty(when she become CA).jpeg";
import y6b from "@/assets/images/year6/v1.jpeg";
import y6c from "@/assets/images/year6/WhatsApp Image 2026-11-12 at 10.40.43 PM (1).jpeg";
// ── year 7 (+ hairSet.mp4)
import y7a from "@/assets/images/year7/you+me.jpeg";
import y7b from "@/assets/images/year7/favourite.jpeg";
import y7c from "@/assets/images/year7/WhatsApp Image 2026-11-12 at 10.15.36 PM (1).jpeg";
// ── year 8
import y8a from "@/assets/images/year8/recentTrip.jpeg";
import y8b from "@/assets/images/year8/tripWithFriends.jpeg";
import y8c from "@/assets/images/year8/WhatsApp Image 2026-11-12 at 10.15.35 PM.jpeg";
import y8d from "@/assets/images/year8/WhatsApp Image 2026-11-12 at 10.40.44 PM.jpeg";
import y8e from "@/assets/images/year8/WhatsApp Image 2026-11-14 at 11.45.34 PM.jpeg";
// ── year 9 · Nov 2025 – Nov 2026
import y9a from "@/assets/images/year9/long1.jpeg";
import y9b from "@/assets/images/year9/WhatsApp Image 2026-11-12 at 10.15.37 PM (1).jpeg";
import y9c from "@/assets/images/year9/WhatsApp Image 2026-11-14 at 11.45.33 PM (4).jpeg";
import y9d from "@/assets/images/year9/WhatsApp Image 2026-11-15 at 12.31.02 AM.jpeg";
// ── the story continues (+ smile.mp4)
import sc1 from "@/assets/images/storyContinues/long2.jpeg";
import sc2 from "@/assets/images/storyContinues/WhatsApp Image 2026-11-12 at 10.15.37 PM (2).jpeg";
import sc3 from "@/assets/images/storyContinues/WhatsApp Image 2026-11-15 at 12.33.15 AM.jpeg";

const VIDEO = {
  mathura: "/memories/videos/mathura.mp4",
  hairSet: "/memories/videos/hairSet.mp4",
  smile: "/memories/videos/smile.mp4",
};

export type Tone = "paper" | "pink" | "butter" | "sage" | "lilac" | "sky" | "lined" | "kraft" | "none";
/** "phone" = photo shown as a video-call screen (cap = caller name) */
export type Look = "polaroid" | "clip" | "taped" | "round" | "arch" | "stamp" | "plain" | "postcard" | "phone";
export type DecoName =
  | "flower" | "daisy" | "lavender" | "leaf" | "heart" | "sparkle" | "tape" | "lace"
  | "string" | "ribbon" | "seal" | "envelope" | "postmark" | "passport" | "ticket"
  | "route"; // two map pins joined by a dotted line; text = [top city, bottom city, distance]

export interface Item {
  k: "photo" | "film" | "booth" | "note" | "title" | "sheet" | "deco" | "video";
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  z?: number;
  // photo / video: image URL or video path under /public
  src?: string;
  // film / booth
  srcs?: string[];
  look?: Look;
  ar?: number;
  cap?: string;
  // note / title
  text?: string | string[];
  tone?: Tone;
  font?: "hand" | "serif" | "type";
  fs?: number;
  list?: boolean;
  torn?: boolean;
  center?: boolean;
  em?: string;
  sub?: string;
  // deco
  d?: DecoName;
  c?: string;
}

export interface PageDef {
  title: string;
  bg: string;
  /** index into `chapters` (src/data/memories.ts) this page belongs to */
  chapter: number;
  items: Item[];
}

type O = Partial<Item>;
type Img = { src: string };
const ph = (img: Img, look: Look, x: number, y: number, w: number, r = 0, cap?: string, z?: number): Item => ({ k: "photo", src: img.src, look, x, y, w, r, cap, z });
const vd = (src: string, x: number, y: number, w: number, r = 0, cap?: string, ar?: number): Item => ({ k: "video", src, x, y, w, r, cap, ar });
const nt = (text: string[], x: number, y: number, w: number, o: O = {}): Item => ({ k: "note", text, x, y, w, ...o });
const dc = (d: DecoName, x: number, y: number, w: number, r = 0, o: O = {}): Item => ({ k: "deco", d, x, y, w, r, ...o });
const tt = (text: string, em: string, x: number, y: number, w: number, fs: number, o: O = {}): Item => ({ k: "title", text, em, x, y, w, fs, ...o });
const sh = (tone: Tone, x: number, y: number, w: number, h: number, o: O = {}): Item => ({ k: "sheet", tone, x, y, w, h, ...o });

export const pages: PageDef[] = [
  // ── Chapter 1 · 2017–18 (4 photos)
  { title: "Where it all began", bg: "wood", chapter: 0, items: [
    sh("paper", 3, 3, 94, 94),
    tt("Where it all", "began.", 7, 6, 34, 5, { sub: "04 · 11 · 2017" }),
    ph(y1a, "taped", 44, 6, 48, 3, "the very first page"),
    dc("flower", 4, 2, 8, 0, { c: "#c4414f" }),
    dc("lavender", 32, 22, 5, -8),
    ph(y1b, "polaroid", 5, 40, 20, -5),
    ph(y1c, "polaroid", 37, 45, 19, 3, "just us"),
    ph(y1d, "polaroid", 68, 39, 19, -3, "together"),
    dc("heart", 31, 42, 4, 0, { c: "#d98c97" }),
    dc("daisy", 86, 84, 9, 0, { c: "#f2cf5a" }),
    nt(["the first page of us ♡"], 22, 90, 56, { tone: "none", font: "hand", fs: 2.4, center: true }),
  ] },

  // ── Chapter 2 · 2018–19 (4 photos)
  { title: "Getting closer", bg: "sky", chapter: 1, items: [
    dc("string", 0, 2, 100, 0, { h: 6 }),
    ph(y2a, "clip", 5, 6, 20, -4),
    ph(y2b, "clip", 37, 7, 20, 3),
    nt(["a thousand", "little reasons", "to smile."], 70, 12, 26, { tone: "paper", font: "hand", fs: 2.1, torn: true, r: 3 }),
    dc("string", 0, 49, 100, 0, { h: 6 }),
    nt(["closer,", "every single day."], 4, 62, 27, { tone: "butter", font: "hand", fs: 2.1, r: -3 }),
    ph(y2c, "clip", 36, 53, 20, -2),
    ph(y2d, "clip", 66, 54, 22, 4),
    dc("lavender", 88, 30, 6, 12),
    dc("heart", 12, 84, 4, 0, { c: "#d98c97" }),
    dc("sparkle", 74, 40, 2.6, 0, { c: "#ffffff" }),
  ] },

  // ── Chapter 3 · 2019–20 (3 photos)
  { title: "Little adventures", bg: "linen", chapter: 2, items: [
    nt(["My love,", "I never knew a heart could", "feel this full until you walked in.", "Every little adventure with you", "turns into my favourite page.", "— forever yours ♡"], 5, 4, 48, { tone: "paper", font: "hand", fs: 1.75, torn: true, r: -1.5 }),
    dc("envelope", 58, 6, 36, 5, { c: "#e9b5ab" }),
    dc("flower", 90, 2, 8, 0, { c: "#ecd7ad" }),
    ph(y3a, "polaroid", 3, 40, 19, -4, "little adventures"),
    ph(y3c, "polaroid", 34, 36, 22, 2, "valentine surprise"),
    ph(y3b, "polaroid", 69, 42, 19, 4),
    dc("seal", 30, 84, 5, 0, { c: "#d9785f" }),
    dc("ribbon", 0, 90, 100, 0, { c: "#f0c0b6", h: 8 }),
    dc("leaf", 92, 70, 6, 10),
  ] },

  // ── Chapter 4 · 2020–21 (4 photos)
  { title: "Growing together", bg: "pink", chapter: 3, items: [
    sh("pink", 0, 70, 56, 30, { torn: true }),
    nt(["You are my", "today and all", "of my tomorrows."], 3, 4, 29, { tone: "lined", font: "hand", fs: 2, r: -2 }),
    ph(y4c, "polaroid", 35, 3, 20, -2, "my little devil"),
    dc("tape", 42, 1, 10, -5, { c: "#f0cf9c" }),
    ph(y4d, "polaroid", 69, 4, 17, 4, "the three of us"),
    ph(y4a, "polaroid", 4, 42, 19, -3),
    ph(y4b, "polaroid", 37, 50, 20, 2),
    nt(["reasons I love you", "your smile", "your kindness", "your endless support", "you, always."], 70, 60, 27, { tone: "kraft", font: "hand", fs: 1.8, list: true, torn: true, r: 1 }),
    dc("flower", 2, 30, 9, 0, { c: "#e8a6b8" }),
    dc("heart", 62, 52, 4, 0, { c: "#e7a6b3" }),
  ] },

  // ── Chapter 5 · 2021–22 (2 photos + mathura video)
  { title: "Our first trip", bg: "map", chapter: 4, items: [
    nt(["Our Great", "Adventure!", "Wherever the road goes,", "we'll go together."], 3, 5, 25, { tone: "paper", font: "hand", fs: 1.7, torn: true, r: -2 }),
    vd(VIDEO.mathura, 31, 6, 36, -1, "mathura ♡"),
    dc("tape", 43, 3, 11, -3),
    ph(y5a, "polaroid", 70, 5, 22, 4, "our first trip"),
    ph(y5b, "polaroid", 4, 40, 19, -4, "wandering"),
    dc("postmark", 74, 50, 14, 0, { text: ["MATHURA", "WITH LOVE"] }),
    dc("ticket", 56, 72, 34, -3, { text: ["ADMIT TWO", "OUR FIRST TRIP", "TOGETHER"] }),
    dc("passport", 34, 80, 18, 3, { text: ["PASSPORT", "FIRST TRIP", "TOGETHER"] }),
    dc("heart", 27, 36, 3.5, 0, { c: "#c0616b" }),
  ] },

  // ── Chapter 6 · 2022–23 (3 photos)
  { title: "Cheers to us", bg: "confetti", chapter: 5, items: [
    ph(y6a, "polaroid", 3, 5, 19, -5, "the day you became a CA"),
    ph(y6b, "polaroid", 37, 3, 19, 3),
    ph(y6c, "polaroid", 70, 6, 19, -3),
    dc("tape", 12, 3, 9, -6),
    dc("tape", 78, 4, 9, 5),
    tt("Cheers", "to us.", 6, 64, 50, 6.4),
    nt(["so proud of you,", "today and always."], 62, 68, 33, { tone: "butter", font: "hand", fs: 2.1, r: 3, torn: true }),
    dc("sparkle", 4, 90, 4, 0, { c: "#e8a0b0" }),
    dc("sparkle", 56, 62, 3, 0, { c: "#e0b24f" }),
    dc("sparkle", 92, 92, 3.4, 0, { c: "#7fb9ae" }),
    dc("heart", 54, 88, 4, 0, { c: "#e5899a" }),
  ] },

  // ── Chapter 7 · 2023–24 (3 photos + hairSet video)
  { title: "Our favourite chapters", bg: "lilac", chapter: 6, items: [
    ph(y7a, "taped", 4, 4, 20, -3, "you + me, always"),
    vd(VIDEO.hairSet, 36, 6, 30, 2, "hair day ♡"),
    ph(y7b, "polaroid", 70, 8, 18, 4, "the little things"),
    ph(y7c, "polaroid", 54, 52, 19, -3),
    nt(["same smile,", "every year."], 6, 68, 40, { tone: "none", font: "hand", fs: 3.4, center: true }),
    dc("flower", 90, 56, 8, 0, { c: "#b78bc4" }),
    dc("heart", 30, 60, 5, 0, { c: "#d98c97" }),
    dc("lavender", 6, 84, 5, -10),
  ] },

  // ── Chapter 8 · 2024–25 (5 photos)
  { title: "Postcards from us", bg: "sage", chapter: 7, items: [
    ph(y8a, "polaroid", 3, 4, 18, -4, "a recent trip"),
    ph(y8b, "polaroid", 35, 6, 20, 3, "with friends"),
    ph(y8c, "polaroid", 69, 3, 18, -2),
    ph(y8d, "polaroid", 8, 50, 18, 3),
    ph(y8e, "polaroid", 40, 52, 18, -3),
    nt(["Dear you,", "every place feels like", "home with you."], 71, 46, 26, { tone: "paper", font: "hand", fs: 1.9, r: -2, torn: true }),
    dc("ticket", 70, 74, 27, 2, { text: ["ADMIT TWO", "ONE ADVENTURE", "FOREVER"] }),
    dc("leaf", 94, 30, 5, 8),
    dc("tape", 44, 3, 9, 4),
  ] },

  // ── Chapter 9 · 2025–26 · long distance: me in Bengaluru, her in Gurgaon (4 photos)
  { title: "Miles apart, never far", bg: "sky", chapter: 8, items: [
    tt("Miles apart,", "never far.", 5, 4, 50, 4.6, { sub: "Bengaluru ⇄ Gurgaon" }),
    dc("route", 4, 20, 50, 0, { text: ["GURGAON", "BENGALURU", "~1,700 km"] }),
    ph(y9a, "phone", 57, 4, 25, 3, "Manvi ♡"),
    nt(["our long-distance rituals", "good morning texts", "\"did you eat?\"", "falling asleep on call", "counting days till we meet"], 5, 53, 44, { tone: "paper", font: "hand", fs: 1.55, list: true, torn: true, r: -1.5 }),
    nt(["my favourite screen ♡"], 58, 64, 36, { tone: "none", font: "hand", fs: 2, center: true }),
    ph(y9d, "polaroid", 4, 70, 18, -4, "when we finally met"),
    ph(y9b, "polaroid", 36, 69, 13, 3),
    ph(y9c, "polaroid", 66, 70, 13, -3),
    dc("heart", 31, 72, 3.5, 0, { c: "#d98c97" }),
    dc("sparkle", 92, 4, 2.6, 0, { c: "#ffffff" }),
  ] },

  // ── Chapter 9 · finale (3 photos + smile video)
  { title: "To be continued…", bg: "rose", chapter: 8, items: [
    ph(sc1, "polaroid", 3, 6, 18, -5),
    vd(VIDEO.smile, 34, 4, 32, -2, "that smile ♡"),
    ph(sc2, "polaroid", 70, 8, 18, 4),
    dc("envelope", 5, 56, 30, -3, { c: "#e9b5ab" }),
    ph(sc3, "polaroid", 64, 54, 20, 3, "always ♡"),
    nt(["with all my love ♡"], 38, 62, 24, { tone: "pink", font: "hand", fs: 2.3, r: -3, torn: true }),
    tt("To be", "continued…", 6, 76, 52, 5),
    dc("ribbon", 0, 93, 100, 0, { c: "#f3c9bf", h: 6 }),
    dc("lavender", 90, 44, 5, 12),
    dc("sparkle", 58, 56, 3, 0, { c: "#fff6e8" }),
  ] },
];

export const TOTAL_PAGES = pages.length;

/** Where each chapter's pages start in `pages`, and how many it has. */
export function chapterRanges(chapterCount: number) {
  return Array.from({ length: chapterCount }, (_, c) => {
    const start = pages.findIndex((p) => p.chapter === c);
    const count = pages.filter((p) => p.chapter === c).length;
    return { start: start === -1 ? 0 : start, count };
  });
}
