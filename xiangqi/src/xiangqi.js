// 中国象棋核心逻辑与渲染引擎 (Chinese Chess - Xiangqi Engine)

const PIECE_CONFIG = {
  // 红方 (大写字符代码)
  K: { name: '帥', color: 'r', val: 20000 },
  A: { name: '仕', color: 'r', val: 220 },
  B: { name: '相', color: 'r', val: 220 },
  N: { name: '傌', color: 'r', val: 450 },
  R: { name: '俥', color: 'r', val: 1000 },
  C: { name: '炮', color: 'r', val: 500 },
  P: { name: '兵', color: 'r', val: 150 },
  // 黑方 (小写字符代码)
  k: { name: '將', color: 'b', val: 20000 },
  a: { name: '士', color: 'b', val: 220 },
  b: { name: '象', color: 'b', val: 220 },
  n: { name: '馬', color: 'b', val: 450 },
  r: { name: '車', color: 'b', val: 1000 },
  c: { name: '砲', color: 'b', val: 500 },
  p: { name: '卒', color: 'b', val: 150 }
};

// 初始 10行 x 9列 棋盘
const INITIAL_XQ_BOARD = [
  ['r', 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'], // 0
  [null, null, null, null, null, null, null, null, null], // 1
  [null, 'c', null, null, null, null, null, 'c', null], // 2
  ['p', null, 'p', null, 'p', null, 'p', null, 'p'], // 3
  [null, null, null, null, null, null, null, null, null], // 4 楚河
  [null, null, null, null, null, null, null, null, null], // 5 汉界
  ['P', null, 'P', null, 'P', null, 'P', null, 'P'], // 6
  [null, 'C', null, null, null, null, null, 'C', null], // 7
  [null, null, null, null, null, null, null, null, null], // 8
  ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R']  // 9
];

// 棋盘绘制常量
const PADDING_X = 30;
const PADDING_Y = 30;
const CELL_W = 60;
const CELL_H = 60;

class XQSound {
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
  playMove() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }
  playCapture() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }
  playCheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659, this.ctx.currentTime);
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

const xqSounds = new XQSound();

class XiangqiGame {
  constructor() {
    this.board = JSON.parse(JSON.stringify(INITIAL_XQ_BOARD));
    this.turn = 'r'; // 'r' (红方) 或 'b' (黑方)
    this.selected = null;
    this.validMoves = [];
    this.history = [];
    this.captured = { r: [], b: [] };
    this.isAI = true;
    this.aiDifficulty = 'master';
    this.gameOver = false;
    this.lastMove = null;

    this.piecesLayer = document.getElementById('pieces-layer');
    this.hintsLayer = document.getElementById('hints-layer');
    this.turnBadge = document.getElementById('turn-badge');
    this.turnSub = document.getElementById('turn-sub');
    this.checkWarning = document.getElementById('check-warning');
    this.redCapEl = document.getElementById('red-captured');
    this.blackCapEl = document.getElementById('black-captured');
    this.historyListEl = document.getElementById('move-history');

    this.drawBoardGrid();
    this.render();
    this.bindEvents();
    this.updateStatus();
  }

