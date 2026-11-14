import React, { useCallback, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { LoveParticles } from './LoveParticles';

interface HappyBirthdayFinaleStageProps {
  onContinueToWish: () => void;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

const FIREWORK_PALETTE = [
  '#FDE68A', // Champagne Gold
  '#FBBF24', // Imperial Gold
  '#FDA4AF', // Rose Gold
  '#F472B6', // Royal Pink
  '#E9D5FF', // Celestial Lilac
  '#FFFFFF', // Diamond Sparkle
];

export const HappyBirthdayFinaleStage: React.FC<HappyBirthdayFinaleStageProps> = ({
  onContinueToWish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SparkParticle[]>([]);
  const timerRef = useRef<number | null>(null);

  const spawnFireworkBurst = useCallback((cx: number, cy: number, count = 42) => {
    const baseColor =
      FIREWORK_PALETTE[Math.floor(Math.random() * FIREWORK_PALETTE.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
      const speed = 1.4 + Math.random() * 4.2;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.014,
        color: i % 3 === 0 ? '#FFFFFF' : baseColor,
        size: 1.4 + Math.random() * 2.2,
      });
    }
  }, []);

  const scheduleAutoContinue = useCallback(
    (delayMs = 7800) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        onContinueToWish();
      }, delayMs);
    },
    [onContinueToWish]
  );

  useEffect(() => {
    scheduleAutoContinue(7800);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [scheduleAutoContinue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial celebratory twin bursts on stage entrance
    spawnFireworkBurst(window.innerWidth * 0.25, window.innerHeight * 0.25, 36);
    spawnFireworkBurst(window.innerWidth * 0.75, window.innerHeight * 0.28, 36);

    const autoBurstInterval = window.setInterval(() => {
      const rx = window.innerWidth * (0.18 + Math.random() * 0.64);
      const ry = window.innerHeight * (0.14 + Math.random() * 0.42);
      spawnFireworkBurst(rx, ry, 34);
    }, 1350);

    let rafId = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // graceful gravity arc
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = window.requestAnimationFrame(render);
    };
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.clearInterval(autoBurstInterval);
      window.cancelAnimationFrame(rafId);
    };
  }, [spawnFireworkBurst]);

  const handleStageTap = (e: React.MouseEvent<HTMLElement>) => {
    spawnFireworkBurst(e.clientX, e.clientY, 44);
    scheduleAutoContinue(7800);
  };

  const handleCrestClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    spawnFireworkBurst(cx, cy, 56);
    setTimeout(() => spawnFireworkBurst(cx - 70, cy - 30, 32), 120);
    setTimeout(() => spawnFireworkBurst(cx + 70, cy - 30, 32), 240);
    scheduleAutoContinue(7800);
  };

  return (
    <section
      data-stage="happy-birthday"
      onClick={handleStageTap}
      className="relative h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-b from-[#0B0320] via-[#1D063A] to-[#2E083B] text-white flex flex-col items-center justify-center px-4 py-6 overflow-hidden select-none transition-colors duration-1000"
    >
      {/* Real-Time Interactive Physics Golden Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[5] w-full h-full"
      />

      {/* Multicolored Fireworks, Ambient Nebulae & Precision Formal Celestial Astrolabe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Firework Burst 1: Cyan / Gold (Top Left) */}
        <div
          className="absolute top-12 left-10 w-32 h-32 rounded-full border border-cyan-400/35 animate-ping"
          style={{ animationDuration: '2.4s' }}
        />
        {/* Firework Burst 2: Rose / Magenta (Top Right) */}
        <div
          className="absolute top-16 right-12 w-40 h-40 rounded-full border border-rose-400/35 animate-ping"
          style={{ animationDuration: '3s', animationDelay: '0.6s' }}
        />
        {/* Firework Burst 3: Gold (Center Bottom) */}
        <div
          className="absolute bottom-20 left-1/4 w-36 h-36 rounded-full border border-amber-300/35 animate-ping"
          style={{ animationDuration: '2.8s', animationDelay: '1.2s' }}
        />

        {/* Ambient Pulsing Nebulae */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-gradient-to-r from-fuchsia-600/25 via-pink-500/20 to-amber-400/20 blur-[130px]"
        />

        {/* Formal Counter-Rotating Golden Celestial Astrolabe Rings (Pure Geometric Art) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="w-[23rem] h-[23rem] sm:w-[35rem] sm:h-[35rem] opacity-55"
        >
          <defs>
            <linearGradient id="astrolabeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#F472B6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Outer Rotating Celestial Degree Ring */}
          <g className="animate-astrolabe-cw origin-center" style={{ transformOrigin: '200px 200px' }}>
            <circle
              cx="200"
              cy="200"
              r="186"
              fill="none"
              stroke="url(#astrolabeGold)"
              strokeWidth="0.9"
              strokeDasharray="4 6"
            />
            <circle
              cx="200"
              cy="200"
              r="174"
              fill="none"
              stroke="#FDE68A"
              strokeOpacity="0.32"
              strokeWidth="0.6"
            />
            {/* 24 Precision Astronomical Dial Ticks */}
            {Array.from({ length: 24 }).map((_, idx) => {
              const deg = idx * 15;
              const isCardinal = idx % 6 === 0;
              return (
                <line
                  key={idx}
                  x1="200"
                  y1={isCardinal ? '10' : '16'}
                  x2="200"
                  y2="26"
                  stroke="#FDE68A"
                  strokeOpacity={isCardinal ? '0.9' : '0.45'}
                  strokeWidth={isCardinal ? '1.6' : '0.8'}
                  transform={`rotate(${deg} 200 200)`}
                />
              );
            })}
            {/* Orbiting Diamond Star Nodes */}
            <polygon points="200,8 204,14 200,20 196,14" fill="#FDE68A" />
            <polygon points="200,380 204,386 200,392 196,386" fill="#FDA4AF" />
          </g>

          {/* Inner Counter-Rotating Royal Sacred Geometry Octagram */}
          <g className="animate-astrolabe-ccw origin-center" style={{ transformOrigin: '200px 200px' }}>
            <circle
              cx="200"
              cy="200"
              r="146"
              fill="none"
              stroke="#FDA4AF"
              strokeOpacity="0.35"
              strokeWidth="0.75"
              strokeDasharray="2 8"
            />
            <rect
              x="98"
              y="98"
              width="204"
              height="204"
              fill="none"
              stroke="url(#astrolabeGold)"
              strokeOpacity="0.32"
              strokeWidth="0.7"
            />
            <rect
              x="98"
              y="98"
              width="204"
              height="204"
              fill="none"
              stroke="url(#astrolabeGold)"
              strokeOpacity="0.32"
              strokeWidth="0.7"
              transform="rotate(45 200 200)"
            />
            {/* Orbiting Luminous Pearl Sphere */}
            <circle cx="200" cy="54" r="3.5" fill="#FDE68A" />
            <circle cx="346" cy="200" r="2.8" fill="#F472B6" />
          </g>
        </svg>
      </div>

      {/* Dense floating love hearts fill the celebratory atmosphere */}
      <LoveParticles density="abundant" />

      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
        {/* Unique Formal Interactive Element: Royal Gold & Laurel Crest Medallion (Zero Text) */}
        <button
          type="button"
          onClick={handleCrestClick}
          aria-label="Royal celebration crest emblem"
          className="group relative mb-3 sm:mb-4 cursor-pointer focus:outline-none animate-crest-halo transition-transform active:scale-90"
        >
          <svg
            viewBox="0 0 120 120"
            className="w-16 h-16 sm:w-20 sm:h-20 overflow-visible"
          >
            <defs>
              <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="45%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <radialGradient id="crimsonEnamel" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="70%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4C0519" />
              </radialGradient>
            </defs>

            {/* Scalloped Formal Wax Seal Outer Crest */}
            <circle
              cx="60"
              cy="60"
              r="42"
              fill="url(#crimsonEnamel)"
              stroke="url(#imperialGold)"
              strokeWidth="2.5"
            />
            <circle
              cx="60"
              cy="60"
              r="36"
              fill="none"
              stroke="#FDE68A"
              strokeOpacity="0.65"
              strokeWidth="0.9"
              strokeDasharray="2 3"
            />

            {/* Royal Crown Finial Above Crest */}
            <path
              d="M45 20 L50 10 L60 17 L70 10 L75 20 Z"
              fill="url(#imperialGold)"
              stroke="#FEF3C7"
              strokeWidth="0.7"
            />
            <circle cx="60" cy="8" r="2.2" fill="#FDA4AF" />

            {/* Left & Right Formal Laurel Wreath Branches */}
            <path
              d="M32 82 C20 68, 22 44, 38 34"
              fill="none"
              stroke="url(#imperialGold)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M88 82 C100 68, 98 44, 82 34"
              fill="none"
              stroke="url(#imperialGold)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {[
              [26, 70, -35],
              [23, 57, -20],
              [26, 44, 5],
              [94, 70, 35],
              [97, 57, 20],
              [94, 44, -5],
            ].map(([lx, ly, rot], idx) => (
              <ellipse
                key={idx}
                cx={lx}
                cy={ly}
                rx="4.2"
                ry="2.1"
                fill="url(#imperialGold)"
                transform={`rotate(${rot} ${lx} ${ly})`}
              />
            ))}

            {/* Faceted Golden Heart Jewel at Center */}
            <path
              d="M60 76 C60 76 42 63 42 52 C42 46 47 42 52.5 42 C56 42 58.6 43.9 60 46.5 C61.4 43.9 64 42 67.5 42 C73 42 78 46 78 52 C78 63 60 76 60 76 Z"
              fill="url(#imperialGold)"
              stroke="#FFFBEB"
              strokeWidth="1"
            />
            {/* Inner Diamond Facet Gleam */}
            <polygon points="60,51 64,57 60,64 56,57" fill="#FFFBEB" fillOpacity="0.65" />
          </svg>
        </button>

        {/* Floating Heart Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-fuchsia-400/40 text-fuchsia-200 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-3 sm:mb-4 shadow-lg shadow-fuchsia-950/40 animate-pulse">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
          <span>With All My Heart</span>
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
        </div>

        {/* Grand Birthday Script Header */}
        <h1 className="font-script text-6xl sm:text-8xl md:text-9xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 leading-none mb-2 sm:mb-3 drop-shadow-[0_10px_25px_rgba(244,63,94,0.45)]">
          Happy Birthday
        </h1>

        {/* Purbasha Name in Diamond Gold Title Typography */}
        <p className="font-title text-3xl sm:text-5xl md:text-6xl font-bold tracking-widest text-amber-300 mb-5 sm:mb-6 drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]">
          PURBASHA
        </p>

        {/* Sentiment Quote */}
        <p className="font-display italic text-base sm:text-2xl text-pink-100/90 max-w-lg mb-7 sm:mb-8 leading-relaxed drop-shadow-sm">
          "You make the whole world softer, brighter, and infinitely more beautiful."
        </p>

        {/* Button to proceed to final letter */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onContinueToWish();
          }}
          className="px-9 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-base font-bold shadow-xl shadow-pink-950/50 transition-all active:scale-95 cursor-pointer flex items-center gap-2 uppercase font-number tracking-wider"
        >
          <span>Read Your Birthday Letter</span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </button>
      </div>
    </section>
  );
};
