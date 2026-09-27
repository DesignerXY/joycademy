// 国际象棋核心引擎与交互逻辑 (Chess Master Game Engine)

const PIECES = {
  P: { type: 'p', color: 'w', symbol: '♙', val: 100 },
  N: { type: 'n', color: 'w', symbol: '♘', val: 320 },
  B: { type: 'b', color: 'w', symbol: '♗', val: 330 },
  R: { type: 'r', color: 'w', symbol: '♖', val: 500 },
  Q: { type: 'q', color: 'w', symbol: '♕', val: 900 },
  K: { type: 'k', color: 'w', symbol: '♔', val: 20000 },
  p: { type: 'p', color: 'b', symbol: '♟', val: 100 },
  n: { type: 'n', color: 'b', symbol: '♞', val: 320 },
  b: { type: 'b', color: 'b', symbol: '♝', val: 330 },
  r: { type: 'r', color: 'b', symbol: '♜', val: 500 },
  q: { type: 'q', color: 'b', symbol: '♛', val: 900 },
  k: { type: 'k', color: 'b', symbol: '♚', val: 20000 }
};

// 初始棋盘布局 (8x8)
const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Web Audio API 合成音效
class SoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  }
  playMove() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
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
    osc.type = 'square';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }
  playCheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const sounds = new SoundEngine();

class ChessGame {
  constructor() {
    this.board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    this.turn = 'w'; // 'w' 或 'b'
    this.selected = null;
    this.validMoves = [];
    this.history = [];
    this.captured = { w: [], b: [] };
    this.isAI = true;
    this.aiDifficulty = 'medium';
    this.gameOver = false;
    this.pendingPromotion = null;

    this.boardEl = document.getElementById('chess-board');
    this.turnDotEl = document.getElementById('turn-dot');
    this.turnTextEl = document.getElementById('turn-text');
    this.checkWarningEl = document.getElementById('check-warning');
    this.whiteCapturedEl = document.getElementById('white-captured');
    this.blackCapturedEl = document.getElementById('black-captured');
    this.historyListEl = document.getElementById('move-history');
    this.promoModal = document.getElementById('promotion-modal');

    this.initBoardUI();
    this.bindEvents();
    this.updateStatusUI();
  }

