import React from 'react';

interface ModernButterscotchCakeProps {
  isBlown: boolean;
}

export const ModernButterscotchCake: React.FC<ModernButterscotchCakeProps> = ({
  isBlown,
}) => {
  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[340px] sm:max-w-[400px] mx-auto">
      {/* Ambient Warm Golden Glow behind cake */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-10 bottom-10 rounded-full bg-gradient-to-tr from-amber-400/30 via-orange-300/30 to-rose-300/25 blur-3xl -z-10"
      />

      {/* Modern 2-Tier Artisan Butterscotch Cake with Candle Mounted Firmly On Top */}
      <svg
        viewBox="0 0 360 360"
        className="w-full h-auto drop-shadow-[0_25px_40px_rgba(120,40,20,0.25)] overflow-visible"
        aria-label="Modern 2-Tier Artisan Butterscotch Birthday Cake with Candle Mounted On Top"
      >
        <defs>
          {/* Marble Stand Gradient */}
          <linearGradient id="marbleStandGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F8FAFC" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Stand Rim Gold Trim */}
          <linearGradient id="goldTrimGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Cake Frosting Cream Gradient */}
          <linearGradient id="cakeCreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="15%" stopColor="#FFFDF5" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>

          {/* Glossy Salted Caramel Drip Gradient */}
          <linearGradient id="caramelDripGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="35%" stopColor="#EA580C" />
            <stop offset="75%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          {/* Butterscotch Mirror Glaze for Top Surfaces */}
          <radialGradient id="butterscotchMirrorGlaze" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="30%" stopColor="#FDE68A" />
            <stop offset="65%" stopColor="#F59E0B" />
            <stop offset="88%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Butterscotch Rosette Swirl */}
          <radialGradient id="rosetteGrad2" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FDE68A" />
            <stop offset="80%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Praline Crunch Pearls */}
          <radialGradient id="pralinePearl2" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* Gold Candle Wax Gradient */}
          <linearGradient id="candleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Toffee Shard Glass Gradient */}
          <linearGradient id="toffeeShardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.9" />
          </linearGradient>

          {/* Candle Flame Glow Filter */}
          <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* 1. PEDESTAL STAND (Marble & Gold Trim) */}
        {/* ======================================================== */}
        <ellipse cx="180" cy="336" rx="84" ry="14" fill="#94A3B8" opacity="0.3" />
        <path
          d="M142 312 Q180 306 218 312 L228 332 Q180 340 132 332 Z"
          fill="url(#marbleStandGrad2)"
          stroke="#CBD5E1"
          strokeWidth="1.2"
        />
        <rect x="166" y="306" width="28" height="6" rx="3" fill="url(#goldTrimGrad2)" />

        {/* Platter Base */}
        <ellipse cx="180" cy="306" rx="156" ry="24" fill="url(#marbleStandGrad2)" />
        <ellipse cx="180" cy="306" rx="156" ry="24" fill="none" stroke="url(#goldTrimGrad2)" strokeWidth="3" />
        <ellipse cx="180" cy="304" rx="150" ry="22" fill="#FFFFFF" opacity="0.8" />

        {/* Praline Crunch Pearls along Platter Rim */}
        {Array.from({ length: 26 }).map((_, i) => {
          const angle = (i / 26) * Math.PI;
          const px = 180 + Math.cos(angle - Math.PI / 2) * 128;
          const py = 286 + Math.sin(angle - Math.PI / 2) * 15;
          const r = 2.4 + (i % 3) * 0.7;
          return <circle key={i} cx={px} cy={py} r={r} fill="url(#pralinePearl2)" />;
        })}

        {/* ======================================================== */}
        {/* 2. BOTTOM CAKE TIER (Wide Base Cylinder) */}
        {/* ======================================================== */}
        <path
          d="M56 200 L56 274 C56 295, 304 295, 304 274 L304 200 Z"
          fill="url(#cakeCreamGrad)"
          stroke="#FDE68A"
          strokeWidth="1.2"
        />

        {/* Textured Spatula Waves on Bottom Tier */}
        <path d="M58 226 Q180 248 302 226" fill="none" stroke="#FEF3C7" strokeWidth="2.5" opacity="0.85" />
        <path d="M58 252 Q180 274 302 252" fill="none" stroke="#FEF3C7" strokeWidth="2" opacity="0.75" />

        {/* Bottom Tier Caramel Drips */}
        <path
          d="M56 200 C64 218, 68 248, 72 244 C76 240, 80 205, 86 205 C92 205, 96 262, 100 262 C104 262, 108 212, 114 212 C120 212, 124 235, 128 235 C132 235, 136 206, 142 206 C148 206, 152 258, 156 258 C160 258, 164 210, 172 210 C180 210, 184 246, 188 246 C192 246, 196 205, 202 205 C208 205, 212 268, 216 268 C220 268, 224 214, 232 214 C240 214, 244 250, 248 250 C252 250, 256 205, 264 205 C272 205, 276 240, 280 240 C284 240, 292 216, 304 200 L304 200 C304 180, 56 180, 56 200 Z"
          fill="url(#caramelDripGrad2)"
        />

        {/* Specular Droplet Highlights on Bottom Drips */}
        <ellipse cx="100" cy="258" rx="2" ry="3" fill="#FEF3C7" opacity="0.9" />
        <ellipse cx="156" cy="254" rx="2" ry="3" fill="#FEF3C7" opacity="0.9" />
        <ellipse cx="216" cy="264" rx="2" ry="3" fill="#FEF3C7" opacity="0.9" />

        {/* Bottom Tier Top Surface */}
        <ellipse cx="180" cy="200" rx="124" ry="26" fill="url(#butterscotchMirrorGlaze)" />

        {/* Base Tier Pearl Trim at Joint */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI;
          const px = 180 + Math.cos(angle - Math.PI / 2) * 98;
          const py = 185 + Math.sin(angle - Math.PI / 2) * 12;
          return <circle key={i} cx={px} cy={py} r="2.6" fill="url(#pralinePearl2)" />;
        })}

        {/* ======================================================== */}
        {/* 3. TOP CAKE TIER (Sleek Modern Cylinder) */}
        {/* ======================================================== */}
        <path
          d="M102 124 L102 178 C102 195, 258 195, 258 178 L258 124 Z"
          fill="url(#cakeCreamGrad)"
          stroke="#FDE68A"
          strokeWidth="1.2"
        />

        {/* Top Tier Caramel Drips */}
        <path
          d="M102 124 C108 138, 112 165, 116 162 C120 159, 124 130, 130 130 C136 130, 140 174, 144 174 C148 174, 152 134, 158 134 C164 134, 168 158, 172 158 C176 158, 180 128, 186 128 C192 128, 196 172, 200 172 C204 172, 208 132, 216 132 C224 132, 228 160, 232 160 C236 160, 244 138, 258 124 L258 124 C258 110, 102 110, 102 124 Z"
          fill="url(#caramelDripGrad2)"
        />

        {/* Top Tier Surface (Butterscotch Mirror Glaze) */}
        <ellipse cx="180" cy="124" rx="78" ry="20" fill="url(#butterscotchMirrorGlaze)" />
        <ellipse cx="180" cy="124" rx="58" ry="14" fill="none" stroke="#FDE68A" strokeWidth="2" opacity="0.85" />
        <ellipse cx="180" cy="124" rx="36" ry="9" fill="none" stroke="#FFFBEB" strokeWidth="1.5" opacity="0.9" />

        {/* ======================================================== */}
        {/* 4. LUXURY TOPPINGS (Macaron, Toffee Shards, Rosettes) */}
        {/* ======================================================== */}
        {/* Golden Honeycomb / Toffee Shards standing proudly */}
        <polygon points="126,120 135,72 144,116 136,122" fill="url(#toffeeShardGrad)" stroke="#FEF3C7" strokeWidth="1" />
        <polygon points="234,120 225,76 216,118 224,123" fill="url(#toffeeShardGrad)" stroke="#FEF3C7" strokeWidth="1" />

        {/* Butterscotch French Macaron on Left */}
        <g transform="translate(112, 115) rotate(-14)">
          <ellipse cx="0" cy="-4" rx="14" ry="7" fill="url(#rosetteGrad2)" />
          <ellipse cx="0" cy="0" rx="13" ry="4" fill="#FEF3C7" />
          <ellipse cx="0" cy="4" rx="14" ry="7" fill="url(#rosetteGrad2)" />
        </g>

        {/* Swirled Whipped Butterscotch Rosettes */}
        <g transform="translate(138, 116)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#rosetteGrad2)" />
          <circle cx="0" cy="-1" r="2.5" fill="#78350F" />
        </g>
        <g transform="translate(222, 118)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#rosetteGrad2)" />
          <circle cx="0" cy="-1" r="2.5" fill="#78350F" />
        </g>

        {/* Candied Butterscotch Pearls & Gold Leaf Specks */}
        <circle cx="156" cy="126" r="3" fill="url(#pralinePearl2)" />
        <circle cx="204" cy="127" r="3.2" fill="url(#pralinePearl2)" />
        <circle cx="170" cy="130" r="2.5" fill="url(#pralinePearl2)" />

        {/* Shimmering Starlight Diamond Sparkles (✦) on Cake */}
        <text x="146" y="106" fill="#FDE047" fontSize="12" className="animate-pulse">✦</text>
        <text x="214" y="104" fill="#FDE047" fontSize="13" className="animate-pulse">✦</text>
        <text x="92" y="196" fill="#FDE047" fontSize="11" className="animate-pulse">✦</text>
        <text x="268" y="194" fill="#FDE047" fontSize="12" className="animate-pulse">✦</text>

        {/* ======================================================== */}
        {/* 5. THE CANDLE FIRMLY MOUNTED DIRECTLY ON TOP OF THE CAKE */}
        {/* ======================================================== */}
        {/* Candle Pick Stem (visibly embedded into cx=180, cy=124) */}
        <rect x="178.5" y="108" width="3" height="18" rx="1.5" fill="url(#candleGoldGrad)" stroke="#78350F" strokeWidth="0.5" />

        {/* Candle Base Accent Plate */}
        <ellipse cx="180" cy="110" rx="9" ry="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />

        {/* Candle Body Card: Sculpted "20" (Outfit Modern Number Font) */}
        <g transform="translate(180, 78)">
          {/* Candle Plaque Background */}
          <rect
            x="-32"
            y="-22"
            width="64"
            height="44"
            rx="12"
            fill="url(#candleGoldGrad)"
            stroke="#92400E"
            strokeWidth="1.8"
            filter="drop-shadow(0 4px 10px rgba(180,83,9,0.45))"
          />
          {/* Inner Golden Rim */}
          <rect
            x="-29"
            y="-19"
            width="58"
            height="38"
            rx="9"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="1.2"
            opacity="0.85"
          />
          {/* Number 20 in Modern, Crystal-Clear Numeral Typography */}
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fill="#451A03"
            fontSize="26"
            fontWeight="900"
            fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
            letterSpacing="1"
          >
            20
          </text>
        </g>

        {/* Candle Wick on top of plaque */}
        <line x1="180" y1="56" x2="180" y2="48" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Candle Flame / Smoke (Tightly Anchored Directly Above Wick) */}
        {!isBlown ? (
          <g transform="translate(180, 36)">
            {/* 1. Pulsing & Blinking Ambient Candlelight Halo (Cast on Cake) */}
            <circle
              cx="0"
              cy="2"
              r="26"
              fill="#F59E0B"
              opacity="0.35"
              filter="url(#flameGlow)"
              style={{
                transformOrigin: '0px 2px',
                animation: 'candleLightBlinkGlow 0.9s ease-in-out infinite',
              }}
            />
            <circle
              cx="0"
              cy="2"
              r="16"
              fill="#FDE047"
              opacity="0.45"
              filter="url(#flameGlow)"
              style={{
                transformOrigin: '0px 2px',
                animation: 'candleLightBlinkGlow 0.75s ease-in-out 0.15s infinite',
              }}
            />

            {/* 2. Realistic Dancing & Flickering Flame Body */}
            <g
              filter="url(#flameGlow)"
              style={{
                transformOrigin: '0px 8px',
                animation: 'realCandleFlameDance 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            >
              {/* Outer Radiant Flame Teardrop */}
              <path
                d="M0 -24 C9 -11, 11 4, 0 10 C-11 4, -9 -11, 0 -24 Z"
                fill="#EA580C"
                opacity="0.9"
              />
              {/* Mid Amber Teardrop */}
              <path
                d="M0 -20 C7 -9, 9 2, 0 8 C-9 2, -7 -9, 0 -20 Z"
                fill="#F59E0B"
              />
              {/* Golden Yellow Flame */}
              <path
                d="M0 -15 C5 -7, 6 1, 0 6 C-6 1, -5 -7, 0 -15 Z"
                fill="#FDE047"
              />
              {/* White-Hot Core Teardrop */}
              <path
                d="M0 -10 C3 -5, 3.5 0, 0 4 C-3.5 0, -3 -5, 0 -10 Z"
                fill="#FFFFFF"
                opacity="0.98"
              />
              {/* Base Blue Chemistry Flame Root */}
              <circle cx="0" cy="8" r="3.2" fill="#38BDF8" opacity="0.9" />
            </g>

            {/* Micro Warm Heat Shimmer Sparkle */}
            <text
              x="-2"
              y="-28"
              fill="#FEF08A"
              fontSize="8"
              className="animate-ping pointer-events-none select-none"
              style={{ animationDuration: '1.4s' }}
            >
              ✦
            </text>
          </g>
        ) : (
          <g transform="translate(180, 34)" className="animate-smoke">
            {/* Smoke Puff 1 */}
            <ellipse cx="0" cy="0" rx="5" ry="8" fill="#94A3B8" opacity="0.6" filter="blur(2px)" />
            {/* Smoke Puff 2 (Rising) */}
            <ellipse cx="3" cy="-14" rx="7" ry="11" fill="#CBD5E1" opacity="0.45" filter="blur(3px)" />
            {/* Smoke Puff 3 (Fading) */}
            <ellipse cx="-2" cy="-28" rx="9" ry="13" fill="#E2E8F0" opacity="0.3" filter="blur(4px)" />
          </g>
        )}
      </svg>
    </div>
  );
};
