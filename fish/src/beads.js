// Mini Game 2: 鱼鱼拼豆模式 (Fish Perler Beads Studio)

import confetti from 'canvas-confetti';
import { fishSound } from './sound.js';

export const BEAD_COLORS = [
  { name: '兰寿朱红', hex: '#ef4444' },
  { name: '珍珠纯白', hex: '#ffffff' },
  { name: '小丑亮橙', hex: '#f97316' },
  { name: '玄墨曜黑', hex: '#0f172a' },
  { name: '水母荧光青', hex: '#06b6d4' },
  { name: '柠檬明黄', hex: '#facc15' },
  { name: '梦幻珊瑚粉', hex: '#ec4899' },
  { name: '深海幽蓝', hex: '#3b82f6' }
];

// 经典模版预设 (16x16 像素图案)
export const BEAD_TEMPLATES = {
  ranchu: {
    name: '🦁 萌宠肉瘤兰寿',
    grid: [
      "................",
      ".....RRRR.......",
      "....RRRRRR......",
      "...RRRRRRRR.....",
      "...RRRKBBRRR....",
      "...RRBBBBBRRR...",
      "..RRRRRRRRRRR...",
      ".RRRRRRRRRRRRW..",
      ".RRRRRRWWWRRRWW.",
      ".RRRRWWWWWRRRWW.",
      "..RRRWWWWWRR....",
      "...RRRRRRRR.....",
      "....RR...RR.....",
      "................",
      "................",
      "................"
    ]
  },
  clown: {
    name: '🎪 条纹小丑鱼',
    grid: [
      "................",
      "......OOO.......",
      ".....OOOOO......",
      "....OOKBBOO.....",
      "...OOWWWOOOO....",
      "..OOOWWWOOOOWO..",
      ".OOOOOWWWOOOOWO.",
      "..OOOWWWOOOOWO..",
      "...OOWWWOOOO....",
      "....OOOOOOO.....",
      ".....OOOOO......",
      "......OOO.......",
      "................",
      "................",
      "................",
      "................"
    ]
  },
  jelly: {
    name: '🪼 梦幻发光水母',
    grid: [
      "................",
      ".....CCCC.......",
      "...CCCCCCCC.....",
      "..CCCCCCCCCC....",
      ".CCCCCCCCCCCC...",
      ".CCCCCCCCCCCC...",
      ".CCCCKBBKCCCC...",
      "..CCCCCCCCCC....",
      "...C.C..C.C.....",
      "...C.C..C.C.....",
      "...C.C..C.C.....",
      "...C.C..C.C.....",
      "....C.C..C......",
      "................",
      "................",
      "................"
    ]
  }
};

const CHAR_TO_COLOR = {
  'R': '#ef4444',
  'W': '#ffffff',
  'O': '#f97316',
  'K': '#0f172a',
  'C': '#06b6d4',
  'Y': '#facc15',
  'P': '#ec4899',
  'B': '#3b82f6',
  '.': null
};

export class PerlerBeadsStudio {
  constructor(containerEl) {
    this.container = containerEl;
    this.gridSize = 16;
    this.cells = Array(this.gridSize * this.gridSize).fill(null);
    this.selectedColor = BEAD_COLORS[0].hex;
    this.currentTool = 'pen'; // 'pen' | 'eraser'
    this.showcaseList = [];

    this.init();
  }

