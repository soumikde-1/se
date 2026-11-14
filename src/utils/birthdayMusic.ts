type MusicMode = 'chime' | 'soft-wish';

class BirthdayMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private mode: MusicMode = 'chime';
  private timer: number | null = null;
  private fadeTimer: number | null = null;
  private isMuted = false;
  private masterGain: GainNode | null = null;

  // Bright celebratory Happy Birthday chime (Stage 2: Cake & Balloons)
  private chimeMelody: Array<[number, number]> = [
    [65, 0.75], [65, 0.25], [67, 1.0], [65, 1.0], [70, 1.0], [69, 2.0],
    [65, 0.75], [65, 0.25], [67, 1.0], [65, 1.0], [72, 1.0], [70, 2.0],
    [65, 0.75], [65, 0.25], [77, 1.0], [74, 1.0], [70, 1.0], [69, 1.0], [67, 1.5],
    [75, 0.75], [75, 0.25], [74, 1.0], [70, 1.0], [72, 1.0], [70, 2.5],
  ];

  // Ultra-soft tender Happy Birthday lullaby with gentle warm harmony (Wish Pages)
  // Key of C major (gentle music-box / warm pad register with soft bass root)
  private softWishNotes: Array<{ midi: number; beats: number; bass?: number }> = [
    { midi: 60, beats: 0.75, bass: 48 }, { midi: 60, beats: 0.25 }, { midi: 62, beats: 1.0 },
    { midi: 60, beats: 1.0, bass: 43 }, { midi: 65, beats: 1.0 }, { midi: 64, beats: 2.2 },
    { midi: 60, beats: 0.75, bass: 48 }, { midi: 60, beats: 0.25 }, { midi: 62, beats: 1.0 },
    { midi: 60, beats: 1.0, bass: 43 }, { midi: 67, beats: 1.0 }, { midi: 65, beats: 2.2 },
    { midi: 60, beats: 0.75, bass: 45 }, { midi: 60, beats: 0.25 }, { midi: 72, beats: 1.0 },
    { midi: 69, beats: 1.0, bass: 41 }, { midi: 65, beats: 1.0 }, { midi: 64, beats: 1.0 }, { midi: 62, beats: 2.0 },
    { midi: 70, beats: 0.75, bass: 43 }, { midi: 70, beats: 0.25 }, { midi: 69, beats: 1.0 },
    { midi: 65, beats: 1.0, bass: 48 }, { midi: 67, beats: 1.0 }, { midi: 65, beats: 3.0 },
  ];

  private getTargetGain(): number {
    if (this.isMuted) return 0;
    return this.mode === 'soft-wish' ? 0.22 : 0.28;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.getTargetGain(), this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        } catch {
          // Ignore if audio device is unavailable in sandbox
        }
      }
    }
    return this.ctx;
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  private playChime(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.2);

      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.08, startTime);

      osc1.connect(noteGain);
      osc2.connect(osc2Gain);
      osc2Gain.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration * 1.3);
      osc2.stop(startTime + duration * 1.3);
    } catch {
      // Audio node scheduling failure
    }
  }

  private playSoftPadNote(
    freq: number,
    startTime: number,
    duration: number,
    bassFreq?: number
  ) {
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;

    try {
      // Silky sine lead with gentle warm sub-octave cushion
      const lead = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      lead.type = 'sine';
      lead.frequency.setValueAtTime(freq, startTime);

      leadGain.gain.setValueAtTime(0.0001, startTime);
      leadGain.gain.linearRampToValueAtTime(0.22, startTime + 0.08);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.5);

      lead.connect(leadGain);
      leadGain.connect(this.masterGain);
      lead.start(startTime);
      lead.stop(startTime + duration * 1.55);

      if (bassFreq) {
        const pad = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        pad.type = 'sine';
        pad.frequency.setValueAtTime(bassFreq, startTime);

        padGain.gain.setValueAtTime(0.0001, startTime);
        padGain.gain.linearRampToValueAtTime(0.12, startTime + 0.2);
        padGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 2.4);

        pad.connect(padGain);
        padGain.connect(this.masterGain);
        pad.start(startTime);
        pad.stop(startTime + duration * 2.5);
      }
    } catch {
      // Audio node scheduling failure
    }
  }

  public start(mode: MusicMode = 'chime', fadeInMs = 300) {
    // If same mode is already playing cleanly, do nothing
    if (this.isPlaying && this.mode === mode) return;

    this.stop();
    this.mode = mode;

    const ctx = this.getContext();
    if (!ctx) return;
    this.isPlaying = true;

    if (this.masterGain) {
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      if (!this.isMuted) {
        this.masterGain.gain.linearRampToValueAtTime(
          this.getTargetGain(),
          now + Math.max(0.1, fadeInMs / 1000)
        );
      }
    }

    // Listen once for first user gesture to unlock AudioContext cleanly
    const unlockAndPlay = () => {
      if (!this.isPlaying) return;
      if (this.ctx && this.ctx.state !== 'running') {
        this.ctx.resume().then(() => {
          if (this.isPlaying) this.scheduleLoop();
        }).catch(() => {});
      } else {
        this.scheduleLoop();
      }
    };

    if (ctx.state === 'running') {
      this.scheduleLoop();
    } else {
      window.addEventListener('pointerdown', unlockAndPlay, { once: true });
      window.addEventListener('keydown', unlockAndPlay, { once: true });
      window.addEventListener('click', unlockAndPlay, { once: true });
    }
  }

  public startSoftWishTone(fadeInMs = 1800) {
    this.start('soft-wish', fadeInMs);
  }

  private scheduleLoop() {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return;

    const startTime = this.ctx.currentTime + 0.05;
    let offset = 0;

    if (this.mode === 'chime') {
      const beatSec = 60 / 104;
      for (const [midi, beats] of this.chimeMelody) {
        const noteDuration = beats * beatSec;
        this.playChime(this.midiToFreq(midi), startTime + offset, noteDuration);
        offset += noteDuration;
      }
    } else {
      const beatSec = 60 / 76; // Slower, gentler romantic cadence
      for (const note of this.softWishNotes) {
        const noteDuration = note.beats * beatSec;
        this.playSoftPadNote(
          this.midiToFreq(note.midi),
          startTime + offset,
          noteDuration,
          note.bass ? this.midiToFreq(note.bass) : undefined
        );
        offset += noteDuration;
      }
    }

    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleLoop();
      }
    }, offset * 1000 + 900);
  }

  public fadeOutAndStop(durationMs = 800) {
    if (!this.isPlaying) return;
    if (this.fadeTimer) {
      window.clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }

    if (this.ctx && this.masterGain && this.ctx.state === 'running') {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + durationMs / 1000);
    }

    this.fadeTimer = window.setTimeout(() => {
      this.stop();
    }, durationMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.fadeTimer) {
      window.clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.getTargetGain(), now);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const birthdayMusic = new BirthdayMusicEngine();
