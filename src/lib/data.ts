import { IMG } from "./assets";

export type Theme =
  | "With Allah"
  | "With Others"
  | "Knowledge"
  | "Plants"
  | "Environment";

export type Track = {
  n: number;
  title: string;
  translit?: string;
  meaning: string;
  theme: Theme;
  /** approximate length shown in the index; the player uses the real video duration */
  dur: string;
  /** official Omar & Hana YouTube video for this song */
  videoId: string;
  /** YouTube search fallback if the embed is unavailable */
  query: string;
  /** which official upload is embedded */
  source: string;
};

export const TRACKS: Track[] = [
  { n: 1, title: "Assalamu Alaikum", meaning: "Peace be upon you — the first word of a Muslim", theme: "With Others", dur: "2:14", videoId: "F7jMVVbSLm4", query: "Omar & Hana Assalamualaikum Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 2, title: "Alhamdulillah", meaning: "All praise belongs to Allah", theme: "With Allah", dur: "2:07", videoId: "-mftgTeb81Q", query: "Omar & Hana Alhamdulillah Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 3, title: "Bismillah", translit: "Bismillahirrahmanirrahim", meaning: "In the name of Allah, before every beginning", theme: "With Allah", dur: "2:03", videoId: "O3Bw_jU3Ws0", query: "Omar & Hana Bismillahirrahmanirrahim Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 4, title: "Loving Orphans", meaning: "Love the ones left with nobody", theme: "With Others", dur: "2:26", videoId: "RS74mqht3S4", query: "Omar & Hana Loving Orphans Islamic Songs for Kids", source: "Official · English" },
  { n: 5, title: "Fasting is Fun", meaning: "Ramadan discipline, set to a playground tune", theme: "With Allah", dur: "2:11", videoId: "xoWPec4mfbI", query: "Omar & Hana Fasting Is Fun Islamic Songs for Kids", source: "Official · English" },
  { n: 6, title: "Let's Go to the Masjid", meaning: "The mosque is our second home", theme: "With Allah", dur: "2:18", videoId: "_YXECwH_90g", query: "Omar & Hana Mari Ke Masjid Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 7, title: "Kongsi", translit: "Share", meaning: "The toy is better when it is passed along", theme: "With Others", dur: "2:16", videoId: "hJXVS4yHxiU", query: "Omar & Hana Kongsi Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 8, title: "Amanah", translit: "The Trust", meaning: "Keep whatever was placed in your hands", theme: "With Others", dur: "2:09", videoId: "2X7t3pxf_y0", query: "Omar & Hana Amanah Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 9, title: "Tolong Mama Papa", meaning: "Lend a hand at home before you are asked", theme: "With Others", dur: "2:12", videoId: "Iy2Lgc93jFY", query: "Omar & Hana Tolong Mama Papa Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 10, title: "Jom Jujur", translit: "Be Honest", meaning: "Honesty is what makes people trust you", theme: "With Others", dur: "2:09", videoId: "T9Xc3VxHVKs", query: "Omar & Hana Jom Jujur Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 11, title: "Sedekah", translit: "Sadaqah", meaning: "Giving purifies whatever remains", theme: "With Others", dur: "2:05", videoId: "hSM_7VXysrQ", query: "Omar & Hana Giving Sadaqah Misi Sedekah", source: "Official · English/Malay" },
  { n: 12, title: "Alif Ba Ta", meaning: "The letters the Qur'an is built from", theme: "Knowledge", dur: "2:04", videoId: "UMhHSWPnj3M", query: "Omar & Hana Alif Ba Ta Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 13, title: "Main Sama-Sama", translit: "Play Together", meaning: "Take turns, nobody sits out", theme: "With Others", dur: "2:08", videoId: "GLAEbUFHLU4", query: "Omar & Hana Main Sama-Sama Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 14, title: "Mari Berkebun", translit: "Let's Garden", meaning: "Plant it, water it, then leave the growth to Allah", theme: "Plants", dur: "2:01", videoId: "gz3zlX4O05c", query: "Omar & Hana Mari Berkebun Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 15, title: "Pembaziran", translit: "Don't Waste", meaning: "Nothing is thrown away before Allah", theme: "Environment", dur: "2:13", videoId: "VIbp9mx7tIU", query: "Omar & Hana Jangan Membazir Lagu Kanak-Kanak Islam", source: "Official · Malay" },
  { n: 16, title: "Mintalah Izin", translit: "Ask Permission", meaning: "Ask before you take what is not yours", theme: "With Others", dur: "1:58", videoId: "b-co3HIiy9U", query: "Omar & Hana Minta Izin Lagu Kanak-Kanak Islam", source: "Official · Malay" },
];

export const THEMES: (Theme | "All")[] = [
  "All",
  "With Allah",
  "With Others",
  "Knowledge",
  "Plants",
  "Environment",
];

export type Story = {
  title: string;
  blurb: string;
  img: string;
  meta: string;
  theme: string;
};

export const STORIES: Story[] = [
  {
    title: "The Seedling Promise",
    blurb:
      "Omar buries a single seed and wants the tree by tomorrow. Hana tells him to wait — and that the rain is not in his hands.",
    img: IMG.garden,
    meta: "5 min · Ages 3–6",
    theme: "Plants",
  },
  {
    title: "Dates at Maghrib",
    blurb:
      "Hana has waited all afternoon with her hand on the plate. When the adhan finally sounds, she learns what sabr tastes like.",
    img: IMG.iftar,
    meta: "6 min · Ages 4–7",
    theme: "Ramadan",
  },
  {
    title: "Moon over the Rooftop",
    blurb:
      "The first night of the month, two siblings count stars from the parapet and ask why the moon keeps coming back.",
    img: IMG.night,
    meta: "7 min · Ages 3–8",
    theme: "Bedtime",
  },
];

export type Word = {
  ar: string;
  latin: string;
  gloss: string;
  note: string;
};

export const WORDS: Word[] = [
  { ar: "سَلَام", latin: "Salam", gloss: "peace", note: "the greeting you give before you ask for anything" },
  { ar: "شُكْر", latin: "Shukr", gloss: "gratitude", note: "saying alhamdulillah with your hands and your feet" },
  { ar: "صَبْر", latin: "Sabr", gloss: "patience", note: "staying kind when the waiting is long" },
  { ar: "رَحْمَة", latin: "Rahma", gloss: "mercy", note: "being gentle with someone smaller than you" },
  { ar: "دُعَاء", latin: "Dua", gloss: "supplication", note: "talking to Allah in your own words" },
];

export const toSeconds = (mmss: string) => {
  const [m, s] = mmss.split(":").map(Number);
  return m * 60 + s;
};

export const fmt = (total: number) => {
  const t = Math.max(0, Math.floor(total));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
