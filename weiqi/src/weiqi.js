// 中国围棋核心算法与交互引擎 (Chinese Weiqi / Go Engine)

class WeiqiSound {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playStone() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    // 沉稳圆润的石子敲击声
    osc.frequency.setValueAtTime(380, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
  playCapture() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

const wqSound = new WeiqiSound();

class WeiqiGame {
  constructor() {
    this.size = 9; // 默认 9 路速战
    this.board = this.createEmptyBoard(this.size);
    this.turn = 'B'; // 'B' (黑方) 或 'W' (白方)
    this.captures = { B: 0, W: 0 };
    this.history = [];
    this.koCoord = null; // 打劫禁着坐标
    this.consecutivePasses = 0;
    this.isAI = true;
    this.aiDifficulty = 'medium';
    this.lastMove = null;
    this.hoverPos = null;

    this.canvas = document.getElementById('weiqi-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.turnStone = document.getElementById('turn-stone');
    this.turnText = document.getElementById('turn-text');
    this.blackScore = document.getElementById('black-score');
    this.whiteScore = document.getElementById('white-score');
    this.historyList = document.getElementById('move-history');

    this.bindEvents();
    this.render();
    this.updateStatus();
  }

  createEmptyBoard(size) {
    const b = [];
    for (let r = 0; r < size; r++) {
      b.push(new Array(size).fill(null));
    }
    return b;
  }

  getStarPoints() {
    if (this.size === 9) {
      return [
        { r: 2, c: 2 }, { r: 2, c: 6 },
        { r: 4, c: 4 }, // 天元
        { r: 6, c: 2 }, { r: 6, c: 6 }
      ];
    } else if (this.size === 13) {
      return [
        { r: 3, c: 3 }, { r: 3, c: 9 },
        { r: 6, c: 6 }, // 天元
        { r: 9, c: 3 }, { r: 9, c: 9 }
      ];
    } else if (this.size === 19) {
      return [
        { r: 3, c: 3 }, { r: 3, c: 9 }, { r: 3, c: 15 },
        { r: 9, c: 3 }, { r: 9, c: 9 }, { r: 9, c: 15 },
        { r: 15, c: 3 }, { r: 15, c: 9 }, { r: 15, c: 15 }
      ];
    }
    return [];
  }

  getLayoutMetrics() {
    const padding = 28;
    const boardW = this.canvas.width;
    const usableW = boardW - padding * 2;
    const step = usableW / (this.size - 1);
    const stoneRadius = step * 0.46;
    return { padding, step, stoneRadius };
  }

  render() {
    const { padding, step, stoneRadius } = this.getLayoutMetrics();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. 棋盘底色木纹质感
    ctx.fillStyle = '#dfaf68';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. 绘制网格线
    ctx.strokeStyle = '#5a3d24';
    ctx.lineWidth = 1.2;

    for (let i = 0; i < this.size; i++) {
      // 横线
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * step);
      ctx.lineTo(padding + (this.size - 1) * step, padding + i * step);
      ctx.stroke();

      // 竖线
      ctx.beginPath();
      ctx.moveTo(padding + i * step, padding);
      ctx.lineTo(padding + i * step, padding + (this.size - 1) * step);
      ctx.stroke();
    }

    // 3. 绘制星位 (Star Points)
    const starPoints = this.getStarPoints();
    ctx.fillStyle = '#452a16';
    starPoints.forEach(sp => {
      const cx = padding + sp.c * step;
      const cy = padding + sp.r * step;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. 绘制悬停虚影
    if (this.hoverPos && !this.board[this.hoverPos.r][this.hoverPos.c]) {
      const hx = padding + this.hoverPos.c * step;
      const hy = padding + this.hoverPos.r * step;
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = this.turn === 'B' ? '#000000' : '#ffffff';
      ctx.beginPath();
      ctx.arc(hx, hy, stoneRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. 绘制棋子 (Stones)
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const stone = this.board[r][c];
        if (!stone) continue;

        const x = padding + c * step;
        const y = padding + r * step;

        // 阴影
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 3;

        // 渐变石子
        const grad = ctx.createRadialGradient(
          x - stoneRadius * 0.3,
          y - stoneRadius * 0.3,
          stoneRadius * 0.1,
          x,
          y,
          stoneRadius
        );

        if (stone === 'B') {
          grad.addColorStop(0, '#555555');
          grad.addColorStop(0.5, '#222222');
          grad.addColorStop(1, '#050505');
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.8, '#e5e7eb');
          grad.addColorStop(1, '#cbd5e1');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, stoneRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 最后落子标记红点
        if (this.lastMove && this.lastMove.r === r && this.lastMove.c === c) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 计算相连棋子群 (Group) 与其“气” (Liberties)
  getGroupWithLiberties(r, c, board) {
    const color = board[r][c];
    if (!color) return { stones: [], liberties: [] };

    const visited = new Set();
    const stones = [];
    const libertiesSet = new Set();
    const queue = [{ r, c }];
    visited.add(`${r},${c}`);

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
      const curr = queue.shift();
      stones.push(curr);

      for (const [dr, dc] of dirs) {
        const nr = curr.r + dr;
        const nc = curr.c + dc;
        if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) continue;

        const neighbor = board[nr][nc];
        if (!neighbor) {
          libertiesSet.add(`${nr},${nc}`);
        } else if (neighbor === color && !visited.has(`${nr},${nc}`)) {
          visited.add(`${nr},${nc}`);
          queue.push({ r: nr, c: nc });
        }
      }
    }

    const liberties = Array.from(libertiesSet).map(s => {
      const [lr, lc] = s.split(',').map(Number);
      return { r: lr, c: lc };
    });

    return { stones, liberties };
  }

  // 模拟落子并检查合法性
  tryMove(r, c, color, board) {
    if (board[r][c]) return null; // 该处已有棋子

    // 打劫禁着检查
    if (this.koCoord && this.koCoord.r === r && this.koCoord.c === c) {
      return null;
    }

    const nextBoard = JSON.parse(JSON.stringify(board));
    nextBoard[r][c] = color;
    const oppColor = color === 'B' ? 'W' : 'B';

    // 检查是否提掉对方无气的棋子群
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const capturedStones = [];
    const checkedGroups = new Set();

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) continue;

      if (nextBoard[nr][nc] === oppColor && !checkedGroups.has(`${nr},${nc}`)) {
        const oppGroup = this.getGroupWithLiberties(nr, nc, nextBoard);
        oppGroup.stones.forEach(s => checkedGroups.add(`${s.r},${s.c}`));

        if (oppGroup.liberties.length === 0) {
          oppGroup.stones.forEach(s => capturedStones.push(s));
        }
      }
    }

    // 提子
    capturedStones.forEach(s => {
      nextBoard[s.r][s.c] = null;
    });

    // 检查己方落子群是否仍有气（禁自杀规则）
    const myGroup = this.getGroupWithLiberties(r, c, nextBoard);
    if (myGroup.liberties.length === 0) {
      return null; // 自身无气且未提子，为禁着点
    }

    // 判断是否形成打劫 (提了1子且自身也是1子1气)
    let newKo = null;
    if (capturedStones.length === 1 && myGroup.stones.length === 1 && myGroup.liberties.length === 1) {
      newKo = capturedStones[0];
    }

    return { nextBoard, capturedStones, newKo };
  }

  playAt(r, c) {
    if (this.isAI && this.turn === 'W') return;

    const result = this.tryMove(r, c, this.turn, this.board);
    if (!result) return; // 不合法落子

    this.executeMove(r, c, result);
  }

  executeMove(r, c, result) {
    const { nextBoard, capturedStones, newKo } = result;

    this.history.push({
      r,
      c,
      color: this.turn,
      board: JSON.parse(JSON.stringify(this.board)),
      captures: { ...this.captures },
      koCoord: this.koCoord
    });

    this.board = nextBoard;
    this.koCoord = newKo;
    this.consecutivePasses = 0;
    this.lastMove = { r, c };

    if (capturedStones.length > 0) {
      this.captures[this.turn] += capturedStones.length;
      wqSound.playCapture();
    } else {
      wqSound.playStone();
    }

    this.turn = this.turn === 'B' ? 'W' : 'B';
    this.render();
    this.updateStatus();

    // AI 行棋
    if (this.isAI && this.turn === 'W') {
      setTimeout(() => this.makeAIMove(), 320);
    }
  }

  makeAIMove() {
    const legalMoves = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const res = this.tryMove(r, c, 'W', this.board);
        if (res) {
          legalMoves.push({ r, c, result: res });
        }
      }
    }

    if (legalMoves.length === 0) {
      this.pass();
      return;
    }

    let chosen = null;

    if (this.aiDifficulty === 'easy') {
      // 优先吃子，否则随机
      const capMoves = legalMoves.filter(m => m.result.capturedStones.length > 0);
      if (capMoves.length > 0 && Math.random() > 0.3) {
        chosen = capMoves[Math.floor(Math.random() * capMoves.length)];
      } else {
        chosen = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }
    } else {
      // 启发式评估 (占角、守边、叫吃与逃生)
      let bestScore = -Infinity;
      for (const m of legalMoves) {
        let score = 0;
        // 1. 提子加分极大
        score += m.result.capturedStones.length * 200;

        // 2. 气数越多越安全
        const group = this.getGroupWithLiberties(m.r, m.c, m.result.nextBoard);
        score += group.liberties.length * 15;

        // 3. 金角银边草肚皮 (占领 3线/4线 星位附近)
        const dR = Math.min(m.r, this.size - 1 - m.r);
        const dC = Math.min(m.c, this.size - 1 - m.c);
        if ((dR === 2 || dR === 3) && (dC === 2 || dC === 3)) {
          score += 25; // 占角好手
        } else if (dR === 0 || dC === 0) {
          score -= 10; // 一线低位通常不佳
        }

        score += Math.random() * 6;

        if (score > bestScore) {
          bestScore = score;
          chosen = m;
        }
      }
      if (!chosen) chosen = legalMoves[0];
    }

    this.executeMove(chosen.r, chosen.c, chosen.result);
  }

  pass() {
    this.consecutivePasses++;
    this.history.push({
      pass: true,
      color: this.turn,
      board: JSON.parse(JSON.stringify(this.board)),
      captures: { ...this.captures }
    });

    const passer = this.turn === 'B' ? '黑方' : '白方';
    this.turn = this.turn === 'B' ? 'W' : 'B';
    this.koCoord = null;

    if (this.consecutivePasses >= 2) {
      setTimeout(() => {
        alert(`🤝 双方连续虚手，对局终局！\n黑方提子: ${this.captures.B} | 白方提子: ${this.captures.W}`);
      }, 100);
    }

    this.render();
    this.updateStatus();

    if (this.isAI && this.turn === 'W' && this.consecutivePasses < 2) {
      setTimeout(() => this.makeAIMove(), 350);
    }
  }

  undo() {
    if (this.history.length === 0) return;
    const steps = (this.isAI && this.history.length >= 2) ? 2 : 1;
    for (let i = 0; i < steps; i++) {
      if (this.history.length === 0) break;
      const last = this.history.pop();
      this.board = last.board;
      this.captures = last.captures;
      this.koCoord = last.koCoord;
    }
    this.turn = 'B';
    this.lastMove = null;
    this.consecutivePasses = 0;
    this.render();
    this.updateStatus();
  }

  restart() {
    this.board = this.createEmptyBoard(this.size);
    this.turn = 'B';
    this.captures = { B: 0, W: 0 };
    this.history = [];
    this.koCoord = null;
    this.consecutivePasses = 0;
    this.lastMove = null;
    this.render();
    this.updateStatus();
  }

  changeSize(newSize) {
    this.size = newSize;
    this.restart();
  }

  updateStatus() {
    const isBlack = this.turn === 'B';
    this.turnStone.className = `stone-badge ${isBlack ? 'black' : 'white'}`;
    const stepCount = this.history.length + 1;
    this.turnText.textContent = isBlack
      ? `轮到黑方落子 (第 ${stepCount} 手)`
      : (this.isAI ? '🤖 白方思考定式中...' : `轮到白方落子 (第 ${stepCount} 手)`);

    this.blackScore.textContent = this.captures.B;
    this.whiteScore.textContent = this.captures.W;

    // 记谱历史
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<div class="history-empty">盘虚黑白隐，静待第一手。</div>';
    } else {
      const last = this.history[this.history.length - 1];
      const colorText = last.color === 'B' ? '黑' : '白';
      const moveText = last.pass
        ? `${this.history.length}. ${colorText}方 虚手 (Pass)`
        : `${this.history.length}. ${colorText}子 (${last.r + 1}, ${last.c + 1})`;

      const div = document.createElement('div');
      div.className = 'history-item';
      div.textContent = moveText;
      this.historyList.appendChild(div);
      this.historyList.scrollTop = this.historyList.scrollHeight;
    }
  }

