export type MemoryCategory = "Everyday" | "Adventure" | "Celebration" | "Little things";

export type Memory = {
  id: string;
  title: string;
  date: string;
  year: number;
  category: MemoryCategory;
  note: string;
  kind: "photo" | "video";
  color: "rose" | "sage" | "butter" | "lilac" | "sky";
  emoji: string;
  featured?: boolean;
};

// Used by MemoryGallery. One entry per year of us, starting 04 November 2017.
export const memories: Memory[] = [
  { id: "m1", title: "A little beginning", date: "2017-11-04", year: 2017, category: "Little things", note: "Every beautiful story has a first page.", kind: "photo", color: "rose", emoji: "♡", featured: true },
  { id: "m2", title: "Getting closer", date: "2018-11-04", year: 2018, category: "Everyday", note: "The ordinary days that became our favourite ones.", kind: "photo", color: "butter", emoji: "✿" },
  { id: "m3", title: "Little adventures", date: "2019-11-04", year: 2019, category: "Adventure", note: "Little adventures and a valentine surprise.", kind: "photo", color: "sage", emoji: "☼" },
  { id: "m4", title: "Growing together", date: "2020-11-04", year: 2020, category: "Little things", note: "My little devil, and the three of us.", kind: "photo", color: "lilac", emoji: "✧" },
  { id: "m5", title: "Our first trip", date: "2021-11-04", year: 2021, category: "Adventure", note: "Mathura, and the first of many trips.", kind: "video", color: "sky", emoji: "▶" },
  { id: "m6", title: "Cheers to us", date: "2022-11-04", year: 2022, category: "Celebration", note: "The day you became a CA.", kind: "photo", color: "rose", emoji: "✧" },
  { id: "m7", title: "Our favourite chapters", date: "2023-11-04", year: 2023, category: "Little things", note: "You + me, always.", kind: "video", color: "butter", emoji: "✿" },
  { id: "m8", title: "Postcards from us", date: "2024-11-04", year: 2024, category: "Adventure", note: "Trips, friends, and every place that felt like home.", kind: "photo", color: "sage", emoji: "♡" },
  { id: "m9", title: "Still choosing us", date: "2025-11-04", year: 2025, category: "Everyday", note: "Nine years, and the story keeps getting better.", kind: "photo", color: "lilac", emoji: "♡" },
];

// One chapter per year of us (each runs 04 Nov → 03 Nov). Scrapbook pages point at these by index.
export const chapters = [
  { year: "2017–18", title: "Where it all began", note: "The first page of our story.", number: "01" },
  { year: "2018–19", title: "Getting closer", note: "A thousand little reasons to smile.", number: "02" },
  { year: "2019–20", title: "Little adventures", note: "Finding our own kind of fun.", number: "03" },
  { year: "2020–21", title: "Growing together", note: "Learning, laughing, and showing up.", number: "04" },
  { year: "2021–22", title: "Our first trip", note: "New places, same us.", number: "05" },
  { year: "2022–23", title: "Cheers to us", note: "A reason to celebrate, forever.", number: "06" },
  { year: "2023–24", title: "Our favourite chapters", note: "A collection of little forever moments.", number: "07" },
  { year: "2024–25", title: "Postcards from us", note: "Every place feels like home with you.", number: "08" },
  { year: "2025–26", title: "Still choosing us", note: "Nine years, and the story keeps unfolding.", number: "09" },
];
