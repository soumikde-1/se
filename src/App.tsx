import React, { useEffect, useState } from 'react';
import { CheckCircle2, Download, Square, Volume2, VolumeX, X } from 'lucide-react';
import {
  BirthdayStage,
  getNextStage,
  parseInitialStageFromSearch,
} from './utils/birthdayLogic';
import { birthdayMusic } from './utils/birthdayMusic';
import { initSecurityProtection } from './utils/securityProtection';
import { StarryLockScreen } from './components/StarryLockScreen';
import { BalloonsAndCakeStage } from './components/BalloonsAndCakeStage';
import { ScratchCardsStage } from './components/ScratchCardsStage';
import { HappyBirthdayFinaleStage } from './components/HappyBirthdayFinaleStage';
import { FinalWishStage } from './components/FinalWishStage';
import { YouTubeBackgroundAudio } from './components/YouTubeBackgroundAudio';
import { useSurpriseRecorder } from './hooks/useSurpriseRecorder';
import {
  formatDuration,
  SurpriseRecorderModal,
} from './components/SurpriseRecorderModal';

export function App() {
  const [stage, setStage] = useState<BirthdayStage>(() =>
    parseInitialStageFromSearch(
      typeof window !== 'undefined' ? window.location.search : ''
    )
  );
  const [isMuted, setIsMuted] = useState(false);
  const recorder = useSurpriseRecorder();
  const {
    status: recorderStatus,
    setAutoSaveCountdown,
    stopRecording,
  } = recorder;

  useEffect(() => {
    const cleanup = initSecurityProtection();
    return cleanup;
  }, []);

  // Stage-based background music transitions:
  // - lock: silent
  // - balloons-cake: gentle celebratory chime
  // - scratch-cards: fade out chime, play YouTube song from 0:23
  // - happy-birthday & final-wish: fade out YouTube song, fade in soft Happy Birthday wish tone
  useEffect(() => {
    if (stage === 'lock') {
      birthdayMusic.stop();
      return;
    }

    if (stage === 'balloons-cake') {
      birthdayMusic.start('chime', 300);
      return;
    }

    if (stage === 'scratch-cards') {
      birthdayMusic.fadeOutAndStop(800);
      return;
    }

    if (stage === 'happy-birthday' || stage === 'final-wish') {
      const timer = window.setTimeout(() => {
        birthdayMusic.startSoftWishTone(1800);
      }, 750);
      return () => window.clearTimeout(timer);
    }
  }, [stage]);

  // Automatic 3-second finalization & MP4 download once user finishes all pages and reaches final-wish
  useEffect(() => {
    if (stage !== 'final-wish' || recorderStatus !== 'recording') {
      setAutoSaveCountdown(null);
      return;
    }

    let remaining = 3;
    setAutoSaveCountdown(remaining);

    const interval = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setAutoSaveCountdown(remaining);
      } else {
        window.clearInterval(interval);
        setAutoSaveCountdown(null);
        stopRecording();
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
      setAutoSaveCountdown(null);
    };
  }, [stage, recorderStatus, setAutoSaveCountdown, stopRecording]);

  const advance = () => {
    setStage((current) => getNextStage(current));
  };

  const toggleSound = () => {
    const muted = birthdayMusic.toggleMute();
    setIsMuted(muted);
  };

  const handleReplay = () => {
    setStage('lock');
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative">
      {/* Background YouTube audio for scratch-cards landing stage starting at 0:23 */}
      <YouTubeBackgroundAudio
        videoId="7SEFsalTzHQ"
        startSeconds={23}
        isActive={stage === 'scratch-cards'}
        isMuted={isMuted}
      />

      {/* Saved Confirmation Toast Banner when MP4 finishes auto-downloading */}
      {recorder.showSavedToast && recorder.status === 'saved' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md rounded-2xl border border-emerald-400/70 bg-emerald-950/95 text-emerald-50 px-4 py-3 shadow-[0_12px_40px_rgba(16,185,129,0.45)] backdrop-blur-xl flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-emerald-200">
              ভিডিওটি সফলভাবে সেভ হয়েছে!
            </p>
            <p className="text-[11px] text-emerald-100/90 mt-0.5 leading-relaxed font-sans-ui">
              অডিও ও ভিডিওসহ ফাইলটি আপনার ডিভাইসে ডাউনলোড ও সেভ করা হয়েছে।
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={recorder.openModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-400 text-zinc-950 text-[11px] font-bold hover:bg-emerald-300 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Watch / Download Again</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={recorder.dismissSavedToast}
            aria-label="Dismiss saved message"
            className="p-1 rounded-full hover:bg-white/10 text-emerald-200 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top-right floating controls: active REC controller + sound toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {recorder.status === 'recording' && (
          <button
            type="button"
            onClick={recorder.stopRecording}
            title="Stop recording and save MP4 video"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-rose-300/60 transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="tabular-nums font-number">
              {recorder.autoSaveCountdown !== null
                ? `Saving ${recorder.autoSaveCountdown}s`
                : formatDuration(recorder.elapsedSeconds)}
            </span>
            <Square className="w-3 h-3 fill-white ml-0.5" />
            <span className="hidden xs:inline">Stop &amp; Save</span>
          </button>
        )}

        {recorder.status === 'saved' && !recorder.isModalOpen && (
          <button
            type="button"
            onClick={recorder.openModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-emerald-300/60 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Saved Video</span>
          </button>
        )}

        {stage !== 'lock' && (
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            className="p-2.5 rounded-full bg-white/70 hover:bg-white text-rose-900 shadow-lg backdrop-blur-md border border-rose-200 transition-all cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-rose-700 animate-pulse" />
            )}
          </button>
        )}
      </div>

      {stage === 'lock' && (
        <StarryLockScreen
          onUnlockComplete={advance}
          onStartRecording={recorder.startRecording}
          recorderStatus={recorder.status}
          recorderError={recorder.errorMessage}
        />
      )}
      {stage === 'balloons-cake' && (
        <BalloonsAndCakeStage onCakeBlownOut={advance} />
      )}
      {stage === 'scratch-cards' && (
        <ScratchCardsStage onAllScratchedContinue={advance} />
      )}
      {stage === 'happy-birthday' && (
        <HappyBirthdayFinaleStage onContinueToWish={advance} />
      )}
      {stage === 'final-wish' && (
        <FinalWishStage
          onReplay={handleReplay}
          isRecording={recorder.status === 'recording'}
          autoSaveCountdown={recorder.autoSaveCountdown}
          hasSavedVideo={recorder.status === 'saved'}
          onStopAndSave={recorder.stopRecording}
          onOpenSavedVideo={recorder.openModal}
        />
      )}

      <SurpriseRecorderModal
        isOpen={recorder.isModalOpen}
        onClose={recorder.closeModal}
        status={recorder.status}
        recordedBlob={recorder.recordedBlob}
        recordedFileName={recorder.recordedFileName}
        previewUrl={recorder.previewUrl}
        onDownloadCopy={recorder.downloadSavedCopy}
        onResetRecorder={recorder.resetRecorder}
      />
    </main>
  );
}

export default App;