  initBoardUI() {
    this.boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
        sq.dataset.row = r;
        sq.dataset.col = c;
        sq.addEventListener('click', () => this.handleSquareClick(r, c));
        this.boardEl.appendChild(sq);
      }
    }
    this.renderPieces();
  }

  renderPieces() {
    const squares = this.boardEl.querySelectorAll('.square');
    squares.forEach(sq => {
      const r = parseInt(sq.dataset.row);
      const c = parseInt(sq.dataset.col);
      const code = this.board[r][c];

      sq.innerHTML = '';
      sq.classList.remove('selected', 'valid-move', 'valid-capture', 'white-piece', 'black-piece');

      if (this.selected && this.selected.r === r && this.selected.c === c) {
        sq.classList.add('selected');
      }

      if (code) {
        const p = PIECES[code];
        const span = document.createElement('span');
        span.className = 'piece';
        span.textContent = p.symbol;
        sq.appendChild(span);
        sq.classList.add(p.color === 'w' ? 'white-piece' : 'black-piece');
      }
    });

    // 渲染可行走/吃子高亮
    if (this.validMoves.length > 0) {
      this.validMoves.forEach(m => {
        const sq = this.boardEl.querySelector(`[data-row="${m.r}"][data-col="${m.c}"]`);
        if (sq) {
          if (this.board[m.r][m.c]) {
            sq.classList.add('valid-capture');
          } else {
            sq.classList.add('valid-move');
          }
        }
      });
    }
  }

  handleSquareClick(r, c) {
    if (this.gameOver) return;
    if (this.isAI && this.turn === 'b') return; // AI 回合等待

    const targetCode = this.board[r][c];
    const targetPiece = targetCode ? PIECES[targetCode] : null;

    // 1. 如果已选子，且点击了有效落子格
    if (this.selected) {
      const move = this.validMoves.find(m => m.r === r && m.c === c);
      if (move) {
        this.makeMove(this.selected.r, this.selected.c, r, c);
        return;
      }
    }

    // 2. 选中己方棋子
    if (targetPiece && targetPiece.color === this.turn) {
      this.selected = { r, c };
      this.validMoves = this.getLegalMoves(r, c, this.board);
      this.renderPieces();
    } else {
      this.selected = null;
      this.validMoves = [];
      this.renderPieces();
    }
  }

  getLegalMoves(r, c, board) {
    const rawMoves = this.getPseudoLegalMoves(r, c, board);
    const color = PIECES[board[r][c]].color;

    // 过滤掉会自陷将军的步法
    return rawMoves.filter(m => {
      const nextBoard = JSON.parse(JSON.stringify(board));
      nextBoard[m.r][m.c] = nextBoard[r][c];
      nextBoard[r][c] = null;
      return !this.isKingInCheck(color, nextBoard);
    });
  }

  getPseudoLegalMoves(r, c, board) {
    const pieceCode = board[r][c];
    if (!pieceCode) return [];
    const p = PIECES[pieceCode];
    const moves = [];
    const isWhite = p.color === 'w';

    const addMove = (nr, nc) => {
      if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return false;
      const dest = board[nr][nc];
      if (!dest) {
        moves.push({ r: nr, c: nc });
        return true; // 可继续延伸
      }
      if (PIECES[dest].color !== p.color) {
        moves.push({ r: nr, c: nc }); // 吃对方子
      }
      return false; // 阻挡终止
    };

    // 兵 (Pawn)
    if (p.type === 'p') {
      const dir = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;
      // 前进 1 步
      if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) {
        moves.push({ r: r + dir, c });
        // 首步前进 2 步
        if (r === startRow && !board[r + dir * 2][c]) {
          moves.push({ r: r + dir * 2, c });
        }
      }
      // 斜向吃子
      [-1, 1].forEach(dc => {
        const nr = r + dir;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const dest = board[nr][nc];
          if (dest && PIECES[dest].color !== p.color) {
            moves.push({ r: nr, c: nc });
          }
        }
      });
    }

    // 马 (Knight)
    if (p.type === 'n') {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      knightOffsets.forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }

    // 象 (Bishop)
    if (p.type === 'b' || p.type === 'q') {
      const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      dirs.forEach(([dr, dc]) => {
        let step = 1;
        while (addMove(r + dr * step, c + dc * step)) step++;
      });
    }

    // 车 (Rook)
    if (p.type === 'r' || p.type === 'q') {
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      dirs.forEach(([dr, dc]) => {
        let step = 1;
        while (addMove(r + dr * step, c + dc * step)) step++;
      });
    }

    // 王 (King)
    if (p.type === 'k') {
      const kingDirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      kingDirs.forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }

    return moves;
  }

  isKingInCheck(color, board) {
    // 寻找王的位置
    let kingPos = null;
    const kingCode = color === 'w' ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === kingCode) {
          kingPos = { r, c };
          break;
        }
      }
      if (kingPos) break;
    }
    if (!kingPos) return true; // 王被吃

    // 遍历对方所有棋子的伪合法走法，看是否能攻击到王
    const opponentColor = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const code = board[r][c];
        if (code && PIECES[code].color === opponentColor) {
          const attacks = this.getPseudoLegalMoves(r, c, board);
          if (attacks.some(m => m.r === kingPos.r && m.c === kingPos.c)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasAnyLegalMoves(color, board) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const code = board[r][c];
        if (code && PIECES[code].color === color) {
          const moves = this.getLegalMoves(r, c, board);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  }

  makeMove(fromR, fromC, toR, toC, promoType = null) {
    const pieceCode = this.board[fromR][fromC];
    const targetCode = this.board[toR][toC];
    const piece = PIECES[pieceCode];

    // 记录历史
    this.history.push({
      from: { r: fromR, c: fromC },
      to: { r: toR, c: toC },
      piece: pieceCode,
      captured: targetCode,
      board: JSON.parse(JSON.stringify(this.board))
    });

    if (targetCode) {
      const capPiece = PIECES[targetCode];
      this.captured[piece.color].push(capPiece.symbol);
      sounds.playCapture();
    } else {
      sounds.playMove();
    }

    // 兵升变检查
    if (piece.type === 'p' && (toR === 0 || toR === 7)) {
      if (!promoType && piece.color === 'w' && this.isAI) {
        // 弹出升变弹窗
        this.pendingPromotion = { fromR, fromC, toR, toC };
        this.promoModal.classList.remove('hidden');
        return;
      } else {
        const pCode = (piece.color === 'w' ? (promoType || 'Q') : (promoType || 'q')).toUpperCase();
        this.board[toR][toC] = piece.color === 'w' ? pCode : pCode.toLowerCase();
        this.board[fromR][fromC] = null;
      }
    } else {
      this.board[toR][toC] = pieceCode;
      this.board[fromR][fromC] = null;
    }

    // 切换回合
    this.turn = this.turn === 'w' ? 'b' : 'w';
    this.selected = null;
    this.validMoves = [];

    // 高亮最后走子
    this.boardEl.querySelectorAll('.square').forEach(s => s.classList.remove('last-move'));
    const fSq = this.boardEl.querySelector(`[data-row="${fromR}"][data-col="${fromC}"]`);
    const tSq = this.boardEl.querySelector(`[data-row="${toR}"][data-col="${toC}"]`);
    if (fSq) fSq.classList.add('last-move');
    if (tSq) tSq.classList.add('last-move');

    // 检查将军与将死
    const inCheck = this.isKingInCheck(this.turn, this.board);
    if (inCheck) sounds.playCheck();

    const hasMoves = this.hasAnyLegalMoves(this.turn, this.board);

    if (!hasMoves) {
      this.gameOver = true;
      if (inCheck) {
        alert(`🏆 对局结束！${this.turn === 'w' ? '黑方' : '白方'} 胜出 (Checkmate 将死)！`);
      } else {
        alert('🤝 对局和棋！逼和 (Stalemate)！');
      }
    }

    this.renderPieces();
    this.updateStatusUI(inCheck);

    // AI 行棋
    if (!this.gameOver && this.isAI && this.turn === 'b') {
      setTimeout(() => this.makeAIMove(), 350);
    }
  }

  makeAIMove() {
    const allMoves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const code = this.board[r][c];
        if (code && PIECES[code].color === 'b') {
          const moves = this.getLegalMoves(r, c, this.board);
          moves.forEach(m => allMoves.push({ fromR: r, fromC: c, toR: m.r, toC: m.c }));
        }
      }
    }

    if (allMoves.length === 0) return;

    let chosenMove = null;

    if (this.aiDifficulty === 'easy') {
      // 简单随机 + 优先吃子
      const captureMoves = allMoves.filter(m => this.board[m.toR][m.toC]);
      if (captureMoves.length > 0 && Math.random() > 0.3) {
        chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
      } else {
        chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      }
    } else {
      // 进阶启发式估值
      let bestScore = -Infinity;
      for (const m of allMoves) {
        const target = this.board[m.toR][m.toC];
        let score = 0;
        if (target) {
          score += PIECES[target].val * 10;
        }
        // 中心控制奖励 (d4, d5, e4, e5)
        if ((m.toR === 3 || m.toR === 4) && (m.toC === 3 || m.toC === 4)) {
          score += 30;
        }
        // 微小随机扰动，避免机械走法
        score += Math.random() * 8;

        if (score > bestScore) {
          bestScore = score;
          chosenMove = m;
        }
      }
      if (!chosenMove) chosenMove = allMoves[0];
    }

    this.makeMove(chosenMove.fromR, chosenMove.fromC, chosenMove.toR, chosenMove.toC, 'q');
  }

  updateStatusUI(inCheck = false) {
    if (this.turn === 'w') {
      this.turnDotEl.className = 'turn-dot';
      this.turnTextEl.textContent = '轮到白方走子';
    } else {
      this.turnDotEl.className = 'turn-dot black';
      this.turnTextEl.textContent = this.isAI ? '🤖 思考中 (黑方)...' : '轮到黑方走子';
    }

    if (inCheck) {
      this.checkWarningEl.classList.remove('hidden');
    } else {
      this.checkWarningEl.classList.add('hidden');
    }

    this.whiteCapturedEl.textContent = this.captured.w.join(' ');
    this.blackCapturedEl.textContent = this.captured.b.join(' ');

    // 记谱历史渲染
    if (this.history.length === 0) {
      this.historyListEl.innerHTML = '<div class="history-empty">对局开始，白方先走。</div>';
    } else {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const last = this.history[this.history.length - 1];
      const fromSquare = `${files[last.from.c]}${8 - last.from.r}`;
      const toSquare = `${files[last.to.c]}${8 - last.to.r}`;
      const pieceName = PIECES[last.piece].symbol;
      const text = `${this.history.length}. ${pieceName} ${fromSquare}→${toSquare}`;

      const div = document.createElement('div');
      div.className = 'history-item';
      div.textContent = text;
      this.historyListEl.appendChild(div);
      this.historyListEl.scrollTop = this.historyListEl.scrollHeight;
    }
  }

  undo() {
    if (this.history.length === 0) return;
    // 如果人机模式且最后一步是白方等AI，或者AI已经走了，则撤回两步
    const steps = (this.isAI && this.history.length >= 2) ? 2 : 1;
    for (let i = 0; i < steps; i++) {
      if (this.history.length === 0) break;
      const last = this.history.pop();
      this.board = last.board;
      if (last.captured) {
        const color = PIECES[last.piece].color;
        this.captured[color].pop();
      }
    }
    this.turn = 'w';
    this.gameOver = false;
    this.selected = null;
    this.validMoves = [];
    this.initBoardUI();
    this.updateStatusUI();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    this.turn = 'w';
    this.selected = null;
    this.validMoves = [];
    this.history = [];
    this.captured = { w: [], b: [] };
    this.gameOver = false;
    this.initBoardUI();
    this.updateStatusUI();
  }

  bindEvents() {
    document.getElementById('btn-restart').addEventListener('click', () => this.restart());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());

    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn.addEventListener('click', () => {
      sounds.enabled = !sounds.enabled;
      soundBtn.textContent = sounds.enabled ? '🔊 棋子落子音效: 开' : '🔈 棋子落子音效: 关';
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

    const diffSelect = document.getElementById('ai-diff');
    diffSelect.addEventListener('change', (e) => {
      this.aiDifficulty = e.target.value;
    });

    // 升变弹窗选择
    this.promoModal.querySelectorAll('.promo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pieceType = btn.getAttribute('data-piece');
        this.promoModal.classList.add('hidden');
        if (this.pendingPromotion) {
          const { fromR, fromC, toR, toC } = this.pendingPromotion;
          this.pendingPromotion = null;
          this.makeMove(fromR, fromC, toR, toC, pieceType);
        }
      });
    });
  }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
  new ChessGame();
});
