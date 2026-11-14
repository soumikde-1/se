import React, { useEffect, useRef } from 'react';

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState?: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubeBackgroundAudioProps {
  videoId: string;
  startSeconds: number;
  isActive: boolean;
  isMuted: boolean;
}

const TARGET_VOLUME = 85;

export const YouTubeBackgroundAudio: React.FC<YouTubeBackgroundAudioProps> = ({
  videoId,
  startSeconds,
  isActive,
  isMuted,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef(false);
  const fadeIntervalRef = useRef<number | null>(null);
  const activeRef = useRef(isActive);
  const mutedRef = useRef(isMuted);

  activeRef.current = isActive;
  mutedRef.current = isMuted;

  const clearFadeTimer = () => {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const startPlaybackWithFadeIn = () => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current || !activeRef.current) return;

    clearFadeTimer();

    try {
      player.seekTo(startSeconds, true);
      if (mutedRef.current) {
        player.mute();
        player.setVolume(0);
      } else {
        player.unMute();
        player.setVolume(12);
      }
      player.playVideo();

      if (!mutedRef.current) {
        let vol = 12;
        fadeIntervalRef.current = window.setInterval(() => {
          if (!activeRef.current || mutedRef.current) {
            clearFadeTimer();
            return;
          }
          vol = Math.min(TARGET_VOLUME, vol + 8);
          try {
            player.setVolume(vol);
          } catch {
            clearFadeTimer();
          }
          if (vol >= TARGET_VOLUME) {
            clearFadeTimer();
          }
        }, 90);
      }
    } catch {
      // Ignore YT transient state errors
    }
  };

  const fadeOutAndPause = () => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;

    clearFadeTimer();

    try {
      const state = player.getPlayerState();
      // If not playing or buffering, just pause quietly
      if (state !== 1 && state !== 3) {
        player.pauseVideo();
        return;
      }

      let currentVol = TARGET_VOLUME;
      try {
        currentVol = player.getVolume() || TARGET_VOLUME;
      } catch {
        currentVol = TARGET_VOLUME;
      }

      if (mutedRef.current || currentVol <= 0) {
        player.setVolume(0);
        player.pauseVideo();
        return;
      }

      const step = Math.max(4, Math.ceil(currentVol / 18));
      fadeIntervalRef.current = window.setInterval(() => {
        if (activeRef.current) {
          clearFadeTimer();
          return;
        }
        currentVol = Math.max(0, currentVol - step);
        try {
          player.setVolume(currentVol);
          if (currentVol <= 0) {
            clearFadeTimer();
            player.pauseVideo();
          }
        } catch {
          clearFadeTimer();
        }
      }, 75);
    } catch {
      // Ignore YT transient errors
    }
  };

  // Load YouTube IFrame Player API and mount player once
  useEffect(() => {
    let isMounted = true;

    const createPlayer = () => {
      if (!isMounted || !containerRef.current || playerRef.current || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: startSeconds,
          loop: 1,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (!isMounted) return;
            isReadyRef.current = true;
            if (activeRef.current) {
              startPlaybackWithFadeIn();
            }
          },
          onStateChange: (event) => {
            // Keep looping from 0:23 if song ends while user is still browsing cards
            if (event.data === 0 && activeRef.current) {
              try {
                event.target.seekTo(startSeconds, true);
                event.target.playVideo();
              } catch {
                // Ignore
              }
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        createPlayer();
      };
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
    }

    return () => {
      isMounted = false;
      clearFadeTimer();
      try {
        playerRef.current?.destroy();
      } catch {
        // Ignore cleanup errors
      }
      playerRef.current = null;
      isReadyRef.current = false;
    };
  }, [videoId, startSeconds]);

  // React to active stage changes (start at 0:23 on scratch-cards, fade out cleanly when leaving)
  useEffect(() => {
    if (isActive) {
      startPlaybackWithFadeIn();

      // Mobile / strict autoplay safeguard: resume playback on first tap/scratch if browser blocked auto-unmute
      const resumeOnGesture = () => {
        const player = playerRef.current;
        if (!player || !isReadyRef.current || !activeRef.current) return;
        try {
          const state = player.getPlayerState();
          if (state !== 1) {
            player.seekTo(startSeconds, true);
            if (!mutedRef.current) {
              player.unMute();
              player.setVolume(TARGET_VOLUME);
            }
            player.playVideo();
          }
        } catch {
          // Ignore
        }
      };

      window.addEventListener('pointerdown', resumeOnGesture, { once: true });
      window.addEventListener('touchstart', resumeOnGesture, { once: true });
      return () => {
        window.removeEventListener('pointerdown', resumeOnGesture);
        window.removeEventListener('touchstart', resumeOnGesture);
      };
    } else {
      fadeOutAndPause();
    }
  }, [isActive, startSeconds]);

  // Sync mute toggle cleanly
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    try {
      if (isMuted) {
        player.mute();
      } else {
        player.unMute();
        if (activeRef.current) {
          player.setVolume(TARGET_VOLUME);
        }
      }
    } catch {
      // Ignore
    }
  }, [isMuted]);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 right-0 w-[2px] h-[2px] opacity-[0.001] pointer-events-none overflow-hidden -z-10"
    >
      <div ref={containerRef} />
    </div>
  );
};
