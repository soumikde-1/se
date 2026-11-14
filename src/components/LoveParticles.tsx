import React, { useMemo } from 'react';

interface LoveParticlesProps {
  density?: 'gentle' | 'abundant';
}

interface HeartSpec {
  id: number;
  leftPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  opacity: number;
  color: string;
}

const HEART_COLORS = [
  '#F43F5E',
  '#FB7185',
  '#EC4899',
  '#F472B6',
  '#E11D48',
  '#FDA4AF',
];

export const LoveParticles: React.FC<LoveParticlesProps> = ({
  density = 'gentle',
}) => {
  const count = density === 'abundant' ? 34 : 18;

  const hearts = useMemo<HeartSpec[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 37 + 13) % 100;
      const seed2 = (i * 53 + 7) % 100;
      return {
        id: i,
        leftPercent: (i / count) * 96 + (seed % 5),
        sizePx: density === 'abundant' ? 16 + (seed % 22) : 14 + (seed % 16),
        durationSec: density === 'abundant' ? 5.5 + (seed2 % 4) : 7.5 + (seed2 % 5),
        delaySec: -((seed / 100) * 8),
        opacity: density === 'abundant' ? 0.55 + (seed % 35) / 100 : 0.38 + (seed % 30) / 100,
        color: HEART_COLORS[i % HEART_COLORS.length],
      };
    });
  }, [count, density]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="animate-float-heart absolute top-0"
          style={
            {
              left: `${heart.leftPercent}%`,
              '--duration': `${heart.durationSec}s`,
              '--delay': `${heart.delaySec}s`,
              opacity: heart.opacity,
            } as React.CSSProperties
          }
        >
          <svg
            width={heart.sizePx}
            height={heart.sizePx}
            viewBox="0 0 24 24"
            fill={heart.color}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
