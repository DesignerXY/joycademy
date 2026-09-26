// Mario Classic Enemies: Goomba and Koopa Troopa
import { TILE_SIZE } from '../world/Level1_1.js';

export class Goomba {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.vx = -0.8;
    this.vy = 0;
    this.onGround = false;
    this.isDead = false;
    this.isSquished = false;
    this.squishTimer = 0;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update(delta, level) {
    if (this.isSquished) {
      this.squishTimer += delta;
      if (this.squishTimer > 0.6) {
        this.isDead = true;
      }
      return;
    }

    // Horizontal Movement
    const nextX = this.x + this.vx * 60 * delta;
    const testTileX = this.vx > 0 ? Math.floor((nextX + this.width) / TILE_SIZE) : Math.floor(nextX / TILE_SIZE);
    const tileY = Math.floor((this.y + 8) / TILE_SIZE);

    if (level.getTile(testTileX, tileY)) {
      this.vx = -this.vx; // Reverse on wall
    } else {
      this.x = nextX;
    }

    // Gravity
    this.vy += 22 * delta;
    if (this.vy > 6) this.vy = 6;
    this.y += this.vy;

    // Ground collision
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const leftTileX = Math.floor((this.x + 2) / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width - 2) / TILE_SIZE);

    if (level.getTile(leftTileX, bottomTileY) || level.getTile(rightTileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    // Walking animation
    this.frameTimer += delta;
    if (this.frameTimer > 0.15) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % 2;
    }

    if (this.y > 260) this.isDead = true;
  }

  stomp() {
    this.isSquished = true;
    this.vx = 0;
  }

  draw(ctx, spriteSheet) {
    if (this.isDead) return;
    const spriteName = this.isSquished ? 'goomba_flat' : `goomba_${this.frame}`;
    const spr = spriteSheet.get(spriteName);
    if (spr) ctx.drawImage(spr, Math.floor(this.x), Math.floor(this.y));
  }
}

export class Koopa {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 24; // Standing height
    this.vx = -0.7;
    this.vy = 0;
    this.onGround = false;
    this.isDead = false;

    // Shell states
    this.isShell = false;
    this.isSliding = false;
    this.wakeTimer = 0;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update(delta, level) {
    if (this.isDead) return;

    if (this.isShell && !this.isSliding) {
      // Stationary shell waking up timer
      this.wakeTimer += delta;
      if (this.wakeTimer > 6.0) {
        // Wake up back to walking koopa
        this.isShell = false;
        this.height = 24;
        this.y -= 8;
        this.vx = -0.7;
      }
      return;
    }

    const currentSpeed = this.isSliding ? 6.0 : 0.7;
    const nextX = this.x + (this.vx > 0 ? currentSpeed : -currentSpeed) * 60 * delta;
    const testTileX = this.vx > 0 ? Math.floor((nextX + this.width) / TILE_SIZE) : Math.floor(nextX / TILE_SIZE);
    const tileY = Math.floor((this.y + this.height - 8) / TILE_SIZE);

    if (level.getTile(testTileX, tileY)) {
      this.vx = -this.vx; // Reverse on wall hit
    } else {
      this.x = nextX;
    }

    // Gravity
    this.vy += 22 * delta;
    if (this.vy > 6) this.vy = 6;
    this.y += this.vy;

    // Ground collision
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const leftTileX = Math.floor((this.x + 2) / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width - 2) / TILE_SIZE);

