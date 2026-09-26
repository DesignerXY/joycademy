// World S (Champion's Gauntlet / 终极超难扩大关卡)
import { TILE_SIZE } from './Level1_1.js';

export const CHAMPION_WIDTH_TILES = 280; // Mega expanded ~4480px!
export const CHAMPION_HEIGHT_TILES = 15;

export class WorldChampion {
  constructor() {
    this.name = 'WORLD S (CHAMPION)';
    this.isChampion = true;
    this.isCastle = true;
    this.width = CHAMPION_WIDTH_TILES;
    this.height = CHAMPION_HEIGHT_TILES;
    this.tiles = Array(this.width * this.height).fill(null);
    this.blockData = new Map();
    this.enemySpawns = [];
    this.axeX = 265 * TILE_SIZE;
    this.toadX = 272 * TILE_SIZE;
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
    // 1. Spikes & Ceiling along the entire mega cavern
    for (let x = 0; x < this.width; x++) {
      this.setTile(x, 0, 'brick');
      this.setTile(x, 1, 'brick');
    }

    // 2. Starting Safe Platform
    for (let x = 0; x <= 15; x++) {
      this.setTile(x, 13, 'brick');
      this.setTile(x, 14, 'brick');
    }

    // 3. Section 1: Tiny 1-Tile Precision Pillars over Boiling Lava
    const addPillars = (xs, y) => {
      xs.forEach(px => {
        this.setTile(px, y, 'brick');
        this.setTile(px, y + 1, 'brick');
      });
    };

    // Lava along the floor
    for (let x = 16; x < 260; x++) {
      this.setTile(x, 14, 'lava');
    }

    addPillars([19, 23, 27, 31, 35, 39, 43], 11);

    // Question block with Super Star for the daring!
    this.setTile(31, 6, 'qblock', { content: 'star' });

    // Section 2: Floating Stepping Platforms with Low Ceilings (Crouch slide challenges)
    const addCeilingSection = (startX, endX, floorY, ceilY) => {
      for (let x = startX; x <= endX; x++) {
        this.setTile(x, floorY, 'brick');
        this.setTile(x, ceilY, 'brick');
      }
    };

    addCeilingSection(48, 62, 10, 8); // Very tight gap!
    this.setTile(55, 6, 'qblock', { content: 'mushroom' });

    // Section 3: High-altitude Stepping Steppes over Lava Abyss
    addPillars([66, 70, 75, 80, 86, 92, 98, 105, 112, 119], 10);
    this.setTile(86, 5, 'qblock', { content: 'star' });

    // Section 4: Pipe Maze & Flying Fish Canyon
    const addPipe = (tx, height) => {
      const topY = 13 - height;
      this.setTile(tx, topY, 'pipe_tl');
      this.setTile(tx + 1, topY, 'pipe_tr');
      for (let y = topY + 1; y < 13; y++) {
        this.setTile(tx, y, 'pipe_sl');
        this.setTile(tx + 1, y, 'pipe_sr');
      }
    };

    for (let px = 125; px <= 165; px += 2) {
      this.setTile(px, 12, 'brick');
    }
    addPipe(130, 4);
    addPipe(142, 6);
    addPipe(154, 5);
    addPipe(162, 7);

    // Star power reward
    this.setTile(148, 7, 'qblock', { content: 'star' });

    // Section 5: The Castle Corridor & Fire Gauntlet (175 to 240)
    for (let x = 172; x <= 245; x++) {
      if ((x % 8) !== 0) {
        this.setTile(x, 12, 'brick');
      }
    }
    this.setTile(210, 7, 'qblock', { content: 'star' });

    // Section 6: The Great Drawbridge with DUAL BOWSER BOSSES (246 to 264)
    for (let bx = 246; bx <= 264; bx++) {
      this.setTile(bx, 10, 'bridge_tile');
    }

    // Golden Axe Switch at x: 265
    this.setTile(265, 9, 'axe');
    this.setTile(265, 10, 'brick');

    // Final Throne Chamber with Princess / Toad (266 to 280)
    for (let fx = 266; fx < this.width; fx++) {
      this.setTile(fx, 13, 'brick');
      this.setTile(fx, 14, 'brick');
    }

    // Mega Enemy Spawns (Fast Koopas, Cheep Cheeps, and DUAL BOWSERS!)
    this.enemySpawns = [
      { type: 'fast_koopa', x: 25 * TILE_SIZE, y: 9 * TILE_SIZE },
      { type: 'cheep', x: 35 * TILE_SIZE, y: 13 * TILE_SIZE },
      { type: 'fast_koopa', x: 72 * TILE_SIZE, y: 8 * TILE_SIZE },
      { type: 'cheep', x: 95 * TILE_SIZE, y: 13 * TILE_SIZE },
      { type: 'fast_koopa', x: 135 * TILE_SIZE, y: 10 * TILE_SIZE },
      { type: 'cheep', x: 150 * TILE_SIZE, y: 13 * TILE_SIZE },
      { type: 'fast_koopa', x: 190 * TILE_SIZE, y: 10 * TILE_SIZE },
      { type: 'fast_koopa', x: 220 * TILE_SIZE, y: 10 * TILE_SIZE },
      // DUAL BOWSERS on the Great Bridge!
      { type: 'bowser', x: 252 * TILE_SIZE, y: 7 * TILE_SIZE },
      { type: 'bowser', x: 260 * TILE_SIZE, y: 7 * TILE_SIZE }
    ];
  }

  collapseBridge() {
    this.bridgeCollapsed = true;
    for (let bx = 246; bx <= 264; bx++) {
      this.setTile(bx, 10, null);
    }
  }
}
