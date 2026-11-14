import React, { useEffect, useMemo, useState } from 'react';
import { Mic, Newspaper, Radio, Sparkles } from 'lucide-react';
import { LoveParticles } from './LoveParticles';
import { birthdayMusic } from '../utils/birthdayMusic';
import { ModernButterscotchCake } from './ModernButterscotchCake';

interface BalloonsAndCakeStageProps {
  onCakeBlownOut: () => void;
}

interface BalloonSpec {
  id: number;
  leftPercent: number;
  delayMs: number;
  durationMs: number;
  targetY: number;
  swayPx: number;
  color: string;
  shineColor: string;
}

const BALLOON_PALETTE = [
  { color: '#B91C1C', shineColor: '#FCA5A5' },
  { color: '#991B1B', shineColor: '#FECACA' },
  { color: '#E11D48', shineColor: '#FDA4AF' },
  { color: '#BE123C', shineColor: '#FECDD3' },
  { color: '#9F1239', shineColor: '#FB7185' },
  { color: '#DC2626', shineColor: '#FEE2E2' },
];

export const BalloonsAndCakeStage: React.FC<BalloonsAndCakeStageProps> = ({
  onCakeBlownOut,
}) => {
  const [phase, setPhase] = useState<'balloons' | 'blasting' | 'cake' | 'blown'>(
    'balloons'
  );
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    birthdayMusic.start();
  }, []);

  // 20 clearly placed heart balloons that float up leisurely and steadily
  const balloons = useMemo<BalloonSpec[]>(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const palette = BALLOON_PALETTE[i % BALLOON_PALETTE.length];
      return {
        id: i + 1,
        leftPercent: 8 + col * 19.5 + ((row % 2 === 0 ? 1 : -1) * 3),
        delayMs: i * 220,
        durationMs: 3800 + (i % 4) * 150,
        targetY: 7 + row * 8.5,
        swayPx: (i % 2 === 0 ? 1 : -1) * (18 + (i % 3) * 6),
        color: palette.color,
        shineColor: palette.shineColor,
      };
    });
  }, []);

  useEffect(() => {
    if (phase !== 'balloons') return;
    const totalArrivalMs = 19 * 220 + 4300;
    const blastTimer = setTimeout(() => {
      setPhase('blasting');
    }, totalArrivalMs);
    return () => clearTimeout(blastTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'blasting') return;
    const cakeTimer = setTimeout(() => {
      setPhase('cake');
    }, 950);
    return () => clearTimeout(cakeTimer);
  }, [phase]);

  const handleBlowCandle = () => {
    if (phase !== 'cake') return;
    setPhase('blown');

    // 5 seconds visible duration: at 4.2s fade out begins, at 5.0s opens next page
    setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    setTimeout(() => {
      onCakeBlownOut();
    }, 5000);
  };

  return (
    <section
      data-stage="balloons-cake"
      className={`relative h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-b from-[#F2E9D5] via-[#EAE0C8] to-[#DFD0B0] text-[#1C1510] flex flex-col justify-between items-center overflow-hidden select-none transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. REALISTIC VINTAGE ENGLISH NEWSPAPER PAPER TEXTURE & COLUMN GRID */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'radial-gradient(#3D2D1E 0.8px, transparent 0.8px), linear-gradient(90deg, rgba(40,28,18,0.08) 1px, transparent 1px)',
          backgroundSize: '12px 12px, 25% 100%',
        }}
      />

      {/* Subtle Paper Fold Line Across Center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] bg-[#2D1F14]/15 shadow-[0_1px_4px_rgba(0,0,0,0.12)] z-0"
      />

      {/* Outer Archival Broadsheet Border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1.5 sm:inset-3 border-2 border-[#2A1D12]/45 outline outline-1 outline-[#2A1D12]/25 outline-offset-2 z-0"
      />

      {/* FULL ENGLISH NEWSPAPER BACKGROUND ARTICLES LAYER (Clearly Visible Around & Behind) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 sm:inset-x-8 top-20 bottom-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 opacity-[0.28] text-[9.5px] sm:text-[10.5px] leading-snug font-display text-[#22170F] overflow-hidden select-none z-0 text-justify"
      >
        {/* Newspaper Column 1 */}
        <article className="border-r border-[#2A1D12]/45 pr-2.5 space-y-2">
          <h4 className="font-title font-bold text-[10px] sm:text-[11px] uppercase tracking-wider border-y border-[#2A1D12]/60 py-0.5 text-left">
            MORNING EDITION · NOV 20
          </h4>
          <p className="first-letter:text-lg first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
            Today&apos;s front-page bulletin brings joyous news from every corner of the studio. Readers gather to celebrate the golden 20th year of Anchor Purbasha, whose voice carries warmth and grace across every broadcast.
          </p>
          <p className="border-t border-dotted border-[#2A1D12]/40 pt-1.5">
            &ldquo;Rarely has a single smile illuminated both the newsroom and so many hearts at once,&rdquo; notes our Senior Desk Editor in today&apos;s commemorative dispatch.
          </p>
          <p className="hidden sm:block">
            WEATHER DESK: Clear starry skies from evening till dawn, with a 100% forecast of laughter, warm wishes, and timeless memories.
          </p>
        </article>

        {/* Newspaper Column 2 */}
        <article className="sm:border-r sm:border-[#2A1D12]/45 pr-1 sm:pr-2.5 space-y-2">
          <h4 className="font-title font-bold text-[10px] sm:text-[11px] uppercase tracking-wider border-y border-[#2A1D12]/60 py-0.5 text-left">
            STUDIO 1407 · LIVE PRESS
          </h4>
          <p className="first-letter:text-lg first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
            Special correspondents report twenty crimson balloons soaring above the press roof this morning as an official tribute to a truly extraordinary anchor and beloved soul.
          </p>
          <p className="border-t border-dotted border-[#2A1D12]/40 pt-1.5 italic">
            EDITOR&apos;S NOTE: Keep turning the pages of this keepsake edition—every headline today is written solely with love for Purbasha.
          </p>
        </article>

        {/* Newspaper Column 3 (Desktop/Tablet) */}
        <article className="hidden sm:block border-r border-[#2A1D12]/45 pr-2.5 space-y-2">
          <h4 className="font-title font-bold text-[11px] uppercase tracking-wider border-y border-[#2A1D12]/60 py-0.5 text-left">
            ARTS &amp; TELEVISION DESK
          </h4>
          <p className="first-letter:text-lg first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
            From breaking bulletins to quiet evening whispers, her poise behind the microphone has inspired admirers everywhere. Cameras stand ready at Studio 1407 for tonight&apos;s cake lighting ceremony.
          </p>
          <p className="border-t border-dotted border-[#2A1D12]/40 pt-1.5">
            CLASSIFIED WISH: To the most precious person in the world—may every dream come true today and forever.
          </p>
        </article>

        {/* Newspaper Column 4 (Desktop/Tablet) */}
        <article className="hidden sm:block space-y-2">
          <h4 className="font-title font-bold text-[11px] uppercase tracking-wider border-y border-[#2A1D12]/60 py-0.5 text-left">
            CHRONICLE ARCHIVES · 2006
          </h4>
          <p className="first-letter:text-lg first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
            Born on the twentieth day of November, our honored guest has turned every ordinary chapter since 14/07 into an unforgettable front-page treasure.
          </p>
          <p className="border-t border-dotted border-[#2A1D12]/40 pt-1.5 font-semibold">
            STOP PRESS: Stay tuned for the live candle wish broadcast at the center column.
          </p>
        </article>
      </div>

      <LoveParticles density="gentle" />

      {/* 2. AUTHENTIC ENGLISH NEWSPAPER MASTHEAD + NEWS CHANNEL HEADER */}
      <header className="relative z-20 w-full px-3 sm:px-6 pt-2.5 sm:pt-3.5 shrink-0">
        <div className="max-w-3xl mx-auto border-b-[3px] border-double border-[#1C1510] pb-1.5 bg-[#F2E9D5]/80 backdrop-blur-[1px] px-2">
          {/* Newspaper Dateline & Broadcast Top Strip */}
          <div className="flex items-center justify-between text-[8.5px] sm:text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#3F2E21] border-b border-[#1C1510]/50 pb-1 mb-1 font-number">
            <span className="flex items-center gap-1">
              <Newspaper className="w-3 h-3 text-[#7F1D1D]" />
              <span>VOL. XX · NO. 1407</span>
            </span>

            <span className="font-display italic font-bold text-[#1C1510] tracking-wider hidden sm:inline">
              THE DAILY CHRONICLE · ENGLISH EDITION
            </span>

            {/* Live News Channel Indicator */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#991B1B] text-white text-[8.5px] sm:text-[10px] font-extrabold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-200 animate-ping" />
              <span>ON AIR · LIVE TV</span>
            </span>
          </div>

          {/* Grand Broadsheet Title Bar */}
          <div className="flex items-center justify-between border-b border-[#1C1510]/35 pb-0.5">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#574232] hidden xs:inline sm:inline">
              NOV 20, 2006
            </span>
            <p className="font-title font-black text-sm sm:text-xl tracking-[0.2em] uppercase text-[#1C1510] mx-auto">
              THE ANCHOR TIMES
            </p>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#991B1B] hidden xs:inline sm:inline">
              SPECIAL ISSUE
            </span>
          </div>

          {/* When Cake/Blown Phase: Newspaper Feature Headline On Top */}
          {(phase === 'cake' || phase === 'blown') && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-xs font-extrabold tracking-[0.18em] uppercase text-[#991B1B] font-number">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>FRONT PAGE POST · STUDIO 1407</span>
                <Mic className="w-3 h-3" />
              </div>
              <h1 className="font-display font-bold text-xl sm:text-3xl md:text-4xl text-[#1A100B] tracking-tight leading-tight">
                Happy Birthday Anchor Purbasha
              </h1>
            </div>
          )}
        </div>
      </header>

      {/* 3. BALLOONS RISING PHASE: CENTERED ENGLISH NEWSPAPER FEATURE POST CLIPPING */}
      {(phase === 'balloons' || phase === 'blasting') && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 pointer-events-none">
          <article className="w-full bg-[#FAF4E4]/95 border-2 border-[#1C1510] shadow-[0_16px_42px_rgba(28,21,16,0.28)] outline outline-1 outline-[#1C1510]/60 outline-offset-4 p-4 sm:p-6 text-center">
            {/* Newspaper Post Metadata Header */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C4534] border-b border-[#1C1510]/40 pb-1.5 mb-2.5 font-number">
              <span>SECTION A · PAGE 1</span>
              <span className="px-2 py-0.5 bg-[#991B1B] text-[#FFFBEB] tracking-widest flex items-center gap-1">
                <Mic className="w-2.5 h-2.5" />
                <span>FEATURE POST</span>
              </span>
              <span>SPECIAL PRESS</span>
            </div>

            {/* Newspaper Post Main Headline */}
            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-[3.4rem] text-[#140D08] leading-[1.12] tracking-tight mb-2.5">
              Happy Birthday{' '}
              <span className="block text-[#991B1B] italic font-serif mt-0.5">
                Anchor Purbasha
              </span>
            </h1>

            {/* Classic Newspaper Article Excerpt Inside the Post */}
            <div className="border-t border-b border-[#1C1510]/40 py-2.5 my-1 text-left sm:text-center">
              <p className="font-display text-xs sm:text-sm text-[#2C1F15] leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-[#991B1B] mr-1">
                  BREAKING DISPATCH —
                </span>
                May your 20th birthday shine as brightly as your voice on air. Twenty heart balloons ascend live across today&apos;s front page to celebrate every smile, dream, and milestone ahead of you.
              </p>
            </div>

            {/* Newspaper Post Footer */}
            <div className="flex items-center justify-center gap-2 mt-2 text-[10px] sm:text-xs font-display italic font-semibold text-[#5C4534] animate-pulse">
              <Radio className="w-3.5 h-3.5 text-[#991B1B]" />
              <span>Reported Live from Studio 1407 · By Soumik</span>
            </div>
          </article>
        </div>
      )}

      {/* 20 Heart Balloons Rising & Blasting Animation */}
      {(phase === 'balloons' || phase === 'blasting') && (
        <div
          aria-label="20 heart balloons rising"
          className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        >
          {balloons.map((b) => (
            <div
              key={b.id}
              data-testid="heart-balloon"
              className="absolute bottom-0 flex flex-col items-center"
              style={{
                left: `${b.leftPercent}%`,
                animation:
                  phase === 'blasting'
                    ? undefined
                    : `balloonRiseSlow ${b.durationMs}ms cubic-bezier(0.25, 1, 0.5, 1) ${b.delayMs}ms both`,
                ...(phase === 'balloons'
                  ? ({
                      '--target-y': `-${100 - b.targetY}vh`,
                      '--sway': `${b.swayPx}px`,
                    } as React.CSSProperties)
                  : {
                      top: `${b.targetY}vh`,
                    }),
              }}
            >
              {phase === 'blasting' && (
                <>
                  {/* Expanding Dual Shockwave Rings */}
                  <div
                    className="absolute -inset-4 rounded-full border-2 border-[#991B1B] pointer-events-none"
                    style={{ animation: 'blastRing 0.8s ease-out forwards' }}
                  />
                  <div
                    className="absolute -inset-2 rounded-full border border-amber-500 pointer-events-none"
                    style={{ animation: 'blastRing 0.95s ease-out 0.08s forwards' }}
                  />

                  {/* 8 Radiating Confetti & Star Shrapnel Particles */}
                  {[
                    { tx: '65px', ty: '-55px', rot: '220deg', color: '#991B1B', shape: '●' },
                    { tx: '-60px', ty: '-50px', rot: '-180deg', color: '#D97706', shape: '✦' },
                    { tx: '75px', ty: '30px', rot: '140deg', color: '#E11D48', shape: '■' },
                    { tx: '-70px', ty: '40px', rot: '-240deg', color: '#451A03', shape: '▲' },
                    { tx: '0px', ty: '-85px', rot: '360deg', color: '#B91C1C', shape: '❤' },
                    { tx: '45px', ty: '75px', rot: '-120deg', color: '#F59E0B', shape: '✦' },
                    { tx: '-45px', ty: '80px', rot: '270deg', color: '#E11D48', shape: '●' },
                    { tx: '0px', ty: '90px', rot: '-310deg', color: '#78350F', shape: '★' },
                  ].map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className="absolute pointer-events-none text-xs font-bold"
                      style={
                        {
                          '--tx': p.tx,
                          '--ty': p.ty,
                          '--rot': p.rot,
                          color: p.color,
                          animation: 'confettiFly 0.85s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                          animationDelay: `${(pIdx % 3) * 30}ms`,
                        } as React.CSSProperties
                      }
                    >
                      {p.shape}
                    </span>
                  ))}
                </>
              )}

              <div
                className="relative flex items-center justify-center drop-shadow-[0_12px_20px_rgba(120,25,25,0.3)]"
                style={{
                  animation:
                    phase === 'blasting'
                      ? 'balloonPopShatter 0.85s cubic-bezier(0.2, 0.9, 0.3, 1) forwards'
                      : undefined,
                }}
              >
                <svg
                  width="62"
                  height="58"
                  viewBox="0 0 24 24"
                  className="transition-transform"
                >
                  <defs>
                    <radialGradient id={`balloon-grad-${b.id}`} cx="35%" cy="30%" r="70%">
                      <stop offset="0%" stopColor={b.shineColor} />
                      <stop offset="60%" stopColor={b.color} />
                      <stop offset="100%" stopColor="#450A0A" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={`url(#balloon-grad-${b.id})`}
                  />
                </svg>

                <span className="absolute text-sm sm:text-base font-black text-white tabular-nums drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] -mt-1 font-number">
                  {b.id}
                </span>
              </div>

              {phase !== 'blasting' && (
                <div className="w-[1.5px] h-14 bg-gradient-to-b from-[#7F1D1D]/70 to-transparent" />
              )}
            </div>
          ))}

          {/* Celebration Flash on Balloon Blast */}
          {phase === 'blasting' && (
            <div
              className="fixed inset-0 pointer-events-none z-50 bg-gradient-to-b from-amber-100/50 via-white/60 to-rose-200/40"
              style={{ animation: 'celebrationFlash 0.75s ease-out forwards' }}
            />
          )}
        </div>
      )}

      {/* 4. CAKE PRINT FEATURE POST & LIVE STUDIO VIEWFINDER */}
      {(phase === 'cake' || phase === 'blown') && (
        <div className="relative z-20 flex-1 min-h-0 w-full max-w-lg mx-auto flex flex-col justify-between items-center px-4 my-1 transition-all duration-700 animate-in fade-in zoom-in-95">
          {/* Newspaper Featured Photo-Plate Framing Around Cake */}
          <div className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-center my-0.5 bg-[#FAF4E4]/75 border border-[#1C1510]/40 p-2 shadow-sm">
            {/* Subtle Broadcast Viewfinder Corner Brackets */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-3 inset-y-2">
              <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#7F1D1D]/70" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#7F1D1D]/70" />
              <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#7F1D1D]/70" />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#7F1D1D]/70" />
              <span className="absolute top-1 left-2 text-[8.5px] font-mono font-bold tracking-widest text-[#3F2E21] uppercase">
                FIG. 01 · FRONT PAGE POST
              </span>
              <span className="absolute top-1 right-2 text-[8.5px] font-mono font-bold tracking-widest text-[#991B1B] uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <span>CAM 01</span>
              </span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={handleBlowCandle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBlowCandle();
                }
              }}
              className="cursor-pointer focus:outline-none flex items-center justify-center w-full max-h-full"
              aria-label="Artisan Butterscotch Cake. Tap to blow candle."
            >
              <div className="w-full max-w-[250px] sm:max-w-[310px]">
                <ModernButterscotchCake isBlown={phase === 'blown'} />
              </div>
            </div>

            {/* Authentic English Newspaper Photo Caption Below Cake */}
            <p className="text-[9.5px] sm:text-[11px] font-display italic text-[#4A3525] border-t border-[#1C1510]/25 pt-0.5 mt-0.5 text-center">
              Special Correspondent Note: Wishing Anchor Purbasha an extraordinary year ahead.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-1.5 pt-1.5 pb-1 w-full max-w-md mx-auto">
            {phase === 'cake' ? (
              <button
                type="button"
                onClick={handleBlowCandle}
                className="px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#B91C1C] hover:from-[#6B1515] hover:to-[#991B1B] text-[#FFFBEB] font-bold text-xs sm:text-sm shadow-lg shadow-[#231811]/25 border border-amber-200/40 transition-all active:scale-95 cursor-pointer flex items-center gap-2 font-number uppercase tracking-wider"
              >
                <Mic className="w-4 h-4 text-amber-300" />
                <span>Tap here to blow the candle</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>
            ) : (
              <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 px-3 py-1.5 rounded-sm bg-[#FAF4E4]/95 border-2 border-[#1C1510] shadow-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#991B1B] text-white text-[9.5px] font-bold uppercase tracking-widest mb-1">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>STOP PRESS · BIRTHDAY WISH</span>
                  <Sparkles className="w-3 h-3 text-amber-200" />
                </div>
                <p className="font-script text-3xl sm:text-4xl text-[#7F1D1D] drop-shadow-xs leading-tight">
                  &ldquo;May all your wishes come true, Purbasha...&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. BOTTOM NEWS CHANNEL BREAKING TICKER STRIP (Lower-Third Broadcast Bar) */}
      <footer className="relative z-20 w-full bg-[#1C120C] text-[#FAF3E3] border-t-2 border-[#991B1B] shrink-0 flex items-center h-7 sm:h-8 overflow-hidden shadow-inner">
        <div className="bg-[#991B1B] text-white font-extrabold text-[9px] sm:text-[11px] tracking-widest uppercase px-2.5 sm:px-3.5 h-full flex items-center gap-1.5 shrink-0 z-10 shadow-md font-number">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
          <span>BREAKING</span>
        </div>

        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="animate-news-ticker text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[#FDE68A] font-number">
            <span className="mx-6">
              ★ HAPPY BIRTHDAY ANCHOR PURBASHA · THE DAILY CHRONICLE FRONT PAGE ★
            </span>
            <span className="mx-6 text-rose-200">
              ✦ LIVE FROM STUDIO 1407 · THE VOICE THAT LIGHTS UP EVERY HEART ✦
            </span>
            <span className="mx-6">
              ★ TODAY&apos;S TOP POST: WISHING YOU ENDLESS JOY, SUCCESS &amp; MAGIC ★
            </span>
            <span className="mx-6">
              ★ HAPPY BIRTHDAY ANCHOR PURBASHA · THE DAILY CHRONICLE FRONT PAGE ★
            </span>
            <span className="mx-6 text-rose-200">
              ✦ LIVE FROM STUDIO 1407 · THE VOICE THAT LIGHTS UP EVERY HEART ✦
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
};
