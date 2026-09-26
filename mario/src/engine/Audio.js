// Authentic NES 8-bit Procedural Sound & BGM Synthesizer for Super Mario Bros.
export class MarioAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startOverworldBGM();
    }
    return this.isMuted;
  }

  playTone(freq, duration, type = 'square', gainLevel = 0.15, startTime = 0) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime + startTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainLevel, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playJumpSmall() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  playJumpSuper() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.22);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playCoin() {
    this.playTone(987.77, 0.08, 'sine', 0.22, 0);       // B5
    this.playTone(1318.51, 0.28, 'square', 0.22, 0.08); // E6
  }

  playStomp() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playBump() {
    this.playTone(85, 0.12, 'square', 0.25);
  }

  playPowerupAppear() {
    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((n, i) => {
      this.playTone(n, 0.08, 'square', 0.18, i * 0.06);
    });
  }

  playPowerup() {
    const notes = [330, 392, 659, 523, 587, 784, 880, 1046];
    notes.forEach((n, i) => {
      this.playTone(n, 0.09, 'square', 0.2, i * 0.05);
    });
  }

  playPipe() {
    const notes = [293, 261, 220, 196, 174, 164];
    notes.forEach((n, i) => {
      this.playTone(n, 0.08, 'triangle', 0.25, i * 0.06);
    });
  }

  playFireball() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playDie() {
    this.stopBGM();
    const notes = [523, 493, 466, 440, 415, 392, 369, 349, 329, 311, 293, 277, 261];
    notes.forEach((n, i) => {
      this.playTone(n, 0.08, 'square', 0.25, i * 0.07);
    });
  }

  playStageClear() {
    this.stopBGM();
    const fanfare = [
      { f: 392, d: 0.12, t: 0 },
      { f: 523, d: 0.12, t: 0.15 },
      { f: 659, d: 0.12, t: 0.3 },
      { f: 784, d: 0.12, t: 0.45 },
      { f: 1046, d: 0.35, t: 0.6 }
    ];
    fanfare.forEach(n => this.playTone(n.f, n.d, 'square', 0.25, n.t));
  }

  // Iconic Mario Overworld BGM Loop
  startOverworldBGM() {
    if (this.isMuted || this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;

    // Melody notes & durations (Hz, seconds)
    const melody = [
      // Intro phrase: E5 E5 - E5 - C5 E5 - G5 - - - G4
      { f: 659.25, d: 0.1 }, { f: 0, d: 0.05 },
      { f: 659.25, d: 0.1 }, { f: 0, d: 0.15 },
      { f: 659.25, d: 0.1 }, { f: 0, d: 0.15 },
      { f: 523.25, d: 0.1 }, { f: 659.25, d: 0.15 },
      { f: 0, d: 0.08 },
      { f: 783.99, d: 0.25 }, { f: 0, d: 0.35 },
      { f: 392.00, d: 0.25 }, { f: 0, d: 0.4 },

      // Main Theme Measure 1
      { f: 523.25, d: 0.18 }, { f: 0, d: 0.15 },
      { f: 392.00, d: 0.18 }, { f: 0, d: 0.15 },
      { f: 329.63, d: 0.18 }, { f: 0, d: 0.15 },
      { f: 440.00, d: 0.15 }, { f: 493.88, d: 0.15 },
      { f: 466.16, d: 0.12 }, { f: 440.00, d: 0.18 },
      { f: 392.00, d: 0.18 }, { f: 659.25, d: 0.18 },
      { f: 783.99, d: 0.18 }, { f: 880.00, d: 0.18 },
      { f: 698.46, d: 0.15 }, { f: 783.99, d: 0.15 },
      { f: 659.25, d: 0.18 }, { f: 523.25, d: 0.15 },
      { f: 587.33, d: 0.15 }, { f: 493.88, d: 0.25 },
      { f: 0, d: 0.3 }
    ];

    let totalDuration = 0;
    melody.forEach(n => totalDuration += n.d);

    const playSequence = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      let offset = 0;
      melody.forEach(item => {
        if (item.f > 0) {
          this.playTone(item.f, item.d * 0.85, 'square', 0.09, offset);
        }
        offset += item.d;
      });

      this.bgmTimer = setTimeout(() => {
        playSequence();
      }, totalDuration * 1000);
    };

    playSequence();
  }

  playPowerdown() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  startStarBGM() {
    if (this.isMuted || !this.ctx) return;
    this.stopBGM();
    this.isStarMusic = true;
    this.bgmPlaying = true;

    // Rapid upbeat Starman Arpeggio
    const starNotes = [
      493.88, 493.88, 0, 493.88, 554.37, 587.33, 493.88, 0,
      440.00, 440.00, 0, 440.00, 493.88, 523.25, 440.00, 0,
      392.00, 392.00, 0, 392.00, 440.00, 493.88, 392.00, 0,
      440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00
    ];

    const noteDur = 0.08;
    const playLoop = () => {
      if (!this.isStarMusic || this.isMuted) return;
      let offset = 0;
      starNotes.forEach(n => {
        if (n > 0) this.playTone(n, noteDur * 0.75, 'square', 0.12, offset);
        offset += noteDur;
      });
      this.starTimer = setTimeout(playLoop, starNotes.length * noteDur * 1000);
    };
    playLoop();
  }

  stopStarBGM() {
    this.isStarMusic = false;
    if (this.starTimer) {
      clearTimeout(this.starTimer);
      this.starTimer = null;
    }
    this.startOverworldBGM();
  }

  stopBGM() {
    this.bgmPlaying = false;
    this.isStarMusic = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.starTimer) {
      clearTimeout(this.starTimer);
      this.starTimer = null;
    }
  }
}
