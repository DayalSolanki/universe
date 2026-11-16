"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Heart } from "lucide-react";
import { chapters } from "@/data/memories";
import { chapterRanges } from "@/data/scrapbook";
import { Scrapbook } from "@/components/Scrapbook";

export function JourneyTimeline() {
  const [openPage, setOpenPage] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ranges = chapterRanges(chapters.length);
  const open = (index: number) => setOpenPage(ranges[index].start);
  const keyOpen = (index: number) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(index);
    }
  };

  return (
    <section className="section journey-section" id="journey">
      <div className="section-heading">
        <div><span className="eyebrow">CHAPTERS OF US</span><h2>Nine years,<br/><em>one beautiful story.</em></h2></div>
        <p>Turn the pages, take your time. Every year holds a little piece of our universe.</p>
      </div>
      <div className="timeline">
        {chapters.map((chapter, index) => {
          const pageCount = ranges[index].count;
          return <motion.article className={`timeline-row ${index % 2 ? "timeline-reverse" : ""}`} key={chapter.year} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55 }}>
            <div className="timeline-year is-clickable" role="button" tabIndex={0} onClick={() => open(index)} onKeyDown={keyOpen(index)} aria-label={`Open the ${chapter.year} scrapbook`}>
              <span>CHAPTER {chapter.number}</span><strong>{chapter.year}</strong>
            </div>
            <div className={`chapter-paper is-clickable chapter-${index % 5}`} role="button" tabIndex={0} onClick={() => open(index)} onKeyDown={keyOpen(index)} aria-label={`Open the ${chapter.year} scrapbook`}>
              <span className="chapter-tape"/>
              <span className="chapter-flower">{index % 2 ? "✿" : "✳"}</span>
              <span className="chapter-kicker">A PAGE FROM OUR STORY</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.note}</p>
              <span className="chapter-count"><BookOpen size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} />{pageCount} scrapbook page{pageCount === 1 ? "" : "s"} · tap to open</span>
              <span className="chapter-heart"><Heart size={15} fill="currentColor"/></span>
            </div>
          </motion.article>;
        })}
      </div>
      <div className="timeline-end"><span>AND THE STORY CONTINUES</span><Heart size={17} fill="currentColor"/></div>

      {mounted && createPortal(
        <AnimatePresence>
          {openPage !== null && <Scrapbook key="scrapbook" chapters={chapters} startPage={openPage} onClose={() => setOpenPage(null)} />}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}