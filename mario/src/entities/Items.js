// Mario Collectibles, Projectiles, and Particle Shards
import { TILE_SIZE } from '../world/Level1_1.js';

export class PopCoin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.vy = -5.5;
    this.gravity = 0.35;
    this.done = false;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update(delta) {
    this.vy += this.gravity;
    this.y += this.vy;
    this.frameTimer += delta;
    if (this.frameTimer > 0.08) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % 4;
    }
    if (this.vy > 0 && this.y >= this.startY - 4) {
      this.done = true;
    }
  }

  draw(ctx, spriteSheet) {
    const spr = spriteSheet.get(`coin_${this.frame}`);
    if (spr) ctx.drawImage(spr, this.x, this.y);
  }
}

export class MushroomItem {
  constructor(x, y, isFireFlower = false) {
    this.x = x;
    this.y = y;
    this.targetY = y - 16;
    this.isFireFlower = isFireFlower;
    this.width = 16;
    this.height = 16;
    this.emergeProgress = 0;
    this.isEmerging = true;
    this.vx = 1.2;
    this.vy = 0;
    this.onGround = false;
    this.done = false;
  }

  update(delta, level) {
    if (this.isEmerging) {
      this.emergeProgress += delta * 2.5;
      this.y = this.targetY + 16 * (1 - Math.min(1, this.emergeProgress));
      if (this.emergeProgress >= 1.0) {
        this.isEmerging = false;
        this.y = this.targetY;
      }
      return;
    }

    if (this.isFireFlower) {
      // Fire flower sits in place atop block
      return;
    }

    // Mushroom physics: slides horizontally, falls with gravity
    this.vy += 22 * delta;
    if (this.vy > 6) this.vy = 6;

    // Horizontal movement & wall collision
    const nextX = this.x + this.vx * 60 * delta;
    const testTileX = this.vx > 0 ? Math.floor((nextX + this.width) / TILE_SIZE) : Math.floor(nextX / TILE_SIZE);
    const tileY = Math.floor((this.y + 8) / TILE_SIZE);

    if (level.getTile(testTileX, tileY)) {
      this.vx = -this.vx; // Reverse on wall hit
    } else {
      this.x = nextX;
    }

    // Vertical movement & floor collision
    this.y += this.vy;
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const leftTileX = Math.floor(this.x / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width - 1) / TILE_SIZE);

    if (level.getTile(leftTileX, bottomTileY) || level.getTile(rightTileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (this.y > 260) this.done = true;
  }

  draw(ctx, spriteSheet) {
    const spr = spriteSheet.get(this.isFireFlower ? 'fireflower' : 'mushroom');
    if (spr) ctx.drawImage(spr, this.x, this.y);
  }
}

export class PoisonMushroomItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetY = y - 16;
    this.width = 16;
    this.height = 16;
    this.emergeProgress = 0;
    this.isEmerging = true;
    this.vx = -1.1; // moves toward player
    this.vy = 0;
    this.onGround = false;
    this.done = false;
  }

  update(delta, level) {
    if (this.isEmerging) {
      this.emergeProgress += delta * 2.5;
      this.y = this.targetY + 16 * (1 - Math.min(1, this.emergeProgress));
      if (this.emergeProgress >= 1.0) {
        this.isEmerging = false;
        this.y = this.targetY;
      }
      return;
    }

    this.vy += 22 * delta;
    if (this.vy > 6) this.vy = 6;

    const nextX = this.x + this.vx * 60 * delta;
    const testTileX = this.vx > 0 ? Math.floor((nextX + this.width) / TILE_SIZE) : Math.floor(nextX / TILE_SIZE);
    const tileY = Math.floor((this.y + 8) / TILE_SIZE);

    if (level.getTile(testTileX, tileY)) {
      this.vx = -this.vx;
    } else {
      this.x = nextX;
    }

    this.y += this.vy;
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const leftTileX = Math.floor(this.x / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width - 1) / TILE_SIZE);

    if (level.getTile(leftTileX, bottomTileY) || level.getTile(rightTileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (this.y > 260) this.done = true;
  }

  draw(ctx, spriteSheet) {
    const spr = spriteSheet.get('poison_mushroom');
    if (spr) ctx.drawImage(spr, this.x, this.y);
  }
}

