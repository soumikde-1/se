import memory1 from '../assets/images/memory_sunset_walk_1794405000705.jpg';
import memory2 from '../assets/images/memory_coffee_date_1794405000088.jpg';
import memory3 from '../assets/images/memory_starry_evening_1794405001067.jpg';
import memory4 from '../assets/images/memory_pink_bouquet_1794405001735.jpg';
import memory5 from '../assets/images/memory_rainy_umbrella_1794496866282.jpg';
import memory6 from '../assets/images/memory_sea_beach_1794496880629.jpg';
import memory7 from '../assets/images/memory_stargazing_camp_1794496894619.jpg';
import memory8 from '../assets/images/memory_sweet_whisper_1794496911408.jpg';
import memory9 from '../assets/images/memory_rooftop_promise_1794496925654.jpg';

export interface MemoryCard {
  id: number;
  title: string;
  subtitle: string;
  bengaliTitle: string;
  bengaliText: string;
  defaultSrc: string;
  animationName: string;
  animationDuration: string;
  theme: {
    name: string;
    foilGradient: [string, string, string, string];
    themeBadge: string;
    cardBorderClass: string;
    cardTopBgClass: string;
    drawerBgClass: string;
    iconColorClass: string;
    dotActiveClass: string;
    dotUnlockedClass: string;
    badgeBorderClass: string;
    nextBtnClass: string;
  };
}

