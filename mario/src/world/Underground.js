// Underground Secret Coin Vault
import { TILE_SIZE } from './Level1_1.js';

export class UndergroundLevel {
  constructor() {
    this.width = 32;
    this.height = 15;
    this.tiles = Array(this.width * this.height).fill(null);
    this.blockData = new Map();
    this.coins = [];
    this.exitPipeX = 26 * TILE_SIZE;

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
    // Ceiling and Floor
    for (let x = 0; x < this.width; x++) {
      this.setTile(x, 0, 'hard_block');
      this.setTile(x, 1, 'hard_block');
      this.setTile(x, 13, 'hard_block');
      this.setTile(x, 14, 'hard_block');
    }
    // Left and Right walls
    for (let y = 0; y < this.height; y++) {
      this.setTile(0, y, 'hard_block');
      this.setTile(1, y, 'hard_block');
    }

    // Floating Rows of Coins (19 coins!)
    for (let x = 5; x <= 18; x++) {
      this.coins.push({ x: x * TILE_SIZE, y: 7 * TILE_SIZE, collected: false });
      this.coins.push({ x: x * TILE_SIZE, y: 9 * TILE_SIZE, collected: false });
    }

    // Exit Pipe on right
    this.setTile(26, 11, 'pipe_tl', { isExit: true });
    this.setTile(27, 11, 'pipe_tr', { isExit: true });
    this.setTile(26, 12, 'pipe_sl');
    this.setTile(27, 12, 'pipe_sr');
  }
}
