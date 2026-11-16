"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Heart, Play, Search, X } from "lucide-react";
import { memories, type Memory } from "@/data/memories";
import { formatMemoryDate } from "@/lib/date";

const filters = ["All", "Everyday", "Adventure", "Celebration", "Little things"] as const;

export function MemoryGallery() {
  const [year, setYear] = useState("All years");
  const [category, setCategory] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Memory | null>(null);
  const years = ["All years", ...Array.from(new Set(memories.map((m) => String(m.year))))].sort((a,b) => a === "All years" ? -1 : Number(b)-Number(a));

  const visible = useMemo(() => memories.filter((m) => {
    const matchesYear = year === "All years" || String(m.year) === year;
    const matchesCategory = category === "All" || m.category === category;
    const matchesSearch = `${m.title} ${m.note} ${m.year}`.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  }), [year, category, search]);

  return (
    <section className="section gallery-section" id="memories">
      <div className="section-heading">
        <div><span className="eyebrow">THE MEMORY BOX</span><h2>Little moments,<br/><em>kept forever.</em></h2></div>
        <p>Some are big adventures. Some are tiny ordinary days. All of them are ours.</p>
      </div>
      <div className="gallery-toolbar">
        <div className="filter-pills" role="group" aria-label="Filter by category">
          {filters.map((f) => <button key={f} className={category === f ? "filter-pill active" : "filter-pill"} onClick={() => setCategory(f)}>{f}</button>)}
        </div>
        <div className="gallery-search">
          <Search size={15}/><input aria-label="Search memories" placeholder="Find a memory..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          <select aria-label="Filter by year" value={year} onChange={(e) => setYear(e.target.value)}>{years.map((y) => <option key={y}>{y}</option>)}</select>
        </div>
      </div>

      <div className="memory-grid">
        {visible.map((memory, index) => (
          <motion.button key={memory.id} className={`memory-card card-${memory.color} ${index % 4 === 1 ? "memory-card-offset" : ""}`} onClick={() => setSelected(memory)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: (index % 4) * 0.07 }} whileHover={{ y: -7, rotate: index % 2 ? 1 : -1 }}>
            <span className="memory-image-placeholder"><span className="placeholder-symbol">{memory.emoji}</span><span className="placeholder-note">YOUR PHOTO GOES HERE</span>{memory.kind === "video" && <span className="video-indicator"><Play size={13} fill="currentColor"/></span>}</span>
            <span className="memory-card-meta"><span>{formatMemoryDate(memory.date)}</span><Heart size={13}/></span>
            <strong>{memory.title}</strong>
            <span className="memory-card-note">{memory.note}</span>
          </motion.button>
        ))}
      </div>
      {visible.length === 0 && <div className="empty-state">No memories found. Try another year or search.</div>}
      <p className="gallery-footnote">A few empty frames, waiting for your favourite photographs.</p>

      <AnimatePresence>
        {selected && <motion.div className="lightbox-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
          <motion.div className="memory-detail" role="dialog" aria-modal="true" aria-label={selected.title} initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 18, scale: 0.98 }} onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close"><X size={19}/></button>
            <div className={`detail-art card-${selected.color}`}><span>{selected.emoji}</span><small>PLACE FOR YOUR MEMORY</small></div>
            <div className="detail-copy"><span className="eyebrow">{formatMemoryDate(selected.date)} · {selected.category}</span><h3>{selected.title}</h3><p>{selected.note}</p><span className="detail-placeholder-note">Replace this placeholder with your real photo, video and story.</span></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}