export const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 1,
    title: 'Our Quiet Walk',
    subtitle: 'The path where time stood still',
    bengaliTitle: 'আমাদের প্রথম চোখের দেখা ও মিষ্টি স্মৃতি',
    bengaliText: 'সেই মিষ্টি বিকেলটা আজও আমার হৃদয়ে সবচেয়ে জীবন্ত। যখন প্রথম তোমার মুখে সেই লাজুক হাসি দেখেছিলাম, আমার পুরো পৃথিবী যেন থমকে গিয়েছিল। তোমার ওই এক চিলতে হাসি আজও আমার সমস্ত ক্লান্তির সেরা মলম।',
    defaultSrc: memory1,
    animationName: 'cardSmoothTiltGlideUnfold',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 1 · Rose Pink',
      foilGradient: ['#FDA4AF', '#F43F5E', '#E11D48', '#881337'],
      themeBadge: 'bg-rose-500/15 border-rose-400/50 text-rose-900',
      cardBorderClass: 'border-[#F43F5E] shadow-[0_20px_50px_rgba(244,63,94,0.45)]',
      cardTopBgClass: 'from-rose-50/90 to-pink-50/70',
      drawerBgClass: 'from-rose-950 via-rose-900 to-rose-900/95 border-rose-400/40',
      iconColorClass: 'fill-pink-400 text-pink-400',
      dotActiveClass: 'bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.65)]',
      dotUnlockedClass: 'bg-rose-400',
      badgeBorderClass: 'border-rose-300 text-rose-950',
      nextBtnClass: 'from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 border-rose-400/50 shadow-rose-950/40',
    },
  },
  {
    id: 2,
    title: 'Sweet Coffee Date',
    subtitle: 'Warm sips, endless laughs',
    bengaliTitle: 'একসাথে কাটানো সোনালী মুহূর্ত',
    bengaliText: 'তোমার সাথে এক কাপ কফি আর অন্তহীন গল্প। ঘড়ির কাঁটা কীভাবে নিঃশব্দে পেরিয়ে যেত, আমরা কেউ টেরই পেতাম না। সাধারণ এই দিনগুলোও তোমার ভালোবাসায় সোনার মতো উজ্জ্বল হয়ে উঠেছে।',
    defaultSrc: memory2,
    animationName: 'cardSmoothFloatWaveBloom',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 2 · Sunset Peach',
      foilGradient: ['#FDBA74', '#FB923C', '#EA580C', '#9A3412'],
      themeBadge: 'bg-orange-500/15 border-orange-400/50 text-orange-900',
      cardBorderClass: 'border-[#FB923C] shadow-[0_20px_50px_rgba(249,115,22,0.45)]',
      cardTopBgClass: 'from-orange-50/90 to-amber-50/70',
      drawerBgClass: 'from-orange-950 via-orange-900 to-orange-900/95 border-orange-400/40',
      iconColorClass: 'fill-orange-400 text-orange-400',
      dotActiveClass: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.65)]',
      dotUnlockedClass: 'bg-orange-400',
      badgeBorderClass: 'border-orange-300 text-orange-950',
      nextBtnClass: 'from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 border-orange-400/50 shadow-orange-950/40',
    },
  },
  {
    id: 3,
    title: 'Starry Conversations',
    subtitle: 'Under a sky full of promises',
    bengaliTitle: 'তারার আলোয় না-বলা কথা',
    bengaliText: 'তুমি আমার রাতের আকাশের সবচেয়ে উজ্জ্বল ধ্রুবতারা। জীবনের যেকোনো অন্ধকার মোড়ে তোমার স্মৃতি আর ভরসা আমাকে পথ দেখায়। আকাশের সব তারা মিলিয়েও তোমার হাসির আলোর সমান হতে পারবে না।',
    defaultSrc: memory3,
    animationName: 'cardSmoothTiltZoomUnfold',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 3 · Royal Indigo',
      foilGradient: ['#A5B4FC', '#6366F1', '#4338CA', '#1E1B4B'],
      themeBadge: 'bg-indigo-500/15 border-indigo-400/50 text-indigo-900',
      cardBorderClass: 'border-[#6366F1] shadow-[0_20px_50px_rgba(99,102,241,0.45)]',
      cardTopBgClass: 'from-indigo-50/90 to-blue-50/70',
      drawerBgClass: 'from-indigo-950 via-indigo-900 to-indigo-900/95 border-indigo-400/40',
      iconColorClass: 'fill-indigo-400 text-indigo-400',
      dotActiveClass: 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.65)]',
      dotUnlockedClass: 'bg-indigo-400',
      badgeBorderClass: 'border-indigo-300 text-indigo-950',
      nextBtnClass: 'from-indigo-600 via-indigo-500 to-blue-500 hover:from-indigo-500 hover:to-blue-400 border-indigo-400/50 shadow-indigo-950/40',
    },
  },
  {
    id: 4,
    title: 'Blooms of My Heart',
    subtitle: 'Every petal carries my love',
    bengaliTitle: 'আমার হৃদয়ের সব গোলাপ তোমার জন্য',
    bengaliText: 'পূর্বাশা, তোমার জন্মদিনে আমার একটাই গভীর প্রার্থনা—তোমার মুখে যেন আজীবন এই নিষ্পাপ হাসিটা অটুট থাকে। আমার জীবনের প্রতিটি নিঃশ্বাসে আমি তোমাকে ভালোবাসবো।',
    defaultSrc: memory4,
    animationName: 'cardSmoothHeartbeatBloom',
    animationDuration: '1.05s',
    theme: {
      name: 'Memory 4 · Electric Fuchsia',
      foilGradient: ['#F0ABFC', '#E879F9', '#C026D3', '#701A75'],
      themeBadge: 'bg-fuchsia-500/15 border-fuchsia-400/50 text-fuchsia-900',
      cardBorderClass: 'border-[#E879F9] shadow-[0_20px_50px_rgba(217,70,239,0.45)]',
      cardTopBgClass: 'from-fuchsia-50/90 to-pink-50/70',
      drawerBgClass: 'from-fuchsia-950 via-fuchsia-900 to-fuchsia-900/95 border-fuchsia-400/40',
      iconColorClass: 'fill-fuchsia-400 text-fuchsia-400',
      dotActiveClass: 'bg-fuchsia-600 shadow-[0_0_10px_rgba(192,38,211,0.65)]',
      dotUnlockedClass: 'bg-fuchsia-400',
      badgeBorderClass: 'border-fuchsia-300 text-fuchsia-950',
      nextBtnClass: 'from-fuchsia-600 via-fuchsia-500 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 border-fuchsia-400/50 shadow-fuchsia-950/40',
    },
  },
  {
    id: 5,
    title: 'Rainy Day Whisper',
    subtitle: 'One umbrella, infinite warmth',
    bengaliTitle: 'এক ছাতায় বৃষ্টির ভেজা গান',
    bengaliText: 'ঝুম বৃষ্টি আর তোমার পাশে এক ছাতার নিচে হেঁটে চলা। বৃষ্টির প্রতিটা ফোঁটায় যেন লেখা থাকে আমাদের নিঃশব্দ ভালোবাসার গল্প। তোমার কাঁধে আলতো ছোঁয়াতেই মন শান্ত হয়ে যায়।',
    defaultSrc: memory5,
    animationName: 'cardSmoothFloatWaveBloom',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 5 · Ocean Sky Cyan',
      foilGradient: ['#7DD3FC', '#38BDF8', '#0284C7', '#0C4A6E'],
      themeBadge: 'bg-sky-500/15 border-sky-400/50 text-sky-900',
      cardBorderClass: 'border-[#38BDF8] shadow-[0_20px_50px_rgba(14,165,233,0.45)]',
      cardTopBgClass: 'from-sky-50/90 to-cyan-50/70',
      drawerBgClass: 'from-sky-950 via-sky-900 to-sky-900/95 border-sky-400/40',
      iconColorClass: 'fill-sky-400 text-sky-400',
      dotActiveClass: 'bg-sky-600 shadow-[0_0_10px_rgba(2,132,199,0.65)]',
      dotUnlockedClass: 'bg-sky-400',
      badgeBorderClass: 'border-sky-300 text-sky-950',
      nextBtnClass: 'from-sky-600 via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 border-sky-400/50 shadow-sky-950/40',
    },
  },
  {
    id: 6,
    title: 'Golden Sunset Tide',
    subtitle: 'Where waves meet our silence',
    bengaliTitle: 'সমুদ্রের ঢেউ আর সোনালী গোধূলি',
    bengaliText: 'সৈকতে বসে অস্তগামী সূর্যের আলোয় তোমার মুখের শান্ত রূপ দেখা—আমার জীবনের শ্রেষ্ঠ দৃশ্য। তোমার হাত ধরে থাকলে মনে হয় অনন্তকাল এই ঢেউগুলোর মতোই শান্তিতে কাটিয়ে দিতে পারি।',
    defaultSrc: memory6,
    animationName: 'cardSmoothTiltGlideUnfold',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 6 · Golden Amber',
      foilGradient: ['#FDE68A', '#FBBF24', '#D97706', '#78350F'],
      themeBadge: 'bg-amber-500/15 border-amber-400/50 text-amber-900',
      cardBorderClass: 'border-[#FBBF24] shadow-[0_20px_50px_rgba(245,158,11,0.45)]',
      cardTopBgClass: 'from-amber-50/90 to-yellow-50/70',
      drawerBgClass: 'from-amber-950 via-amber-900 to-amber-900/95 border-amber-400/40',
      iconColorClass: 'fill-amber-400 text-amber-400',
      dotActiveClass: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.65)]',
      dotUnlockedClass: 'bg-amber-400',
      badgeBorderClass: 'border-amber-300 text-amber-950',
      nextBtnClass: 'from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 border-amber-400/50 shadow-amber-950/40',
    },
  },
  {
    id: 7,
    title: 'Stargazing in Meadows',
    subtitle: 'Dreaming under endless skies',
    bengaliTitle: 'সবুজ ঘাসে তারার মেলা',
    bengaliText: 'খোলা আকাশের নিচে ঘাসের ওপর শুয়ে তারার হিসাব গোনা, আর জোনাকির আলোয় তোমার দিকে অপলক তাকিয়ে থাকা। পৃথিবী যতই ব্যস্ত হোক, তোমার সান্নিধ্য আমার শান্তির ঠিকানা।',
    defaultSrc: memory7,
    animationName: 'cardSmoothTiltZoomUnfold',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 7 · Mystic Violet',
      foilGradient: ['#C4B5FD', '#8B5CF6', '#6D28D9', '#3B0764'],
      themeBadge: 'bg-violet-500/15 border-violet-400/50 text-violet-900',
      cardBorderClass: 'border-[#8B5CF6] shadow-[0_20px_50px_rgba(139,92,246,0.45)]',
      cardTopBgClass: 'from-violet-50/90 to-purple-50/70',
      drawerBgClass: 'from-violet-950 via-violet-900 to-violet-900/95 border-violet-400/40',
      iconColorClass: 'fill-violet-400 text-violet-400',
      dotActiveClass: 'bg-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.65)]',
      dotUnlockedClass: 'bg-violet-400',
      badgeBorderClass: 'border-violet-300 text-violet-950',
      nextBtnClass: 'from-violet-600 via-violet-500 to-purple-500 hover:from-violet-500 hover:to-purple-400 border-violet-400/50 shadow-violet-950/40',
    },
  },
  {
    id: 8,
    title: 'Intertwined Hands',
    subtitle: 'Held tight, never letting go',
    bengaliTitle: 'হাতে হাত রেখে অটুট অঙ্গীকার',
    bengaliText: 'তোমার নরম আঙুলগুলো যখন আমার হাতের মুঠোয় থাকে, পৃথিবীর সব ভয় আর সংশয় মিলিয়ে যায়। এই বন্ধন কোনোদিন আলগা হবে না, জীবনের প্রতিটি পদক্ষেপে আমি তোমার পাশে আছি।',
    defaultSrc: memory8,
    animationName: 'cardSmoothHeartbeatBloom',
    animationDuration: '1.05s',
    theme: {
      name: 'Memory 8 · Emerald Jade',
      foilGradient: ['#6EE7B7', '#10B981', '#059669', '#064E3B'],
      themeBadge: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-900',
      cardBorderClass: 'border-[#10B981] shadow-[0_20px_50px_rgba(16,185,129,0.45)]',
      cardTopBgClass: 'from-emerald-50/90 to-teal-50/70',
      drawerBgClass: 'from-emerald-950 via-emerald-900 to-emerald-900/95 border-emerald-400/40',
      iconColorClass: 'fill-emerald-400 text-emerald-400',
      dotActiveClass: 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.65)]',
      dotUnlockedClass: 'bg-emerald-400',
      badgeBorderClass: 'border-emerald-300 text-emerald-950',
      nextBtnClass: 'from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 border-emerald-400/50 shadow-emerald-950/40',
    },
  },
  {
    id: 9,
    title: 'Rooftop Promise',
    subtitle: 'Cozy whispers & forever dreams',
    bengaliTitle: 'আলোর ছাদ আর আজীবন থাকার কথা',
    bengaliText: 'আলোর মালায় সাজানো ছাদ আর হালকা শীতের চাদরে তোমার সাথে বসে থাকা। তুমি আমার বর্তমান, আমার ভবিষ্যৎ আর আমার গোটা পৃথিবী। তোমাকে ভালোবাসা আমার জীবনের শ্রেষ্ঠ প্রাপ্তি।',
    defaultSrc: memory9,
    animationName: 'cardSmoothTiltGlideUnfold',
    animationDuration: '0.95s',
    theme: {
      name: 'Memory 9 · Royal Crimson',
      foilGradient: ['#FCA5A5', '#EF4444', '#B91C1C', '#450A0A'],
      themeBadge: 'bg-red-500/15 border-red-400/50 text-red-900',
      cardBorderClass: 'border-[#EF4444] shadow-[0_20px_50px_rgba(239,68,68,0.48)]',
      cardTopBgClass: 'from-red-50/90 to-rose-50/70',
      drawerBgClass: 'from-red-950 via-red-900 to-red-900/95 border-red-400/40',
      iconColorClass: 'fill-red-400 text-red-400',
      dotActiveClass: 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.65)]',
      dotUnlockedClass: 'bg-red-400',
      badgeBorderClass: 'border-red-300 text-red-950',
      nextBtnClass: 'from-red-600 via-red-500 to-rose-500 hover:from-red-500 hover:to-rose-400 border-red-400/50 shadow-red-950/40',
    },
  },
];