  drawBoardGrid() {
    const canvas = document.getElementById('board-grid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#5c3a21';
    ctx.lineWidth = 1.8;

    // 1. 横线 (10 条)
    for (let r = 0; r < 10; r++) {
      const y = PADDING_Y + r * CELL_H;
      ctx.beginPath();
      ctx.moveTo(PADDING_X, y);
      ctx.lineTo(PADDING_X + 8 * CELL_W, y);
      ctx.stroke();
    }

    // 2. 竖线 (左右两边贯穿，中间 7 条在楚河处断开)
    for (let c = 0; c < 9; c++) {
      const x = PADDING_X + c * CELL_W;
      if (c === 0 || c === 8) {
        ctx.beginPath();
        ctx.moveTo(x, PADDING_Y);
        ctx.lineTo(x, PADDING_Y + 9 * CELL_H);
        ctx.stroke();
      } else {
        // 上半部 (黑方)
        ctx.beginPath();
        ctx.moveTo(x, PADDING_Y);
        ctx.lineTo(x, PADDING_Y + 4 * CELL_H);
        ctx.stroke();
        // 下半部 (红方)
        ctx.beginPath();
        ctx.moveTo(x, PADDING_Y + 5 * CELL_H);
        ctx.lineTo(x, PADDING_Y + 9 * CELL_H);
        ctx.stroke();
      }
    }

    // 3. 九宫斜交叉线
    // 黑方九宫 (r: 0..2, c: 3..5)
    ctx.beginPath();
    ctx.moveTo(PADDING_X + 3 * CELL_W, PADDING_Y);
    ctx.lineTo(PADDING_X + 5 * CELL_W, PADDING_Y + 2 * CELL_H);
    ctx.moveTo(PADDING_X + 5 * CELL_W, PADDING_Y);
    ctx.lineTo(PADDING_X + 3 * CELL_W, PADDING_Y + 2 * CELL_H);
    ctx.stroke();

    // 红方九宫 (r: 7..9, c: 3..5)
    ctx.beginPath();
    ctx.moveTo(PADDING_X + 3 * CELL_W, PADDING_Y + 7 * CELL_H);
    ctx.lineTo(PADDING_X + 5 * CELL_W, PADDING_Y + 9 * CELL_H);
    ctx.moveTo(PADDING_X + 5 * CELL_W, PADDING_Y + 7 * CELL_H);
    ctx.lineTo(PADDING_X + 3 * CELL_W, PADDING_Y + 9 * CELL_H);
    ctx.stroke();

    // 4. 楚河 · 漢界 文字
    ctx.save();
    ctx.font = 'bold 24px "Noto Serif SC", serif';
    ctx.fillStyle = '#6b4423';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('楚  河', PADDING_X + 2 * CELL_W, PADDING_Y + 4.5 * CELL_H);
    ctx.fillText('漢  界', PADDING_X + 6 * CELL_W, PADDING_Y + 4.5 * CELL_H);
    ctx.restore();
  }

  getPixelCoords(r, c) {
    return {
      x: PADDING_X + c * CELL_W,
      y: PADDING_Y + r * CELL_H
    };
  }

  render() {
    this.piecesLayer.innerHTML = '';
    this.hintsLayer.innerHTML = '';

    // 渲染棋子
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const code = this.board[r][c];
        if (!code) continue;
        const info = PIECE_CONFIG[code];
        const { x, y } = this.getPixelCoords(r, c);

        const el = document.createElement('div');
        el.className = `xq-piece ${info.color === 'r' ? 'red' : 'black'}`;
        el.textContent = info.name;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        if (this.selected && this.selected.r === r && this.selected.c === c) {
          el.classList.add('selected');
        }

        if (this.lastMove && (this.lastMove.toR === r && this.lastMove.toC === c)) {
          el.classList.add('last-moved');
        }

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handlePieceClick(r, c);
        });

