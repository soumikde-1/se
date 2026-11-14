import React from 'react';
import { Download, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { LoveParticles } from './LoveParticles';

interface FinalWishStageProps {
  onReplay: () => void;
  isRecording?: boolean;
  autoSaveCountdown?: number | null;
  hasSavedVideo?: boolean;
  onStopAndSave?: () => void;
  onOpenSavedVideo?: () => void;
}

export const FinalWishStage: React.FC<FinalWishStageProps> = ({
  onReplay,
  isRecording = false,
  autoSaveCountdown = null,
  hasSavedVideo = false,
  onStopAndSave,
  onOpenSavedVideo,
}) => {
  return (
    <section
      data-stage="final-wish"
      className="relative h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-b from-[#FFF3F7] via-[#FFEAF1] to-[#FFDDE8] text-[#4A1525] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden select-none"
    >
      {/* Floating love hearts in gentle motion */}
      <LoveParticles density="gentle" />

      {/* Aesthetic Parchment / Letter Envelope Card */}
      <article className="relative z-10 w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-[2rem] border border-rose-200/90 bg-white/92 backdrop-blur-xl p-5 sm:p-10 shadow-[0_20px_50px_rgba(136,19,55,0.12)] text-center transition-all flex flex-col justify-between items-center">
        {/* Stylish SOPU Emblem Stamp */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-100/90 via-pink-100 to-rose-100/90 border border-rose-300 text-rose-900 shadow-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="font-title text-xs sm:text-sm font-black tracking-[0.35em] uppercase text-[#6B1834]">
            SOPU
          </span>
          <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        </div>

        {/* Elegant Script & Display Fonts */}
        <h1 className="font-script text-4xl sm:text-6xl text-[#6B1834] leading-tight">
          Happy <span className="font-number font-bold">20</span>th Birthday,
        </h1>
        <p className="font-title text-xl sm:text-2xl font-bold tracking-widest text-[#9F1239] mb-3">
          MY BABI
        </p>

        {/* Romantic Letter Text in Stylish Bengali Typography */}
        <div className="space-y-3 sm:space-y-4 font-bengali-stylish text-xs sm:text-sm md:text-[15px] text-[#2C0B17] leading-relaxed sm:leading-loose mb-3 text-center px-1">
          <p className="bg-gradient-to-r from-rose-950 via-[#4A0E24] to-rose-950 bg-clip-text text-transparent font-medium drop-shadow-xs">
            নতুন বছরটা তোমার অনেক সুন্দরভাবে, হাসিখুশি ও সুস্থভাবে কাটুক। কাজ, ক্যারিয়ার, পড়াশোনা, পরিবার আর আমাকে নিয়ে তোমার সামনের দিনগুলো ভীষণ শান্তিপূর্ণ ও সাফল্যে ভরা হোক—এই কামনাই করি।
          </p>

          <p className="bg-gradient-to-r from-rose-950 via-[#4A0E24] to-rose-950 bg-clip-text text-transparent font-medium drop-shadow-xs">
            তুমি আমার জীবনের সেই <span className="font-semibold text-rose-800 drop-shadow-[0_1px_2px_rgba(225,29,72,0.2)]">ধ্রুবতারা</span>, যার স্পর্শে আমার বিবর্ণ পৃথিবীটা <span className="font-semibold text-rose-800">নতুন রঙে ও রূপে</span> সেজে উঠেছে। যে মানুষটা একসময় হাসির ভাষা ভুলে গিয়েছিল, তার অধরে নতুন করে <span className="font-semibold text-rose-800">প্রাণের স্পন্দন ও হাসি</span> ফিরিয়ে এনেছ তুমিই। তাই তোমার জীবনের প্রতিটি বাঁকে, প্রতিটি সুখ-দুঃখের কাব্যে ছায়ার মতো আমি সবসময় তোমার পাশে আছি, আর <span className="font-semibold text-rose-800">অনন্তকাল</span> এভাবেই তোমার হাত ধরে থাকব।
          </p>

          <p className="italic font-display text-[#6B1834] text-xs sm:text-sm md:text-base pt-1 font-medium">
            "May your 20th year blossom with boundless joy, radiant mornings, gentle peace, and dreams that unfold even more beautifully than you could have ever imagined."
          </p>

          <div>
            <p className="font-script text-2xl sm:text-3xl text-[#881337]">
              Always and forever yours,
            </p>
            <p className="font-title text-sm sm:text-base font-bold tracking-widest text-[#4C0519] mt-0.5">
              SOUMIK
            </p>
          </div>
        </div>

        {/* Heart icon separator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-[1px] w-10 bg-rose-300" />
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <div className="h-[1px] w-10 bg-rose-300" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {isRecording && onStopAndSave && (
            <button
              type="button"
              onClick={onStopAndSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer uppercase font-number tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {autoSaveCountdown !== null
                  ? `Saving Video (${autoSaveCountdown}s)...`
                  : 'Save Video Now'}
              </span>
            </button>
          )}

          {hasSavedVideo && onOpenSavedVideo && (
            <button
              type="button"
              onClick={onOpenSavedVideo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer uppercase font-number tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Watch / Download Video</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6B1834] to-[#881337] hover:from-[#521127] hover:to-[#6B1834] text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-950/20 transition-all active:scale-95 cursor-pointer uppercase font-number tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Our Surprise</span>
          </button>
        </div>
      </article>
    </section>
  );
};