  bindEvents() {
    // 鼠标移动悬停
    this.canvas.addEventListener('mousemove', (e) => {
      const { padding, step } = this.getLayoutMetrics();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      const c = Math.round((mx - padding) / step);
      const r = Math.round((my - padding) / step);

      if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
        if (!this.hoverPos || this.hoverPos.r !== r || this.hoverPos.c !== c) {
          this.hoverPos = { r, c };
          this.render();
        }
      } else {
        if (this.hoverPos) {
          this.hoverPos = null;
          this.render();
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPos = null;
      this.render();
    });

    // 点击落子
    this.canvas.addEventListener('click', (e) => {
      const { padding, step } = this.getLayoutMetrics();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      const c = Math.round((mx - padding) / step);
      const r = Math.round((my - padding) / step);

      if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
        this.playAt(r, c);
      }
    });

    // 棋盘尺寸切换
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const s = parseInt(btn.getAttribute('data-size'));
        this.changeSize(s);
      });
    });

    // 功能按钮
    document.getElementById('btn-pass').addEventListener('click', () => this.pass());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-restart').addEventListener('click', () => this.restart());

    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn.addEventListener('click', () => {
      wqSound.enabled = !wqSound.enabled;
      soundBtn.textContent = wqSound.enabled ? '🔊 沉浸落子音效: 开' : '🔈 沉浸落子音效: 关';
    });

    const btnAi = document.getElementById('btn-mode-ai');
    const btnPvp = document.getElementById('btn-mode-pvp');
    btnAi.addEventListener('click', () => {
      this.isAI = true;
      btnAi.classList.add('active');
      btnPvp.classList.remove('active');
      this.restart();
    });
    btnPvp.addEventListener('click', () => {
      this.isAI = false;
      btnPvp.classList.add('active');
      btnAi.classList.remove('active');
      this.restart();
    });

    document.getElementById('ai-diff').addEventListener('change', (e) => {
      this.aiDifficulty = e.target.value;
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new WeiqiGame();
});