  init() {
    this.renderLayout();
    this.loadTemplate('ranchu');
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="beads-studio-wrap">
        <div class="beads-sidebar">
          <h4>🎨 拼豆调色盘</h4>
          <div class="color-palette-grid" id="bead-palette-grid"></div>

          <div class="bead-tools-box">
            <button class="btn-bead-tool active" id="btn-tool-pen">🖌️ 放置豆豆</button>
            <button class="btn-bead-tool" id="btn-tool-eraser">🧹 镊子拔豆</button>
            <button class="btn-bead-tool" id="btn-bead-clear">🗑️ 一键清空</button>
          </div>

          <h4>📜 图纸模版</h4>
          <div class="template-selector-box">
            <button class="btn-template-chip" data-tpl="ranchu">🦁 萌宠兰寿</button>
            <button class="btn-template-chip" data-tpl="clown">🎪 条纹小丑</button>
            <button class="btn-template-chip" data-tpl="jelly">🪼 发光水母</button>
            <button class="btn-template-chip" data-tpl="blank">✨ 自由画布</button>
          </div>

          <div style="margin-top: 16px;">
            <button class="btn-iron-magic" id="btn-iron-execute">
              <span>♨️ 电熨斗魔法熨烫！</span>
            </button>
          </div>
        </div>

        <div class="beads-board-panel">
          <div class="board-header">
            <span>✨ 16×16 发光拼豆插板 (按住拖拽连续拼插)</span>
            <span style="color: #fde047;">兰寿与鱼鱼艺术工坊</span>
          </div>
          <div class="bead-pegboard" id="bead-pegboard-grid"></div>
        </div>
      </div>

      <div class="showcase-section" id="bead-showcase-box">
        <h4>🏆 我的拼豆作品珍藏馆 (<span id="showcase-count">0</span> 件)</h4>
        <div class="showcase-badges-row" id="showcase-badges-list">
          <div style="color: #64748b; font-size: 13px;">暂未熨烫出作品，快快拼插并点击“电熨斗魔法熨烫”吧！</div>
        </div>
      </div>
    `;

    // 渲染调色盘
    const palGrid = document.getElementById('bead-palette-grid');
    palGrid.innerHTML = BEAD_COLORS.map((c, idx) => `
      <div class="color-swatch ${idx === 0 ? 'active' : ''}" data-color="${c.hex}" style="background: ${c.hex};" title="${c.name}"></div>
    `).join('');

    palGrid.addEventListener('click', (e) => {
      const sw = e.target.closest('.color-swatch');
      if (sw) {
        palGrid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        this.selectedColor = sw.dataset.color;
        this.currentTool = 'pen';
        document.getElementById('btn-tool-pen').classList.add('active');
        document.getElementById('btn-tool-eraser').classList.remove('active');
      }
    });

    // 工具切换
    const penBtn = document.getElementById('btn-tool-pen');
    const eraserBtn = document.getElementById('btn-tool-eraser');
    const clearBtn = document.getElementById('btn-bead-clear');

    penBtn.addEventListener('click', () => {
      this.currentTool = 'pen';
      penBtn.classList.add('active');
      eraserBtn.classList.remove('active');
    });

    eraserBtn.addEventListener('click', () => {
      this.currentTool = 'eraser';
      eraserBtn.classList.add('active');
      penBtn.classList.remove('active');
    });

    clearBtn.addEventListener('click', () => {
      this.cells = Array(this.gridSize * this.gridSize).fill(null);
      this.renderBoard();
      fishSound.playBubble();
    });

    // 模版切换
    document.querySelectorAll('.btn-template-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const tplKey = btn.dataset.tpl;
        this.loadTemplate(tplKey);
      });
    });

    // 熨烫按钮
    document.getElementById('btn-iron-execute').addEventListener('click', () => {
      this.executeIronMagic();
    });

    // 渲染插板
    this.renderBoard();
  }

  loadTemplate(tplKey) {
    if (tplKey === 'blank') {
      this.cells = Array(this.gridSize * this.gridSize).fill(null);
    } else {
      const tpl = BEAD_TEMPLATES[tplKey];
      if (!tpl) return;
      this.cells = Array(this.gridSize * this.gridSize).fill(null);
      tpl.grid.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
          const ch = row[c];
          const color = CHAR_TO_COLOR[ch];
          this.cells[r * this.gridSize + c] = color;
        }
      });
    }
    this.renderBoard();
    fishSound.playBubble();
  }

  renderBoard() {
    const board = document.getElementById('bead-pegboard-grid');
    if (!board) return;
    board.innerHTML = '';

    let isDrawing = false;

    board.addEventListener('mousedown', () => { isDrawing = true; });
    window.addEventListener('mouseup', () => { isDrawing = false; });

    for (let i = 0; i < this.cells.length; i++) {
      const peg = document.createElement('div');
      peg.className = 'bead-peg';
      const color = this.cells[i];

      if (color) {
        peg.style.backgroundColor = color;
        peg.style.boxShadow = `inset -2px -2px 4px rgba(0,0,0,0.35), 0 0 6px ${color}88`;
      }

      const applyCell = () => {
        if (this.currentTool === 'pen') {
          this.cells[i] = this.selectedColor;
          peg.style.backgroundColor = this.selectedColor;
          peg.style.boxShadow = `inset -2px -2px 4px rgba(0,0,0,0.35), 0 0 6px ${this.selectedColor}88`;
          fishSound.playBead();
        } else {
          this.cells[i] = null;
          peg.style.backgroundColor = 'transparent';
          peg.style.boxShadow = 'none';
          fishSound.playBubble();
        }
      };

      peg.addEventListener('mousedown', applyCell);
      peg.addEventListener('mouseenter', () => {
        if (isDrawing) applyCell();
      });

      board.appendChild(peg);
    }
  }

  // 电熨斗魔法熨烫
  executeIronMagic() {
    const filledCount = this.cells.filter(c => c !== null).length;
    if (filledCount < 5) {
      alert('插板上的豆豆太少啦，先多拼几颗彩色豆豆再熨烫吧！');
      return;
    }

    const board = document.getElementById('bead-pegboard-grid');
    board.classList.add('ironing-steam');

    fishSound.playBubble();

    setTimeout(() => {
      board.classList.remove('ironing-steam');
      fishSound.playIronSuccess();
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 }
      });

      // 保存到作品珍藏馆
      this.saveShowcaseBadge();
    }, 1000);
  }

  saveShowcaseBadge() {
    // 生成徽章缩略图 (用小画布绘制)
    const cvs = document.createElement('canvas');
    cvs.width = 64;
    cvs.height = 64;
    const ctx = cvs.getContext('2d');
    const step = 64 / this.gridSize;

    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const color = this.cells[r * this.gridSize + c];
        if (color) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(c * step + step * 0.5, r * step + step * 0.5, step * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const badgeUrl = cvs.toDataURL();
    this.showcaseList.unshift(badgeUrl);
    this.renderShowcase();
  }

  renderShowcase() {
    const list = document.getElementById('showcase-badges-list');
    const cnt = document.getElementById('showcase-count');
    if (!list || !cnt) return;

    cnt.textContent = this.showcaseList.length;
    list.innerHTML = this.showcaseList.map((url, i) => `
      <div class="badge-item-card">
        <img src="${url}" alt="作品 ${i + 1}">
        <span>作品 #${this.showcaseList.length - i}</span>
      </div>
    `).join('');
  }
}
