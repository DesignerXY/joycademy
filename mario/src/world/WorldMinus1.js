// World -1 (Underwater Glitch Level / 水下无限循环关卡)
import { TILE_SIZE } from './Level1_1.js';

export const MINUS1_WIDTH_TILES = 120;
export const MINUS1_HEIGHT_TILES = 15;

export class WorldMinus1 {
  constructor() {
    this.name = 'WORLD -1';
    this.isUnderwater = true;
    this.width = MINUS1_WIDTH_TILES;
    this.height = MINUS1_HEIGHT_TILES;
    this.tiles = Array(this.width * this.height).fill(null);
    this.blockData = new Map();
    this.enemySpawns = [];
    this.flagpoleX = 105 * TILE_SIZE;
    this.castleDoorX = 112 * TILE_SIZE;

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
    // 1. Water Floor & Ceiling (underwater tunnel)
    for (let x = 0; x < this.width; x++) {
      this.setTile(x, 0, 'ground');
      this.setTile(x, 13, 'ground');
      this.setTile(x, 14, 'ground');
    }

    // 2. Coral Reefs & Water Pipes
    const addCoral = (tx, height) => {
      for (let y = 13 - height; y < 13; y++) {
        this.setTile(tx, y, 'brick');
      }
    };

    addCoral(18, 3);
    addCoral(28, 5);
    addCoral(45, 4);
    addCoral(62, 6);
    addCoral(78, 3);

    // 3. Question Blocks underwater (Coins & Star)
    this.setTile(22, 8, 'qblock', { content: 'coin' });
    this.setTile(35, 7, 'qblock', { content: 'star' });
    this.setTile(52, 6, 'qblock', { content: 'mushroom' });
    this.setTile(70, 7, 'qblock', { content: 'coin' });

    // 4. Underwater Flagpole at the end!
    for (let y = 3; y <= 12; y++) {
      this.setTile(105, y, 'flagpole');
    }
    this.setTile(105, 3, 'flag');
    this.setTile(105, 13, 'ground');

    // Castle structure
    for (let cx = 110; cx <= 114; cx++) {
      for (let cy = 8; cy <= 12; cy++) {
        this.setTile(cx, cy, 'brick');
      }
    }
    this.setTile(112, 11, 'castle_door');
    this.setTile(112, 12, 'castle_door');

    // 5. Enemy Spawns (Cheep Cheeps & Bloopers)
    this.enemySpawns = [
      { type: 'cheep', x: 25 * TILE_SIZE, y: 8 * TILE_SIZE },
      { type: 'blooper', x: 38 * TILE_SIZE, y: 6 * TILE_SIZE },
      { type: 'cheep', x: 55 * TILE_SIZE, y: 7 * TILE_SIZE },
      { type: 'cheep', x: 68 * TILE_SIZE, y: 5 * TILE_SIZE },
      { type: 'blooper', x: 82 * TILE_SIZE, y: 7 * TILE_SIZE }
    ];
  }
}
