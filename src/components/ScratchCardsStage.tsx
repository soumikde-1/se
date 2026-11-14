import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Heart, ImagePlus, RotateCcw, Sparkles, X } from 'lucide-react';
import { MEMORY_CARDS, MemoryCard } from '../data/memoriesData';
import { calculateScratchRatio } from '../utils/birthdayLogic';
import embraceSpecialPic from '../assets/images/embrace_special_love_1794496940098.jpg';

interface ScratchCardsStageProps {
  onAllScratchedContinue: () => void;
}

interface CustomCardContent {
  imageSrc?: string;
  bengaliTitle?: string;
  bengaliText?: string;
}

export const ScratchCardsStage: React.FC<ScratchCardsStageProps> = ({
  onAllScratchedContinue,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [flippingCardId, setFlippingCardId] = useState<number | null>(null);
  const [loveBlastCardId, setLoveBlastCardId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScratchAlert, setShowScratchAlert] = useState(false);
  const [showDangerBlink, setShowDangerBlink] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  // Special 9th card completion celebration blast and pink fade reveal screen
  const [showSpecialTransitionBlast, setShowSpecialTransitionBlast] = useState(false);
  const [showPinkFadeScreen, setShowPinkFadeScreen] = useState(false);

  // Custom user content persisted in localStorage
  const [customContents, setCustomContents] = useState<Record<number, CustomCardContent>>(() => {
    try {
      const saved = localStorage.getItem('purbasha_custom_cards');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const alertTimeoutRef = useRef<number | null>(null);
  const dangerTimeoutRef = useRef<number | null>(null);

  const currentCard: MemoryCard = MEMORY_CARDS[currentIndex];
  const isCurrentRevealed = revealedIds.includes(currentCard.id);
  const allRevealed = revealedIds.length === MEMORY_CARDS.length;

  const currentCustom = customContents[currentCard.id] || {};
  const displayImage = currentCustom.imageSrc || currentCard.defaultSrc;
  const displayBengaliTitle = currentCustom.bengaliTitle || currentCard.bengaliTitle;
  const displayBengaliText = currentCustom.bengaliText || currentCard.bengaliText;

  const triggerScratchAlert = () => {
    // Clear any pending timers
    if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
    if (dangerTimeoutRef.current) window.clearTimeout(dangerTimeoutRef.current);

    setShowScratchAlert(true);
    setShowDangerBlink(true);
    setShakeCard(true);

    setTimeout(() => setShakeCard(false), 450);

    // Keep alert message and blinking danger icon active for full visibility
    alertTimeoutRef.current = window.setTimeout(() => {
      setShowScratchAlert(false);
    }, 3200);

    dangerTimeoutRef.current = window.setTimeout(() => {
      setShowDangerBlink(false);
    }, 3200);
  };

  const handleReveal = (id: number) => {
    if (revealedIds.includes(id)) return;
    setShowScratchAlert(false);

    // Trigger unique smooth animation & cute mini love burst
    setFlippingCardId(id);
    setLoveBlastCardId(id);

    setTimeout(() => {
      setRevealedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, 450);

    setTimeout(() => {
      setFlippingCardId(null);
    }, 1000);

    setTimeout(() => {
      setLoveBlastCardId(null);
    }, 1400);
  };

  // Re-draw metallic holographic scratch overlay whenever currentIndex changes (if not yet revealed)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = cardContainerRef.current;
    if (!canvas || !container || isCurrentRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(Math.round(rect.width), 300);
    const height = Math.max(Math.round(rect.height), 340);

    canvas.width = width;
    canvas.height = height;

    const [c1, c2, c3, c4] = currentCard.theme.foilGradient;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.3, c2);
    gradient.addColorStop(0.7, c3);
    gradient.addColorStop(1, c4);

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Fine holographic stardust sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let x = 16; x < width; x += 26) {
      for (let y = 16; y < height; y += 26) {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Prominent "SCRATCH HERE" instruction text on scratch foil with crisp contrast shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', width / 2, height / 2 - 12);

    ctx.font = '600 13px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.fillText('Rub with your finger to reveal 💖', width / 2, height / 2 + 18);
    ctx.restore();
  }, [currentIndex, isCurrentRevealed, currentCard]);

  // Smooth scratch drawing handler with continuous strokes
  const scratchAt = (clientX: number, clientY: number, isStarting = false) => {
    const canvas = canvasRef.current;
    if (!canvas || isCurrentRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (showScratchAlert) {
      setShowScratchAlert(false);
    }

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 44;

    if (isStarting || !lastPointRef.current) {
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPointRef.current = { x, y };

    // Check scratch ratio
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const alphaValues: number[] = [];
    for (let i = 3; i < imageData.data.length; i += 16) {
      alphaValues.push(imageData.data[i]);
    }
    if (calculateScratchRatio(alphaValues) >= 0.28) {
      handleReveal(currentCard.id);
    }
  };

  const handleNext = () => {
    if (!isCurrentRevealed) {
      triggerScratchAlert();
      return;
    }

    if (currentIndex < MEMORY_CARDS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 9th memory scratched: trigger joyful blast particles & pink fade reveal screen!
      setShowSpecialTransitionBlast(true);
      setTimeout(() => {
        setShowPinkFadeScreen(true);
      }, 350);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSaveCustomContent = (
    id: number,
    updates: Partial<CustomCardContent>
  ) => {
    setCustomContents((prev) => {
      const updated = {
        ...prev,
        [id]: { ...(prev[id] || {}), ...updates },
      };
      try {
        localStorage.setItem('purbasha_custom_cards', JSON.stringify(updated));
      } catch {
        // ignore quota errors
      }
      return updated;
    });
  };

  const handleFileUpload = (id: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        handleSaveCustomContent(id, { imageSrc: e.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      data-stage="scratch-cards"
      className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between items-center px-4 py-3 sm:py-5 overflow-hidden select-none transition-all duration-1000"
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #F4F4F6 14%, #9CA3AF 44%, #374151 72%, #111827 88%, #000000 100%)',
      }}
    >
      {/* ======================================================== */}
      {/* DUAL INTERLACING HEARTS: WHITE RISING FROM BOTTOM, BLACK FALLING FROM TOP */}
      {/* ======================================================== */}
      <div
        aria-label="White hearts rising from bottom and black hearts falling from top"
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      >
        {/* 1. White Love Hearts Rising Upward From Bottom */}
        {Array.from({ length: 12 }).map((_, i) => {
          const leftPercent = 6 + i * 7.8 + ((i % 3) * 1.5);
          const duration = 6.2 + (i % 4) * 0.8;
          const delay = (i * 0.5) % 5;
          const sway = (i % 2 === 0 ? 1 : -1) * (18 + (i % 3) * 6);
          const size = 16 + (i % 3) * 6;
          return (
            <span
              key={`white-${i}`}
              className="absolute bottom-0 select-none text-base sm:text-xl font-bold"
              style={
                {
                  left: `${leftPercent}%`,
                  fontSize: `${size}px`,
                  '--sway': `${sway}px`,
                  animation: `whiteHeartsRise ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties
              }
            >
              ❤
            </span>
          );
        })}

        {/* 2. Black Love Hearts Showering Downward From Top */}
        {Array.from({ length: 12 }).map((_, i) => {
          const leftPercent = 10 + i * 7.5 + ((i % 2 === 0 ? 1 : -1) * 2.5);
          const duration = 6.5 + (i % 4) * 0.7;
          const delay = (i * 0.45) % 5.5;
          const sway = (i % 2 === 0 ? -1 : 1) * (18 + (i % 3) * 6);
          const size = 16 + (i % 3) * 6;
          return (
            <span
              key={`black-${i}`}
              className="absolute top-0 select-none text-base sm:text-xl font-bold"
              style={
                {
                  left: `${leftPercent}%`,
                  fontSize: `${size}px`,
                  '--sway': `${sway}px`,
                  animation: `blackHeartsFall ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties
              }
            >
              ❤
            </span>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. TOP HEADER (SOME EVERGREEN MEMORIES in Frosted Badge) */}
      {/* ======================================================== */}
      <header className="relative z-20 w-full max-w-sm flex flex-col items-center text-center shrink-0">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border shadow-sm mb-1.5 transition-all duration-500 ${currentCard.theme.badgeBorderClass}`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="font-title text-xs sm:text-sm font-bold tracking-widest uppercase">
            SOME EVERGREEN MEMORIES
          </span>
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
        </div>

        <h2 className="font-title text-xl sm:text-2xl font-extrabold text-[#18181B] leading-tight drop-shadow-xs line-clamp-1">
          {currentCard.title}
        </h2>

        {/* 9 Interactive Progress Indicator Dots Matching Each Card's Unique Color */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {MEMORY_CARDS.map((card, idx) => {
            const isUnlocked = revealedIds.includes(card.id);
            const isSelected = idx === currentIndex;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  if (revealedIds.includes(card.id) || idx <= currentIndex) {
                    setCurrentIndex(idx);
                  } else {
                    triggerScratchAlert();
                  }
                }}
                aria-label={`Go to Memory ${card.id}: ${card.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isSelected
                    ? `w-7 h-2.5 ${card.theme.dotActiveClass}`
                    : isUnlocked
                      ? `w-2.5 h-2.5 ${card.theme.dotUnlockedClass}`
                      : 'w-2.5 h-2.5 bg-zinc-400 hover:bg-zinc-600'
                }`}
              />
            );
          })}
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. CENTER STAGE: SINGLE CARD (Pink Border & Scratch Canvas) */}
      {/* ======================================================== */}
      <main className="relative z-20 w-full max-w-xs sm:max-w-sm flex-1 flex flex-col items-center justify-center min-h-0 my-1">
        {/* DANGER SYMBOL BLINKING OVERLAY & ALERT NOTIFICATION */}
        {showDangerBlink && (
          <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center animate-danger-flash backdrop-blur-[2px]"
          >
            {/* Blinking Danger Shield / Hazard Symbol with Neon Red Corona */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-black/85 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.85)] animate-danger-blink max-w-[280px] sm:max-w-xs text-center">
              <div className="relative mb-3 flex items-center justify-center">
                <span className="absolute -inset-3 rounded-full bg-red-600/40 blur-xl animate-ping" />
                <AlertTriangle className="relative w-16 h-16 sm:w-20 sm:h-20 text-red-500 stroke-[2.5] fill-red-500/20" />
              </div>
              <span className="font-title text-base sm:text-lg font-black tracking-widest uppercase text-white drop-shadow-[0_2px_12px_rgba(239,68,68,0.9)]">
                PLEASE SCRATCH THIS CARD FIRST!
              </span>
              <span className="text-xs text-red-300 font-semibold tracking-wide mt-1">
                কার্ডটি স্ক্র্যাচ না করে পরবর্তী ধাপে যাওয়া যাবে না
              </span>
            </div>
          </div>
        )}

        {/* TOP ALERT PILL NOTIFICATION */}
        {showScratchAlert && (
          <div
            role="alert"
            className="absolute -top-3 z-40 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-red-600 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-red-950/70 border-2 border-red-300 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-250 select-none"
          >
            <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 animate-bounce stroke-[2.5]" />
            <span className="font-title tracking-wider uppercase text-[11px] sm:text-xs">
              PLEASE SCRATCH THIS CARD FIRST! ⚠️
            </span>
          </div>
        )}

        {/* Cute Mini Love Burst Particles on Scratch Complete */}
        {loveBlastCardId === currentCard.id && (
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-visible">
            {[
              { x: '95px', y: '-80px', rot: '45deg', text: '💖', delay: '0ms' },
              { x: '-90px', y: '-70px', rot: '-35deg', text: '❤', delay: '50ms' },
              { x: '110px', y: '20px', rot: '60deg', text: '💕', delay: '80ms' },
              { x: '-115px', y: '30px', rot: '-50deg', text: '✨', delay: '30ms' },
              { x: '50px', y: '-110px', rot: '20deg', text: '✦', delay: '100ms' },
              { x: '-55px', y: '-115px', rot: '-20deg', text: '💗', delay: '60ms' },
              { x: '70px', y: '95px', rot: '75deg', text: '🌸', delay: '120ms' },
              { x: '-75px', y: '90px', rot: '-65deg', text: '❤', delay: '90ms' },
            ].map((blast, bIdx) => (
              <span
                key={bIdx}
                className="absolute text-xl sm:text-2xl font-bold select-none drop-shadow-md"
                style={
                  {
                    '--burst-x': blast.x,
                    '--burst-y': blast.y,
                    '--burst-rot': blast.rot,
                    animation: 'miniLoveBurst 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    animationDelay: blast.delay,
                  } as React.CSSProperties
                }
              >
                {blast.text}
              </span>
            ))}
          </div>
        )}

        {/* Card with Dynamic Per-Card Color Border & Smooth Gliding Animation */}
        <div
          ref={cardContainerRef}
          key={currentCard.id}
          className={`relative w-full h-full max-h-[58vh] sm:max-h-[64vh] rounded-[2.2rem] overflow-hidden border-[4px] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-between transition-all duration-700 ${currentCard.theme.cardBorderClass} ${
            shakeCard ? 'animate-shake' : ''
          }`}
          style={{
            animation:
              flippingCardId === currentCard.id
                ? `${currentCard.animationName} ${currentCard.animationDuration} cubic-bezier(0.25, 1, 0.5, 1) forwards`
                : 'fade-in 0.35s ease-out',
          }}
        >
          {/* Card Top: Photo Container with Smooth Slide-Up Transition & Matching Color Tint */}
          <div
            className={`relative w-full flex items-center justify-center p-2.5 transition-all duration-700 bg-gradient-to-b ${currentCard.theme.cardTopBgClass} ${
              isCurrentRevealed ? 'h-[52%] sm:h-[55%] -translate-y-1' : 'h-full'
            }`}
          >
            <img
              src={displayImage}
              alt={currentCard.title}
              className="w-full h-full object-contain rounded-2xl drop-shadow-md select-none pointer-events-none transition-transform duration-700"
            />
          </div>

          {/* Card Bottom: Bengali Romantic Text Drawer (Color-Synced After Reveal) */}
          {isCurrentRevealed && (
            <div
              className={`w-full h-[48%] sm:h-[45%] bg-gradient-to-t px-3.5 pb-3 pt-1 flex flex-col justify-end text-center rounded-b-[2rem] border-t-2 text-white ${currentCard.theme.drawerBgClass}`}
              style={{ animation: 'textRevealFade 0.65s ease-out forwards' }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Heart className={`w-3.5 h-3.5 shrink-0 ${currentCard.theme.iconColorClass}`} />
                <h3 className="font-sans-ui text-xs sm:text-sm font-bold text-amber-200 tracking-wide line-clamp-1">
                  {displayBengaliTitle}
                </h3>
                <Heart className={`w-3.5 h-3.5 shrink-0 ${currentCard.theme.iconColorClass}`} />
              </div>

              <p className="font-sans-ui text-[11px] sm:text-xs text-white/95 leading-relaxed font-normal line-clamp-4 px-1">
                {displayBengaliText}
              </p>
            </div>
          )}

          {/* Scratchable Metallic Foil Overlay with "✨ SCRATCH HERE ✨" */}
          {!isCurrentRevealed && (
            <canvas
              ref={canvasRef}
              data-testid={`scratch-canvas-${currentCard.id}`}
              onPointerDown={(e) => {
                isDrawingRef.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                scratchAt(e.clientX, e.clientY, true);
              }}
              onPointerMove={(e) => {
                if (!isDrawingRef.current) return;
                scratchAt(e.clientX, e.clientY, false);
              }}
              onPointerUp={() => {
                isDrawingRef.current = false;
                lastPointRef.current = null;
              }}
              onPointerCancel={() => {
                isDrawingRef.current = false;
                lastPointRef.current = null;
              }}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none rounded-[2rem] z-20"
            />
          )}
        </div>
      </main>

      {/* ======================================================== */}
      {/* 3. BOTTOM CONTROLS (Always Sleek Modern Button Symbols < and >) */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full max-w-sm flex items-center justify-between px-6 shrink-0 pb-2">
        {/* Modern Previous Symbol Button ONLY (No Text) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-3.5 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-md transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            currentIndex === 0
              ? 'opacity-25 cursor-not-allowed border-white/5'
              : 'hover:bg-white/20 hover:border-pink-400/50'
          }`}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Dynamic Card Indicator Pill */}
        <div className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white tracking-widest uppercase font-number select-none">
          {currentIndex + 1} / {MEMORY_CARDS.length}
        </div>

        {/* Modern Next Symbol Button ONLY (Color-Synced With Card) */}
        <button
          type="button"
          onClick={handleNext}
          className={`p-3.5 rounded-full bg-gradient-to-r text-white shadow-lg transition-all cursor-pointer flex items-center justify-center active:scale-95 border ${currentCard.theme.nextBtnClass}`}
          aria-label="Next card"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </footer>

      {/* ======================================================== */}
      {/* 4. PHOTO & BENGALI TEXT CUSTOMIZATION MODAL */}
      {/* ======================================================== */}
      {showEditModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl border border-pink-400/40 bg-zinc-900 text-white p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-title text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Customize Card {currentCard.id}
              </span>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 mb-3">
              Upload your photo and edit the Bengali caption for this card:
            </p>

            {/* Photo Upload Area */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                Photo (ছবি নির্বাচন করুন)
              </label>
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-zinc-600 hover:border-pink-400 text-xs text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 cursor-pointer transition-colors">
                <ImagePlus className="w-4 h-4 text-pink-400" />
                <span>{displayImage.startsWith('data:') ? 'New Photo Selected ✓' : 'Upload custom photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileUpload(currentCard.id, e.target.files?.[0])}
                />
              </label>
            </div>

            {/* Bengali Title Input */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                Bengali Title (শিরোনাম)
              </label>
              <input
                type="text"
                value={displayBengaliTitle}
                onChange={(e) => handleSaveCustomContent(currentCard.id, { bengaliTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-pink-400 font-sans-ui"
              />
            </div>

            {/* Bengali Message Textarea */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                Bengali Love Note (বাংলা বার্তা)
              </label>
              <textarea
                rows={3}
                value={displayBengaliText}
                onChange={(e) => handleSaveCustomContent(currentCard.id, { bengaliText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-pink-400 font-sans-ui resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleSaveCustomContent(currentCard.id, {
                    imageSrc: undefined,
                    bengaliTitle: undefined,
                    bengaliText: undefined,
                  });
                }}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CELEBRATION BLAST PARTICLES ON 9TH CARD COMPLETION */}
      {/* ======================================================== */}
      {showSpecialTransitionBlast && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
        >
          {[
            { dx: '130px', dy: '-140px', rot: '45deg', text: '🎉', delay: '0ms' },
            { dx: '-120px', dy: '-130px', rot: '-35deg', text: '💖', delay: '40ms' },
            { dx: '150px', dy: '30px', rot: '60deg', text: '✨', delay: '80ms' },
            { dx: '-160px', dy: '40px', rot: '-50deg', text: '🌸', delay: '30ms' },
            { dx: '80px', dy: '-170px', rot: '20deg', text: '💕', delay: '100ms' },
            { dx: '-85px', dy: '-180px', rot: '-20deg', text: '⭐', delay: '60ms' },
            { dx: '110px', dy: '140px', rot: '75deg', text: '❤', delay: '120ms' },
            { dx: '-115px', dy: '130px', rot: '-65deg', text: '🎊', delay: '90ms' },
            { dx: '0px', dy: '-190px', rot: '10deg', text: '✨', delay: '150ms' },
            { dx: '0px', dy: '180px', rot: '-10deg', text: '💖', delay: '140ms' },
          ].map((item, idx) => (
            <span
              key={idx}
              className="absolute text-2xl sm:text-3xl select-none animate-blast-particle drop-shadow-lg"
              style={
                {
                  '--blast-dx': item.dx,
                  '--blast-dy': item.dy,
                  '--blast-rot': item.rot,
                  animationDelay: item.delay,
                } as React.CSSProperties
              }
            >
              {item.text}
            </span>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ROMANTIC PINK FADE SCREEN WITH PICTURE & BENGALI MESSAGE */}
      {/* ======================================================== */}
      {showPinkFadeScreen && (
        <div
          role="dialog"
          aria-label="A special love message for Purbasha"
          className="fixed inset-0 z-50 flex flex-col items-center justify-between px-5 py-6 sm:py-8 overflow-hidden select-none animate-pink-screen-fade"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(255, 228, 230, 0.98) 0%, rgba(254, 205, 211, 0.96) 45%, rgba(251, 113, 133, 0.92) 85%, rgba(225, 29, 72, 0.95) 100%)',
          }}
        >
          {/* Gentle Floating Background Hearts */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-rose-300/60 font-bold select-none text-xl sm:text-2xl"
                style={{
                  left: `${10 + i * 11}%`,
                  bottom: '-10%',
                  animation: `whiteHeartsRise ${5 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              >
                ❤
              </span>
            ))}
          </div>

          {/* Top Title Pill / Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-rose-300 shadow-sm mt-1 sm:mt-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-title text-xs sm:text-sm font-bold tracking-widest uppercase text-rose-950">
              FOREVER WITH YOU
            </span>
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          </div>

          {/* Central Featured Romantic Picture Card with Soft Glow */}
          <div className="relative z-10 w-full max-w-[270px] sm:max-w-[310px] aspect-[4/3] rounded-[1.75rem] overflow-hidden p-1.5 bg-gradient-to-tr from-rose-400 via-pink-200 to-white shadow-[0_12px_45px_rgba(225,29,72,0.4)] animate-picture-rise">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-black/10">
              <img
                src={embraceSpecialPic}
                alt="Embracing with care and love"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bengali Love Heading & Note (Medium Size, Beautiful Bengali Font) */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto text-center px-4 py-3 sm:py-3.5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg">
            {/* Beautiful Heading in Bengali */}
            <h3 className="font-bengali text-lg sm:text-xl font-bold text-rose-950 mb-1.5 leading-snug drop-shadow-xs flex items-center justify-center gap-1.5">
              <span>আমার একান্ত আপন মানুষ</span>
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600 shrink-0 inline-block" />
            </h3>

            {/* Requested Bengali Note in Medium Size Font */}
            <p className="font-bengali text-sm sm:text-base font-semibold text-rose-900 leading-relaxed tracking-normal">
              এভাবেই আঁকড়ে ধরে আদর দিয়ে যত্নে সাজিয়ে রাখতে চাই তোমায়
            </p>
          </div>

          {/* Bottom Next / Continue Button to Proceed to Next Stage */}
          <div className="relative z-10 w-full max-w-xs flex justify-center pb-2">
            <button
              type="button"
              onClick={onAllScratchedContinue}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-950/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest font-number"
            >
              <span>CONTINUE</span>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
