# Our Little Universe — Phase 1

A scrapbook-style birthday memory website for Manvi, built with Next.js App Router, TypeScript, Tailwind CSS v4 and Motion.

## Included in Phase 1

- Interactive envelope and letter-opening intro
- Scrapbook-inspired homepage
- Eight-chapter relationship timeline (04 October 2018 start date)
- Memory gallery with year/category filters
- Accessible photo-story modal using clearly-labelled placeholders
- Optional music player UI (add your licensed audio file later)
- Responsive navigation and mobile layout
- Mock data kept separate from UI
- Reduced-motion support

No database, authentication or uploads are connected yet. Those belong to later phases.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add your own media

1. Put your own images in `public/memories/`.
2. Update `src/data/memories.ts` with each image path, date, title and story.
3. Put an audio file you have permission to use in `public/music/our-song.mp3`.
4. In `src/components/MusicPlayer.tsx`, set `AUDIO_SRC` to `/music/our-song.mp3`.

The current gallery uses designed placeholders rather than pretending stock photos are your memories.

## Customize

- Relationship date: `src/lib/site.ts`
- Her name and site copy: `src/lib/site.ts`
- Chapters and sample memory data: `src/data/memories.ts`
- Colors, typography and scrapbook styles: `src/app/globals.css`

## Next phases

Phase 2: letters, milestones, memory detail routes and bucket list.
Phase 3: Supabase Auth, PostgreSQL, private Storage, signed media access and RLS policies.
Phase 4: accessibility, performance, end-to-end testing and deployment.

## Privacy note

Do not put private photos/videos into a public repository. The Phase 1 placeholders are local UI-only assets. Use private storage and authorization in Phase 3 before uploading personal media to a deployed site.