        this.piecesLayer.appendChild(el);
      }
    }

    // 渲染可行落子/吃子标记
    this.validMoves.forEach(m => {
      const { x, y } = this.getPixelCoords(m.r, m.c);
      const isCapture = !!this.board[m.r][m.c];

      const hint = document.createElement('div');
      hint.className = isCapture ? 'xq-hint-capture' : 'xq-hint-dot';
      hint.style.left = `${x}px`;
      hint.style.top = `${y}px`;

      hint.addEventListener('click', (e) => {
        e.stopPropagation();
        this.makeMove(this.selected.r, this.selected.c, m.r, m.c);
      });

      this.hintsLayer.appendChild(hint);
    });
  }

  handlePieceClick(r, c) {
    if (this.gameOver) return;
    if (this.isAI && this.turn === 'b') return;

    const code = this.board[r][c];
    const info = code ? PIECE_CONFIG[code] : null;

    // 1. 如果已选子，点击敌方棋子吃子
    if (this.selected) {
      const move = this.validMoves.find(m => m.r === r && m.c === c);
      if (move) {
        this.makeMove(this.selected.r, this.selected.c, r, c);
        return;
      }
    }

    // 2. 选择己方棋子
    if (info && info.color === this.turn) {
      this.selected = { r, c };
      this.validMoves = this.getLegalMoves(r, c, this.board);
      this.render();
    } else {
      this.selected = null;
      this.validMoves = [];
      this.render();
    }
  }

  getLegalMoves(r, c, board) {
    const rawMoves = this.getPseudoLegalMoves(r, c, board);
    const color = PIECE_CONFIG[board[r][c]].color;

    // 过滤掉会自陷被将军或形成将帅照面的招法
    return rawMoves.filter(m => {
      const nextBoard = JSON.parse(JSON.stringify(board));
      nextBoard[m.r][m.c] = nextBoard[r][c];
      nextBoard[r][c] = null;

      // 规则：将帅不能照面 (飞将)
      if (this.isFlyingGenerals(nextBoard)) return false;

      // 己方将/帅不能被将军
      return !this.isKingInCheck(color, nextBoard);
    });
  }

  // 飞将规则检查
  isFlyingGenerals(board) {
    let redKing = null;
    let blackKing = null;

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 'K') redKing = { r, c };
        if (board[r][c] === 'k') blackKing = { r, c };
      }
    }

    if (!redKing || !blackKing) return false;
    if (redKing.c !== blackKing.c) return false;

    // 同一竖列，检查中间是否有遮挡子
    const col = redKing.c;
    for (let r = blackKing.r + 1; r < redKing.r; r++) {
      if (board[r][col]) return false;
    }
    return true; // 中间无子，照面犯规
  }

  getPseudoLegalMoves(r, c, board) {
    const code = board[r][c];
    if (!code) return [];
    const info = PIECE_CONFIG[code];
    const isRed = info.color === 'r';
    const moves = [];

    const canLand = (nr, nc) => {
      if (nr < 0 || nr >= 10 || nc < 0 || nc >= 9) return false;
      const target = board[nr][nc];
      if (!target) return true;
      return PIECE_CONFIG[target].color !== info.color;
    };

    // 1. 帥 / 將 (King)
    if (code === 'K' || code === 'k') {
      const minR = isRed ? 7 : 0;
      const maxR = isRed ? 9 : 2;
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      dirs.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= minR && nr <= maxR && nc >= 3 && nc <= 5) {
          if (canLand(nr, nc)) moves.push({ r: nr, c: nc });
        }
      });
    }

    // 2. 仕 / 士 (Advisor)
    if (code === 'A' || code === 'a') {
      const minR = isRed ? 7 : 0;
      const maxR = isRed ? 9 : 2;
      const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      diagDirs.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= minR && nr <= maxR && nc >= 3 && nc <= 5) {
          if (canLand(nr, nc)) moves.push({ r: nr, c: nc });
        }
      });
    }

    // 3. 相 / 象 (Elephant - 走田，不过河，塞象眼)
    if (code === 'B' || code === 'b') {
      const elephantMoves = [
        { dr: -2, dc: -2, eyeR: -1, eyeC: -1 },
        { dr: -2, dc: 2,  eyeR: -1, eyeC: 1 },
        { dr: 2,  dc: -2, eyeR: 1,  eyeC: -1 },
        { dr: 2,  dc: 2,  eyeR: 1,  eyeC: 1 }
      ];
      elephantMoves.forEach(em => {
        const nr = r + em.dr;
        const nc = c + em.dc;
        const er = r + em.eyeR;
        const ec = c + em.eyeC;
        // 边界与不可过河
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
          const crossRiver = isRed ? nr < 5 : nr > 4;
          if (!crossRiver && !board[er][ec]) { // 塞象眼检查
            if (canLand(nr, nc)) moves.push({ r: nr, c: nc });
          }
        }
      });
    }

    // 4. 傌 / 馬 (Horse - 走日，蹩马腿)
    if (code === 'N' || code === 'n') {
      const horseMoves = [
        { dr: -2, dc: -1, legR: -1, legC: 0 },
        { dr: -2, dc: 1,  legR: -1, legC: 0 },
        { dr: 2,  dc: -1, legR: 1,  legC: 0 },
        { dr: 2,  dc: 1,  legR: 1,  legC: 0 },
        { dr: -1, dc: -2, legR: 0,  legC: -1 },
        { dr: 1,  dc: -2, legR: 0,  legC: -1 },
        { dr: -1, dc: 2,  legR: 0,  legC: 1 },
        { dr: 1,  dc: 2,  legR: 0,  legC: 1 }
      ];
      horseMoves.forEach(hm => {
        const nr = r + hm.dr;
        const nc = c + hm.dc;
        const lr = r + hm.legR;
        const lc = c + hm.legC;
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
          if (!board[lr][lc]) { // 蹩马腿判定
            if (canLand(nr, nc)) moves.push({ r: nr, c: nc });
          }
        }
      });
    }

    // 5. 俥 / 車 (Chariot - 直线无阻)
    if (code === 'R' || code === 'r') {
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      dirs.forEach(([dr, dc]) => {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (nr < 0 || nr >= 10 || nc < 0 || nc >= 9) break;
          const target = board[nr][nc];
          if (!target) {
            moves.push({ r: nr, c: nc });
          } else {
            if (PIECE_CONFIG[target].color !== info.color) {
              moves.push({ r: nr, c: nc }); // 吃子
            }
            break;
          }
          step++;
        }
      });
    }

    // 6. 炮 / 砲 (Cannon - 走法同车，吃子隔山打炮)
    if (code === 'C' || code === 'c') {
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      dirs.forEach(([dr, dc]) => {
        let step = 1;
        let jumped = false;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (nr < 0 || nr >= 10 || nc < 0 || nc >= 9) break;
          const target = board[nr][nc];
          if (!jumped) {
            if (!target) {
              moves.push({ r: nr, c: nc }); // 不吃子自由走
            } else {
              jumped = true; // 发现炮架
            }
          } else {
            if (target) {
              if (PIECE_CONFIG[target].color !== info.color) {
                moves.push({ r: nr, c: nc }); // 隔子吃敌子
              }
              break; // 最多隔一子
            }
          }
          step++;
        }
      });
    }

    // 7. 兵 / 卒 (Soldier)
    if (code === 'P' || code === 'p') {
      const forwardDir = isRed ? -1 : 1;
      const isCrossed = isRed ? r <= 4 : r >= 5;

      // 向前
      const fr = r + forwardDir;
      if (fr >= 0 && fr < 10) {
        if (canLand(fr, c)) moves.push({ r: fr, c });
      }

      // 过河后可左右移动
      if (isCrossed) {
        [-1, 1].forEach(dc => {
          const nc = c + dc;
          if (nc >= 0 && nc < 9) {
            if (canLand(r, nc)) moves.push({ r, c: nc });
          }
        });
      }
    }

    return moves;
  }

  isKingInCheck(color, board) {
    let kingPos = null;
    const kingCode = color === 'r' ? 'K' : 'k';
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === kingCode) {
          kingPos = { r, c };
          break;
        }
      }
      if (kingPos) break;
    }
    if (!kingPos) return true;

    const oppColor = color === 'r' ? 'b' : 'r';
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const code = board[r][c];
        if (code && PIECE_CONFIG[code].color === oppColor) {
          const pseudoMoves = this.getPseudoLegalMoves(r, c, board);
          if (pseudoMoves.some(m => m.r === kingPos.r && m.c === kingPos.c)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasAnyLegalMoves(color, board) {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const code = board[r][c];
        if (code && PIECE_CONFIG[code].color === color) {
          const legal = this.getLegalMoves(r, c, board);
          if (legal.length > 0) return true;
        }
      }
    }
    return false;
  }

  makeMove(fromR, fromC, toR, toC) {
    const pieceCode = this.board[fromR][fromC];
    const targetCode = this.board[toR][toC];
    const piece = PIECE_CONFIG[pieceCode];

    // 保存历史记录
    this.history.push({
      from: { r: fromR, c: fromC },
      to: { r: toR, c: toC },
      piece: pieceCode,
      captured: targetCode,
      board: JSON.parse(JSON.stringify(this.board))
    });

    if (targetCode) {
      const cap = PIECE_CONFIG[targetCode];
      this.captured[piece.color].push(cap.name);
      xqSounds.playCapture();
    } else {
      xqSounds.playMove();
    }

    this.board[toR][toC] = pieceCode;
    this.board[fromR][fromC] = null;
    this.lastMove = { fromR, fromC, toR, toC };

    this.turn = this.turn === 'r' ? 'b' : 'r';
    this.selected = null;
    this.validMoves = [];

    const inCheck = this.isKingInCheck(this.turn, this.board);
    if (inCheck) xqSounds.playCheck();

    const hasMoves = this.hasAnyLegalMoves(this.turn, this.board);
    if (!hasMoves) {
      this.gameOver = true;
      const winner = this.turn === 'r' ? '黑方' : '红方';
      setTimeout(() => alert(`🏆 决胜时刻！${winner} 绝杀将死，荣登棋王胜位！`), 100);
    }

    this.render();
    this.updateStatus(inCheck);

    // AI 行棋
    if (!this.gameOver && this.isAI && this.turn === 'b') {
      setTimeout(() => this.makeAIMove(), 350);
    }
  }

  // 经典开局应招变式库（根据红方第一步多重权值随机应变，杜绝千篇一律）
  tryOpeningBook() {
    if (this.history.length > 2) return null; // 仅在对局前两回合启用丰富开局库

    const firstRedMove = this.history[0];
    if (!firstRedMove) return null;

    const toR = firstRedMove.to.r;
    const toC = firstRedMove.to.c;
    const candidates = [];

    // 1. 红方当头中炮 (炮二平五 C:7,7->7,4 或 炮八平五 C:7,1->7,4)
    if (firstRedMove.piece === 'C' && toC === 4) {
      candidates.push(
        { from: [0, 7], to: [2, 6], weight: 32, desc: '屏风马进右马 (稳健抗衡中炮)' },
        { from: [0, 1], to: [2, 2], weight: 28, desc: '屏风马进左马 (守卫中卒)' },
        { from: [2, 7], to: [2, 4], weight: 22, desc: '顺手炮 (以攻对攻，火爆对决)' },
        { from: [2, 1], to: [2, 4], weight: 18, desc: '列手炮 (左右对攻)' },
        { from: [3, 6], to: [4, 6], weight: 16, desc: '进7卒制马 (反客为主)' },
        { from: [3, 2], to: [4, 2], weight: 16, desc: '进3卒制马 (活络边马)' },
        { from: [0, 6], to: [2, 4], weight: 12, desc: '飞右象 (中宫筑城)' },
        { from: [0, 2], to: [2, 4], weight: 12, desc: '飞左象 (铜墙铁壁)' }
      );
    }
    // 2. 红方进兵局 (兵七进一 P:6,2->5,2 或 兵三进一 P:6,6->5,6)
    else if (firstRedMove.piece === 'P' && toR === 5) {
      candidates.push(
        { from: [3, 2], to: [4, 2], weight: 32, desc: '挺3卒对攻' },
        { from: [3, 6], to: [4, 6], weight: 30, desc: '挺7卒对攻' },
        { from: [2, 1], to: [2, 4], weight: 25, desc: '卒底反架当头炮' },
        { from: [2, 7], to: [2, 4], weight: 22, desc: '右中炮威慑' },
        { from: [0, 1], to: [2, 2], weight: 20, desc: '起右正马' },
        { from: [0, 7], to: [2, 6], weight: 20, desc: '起左正马' }
      );
    }
    // 3. 红方飞相局 (相七进五 或 相三进五)
    else if (firstRedMove.piece === 'B' && toR === 7 && toC === 4) {
      candidates.push(
        { from: [2, 1], to: [2, 4], weight: 32, desc: '左中炮破相攻中' },
        { from: [2, 7], to: [2, 4], weight: 30, desc: '右中炮猛轰中路' },
        { from: [3, 2], to: [4, 2], weight: 25, desc: '挺3卒开阔马路' },
        { from: [0, 1], to: [2, 2], weight: 22, desc: '起边马厚实自成一体' }
      );
    }
    // 4. 红方起马局 (马二进三 或 马八进七)
    else if (firstRedMove.piece === 'N') {
      candidates.push(
        { from: [3, 6], to: [4, 6], weight: 32, desc: '进7卒封锁马头' },
        { from: [3, 2], to: [4, 2], weight: 30, desc: '进3卒封锁马腿' },
        { from: [2, 7], to: [2, 4], weight: 26, desc: '中炮发力先声夺人' },
        { from: [0, 7], to: [2, 6], weight: 24, desc: '对应起马均势博弈' }
      );
    } else {
      // 其他自由开局：随机在正统走法中挑选
      candidates.push(
        { from: [0, 1], to: [2, 2], weight: 25, desc: '起马' },
        { from: [0, 7], to: [2, 6], weight: 25, desc: '起马' },
        { from: [2, 1], to: [2, 4], weight: 25, desc: '当头炮' },
        { from: [2, 7], to: [2, 4], weight: 25, desc: '当头炮' },
        { from: [3, 2], to: [4, 2], weight: 20, desc: '挺3卒' },
        { from: [3, 6], to: [4, 6], weight: 20, desc: '挺7卒' }
      );
    }

    // 过滤出当前局面下合法的开局走法
    const legalCandidates = candidates.filter(c => {
      const piece = this.board[c.from[0]][c.from[1]];
      if (!piece || PIECE_CONFIG[piece].color !== 'b') return false;
      const legals = this.getLegalMoves(c.from[0], c.from[1], this.board);
      return legals.some(m => m.r === c.to[0] && m.c === c.to[1]);
    });

    if (legalCandidates.length === 0) return null;

    // 按权重轮盘赌随机挑选，保证局局不同！
    const totalWeight = legalCandidates.reduce((sum, c) => sum + c.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const c of legalCandidates) {
      if (rand < c.weight) {
        return { fromR: c.from[0], fromC: c.from[1], toR: c.to[0], toC: c.to[1] };
      }
      rand -= c.weight;
    }
    return {
      fromR: legalCandidates[0].from[0],
      fromC: legalCandidates[0].from[1],
      toR: legalCandidates[0].to[0],
      toC: legalCandidates[0].to[1]
    };
  }

  // 局势综合估值函数（黑方正分越高越优，红方正分越高对红越有利）
  evaluateBoard(board) {
    let score = 0;

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const code = board[r][c];
        if (!code) continue;
        const info = PIECE_CONFIG[code];
        const isBlack = info.color === 'b';
        let pieceVal = info.val;

        // 棋子位置评估 (PST 加权)
        let posVal = 0;

        if (code === 'r') { // 黑车
          if (r >= 4 && r <= 5) posVal += 30; // 巡河
          if (r >= 6) posVal += 50 + (r - 6) * 15; // 深入敌阵压迫
          if (c === 3 || c === 4 || c === 5) posVal += 25; // 占领中路或肋道
        } else if (code === 'R') { // 红车
          if (r <= 5 && r >= 4) posVal += 30;
          if (r <= 3) posVal += 50 + (3 - r) * 15;
          if (c === 3 || c === 4 || c === 5) posVal += 25;
        } else if (code === 'n') { // 黑马
          if (r >= 3 && r <= 6 && c >= 2 && c <= 6) posVal += 30; // 居中活跃
          if (r >= 7 && (c === 2 || c === 3 || c === 5 || c === 6)) posVal += 65; // 挂角/卧槽
          if (c === 0 || c === 8) posVal -= 25; // 边马受限
        } else if (code === 'N') { // 红马
          if (r <= 6 && r >= 3 && c >= 2 && c <= 6) posVal += 30;
          if (r <= 2 && (c === 2 || c === 3 || c === 5 || c === 6)) posVal += 65;
          if (c === 0 || c === 8) posVal -= 25;
        } else if (code === 'c') { // 黑炮
          if (c === 4 && r >= 2 && r <= 5) posVal += 45; // 中炮当头
          if (r === 9) posVal += 50; // 沉底炮
          if (r === 4) posVal += 25; // 巡河炮
        } else if (code === 'C') { // 红炮
          if (c === 4 && r <= 7 && r >= 4) posVal += 45;
          if (r === 0) posVal += 50;
          if (r === 5) posVal += 25;
        } else if (code === 'p') { // 黑卒
          if (r >= 5) posVal += 80; // 过河卒
          if (r >= 7 && c >= 3 && c <= 5) posVal += 150; // 进逼九宫小卒
        } else if (code === 'P') { // 红兵
          if (r <= 4) posVal += 80;
          if (r <= 2 && c >= 3 && c <= 5) posVal += 150;
        } else if (code === 'k' || code === 'K') { // 将帅安全
          posVal += 50;
        }

        const totalPieceScore = pieceVal + posVal;
        if (isBlack) {
          score += totalPieceScore;
        } else {
          score -= totalPieceScore;
        }
      }
    }

    // 将军奖惩
    if (this.isKingInCheck('r', board)) score += 120; // 红方被将，黑加分
    if (this.isKingInCheck('b', board)) score -= 150; // 黑方被将，黑扣分

    return score;
  }

  // Alpha-Beta 极小极大搜索算法
  minimaxAlphaBeta(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
      return this.evaluateBoard(board);
    }

    const currentTurn = isMaximizing ? 'b' : 'r';

    // 收集所有合法走法
    const moves = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const code = board[r][c];
        if (code && PIECE_CONFIG[code].color === currentTurn) {
          const legals = this.getLegalMoves(r, c, board);
          for (const m of legals) {
            moves.push({ fromR: r, fromC: c, toR: m.r, toC: m.c, target: board[m.r][m.c] });
          }
        }
      }
    }

    if (moves.length === 0) {
      // 无路可走：被将死或困毙
      if (this.isKingInCheck(currentTurn, board)) {
        return isMaximizing ? -25000 : 25000;
      }
      return 0; // 和棋
    }

    // 启发式走法排序 (Move Ordering: 优先搜吃大子与将军，成倍提升剪枝效率)
    moves.sort((a, b) => {
      const valA = a.target ? PIECE_CONFIG[a.target].val : 0;
      const valB = b.target ? PIECE_CONFIG[b.target].val : 0;
      return valB - valA;
    });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const m of moves) {
        const nextBoard = JSON.parse(JSON.stringify(board));
        nextBoard[m.toR][m.toC] = nextBoard[m.fromR][m.fromC];
        nextBoard[m.fromR][m.fromC] = null;

        const evalScore = this.minimaxAlphaBeta(nextBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // Beta 剪枝
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of moves) {
        const nextBoard = JSON.parse(JSON.stringify(board));
        nextBoard[m.toR][m.toC] = nextBoard[m.fromR][m.fromC];
        nextBoard[m.fromR][m.fromC] = null;

        const evalScore = this.minimaxAlphaBeta(nextBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // Alpha 剪枝
      }
      return minEval;
    }
  }

  makeAIMove() {
    // 1. 尝试从多变开局库中随机选取精妙应招（前两回合绝不单调！）
    const bookMove = this.tryOpeningBook();
    if (bookMove) {
      this.makeMove(bookMove.fromR, bookMove.fromC, bookMove.toR, bookMove.toC);
      return;
    }

    // 2. 收集黑方所有当前合法走法
    const allMoves = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const code = this.board[r][c];
        if (code && PIECE_CONFIG[code].color === 'b') {
          const legal = this.getLegalMoves(r, c, this.board);
          for (const m of legal) {
            allMoves.push({
              fromR: r,
              fromC: c,
              toR: m.r,
              toC: m.c,
              target: this.board[m.r][m.c]
            });
          }
        }
      }
    }

    if (allMoves.length === 0) return;

    let chosen = null;

    if (this.aiDifficulty === 'easy') {
      // 棋艺初学：优先吃子，35% 随机性
      const capMoves = allMoves.filter(m => m.target);
      if (capMoves.length > 0 && Math.random() > 0.4) {
        chosen = capMoves[Math.floor(Math.random() * capMoves.length)];
      } else {
        chosen = allMoves[Math.floor(Math.random() * allMoves.length)];
      }
    } else {
      // medium: depth 2; master: depth 3
      const searchDepth = this.aiDifficulty === 'master' ? 3 : 2;

      // 走法预排序 (优先评估吃子)
      allMoves.sort((a, b) => {
        const valA = a.target ? PIECE_CONFIG[a.target].val : 0;
        const valB = b.target ? PIECE_CONFIG[b.target].val : 0;
        return valB - valA;
      });

      let bestScore = -Infinity;
      const topMoves = [];

      for (const m of allMoves) {
        const nextBoard = JSON.parse(JSON.stringify(this.board));
        nextBoard[m.toR][m.toC] = nextBoard[m.fromR][m.fromC];
        nextBoard[m.fromR][m.fromC] = null;

        // 执行 Alpha-Beta 搜索
        const score = this.minimaxAlphaBeta(nextBoard, searchDepth - 1, -Infinity, Infinity, false);

        // 融入微小随机扰动 (0~10分)，在势均力敌的多条优良路线中随机切换，棋风灵活多变
        const dynamicScore = score + (Math.random() * 10);

        if (dynamicScore > bestScore) {
          bestScore = dynamicScore;
          chosen = m;
        }

        topMoves.push({ move: m, score: dynamicScore });
      }

      // 如果有评分非常接近的高分棋步（分差在 12 分以内），在最优阵列中随机挑一步，保持行棋灵动
      const eliteMoves = topMoves.filter(tm => (bestScore - tm.score) < 12);
      if (eliteMoves.length > 1) {
        chosen = eliteMoves[Math.floor(Math.random() * eliteMoves.length)].move;
      }
    }

    if (!chosen) chosen = allMoves[0];
    this.makeMove(chosen.fromR, chosen.fromC, chosen.toR, chosen.toC);
  }

  updateStatus(inCheck = false) {
    if (this.turn === 'r') {
      this.turnBadge.className = 'turn-badge red';
      this.turnBadge.textContent = '红方走子';
      this.turnSub.textContent = '轮到红方行棋';
    } else {
      this.turnBadge.className = 'turn-badge black';
      this.turnBadge.textContent = '黑方走子';
      this.turnSub.textContent = this.isAI ? '🤖 电脑推演中...' : '轮到黑方行棋';
    }

    if (inCheck) {
      this.checkWarning.classList.remove('hidden');
    } else {
      this.checkWarning.classList.add('hidden');
    }

    this.redCapEl.textContent = this.captured.r.join(' ');
    this.blackCapEl.textContent = this.captured.b.join(' ');

    // 记谱渲染
    if (this.history.length === 0) {
      this.historyListEl.innerHTML = '<div class="history-empty">战幕拉开，红方先行。</div>';
    } else {
      const last = this.history[this.history.length - 1];
      const pName = PIECE_CONFIG[last.piece].name;
      const text = `${this.history.length}. ${pName} (${last.from.r},${last.from.c}) ➔ (${last.to.r},${last.to.c})`;

      const div = document.createElement('div');
      div.className = 'history-item';
      div.textContent = text;
      this.historyListEl.appendChild(div);
      this.historyListEl.scrollTop = this.historyListEl.scrollHeight;
    }
  }

  undo() {
    if (this.history.length === 0) return;
    const steps = (this.isAI && this.history.length >= 2) ? 2 : 1;
    for (let i = 0; i < steps; i++) {
      if (this.history.length === 0) break;
      const last = this.history.pop();
      this.board = last.board;
      if (last.captured) {
        const color = PIECE_CONFIG[last.piece].color;
        this.captured[color].pop();
      }
    }
    this.turn = 'r';
    this.gameOver = false;
    this.selected = null;
    this.validMoves = [];
    this.lastMove = null;
    this.render();
    this.updateStatus();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(INITIAL_XQ_BOARD));
    this.turn = 'r';
    this.selected = null;
    this.validMoves = [];
    this.history = [];
    this.captured = { r: [], b: [] };
    this.gameOver = false;
    this.lastMove = null;
    this.render();
    this.updateStatus();
  }

  bindEvents() {
    document.getElementById('btn-restart').addEventListener('click', () => this.restart());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());

    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn.addEventListener('click', () => {
      xqSounds.enabled = !xqSounds.enabled;
      soundBtn.textContent = xqSounds.enabled ? '🔊 沉浸落子音效: 开' : '🔈 沉浸落子音效: 关';
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

    // 点击棋盘空白处取消选中
    document.getElementById('xiangqi-board').addEventListener('click', () => {
      this.selected = null;
      this.validMoves = [];
      this.render();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new XiangqiGame();
});
