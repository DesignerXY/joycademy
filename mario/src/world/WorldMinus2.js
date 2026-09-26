// World -2 (High-Speed Bridge Level / 桥上高速跳跃关卡)
import { TILE_SIZE } from './Level1_1.js';

export const MINUS2_WIDTH_TILES = 140;
export const MINUS2_HEIGHT_TILES = 15;

export class WorldMinus2 {
  constructor() {
    this.name = 'WORLD -2';
    this.isBridge = true;
    this.width = MINUS2_WIDTH_TILES;
    this.height = MINUS2_HEIGHT_TILES;
    this.tiles = Array(this.width * this.height).fill(null);
    this.blockData = new Map();
    this.enemySpawns = [];
    this.flagpoleX = 125 * TILE_SIZE;
    this.castleDoorX = 132 * TILE_SIZE;

    this.buildMap();
  }

  setTile(tx, ty, type, data = null) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return;
    this.tiles[ty * this.width + tx] = type;
    if (data) this.blockData.set(`${tx},${ty}`, data);
  }

  getTile(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return null;
    return this.tiles[ty * this.width + tx];
  }

  buildMap() {
    // 1. Starting Platform
    for (let x = 0; x <= 15; x++) {
      this.setTile(x, 13, 'ground');
      this.setTile(x, 14, 'ground');
    }

    // 2. High Suspended Wooden Bridges over Pits
    const addBridge = (startX, endX, y) => {
      for (let x = startX; x <= endX; x++) {
        this.setTile(x, y, 'brick');
      }
    };

    addBridge(18, 30, 11);
    addBridge(34, 46, 10);
    addBridge(50, 64, 9);
    addBridge(68, 80, 10);
    addBridge(84, 98, 11);
    addBridge(102, 115, 12);

    // 3. Question Blocks on Bridges (Super Star & Coins)
    this.setTile(24, 7, 'qblock', { content: 'star' });
    this.setTile(40, 6, 'qblock', { content: 'mushroom' });
    this.setTile(56, 5, 'qblock', { content: 'coin' });
    this.setTile(74, 6, 'qblock', { content: 'coin' });
    this.setTile(90, 7, 'qblock', { content: 'star' });

    // 4. Ending Flagpole
    for (let x = 118; x < this.width; x++) {
      this.setTile(x, 13, 'ground');
      this.setTile(x, 14, 'ground');
    }

    for (let y = 3; y <= 12; y++) {
      this.setTile(125, y, 'flagpole');
    }
    this.setTile(125, 3, 'flag');

    // Castle
    for (let cx = 130; cx <= 134; cx++) {
      for (let cy = 8; cy <= 12; cy++) {
        this.setTile(cx, cy, 'brick');
      }
    }
    this.setTile(132, 11, 'castle_door');
    this.setTile(132, 12, 'castle_door');

    // 5. High-Speed Enemies (Cheep Cheeps & Fast Koopas)
    this.enemySpawns = [
      { type: 'fast_koopa', x: 28 * TILE_SIZE, y: 9 * TILE_SIZE },
      { type: 'cheep', x: 38 * TILE_SIZE, y: 13 * TILE_SIZE },
      { type: 'fast_koopa', x: 55 * TILE_SIZE, y: 7 * TILE_SIZE },
      { type: 'cheep', x: 72 * TILE_SIZE, y: 13 * TILE_SIZE },
      { type: 'fast_koopa', x: 88 * TILE_SIZE, y: 9 * TILE_SIZE },
      { type: 'cheep', x: 106 * TILE_SIZE, y: 13 * TILE_SIZE }
    ];
  }
}