export class StarItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetY = y - 16;
    this.width = 16;
    this.height = 16;
    this.emergeProgress = 0;
    this.isEmerging = true;
    this.vx = 1.6;
    this.vy = -3.5;
    this.onGround = false;
    this.frame = 0;
    this.frameTimer = 0;
    this.done = false;
  }

  update(delta, level) {
    this.frameTimer += delta;
    if (this.frameTimer > 0.07) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % 4;
    }

    if (this.isEmerging) {
      this.emergeProgress += delta * 2.5;
      this.y = this.targetY + 16 * (1 - Math.min(1, this.emergeProgress));
      if (this.emergeProgress >= 1.0) {
        this.isEmerging = false;
        this.y = this.targetY;
        this.vy = -4.0;
      }
      return;
    }

    // Bouncing gravity
    this.vy += 20 * delta;
    if (this.vy > 6.0) this.vy = 6.0;

    // Horizontal movement & wall bounce
    const nextX = this.x + this.vx * 60 * delta;
    const testTileX = this.vx > 0 ? Math.floor((nextX + this.width) / TILE_SIZE) : Math.floor(nextX / TILE_SIZE);
    const tileY = Math.floor((this.y + 8) / TILE_SIZE);

    if (level.getTile(testTileX, tileY)) {
      this.vx = -this.vx;
    } else {
      this.x = nextX;
    }

    // Vertical movement & ground high bounce!
    this.y += this.vy;
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const leftTileX = Math.floor(this.x / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width - 1) / TILE_SIZE);

    if (level.getTile(leftTileX, bottomTileY) || level.getTile(rightTileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = -4.5; // BOUNCE!
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (this.y > 260) this.done = true;
  }

  draw(ctx, spriteSheet) {
    const spr = spriteSheet.get(`star_${this.frame}`);
    if (spr) ctx.drawImage(spr, this.x, this.y);
  }
}

export class FireballProjectile {
  constructor(x, y, facingRight) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
    this.vx = facingRight ? 4.5 : -4.5;
    this.vy = 2.0;
    this.done = false;
  }

  update(delta, level) {
    this.x += this.vx;
    this.vy += 20 * delta;
    this.y += this.vy;

    // Bounce on floor
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const tileX = Math.floor((this.x + 4) / TILE_SIZE);

    if (level.getTile(tileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = -3.5; // Bounce up!
    }

    // Disappear on wall hit or out of bounds
    const sideTileX = Math.floor((this.x + (this.vx > 0 ? this.width : 0)) / TILE_SIZE);
    const midTileY = Math.floor((this.y + 4) / TILE_SIZE);
    if (level.getTile(sideTileX, midTileY)) {
      this.done = true;
    }

    if (this.y > 250) this.done = true;
  }

  draw(ctx, spriteSheet) {
    const spr = spriteSheet.get('fireball');
    if (spr) ctx.drawImage(spr, this.x, this.y);
  }
}

export class BrickShard {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.done = false;
  }

  update(delta) {
    this.vy += 25 * delta;
    this.x += this.vx * 60 * delta;
    this.y += this.vy * 60 * delta;
    if (this.y > 260) this.done = true;
  }

  draw(ctx) {
    ctx.fillStyle = '#b84418';
    ctx.fillRect(this.x, this.y, 4, 4);
    ctx.fillStyle = '#fc9838';
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

export class ScorePopup {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.life = 0.8;
  }

  update(delta) {
    this.y -= delta * 24;
    this.life -= delta;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(this.text, this.x, this.y);
  }
}
