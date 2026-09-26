// Web Audio API 纯合成音效系统（无外部音频文件依赖，高保真零延迟）

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play error:', e);
      }
    }, delay * 1000);
  }

  // 按钮轻触声
  playClick() {
    this.playTone(600, 'triangle', 0.06, 0.08);
  }

  // 答对音效（欢快的双音上升）
  playCorrect() {
    this.playTone(523.25, 'sine', 0.12, 0.15, 0);       // C5
    this.playTone(659.25, 'sine', 0.15, 0.18, 0.08);    // E5
    this.playTone(783.99, 'sine', 0.25, 0.2, 0.16);     // G5
    this.playTone(1046.50, 'triangle', 0.35, 0.22, 0.24); // C6
  }

  // 答错/提示音效
  playWrong() {
    this.playTone(330, 'sawtooth', 0.15, 0.12, 0);
    this.playTone(293.66, 'sawtooth', 0.25, 0.14, 0.12);
  }

  // 获得星星/金币
  playCoin() {
    this.playTone(987.77, 'sine', 0.08, 0.15, 0);
    this.playTone(1318.51, 'sine', 0.22, 0.2, 0.07);
  }

  // 攻击 Boss / 命中音效
  playHit() {
    this.playTone(220, 'square', 0.12, 0.18, 0);
    this.playTone(110, 'sawtooth', 0.18, 0.2, 0.06);
  }

  // 升级/成就解锁号角
  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.3, 0.2, idx * 0.1);
    });
  }

  // 升级/火柴人接力突破音效
  playLevelUp() {
    this.playTone(523.25, 'triangle', 0.1, 0.18, 0);
    this.playTone(659.25, 'triangle', 0.1, 0.18, 0.08);
    this.playTone(783.99, 'triangle', 0.12, 0.2, 0.16);
    this.playTone(1046.50, 'triangle', 0.25, 0.22, 0.24);
  }

  // Boss击败大胜利
  playVictory() {
    const melody = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 523.25, d: 0.15, t: 0.15 },
      { f: 523.25, d: 0.15, t: 0.3 },
      { f: 659.25, d: 0.35, t: 0.45 },
      { f: 587.33, d: 0.2, t: 0.8 },
      { f: 659.25, d: 0.2, t: 1.0 },
      { f: 783.99, d: 0.5, t: 1.2 },
      { f: 1046.5, d: 0.7, t: 1.6 }
    ];
    melody.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.2, n.t);
    });
  }
}

export const sound = new SoundSystem();
