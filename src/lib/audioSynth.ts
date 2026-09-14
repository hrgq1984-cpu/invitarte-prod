/**
 * Ambient Audio Synthesizer and Player
 * Uses Web Audio API to produce soft, elegant ceremonial chimes/piano
 * alongside external audio streaming with user-gesture unlock.
 */

class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private isPlayingSynth: boolean = false;
  private synthInterval: number | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft bell/chime chord for ceremonial feeling
  public playCeremonialChord(freqs: number[] = [440, 554.37, 659.25, 880]) {
    try {
      this.initAudioContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      freqs.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        // Delicate decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12 * this.volume, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8 + index * 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + 3.2 + index * 0.15);
      });
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  // Continuous ambient background melody
  public startAmbientMelody() {
    this.initAudioContext();
    this.isPlayingSynth = true;

    const scale = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00]  // G Major
    ];

    let chordIdx = 0;
    this.playCeremonialChord(scale[chordIdx]);

    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
    }

    this.synthInterval = window.setInterval(() => {
      if (!this.isPlayingSynth) return;
      chordIdx = (chordIdx + 1) % scale.length;
      this.playCeremonialChord(scale[chordIdx]);
    }, 4500);
  }

  public stopAmbientMelody() {
    this.isPlayingSynth = false;
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Play custom audio stream
  public playStream(url?: string) {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    if (url) {
      try {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = this.volume;
        audio.crossOrigin = 'anonymous';

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.audioElement = audio;
            })
            .catch(() => {
              // Fallback to synthetic ceremonial chimes if URL fails
              this.startAmbientMelody();
            });
        }
      } catch {
        this.startAmbientMelody();
      }
    } else {
      this.startAmbientMelody();
    }
  }

  public pause() {
    this.stopAmbientMelody();
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }
}

export const ambientAudio = new AmbientAudioManager();
