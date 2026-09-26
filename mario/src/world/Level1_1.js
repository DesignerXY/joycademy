// World 1-1 Layout and Tile Definitions
export const TILE_SIZE = 16;
export const LEVEL_WIDTH_TILES = 215; // ~3440px wide
export const LEVEL_HEIGHT_TILES = 15; // 240px high

export class Level1_1 {
  constructor() {
    this.width = LEVEL_WIDTH_TILES;
    this.height = LEVEL_HEIGHT_TILES;
    this.tiles = Array(this.width * this.height).fill(null);
    this.blockData = new Map(); // Stores extra data like coins, powerups, bounce animation
    this.enemySpawns = [];
    this.flagpoleX = 198 * TILE_SIZE;
    this.castleDoorX = 205 * TILE_SIZE;

    this.buildMap();
  }

  setTile(tx, ty, type, data = null) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return;
    const idx = ty * this.width + tx;
    this.tiles[idx] = type;
    if (data) {
      this.blockData.set(`${tx},${ty}`, data);
    }
  }

  getTile(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return null;
    return this.tiles[ty * this.width + tx];
  }

  buildMap() {
    // 1. Ground with Pits
    const isPit = (x) => (x >= 69 && x <= 70) || (x >= 86 && x <= 88) || (x >= 153 && x <= 154);

    for (let x = 0; x < this.width; x++) {
      if (!isPit(x)) {
        this.setTile(x, 13, 'ground');
        this.setTile(x, 14, 'ground');
      }
    }

    // 2. Pipes (x, height, isEnterable)
    const addPipe = (tx, height, enterable = false) => {
      const topY = 13 - height;
      this.setTile(tx, topY, enterable ? 'pipe_enter_l' : 'pipe_tl', { enterable });
      this.setTile(tx + 1, topY, enterable ? 'pipe_enter_r' : 'pipe_tr', { enterable });
      for (let y = topY + 1; y < 13; y++) {
        this.setTile(tx, y, 'pipe_sl');
        this.setTile(tx + 1, y, 'pipe_sr');
      }
    };

    addPipe(28, 2);
    addPipe(38, 3);
    addPipe(46, 4);
    addPipe(57, 4, true); // Pipe 4 enters underground!
    addPipe(163, 2);
    addPipe(179, 2);

    // 3. Question Blocks & Bricks
    // Section 1: ? block with coin, then 5 blocks row
    this.setTile(16, 9, 'qblock', { content: 'coin' });
    this.setTile(20, 9, 'brick', { breakable: true });
    this.setTile(21, 9, 'qblock', { content: 'mushroom' }); // Super Mushroom
    this.setTile(22, 9, 'brick', { breakable: true });
    this.setTile(23, 9, 'qblock', { content: 'coin' });
    this.setTile(24, 9, 'brick', { breakable: true });
    this.setTile(22, 5, 'qblock', { content: 'coin' }); // High ? block

    // Section 2: Over pipe 4
    this.setTile(64, 8, 'brick', { breakable: true });
    this.setTile(65, 8, 'qblock', { content: 'mushroom' });
    this.setTile(66, 8, 'brick', { breakable: true });

    // Section 3: High bridge
    for (let x = 77; x <= 79; x++) {
      this.setTile(x, 5, 'brick', { breakable: true });
    }
    this.setTile(78, 9, 'qblock', { content: 'coin' });

    // Multi-coin brick
    this.setTile(80, 9, 'brick', { breakable: true, coinsLeft: 5 });

    // Section 4: Double Question Blocks
    this.setTile(94, 9, 'brick', { breakable: true });
    this.setTile(95, 9, 'qblock', { content: 'coin' });
    this.setTile(96, 9, 'brick', { breakable: true });

    // Starman Brick
    this.setTile(101, 9, 'brick', { content: 'star', breakable: true });

    this.setTile(106, 9, 'qblock', { content: 'coin' });
    this.setTile(109, 9, 'qblock', { content: 'mushroom' });
    this.setTile(109, 5, 'qblock', { content: 'coin' });
    this.setTile(112, 9, 'qblock', { content: 'coin' });

    // Section 5: Triple Bricks with Mushroom
    this.setTile(118, 9, 'brick', { breakable: true });
    this.setTile(121, 5, 'brick', { breakable: true });
    this.setTile(122, 5, 'brick', { breakable: true });
    this.setTile(123, 5, 'brick', { breakable: true });

    this.setTile(128, 5, 'brick', { breakable: true });
    this.setTile(129, 5, 'qblock', { content: 'coin' });
    this.setTile(130, 5, 'qblock', { content: 'coin' });
    this.setTile(131, 5, 'brick', { breakable: true });

    this.setTile(129, 9, 'brick', { breakable: true });
    this.setTile(130, 9, 'brick', { breakable: true });

    // 4. End Pyramid Staircases
    const buildStairs = (startX, height, facingRight = true) => {
      for (let step = 0; step < height; step++) {
        const x = facingRight ? startX + step : startX - step;
        for (let y = 0; y <= step; y++) {
          this.setTile(x, 12 - y, 'hard_block');
        }
      }
    };

    // Stairs before final flag
    buildStairs(134, 4, true);
    buildStairs(143, 4, false);

    buildStairs(148, 4, true);
    buildStairs(158, 4, false);

    // Huge 8-step staircase to flagpole
    buildStairs(181, 8, true);
    for (let y = 0; y < 8; y++) {
      this.setTile(189, 12 - y, 'hard_block');
    }

    // 5. Flagpole at x = 198
    this.setTile(198, 12, 'hard_block');
    for (let y = 3; y <= 11; y++) {
      this.setTile(198, y, 'flagpole');
    }
    this.setTile(198, 2, 'pole_top');

    // 6. Castle at x = 202..207
    for (let cx = 202; cx <= 207; cx++) {
      for (let cy = 8; cy <= 12; cy++) {
        this.setTile(cx, cy, 'castle_brick');
      }
    }
    // Castle Turrets
    this.setTile(202, 7, 'castle_brick');
    this.setTile(204, 7, 'castle_brick');
    this.setTile(205, 7, 'castle_brick');
    this.setTile(207, 7, 'castle_brick');
    // Castle Doorway
    this.setTile(204, 11, 'castle_door');
    this.setTile(204, 12, 'castle_door');

    // 7. Enemy Spawns (x in pixels, type)
    this.enemySpawns = [
      { x: 22 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 40 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 51 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 53 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 82 * TILE_SIZE, y: 4 * TILE_SIZE, type: 'goomba' },
      { x: 97 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 107 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'koopa' }, // Green Koopa
      { x: 114 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 124 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 126 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 168 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'goomba' },
      { x: 175 * TILE_SIZE, y: 12 * TILE_SIZE, type: 'koopa' }
    ];
  }
}
