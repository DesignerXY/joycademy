// Mini Game 1: 抓住捣蛋鱼 (Catch the Mischievous Fish)

import confetti from 'canvas-confetti';
import { fishSound } from './sound.js';

export class MischiefGame {
  constructor(containerEl, onRewardGranted) {
    this.container = containerEl;
    this.onRewardGranted = onRewardGranted;

    this.score = 0;
    this.timeLeft = 30;
    this.combo = 0;
    this.timerId = null;
    this.spawnTimerId = null;
    this.isPlaying = false;

    this.holes = [];
    this.holeCount = 8;

    this.init();
  }

  init() {
    this.renderLayout();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="mischief-arena">
        <div class="mischief-topbar">
          <div class="score-pill">🎯 得分: <span id="mischief-score">0</span></div>
          <div class="combo-pill" id="mischief-combo" style="display: none;">🔥 连击 x1</div>
          <div class="time-pill">⏳ 倒计时: <span id="mischief-time">30</span>s</div>
          <button id="btn-start-mischief" class="btn-game-action">🚀 开始抓捕！</button>
        </div>

        <div class="mischief-grid" id="mischief-holes-grid">
          <!-- 8 个珊瑚礁洞穴 -->
        </div>

        <div class="mischief-hint">
          💡 点击从珊瑚洞穴探头的【淘气黑鱼】(+100分) 或【黄金捣蛋鱼】(+300分)！千万别点到【海胆炸弹】(-150分)！
        </div>
      </div>
    `;

    const grid = document.getElementById('mischief-holes-grid');
    grid.innerHTML = '';
    this.holes = [];

    for (let i = 0; i < this.holeCount; i++) {
      const hole = document.createElement('div');
      hole.className = 'mischief-hole';
      hole.dataset.index = i;
      hole.innerHTML = `
        <div class="coral-cave">🪸</div>
        <div class="mischief-target hidden"></div>
      `;
      hole.addEventListener('click', () => this.hitHole(i));
      grid.appendChild(hole);
      this.holes.push({
        el: hole,
        targetEl: hole.querySelector('.mischief-target'),
        currentType: null,
        active: false,
        timer: null
      });
    }

    const startBtn = document.getElementById('btn-start-mischief');
    startBtn.addEventListener('click', () => this.startGame());
  }

  startGame() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 30;
    this.updateHUD();

    const startBtn = document.getElementById('btn-start-mischief');
    startBtn.disabled = true;
    startBtn.textContent = '捕鱼进行中...';

    fishSound.playBubble();

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateHUD();
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    this.spawnLoop();
  }

  spawnLoop() {
    if (!this.isPlaying) return;

    // 随机选择 1-2 个空闲洞穴探头
    const idleHoles = this.holes.filter(h => !h.active);
    if (idleHoles.length > 0) {
      const hole = idleHoles[Math.floor(Math.random() * idleHoles.length)];
      this.popupTarget(hole);
    }

    const nextDelay = 500 + Math.random() * 600;
    this.spawnTimerId = setTimeout(() => this.spawnLoop(), nextDelay);
  }

  popupTarget(hole) {
    hole.active = true;
    const rand = Math.random();
    let type = 'normal'; // normal: 70%, golden: 15%, bomb: 15%
    if (rand < 0.15) {
      type = 'golden';
    } else if (rand < 0.30) {
      type = 'bomb';
    }

    hole.currentType = type;
    hole.targetEl.classList.remove('hidden', 'hit');

    if (type === 'normal') {
      hole.targetEl.innerHTML = `<span>🐟</span><small style="color:#38bdf8;">做鬼脸</small>`;
    } else if (type === 'golden') {
      hole.targetEl.innerHTML = `<span>🐠</span><small style="color:#fde047;">✨黄金鱼</small>`;
    } else {
      hole.targetEl.innerHTML = `<span>💣</span><small style="color:#ef4444;">炸弹海胆</small>`;
    }

    // 停留 0.8-1.4 秒后缩回洞穴
    const stayTime = type === 'golden' ? 900 : 1300;
    hole.timer = setTimeout(() => {
      this.hideHole(hole);
    }, stayTime);
  }

  hideHole(hole) {
    hole.active = false;
    hole.currentType = null;
    hole.targetEl.classList.add('hidden');
    if (hole.timer) clearTimeout(hole.timer);
  }

  hitHole(index) {
    if (!this.isPlaying) return;
    const hole = this.holes[index];
    if (!hole.active || !hole.currentType) return;

    const type = hole.currentType;
    hole.targetEl.classList.add('hit');

    if (type === 'normal') {
      this.combo++;
      const pts = 100 * Math.min(3, 1 + Math.floor(this.combo / 4));
      this.score += pts;
      fishSound.playCatch();
    } else if (type === 'golden') {
      this.combo += 2;
      this.score += 300;
      fishSound.playCatch();
      confetti({ particleCount: 30, spread: 50 });
    } else if (type === 'bomb') {
      this.combo = 0;
      this.score = Math.max(0, this.score - 150);
      fishSound.playBubble();
    }

    this.updateHUD();
    setTimeout(() => {
      this.hideHole(hole);
    }, 200);
  }

  updateHUD() {
    const sEl = document.getElementById('mischief-score');
    const tEl = document.getElementById('mischief-time');
    const cEl = document.getElementById('mischief-combo');

    if (sEl) sEl.textContent = this.score;
    if (tEl) tEl.textContent = this.timeLeft;
    if (cEl) {
      if (this.combo >= 2) {
        cEl.style.display = 'inline-flex';
        cEl.textContent = `🔥 连击 x${this.combo}`;
      } else {
        cEl.style.display = 'none';
      }
    }
  }

  endGame() {
    this.isPlaying = false;
    clearInterval(this.timerId);
    clearTimeout(this.spawnTimerId);
    this.holes.forEach(h => this.hideHole(h));

    const startBtn = document.getElementById('btn-start-mischief');
    startBtn.disabled = false;
    startBtn.textContent = '🔄 再玩一局';

    fishSound.playIronSuccess();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

    // 获得奖励食材
    if (this.onRewardGranted) {
      this.onRewardGranted(this.score);
    }

    setTimeout(() => {
      alert(`🎉 捕鱼大捷！你一共抓到了捣蛋鱼并获得了 ${this.score} 分！奖励发光水母胶质与珍珠亮粉！`);
    }, 150);
  }
}
