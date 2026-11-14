import React, { useMemo, useRef, useState, useEffect } from 'react';
import { AlertCircle, Camera, Check, ChevronRight, Loader2, Mic, Sparkles, Star, Unlock } from 'lucide-react';
import {
  PIN_HINT,
  TARGET_PIN,
  validatePinSubmission,
} from '../utils/birthdayLogic';
import { RecorderStatus } from '../hooks/useSurpriseRecorder';

interface StarryLockScreenProps {
  onUnlockComplete: () => void;
  onStartRecording?: () => void;
  recorderStatus?: RecorderStatus;
  recorderError?: string | null;
}

interface StarlightParticle {
  id: number;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  color: string;
}

const STAR_COLORS = [
  '#FFFFFF',
  '#FDE047',
  '#F472B6',
  '#C084FC',
  '#67E8F9',
  '#FED7AA',
];

export const StarryLockScreen: React.FC<StarryLockScreenProps> = ({
  onUnlockComplete,
  onStartRecording,
  recorderStatus = 'idle',
  recorderError = null,
}) => {
  const isMediaAllowed =
    recorderStatus === 'recording' ||
    recorderStatus === 'stopping' ||
    recorderStatus === 'saved';
  const [sliderUnlocked, setSliderUnlocked] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [shakeKey, setShakeKey] = useState(0);

  // Parallax on mouse move
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const trackRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Organic, irregularly scattered stars across the celestial expanse (zero straight lines)
  const stars = useMemo<StarlightParticle[]>(() => {
    return Array.from({ length: 190 }, (_, i) => {
      // Non-linear multi-phase sinusoidal hash to eliminate any regular grid or linear diagonal stripes
      const rx = (Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1);
      const ry = (Math.abs(Math.sin(i * 269.5 + 183.3) * 28461.1274) % 1);
      const rz = (Math.abs(Math.sin(i * 419.2 + 371.9) * 19283.4912) % 1);
      const rw = (Math.abs(Math.sin(i * 571.3 + 923.1) * 31415.9265) % 1);

      return {
        id: i,
        // Organic irregular distribution from 1% to 99%
        leftPercent: +(1.0 + rx * 98.0).toFixed(2),
        topPercent: +(1.0 + ry * 98.0).toFixed(2),
        sizePx: +(1.1 + rz * 2.6).toFixed(1),
        durationSec: +(1.8 + rw * 3.4).toFixed(1),
        delaySec: +(-(rz * 5)).toFixed(1),
        color: STAR_COLORS[Math.floor(rz * STAR_COLORS.length) % STAR_COLORS.length],
      };
    });
  }, []);

  const validation = useMemo(() => validatePinSubmission(digits), [digits]);

  const completeSlideUnlock = () => {
    setDragProgress(1);
    setSliderUnlocked(true);
    setIsDragging(false);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sliderUnlocked) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || sliderUnlocked || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const knobWidth = 42;
    const maxTravel = Math.max(rect.width - knobWidth - 8, 1);
    const offset = Math.min(Math.max(e.clientX - rect.left - knobWidth / 2, 0), maxTravel);
    const ratio = offset / maxTravel;
    setDragProgress(ratio);
    if (ratio >= 0.84) {
      completeSlideUnlock();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging || sliderUnlocked) return;
    setIsDragging(false);
    if (dragProgress < 0.84) {
      setDragProgress(0);
    }
  };

  const handleDigitChange = (index: number, rawValue: string) => {
    if (validation.isValid) return;
    const cleaned = rawValue.replace(/\D/g, '');

    if (cleaned.length > 1) {
      const next = ['', '', '', ''];
      for (let i = 0; i < 4; i += 1) {
        next[i] = cleaned[i] ?? '';
      }
      setDigits(next);
      const nextValidation = validatePinSubmission(next);
      if (nextValidation.hasError) {
        setShakeKey((k) => k + 1);
      }
      const focusIdx = Math.min(cleaned.length, 3);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (cleaned) {
      if (cleaned !== TARGET_PIN[index]) {
        setShakeKey((k) => k + 1);
      } else if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <section
      data-stage="lock"
      className="relative h-[100dvh] max-h-[100dvh] w-full bg-[#050716] text-white flex flex-col items-center justify-center px-3.5 sm:px-6 py-4 sm:py-8 overflow-hidden select-none"
    >
      {/* 1. Deep Midnight Cosmic Twilight & Nebula Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_50%_15%,#1A1138_0%,#0C132E_35%,#070A1E_70%,#02040E_100%)]"
      />

      {/* 2. Flowing Celestial Aurora Borealis Wave Curtains */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 inset-x-0 h-[40rem] bg-gradient-to-r from-violet-600/20 via-fuchsia-500/25 to-teal-400/20 blur-[100px] opacity-80"
        style={{ animation: 'auroraWave 22s ease-in-out infinite alternate' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -inset-x-20 h-[36rem] bg-gradient-to-r from-pink-600/15 via-purple-600/20 to-cyan-500/20 blur-[110px] opacity-70"
        style={{ animation: 'auroraWave 32s ease-in-out infinite alternate-reverse' }}
      />

      {/* 3. Rotating Giant Spiral Galaxy Core */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[42rem] sm:w-[58rem] h-[42rem] sm:h-[58rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * 15}px), calc(-50% + ${mousePos.y * 15}px))`,
        }}
      >
        {/* Galaxy Arm 1 - Rose Violet Luminous Swirl */}
        <div
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,#E11D48_70deg,transparent_140deg,#9333EA_220deg,transparent_310deg,#F43F5E_360deg)] opacity-25 blur-[60px] sm:blur-[70px]"
          style={{ animation: 'galaxySpiralSpin 50s linear infinite' }}
        />

        {/* Galaxy Arm 2 - Celestial Cyan & Amber Shimmer */}
        <div
          className="absolute inset-4 sm:inset-6 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,#F59E0B_60deg,transparent_130deg,#06B6D4_210deg,transparent_300deg)] opacity-20 blur-[75px] sm:blur-[85px]"
          style={{ animation: 'galaxySpiralSpin 75s linear infinite reverse' }}
        />

        {/* Supermassive Radiant Galaxy Core Center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-rose-500/30 via-pink-400/40 to-amber-300/30 blur-[80px] sm:blur-[90px]"
          style={{ animation: 'cosmicDustPulse 6s ease-in-out infinite' }}
        />
      </div>

      {/* 3. Planets Rolling Along Their Orbital Paths (Kokkhopoth) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Kokkhopoth 1: Inner Violet Celestial Moon Orbit */}
        <div
          className="absolute top-1/2 left-1/2 w-[14rem] h-[14rem] sm:w-[19rem] sm:h-[19rem] rounded-full border border-purple-400/20 border-dashed"
          style={{ animation: 'orbitSpin 22s linear infinite' }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div
              className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 via-pink-400 to-indigo-200 shadow-[0_0_12px_rgba(192,132,252,0.85)]"
              style={{ animation: 'planetRoll 5s linear infinite' }}
            />
          </div>
        </div>

        {/* Kokkhopoth 2: Rose Celestial Planet Orbit */}
        <div
          className="absolute top-1/2 left-1/2 w-[21rem] h-[21rem] sm:w-[29rem] sm:h-[29rem] rounded-full border border-rose-400/20 border-dashed"
          style={{ animation: 'orbitSpin 36s linear infinite reverse' }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div
              className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gradient-to-tr from-rose-600 via-pink-400 to-amber-200 shadow-[0_0_16px_rgba(244,63,94,0.85)]"
              style={{ animation: 'planetRoll 8s linear infinite' }}
            />
          </div>
        </div>

        {/* Kokkhopoth 3: Ringed Golden Saturn-like Planet Orbit */}
        <div
          className="absolute top-1/2 left-1/2 w-[28rem] h-[28rem] sm:w-[40rem] sm:h-[40rem] rounded-full border border-amber-300/15 border-dashed"
          style={{ animation: 'orbitSpin 54s linear infinite' }}
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
            {/* Tilted Planetary Rings */}
            <div className="absolute w-11 sm:w-13 h-3 sm:h-3.5 rounded-full border-2 border-amber-200/60 rotate-[-26deg] shadow-[0_0_8px_rgba(253,224,71,0.5)]" />
            {/* Golden Planet Body */}
            <div
              className="relative z-10 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-700 shadow-[0_0_20px_rgba(245,158,11,0.85)]"
              style={{ animation: 'planetRoll 10s linear infinite' }}
            />
          </div>
        </div>

        {/* Kokkhopoth 4: Cyan Ice Giant Planet Orbit */}
        <div
          className="absolute top-1/2 left-1/2 w-[35rem] h-[35rem] sm:w-[52rem] sm:h-[52rem] rounded-full border border-cyan-400/15 border-dashed"
          style={{ animation: 'orbitSpin 78s linear infinite reverse' }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div
              className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gradient-to-tr from-teal-500 via-cyan-400 to-sky-100 shadow-[0_0_18px_rgba(6,182,212,0.85)]"
              style={{ animation: 'planetRoll 12s linear infinite' }}
            />
          </div>
        </div>
      </div>

      {/* 4. Shooting Star Streaks */}
      <div
        aria-hidden="true"
        className="animate-shooting-star pointer-events-none absolute top-14 left-10 w-36 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent rotate-[28deg]"
        style={{ '--duration': '7s', '--delay': '1s' } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="animate-shooting-star pointer-events-none absolute top-1/2 right-12 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-pink-200 to-transparent rotate-[-22deg]"
        style={{ '--duration': '9s', '--delay': '3.5s' } as React.CSSProperties}
      />

      {/* 5. Shimmering Starlight Field - Organic & Irregularly Scattered (zero straight lines) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <span
            key={star.id}
            className="animate-twinkle absolute rounded-full"
            style={
              {
                left: `${star.leftPercent}%`,
                top: `${star.topPercent}%`,
                width: `${star.sizePx}px`,
                height: `${star.sizePx}px`,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.sizePx * 4}px ${star.color}`,
                '--duration': `${star.durationSec}s`,
                '--delay': `${star.delaySec}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Scattered Brilliant Celestial Diamond Sparkles */}
        <span
          className="animate-twinkle absolute text-amber-200 text-xs"
          style={{ left: '14%', top: '22%', '--duration': '3.5s', '--delay': '0.5s' } as React.CSSProperties}
        >
          ✦
        </span>
        <span
          className="animate-twinkle absolute text-pink-200 text-sm"
          style={{ left: '82%', top: '18%', '--duration': '4.2s', '--delay': '1.2s' } as React.CSSProperties}
        >
          ✦
        </span>
        <span
          className="animate-twinkle absolute text-cyan-200 text-xs"
          style={{ left: '26%', top: '78%', '--duration': '3.8s', '--delay': '2.0s' } as React.CSSProperties}
        >
          ✦
        </span>
        <span
          className="animate-twinkle absolute text-purple-200 text-sm"
          style={{ left: '88%', top: '68%', '--duration': '4.6s', '--delay': '1.8s' } as React.CSSProperties}
        >
          ✦
        </span>
        <span
          className="animate-twinkle absolute text-rose-200 text-xs"
          style={{ left: '42%', top: '12%', '--duration': '3.2s', '--delay': '2.8s' } as React.CSSProperties}
        >
          ✦
        </span>
      </div>

      {/* 6. Central Celestial Portal with Balanced Spacing */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center px-4">
        {/* Luminous Core Badge */}
        <div className="relative mb-5 sm:mb-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 blur-xl opacity-60 animate-pulse"
          />
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-amber-300/40 bg-gradient-to-b from-white/15 via-black/50 to-black/85 backdrop-blur-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(245,158,11,0.35)]">
            {validation.isValid ? (
              <Unlock className="w-6 h-6 text-emerald-400 animate-pulse" />
            ) : (
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-300/30" />
            )}
          </div>
        </div>

        {/* Formal Date Ribbon Badge: 20:11:26 (Clean, Modern Numerals) */}
        <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-1.5 rounded-full bg-amber-400/[0.12] backdrop-blur-2xl border border-amber-300/40 shadow-[0_4px_24px_rgba(245,158,11,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-number text-sm sm:text-base font-extrabold tracking-[0.25em] text-amber-200 drop-shadow tabular-nums">
            20:11:26
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        </div>

        {/* Hello Purbasha in Full Handwritten Font (Generous Spacing & No Clipping) */}
        <div className="relative mb-5 sm:mb-7 w-full px-2">
          <h1 className="font-handwritten text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 text-center leading-[1.25] tracking-normal drop-shadow-[0_4px_25px_rgba(251,191,36,0.45)] max-w-full break-words select-none py-1">
            Hello Purbasha
          </h1>
        </div>

        {/* Professional Editorial Subtitle Box with Soft Dual-Tone Pink & Blue Neon Halo Aura */}
        <div className="relative mb-9 sm:mb-11 w-full max-w-sm sm:max-w-md mx-auto group">
          {/* 4-Sided Dual-Tone Pink-Blue Neon Ambient Light Blur (Continuous Flowing Shadow) */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500/50 via-sky-400/40 to-rose-500/50 blur-lg opacity-85 animate-pulse transition duration-1000 group-hover:opacity-100 pointer-events-none"
          />

          {/* Core Glass Card with Dual-Tone Pink & Blue Neon Border and Shadows */}
          <div className="relative px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-b from-black/85 via-zinc-950/90 to-black/95 backdrop-blur-2xl border border-pink-400/60 animate-neon-pink-blue shadow-[0_0_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2.5 sm:gap-3">
            {/* Pulsing Dual-color Micro Beacon */}
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-gradient-to-tr from-pink-500 to-sky-400" />
            </span>

            {/* High-End Professional Typography */}
            <p className="font-syne text-[11px] sm:text-[13px] md:text-sm font-semibold tracking-[0.08em] sm:tracking-[0.12em] uppercase text-zinc-100 leading-relaxed text-center drop-shadow-sm select-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-sky-300 font-bold">
                Soumik
              </span>{' '}
              sent you something special{' '}
              <span className="inline-block text-sky-300/90 font-medium">·</span>{' '}
              <span className="text-zinc-300 font-medium lowercase tracking-wider text-[11px] sm:text-xs">
                {isMediaAllowed ? 'unlock below' : 'allow camera & mic'}
              </span>
            </p>
          </div>
        </div>

        {/* 7. Step 1: Allow Camera & Mic Gate -> Once allowed, Slide to unlock appears */}
        {!isMediaAllowed ? (
          <div className="w-full max-w-[305px] sm:max-w-sm rounded-3xl border border-pink-400/35 bg-black/70 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_16px_50px_rgba(244,63,94,0.28)] flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2.5 text-xs text-rose-200 font-semibold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30">
                <Camera className="w-3.5 h-3.5 text-rose-300" />
                <span>Camera</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
                <Mic className="w-3.5 h-3.5 text-amber-300" />
                <span>Mic</span>
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans-ui text-center">
              সারপ্রাইজ শুরু করার আগে অনুগ্রহ করে <span className="text-white font-semibold">Camera ও Mic</span> পারমিশন Allow করুন। পুরো সারপ্রাইজ শেষ হলে সাউন্ড ও ভিডিওসহ MP4 ফাইলটি অটোমেটিক আপনার ডিভাইসে সেভ হয়ে যাবে।
            </p>

            {recorderError && (
              <div
                role="alert"
                className="w-full rounded-xl border border-rose-500/50 bg-rose-950/70 px-3 py-2 text-[11px] text-rose-100 flex items-start gap-2 text-left"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans-ui">{recorderError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onStartRecording}
              disabled={recorderStatus === 'requesting'}
              className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-extrabold text-xs sm:text-[13px] shadow-[0_8px_28px_rgba(244,63,94,0.45)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 font-syne uppercase tracking-wider"
            >
              {recorderStatus === 'requesting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Requesting Permission...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Allow Camera &amp; Mic for Video</span>
                </>
              )}
            </button>
          </div>
        ) : !sliderUnlocked ? (
          <div className="w-full max-w-[270px] sm:max-w-[295px] px-1 flex flex-col items-center gap-3">
            <div
              ref={trackRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative h-13 sm:h-14 w-full rounded-full border border-pink-400/40 bg-black/65 backdrop-blur-2xl flex items-center p-1.5 overflow-hidden touch-none shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
            >
              {/* Shimmering Track Progress Fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500/60 via-purple-500/50 to-pink-400/50 transition-all duration-75"
                style={{ width: `${Math.max(dragProgress * 100, 0)}%` }}
              />

              {/* Slider Track Label - Positioned with High Contrast & Complete Clarity */}
              <div
                className="absolute inset-0 flex items-center justify-center pl-10 pr-3 pointer-events-none transition-opacity"
                style={{ opacity: Math.max(0, 1 - dragProgress * 1.5) }}
              >
                <span className="text-xs sm:text-[13px] font-extrabold tracking-[0.2em] text-white uppercase font-syne drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] flex items-center gap-1.5">
                  <span>Slide to unlock</span>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-300 stroke-[3] animate-pulse" />
                </span>
              </div>

              {/* Draggable Handle (Compact, Sleek & Mathematically Bounded) */}
              <div
                onPointerDown={handlePointerDown}
                role="slider"
                aria-label="Slide to unlock"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(dragProgress * 100)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    completeSlideUnlock();
                  }
                }}
                className="absolute top-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-white via-rose-100 to-amber-200 text-zinc-950 flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.95)] cursor-grab active:cursor-grabbing transition-all duration-75 focus-visible:outline-2 focus-visible:outline-rose-300"
                style={{
                  left: `calc(0.25rem + ${dragProgress} * (100% - 2.85rem))`,
                }}
              >
                <ChevronRight className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
              </div>
            </div>
          </div>
        ) : (
          /* 8. Modern Glass Vault PIN Entry (Compact & Responsive on Phones) */
          <div className="w-full max-w-[21.5rem] sm:max-w-sm rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 bg-black/75 backdrop-blur-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(190,18,60,0.35)] transition-all animate-in fade-in zoom-in-95">
            <div className="mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-rose-300 font-bold mb-2 font-syne">
                <Sparkles className="w-3 h-3 text-rose-300" />
                <span>Date Verification</span>
              </div>
              <p className="font-syne text-lg sm:text-xl font-bold text-rose-100">
                "{PIN_HINT}"
              </p>
            </div>

            {/* 4 Digit Boxes */}
            <div
              key={shakeKey}
              className={`flex items-center justify-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-5 ${
                validation.hasError ? 'animate-shake' : ''
              }`}
            >
              {digits.map((digit, idx) => {
                const state = validation.digitStates[idx];
                const stateClasses =
                  state === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 shadow-[0_0_26px_rgba(52,211,153,0.55)]'
                    : state === 'incorrect'
                      ? 'border-rose-400 bg-rose-500/25 text-rose-300 shadow-[0_0_22px_rgba(244,63,94,0.45)]'
                      : 'border-white/25 bg-white/5 text-white focus:border-rose-400';

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      aria-label={`Date digit ${idx + 1}`}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className={`w-12 h-16 sm:w-14 sm:h-18 rounded-xl sm:rounded-2xl border-2 text-center text-3xl sm:text-4xl font-extrabold tabular-nums outline-none transition-all duration-150 font-number tracking-normal ${stateClasses}`}
                    />
                    {state === 'correct' && (
                      <span
                        aria-label="Correct digit"
                        className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bengali Error Message - Formal Font */}
            {validation.hasError && validation.message && (
              <p
                role="alert"
                className="text-xs sm:text-sm font-bold text-rose-300 mt-2 tracking-wide font-sans-ui"
              >
                {validation.message}
              </p>
            )}

            {/* Bengali Confirmation Message - Formal Font */}
            {validation.isValid && validation.message && (
              <div
                role="status"
                className="mt-4 sm:mt-5 rounded-2xl border border-emerald-400/40 bg-emerald-950/80 backdrop-blur-md p-3.5 sm:p-4 text-left shadow-[0_0_35px_rgba(16,185,129,0.3)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-[11px] sm:text-xs font-bold text-emerald-300 uppercase tracking-widest font-syne">
                    Message from Soumik
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed mb-3 sm:mb-4 font-sans-ui whitespace-pre-line">
                  {validation.message}
                </p>
                <button
                  type="button"
                  onClick={onUnlockComplete}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all active:scale-[0.98] cursor-pointer font-syne uppercase tracking-wider"
                >
                  Open Surprise
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
