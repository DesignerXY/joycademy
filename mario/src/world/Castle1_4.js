// World 1-4 (Bowser's Castle / 库巴城堡最终BOSS决战)
import { TILE_SIZE } from './Level1_1.js';

export const CASTLE_WIDTH_TILES = 160;
export const CASTLE_HEIGHT_TILES = 15;

export class Castle1_4 {
  constructor() {
    this.name = 'WORLD 1-4';
    this.isCastle = true;
    this.width = CASTLE_WIDTH_TILES;
    this.height = CASTLE_HEIGHT_TILES;
    this.tiles = Array(this.width * this.height).fill(null);
    this.blockData = new Map();
    this.enemySpawns = [];
    this.axeX = 145 * TILE_SIZE;
    this.toadX = 152 * TILE_SIZE;
    this.bowserDefeated = false;
    this.bridgeCollapsed = false;

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
    // 1. Castle Ceiling & Floor
    for (let x = 0; x < this.width; x++) {
      this.setTile(x, 1, 'brick'); // Ceiling
      this.setTile(x, 2, 'brick');
    }

    // Floors with Lava Pits
    const isLava = (x) => (x >= 28 && x <= 34) || (x >= 58 && x <= 66) || (x >= 92 && x <= 100) || (x >= 126 && x <= 144);

    for (let x = 0; x < this.width; x++) {
      if (isLava(x)) {
        this.setTile(x, 14, 'lava');
      } else {
        this.setTile(x, 13, 'brick');
        this.setTile(x, 14, 'brick');
      }
    }

    // 2. Pillars and Corridors
    const addPillars = (tx, height) => {
      for (let y = 13 - height; y < 13; y++) {
        this.setTile(tx, y, 'brick');
      }
    };

    addPillars(20, 4);
    addPillars(45, 5);
    addPillars(75, 4);
    addPillars(110, 6);

    // 3. Question Blocks in Castle
    this.setTile(25, 8, 'qblock', { content: 'mushroom' });
    this.setTile(50, 7, 'qblock', { content: 'star' });
    this.setTile(82, 8, 'qblock', { content: 'coin' });

    // 4. The Famous Bowser Drawbridge (x: 126 to 144 over lava pit!)
    for (let bx = 126; bx <= 144; bx++) {
      this.setTile(bx, 10, 'bridge_tile');
    }

    // 5. Golden Axe Switch at x: 145, y: 9
    this.setTile(145, 9, 'axe');
    this.setTile(145, 10, 'brick');

    // 6. Chamber with rescued Toad (x: 148 to 158)
    for (let cx = 146; cx < this.width; cx++) {
      this.setTile(cx, 13, 'brick');
      this.setTile(cx, 14, 'brick');
    }

    // Spawn Bowser on the bridge!
    this.enemySpawns = [
      { type: 'bowser', x: 135 * TILE_SIZE, y: 7 * TILE_SIZE }
    ];
  }

  collapseBridge() {
    this.bridgeCollapsed = true;
    for (let bx = 126; bx <= 144; bx++) {
      this.setTile(bx, 10, null);
    }
  }
}