    if (level.getTile(leftTileX, bottomTileY) || level.getTile(rightTileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (!this.isShell) {
      this.frameTimer += delta;
      if (this.frameTimer > 0.15) {
        this.frameTimer = 0;
        this.frame = (this.frame + 1) % 2;
      }
    }

    if (this.y > 260) this.isDead = true;
  }

  stomp() {
    if (!this.isShell) {
      // Retreat into shell
      this.isShell = true;
      this.height = 16;
      this.y += 8;
      this.vx = 0;
      this.isSliding = false;
      this.wakeTimer = 0;
    } else if (!this.isSliding) {
      // Kick shell into slide!
      this.isSliding = true;
      this.vx = 1.0;
    } else {
      // Stop sliding shell
      this.isSliding = false;
      this.vx = 0;
    }
  }

  kick(facingRight) {
    this.isShell = true;
    this.isSliding = true;
    this.vx = facingRight ? 1.0 : -1.0;
  }

  draw(ctx, spriteSheet) {
    if (this.isDead) return;
    const spr = spriteSheet.get(this.isShell ? 'koopa_shell' : `koopa_${this.frame}`);
    if (spr) {
      ctx.save();
      if (this.vx > 0 && !this.isShell) {
        ctx.scale(-1, 1);
        ctx.drawImage(spr, -Math.floor(this.x) - this.width, Math.floor(this.y));
      } else {
        ctx.drawImage(spr, Math.floor(this.x), Math.floor(this.y));
      }
      ctx.restore();
    }
  }
}

export class FastKoopa extends Koopa {
  constructor(x, y) {
    super(x, y);
    this.vx = -2.6; // High speed rush!
  }
}

export class Bowser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.vx = -0.5;
    this.vy = 0;
    this.onGround = false;
    this.isDead = false;
    this.isFallingIntoLava = false;
    this.jumpTimer = 0;
    this.fireTimer = 0;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update(delta, level, fireballs = []) {
    if (this.isFallingIntoLava) {
      this.vy += 25 * delta;
      this.y += this.vy;
      if (this.y > 260) this.isDead = true;
      return;
    }

    // Bowser Roaming on the Bridge
    this.x += this.vx * 30 * delta;
    if (this.x < 127 * TILE_SIZE) this.vx = 0.6;
    if (this.x > 140 * TILE_SIZE) this.vx = -0.6;

    // Jumping
    this.jumpTimer += delta;
    if (this.jumpTimer > 2.5 && this.onGround) {
      this.jumpTimer = 0;
      this.vy = -3.8;
      this.onGround = false;
    }

    // Fire breathing
    this.fireTimer += delta;
    if (this.fireTimer > 3.0) {
      this.fireTimer = 0;
      this.frame = 1; // Open mouth
      // Shoot boss fire projectile
      fireballs.push({
        x: this.x - 8,
        y: this.y + 10,
        width: 16,
        height: 8,
        vx: -3.5,
        vy: 0,
        isBossFire: true,
        done: false,
        update: function(d) {
          this.x += this.vx;
          if (this.x < 0) this.done = true;
        },
        draw: function(ctx, ss) {
          const spr = ss.get('fireball');
          if (spr) {
            ctx.drawImage(spr, this.x, this.y, 16, 8);
          }
        }
      });
    }

    // Gravity
    this.vy += 18 * delta;
    if (this.vy > 6) this.vy = 6;
    this.y += this.vy;

    // Ground collision on bridge
    const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
    const leftTileX = Math.floor(this.x / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width) / TILE_SIZE);

    if (level.getTile(leftTileX, bottomTileY) || level.getTile(rightTileX, bottomTileY)) {
      this.y = bottomTileY * TILE_SIZE - this.height;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    this.frameTimer += delta;
    if (this.frameTimer > 0.2) {
      this.frameTimer = 0;
      this.frame = (this.frame === 0) ? 1 : 0;
    }
  }

  stomp() {
    // Bowser is too tough to be stomped!
  }

  defeat() {
    this.isFallingIntoLava = true;
    this.vy = -2.0;
  }

  draw(ctx, spriteSheet) {
    if (this.isDead) return;
    const spr = spriteSheet.get(`bowser_${this.frame}`);
    if (spr) {
      ctx.drawImage(spr, Math.floor(this.x), Math.floor(this.y));
    }
  }
}

export class CheepCheep {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.width = 16;
    this.height = 16;
    this.vx = -1.2;
    this.vy = -6.0; // leaps upwards
    this.gravity = 0.22;
    this.isDead = false;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update(delta) {
    this.x += this.vx * 60 * delta;
    this.vy += this.gravity;
    this.y += this.vy;

    if (this.y > 260) {
      this.y = this.startY;
      this.vy = -6.5;
    }

    this.frameTimer += delta;
    if (this.frameTimer > 0.12) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % 2;
    }
  }

  stomp() {
    this.isDead = true;
  }

  draw(ctx, spriteSheet) {
    if (this.isDead) return;
    const spr = spriteSheet.get(`cheep_${this.frame}`);
    if (spr) {
      ctx.drawImage(spr, Math.floor(this.x), Math.floor(this.y));
    }
  }
}

export class Blooper {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.pulseTimer = 0;
    this.vx = -0.5;
    this.vy = 0;
    this.isDead = false;
  }

  update(delta) {
    this.pulseTimer += delta;
    if (this.pulseTimer > 1.2) {
      this.pulseTimer = 0;
      this.vy = -2.2;
      this.vx = (Math.random() - 0.7) * 1.5;
    }
    this.vy += 3.5 * delta;
    this.x += this.vx * 30 * delta;
    this.y += this.vy;
    if (this.y < 30) this.y = 30;
    if (this.y > 180) this.y = 180;
  }

  stomp() {
    this.isDead = true;
  }

  draw(ctx, spriteSheet) {
    if (this.isDead) return;
    const spr = spriteSheet.get('blooper_0');
    if (spr) {
      ctx.drawImage(spr, Math.floor(this.x), Math.floor(this.y));
    }
  }
}

