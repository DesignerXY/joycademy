// Mario Player Entity with Authentic NES Physics, Multi-state Transformations, and Interactions
import { TILE_SIZE } from '../world/Level1_1.js';
import { PopCoin, MushroomItem, PoisonMushroomItem, StarItem, BrickShard, ScorePopup, FireballProjectile } from './Items.js';

export class Mario {
  constructor(x, y, audioEngine) {
    this.audio = audioEngine;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.state = 'small'; // 'small', 'super', 'fire'

    this.width = 14;
    this.height = 16; // 16 for small, 32 for super/fire
    this.facingRight = true;
    this.onGround = false;
    this.isJumping = false;
    this.isDucking = false;
    this.isSkidding = false;

    // Run animation
    this.runFrame = 1;
    this.runAnimTimer = 0;

    // Death animation
    this.isDead = false;
    this.deathTimer = 0;

    // Flagpole slide animation
    this.isSlidingFlag = false;
    this.flagpoleDone = false;
    this.walkToCastle = false;

    // Pipe entry animation
    this.isEnteringPipe = false;
    this.pipeWarpReady = false;

    // Invulnerability & Star power
    this.invulnerableTimer = 0;
    this.starmanTimer = 0;
  }

  upgradeToSuper() {
    if (this.state === 'small') {
      this.state = 'super';
      this.height = 32;
      this.y -= 16;
      this.audio.playPowerup();
    }
  }

  upgradeToFire() {
    this.state = 'fire';
    this.height = 32;
    this.audio.playPowerup();
  }

  upgradeToStar() {
    this.starmanTimer = 12.0;
    this.audio.startStarBGM();
  }

  takePoison() {
    if (this.starmanTimer > 0) return; // Star power destroys poison
    if (this.state !== 'small') {
      this.state = 'small';
      this.height = 16;
      this.y += 16;
      this.invulnerableTimer = 2.0;
      this.audio.playPowerdown();
    } else {
      this.die();
    }
  }

  takeDamage() {
    if (this.invulnerableTimer > 0 || this.starmanTimer > 0 || this.isDead) return;

    if (this.state === 'fire') {
      this.state = 'super';
      this.invulnerableTimer = 2.0;
      this.audio.playBump();
    } else if (this.state === 'super') {
      this.state = 'small';
      this.height = 16;
      this.invulnerableTimer = 2.0;
      this.audio.playBump();
    } else {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.vx = 0;
    this.vy = -6.5;
    this.audio.playDie();
  }

  shootFireball(fireballs) {
    if (this.state !== 'fire' || this.isDead) return;
    if (fireballs.length < 2) {
      const fbX = this.facingRight ? this.x + this.width + 2 : this.x - 6;
      const fbY = this.y + 12;
      fireballs.push(new FireballProjectile(fbX, fbY, this.facingRight));
      this.audio.playFireball();
    }
  }

  update(delta, input, level, items, particles, popups, fireballs, camera) {
    // 1. Death Physics
    if (this.isDead) {
      this.deathTimer += delta;
      if (this.deathTimer > 0.4) {
        this.vy += 20 * delta;
        this.y += this.vy;
      }
      return;
    }

    // 2. Invulnerability Timers
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= delta;
    if (this.starmanTimer > 0) this.starmanTimer -= delta;

    // 3. Pipe Entry Animation
    if (this.isEnteringPipe) {
      this.y += delta * 24;
      this.vx = 0;
      this.vy = 0;
      if (this.y > 13 * TILE_SIZE) {
        this.isEnteringPipe = false;
        this.pipeWarpReady = true;
      }
      return;
    }

    // 4. Flagpole Slide & Walk to Castle
    if (this.isSlidingFlag) {
      if (this.y < 11 * TILE_SIZE) {
        this.y += delta * 70;
      } else {
        this.isSlidingFlag = false;
        this.walkToCastle = true;
        this.facingRight = true;
      }
      return;
    }

    if (this.walkToCastle) {
      this.x += delta * 45;
      this.runAnimTimer += delta;
      if (this.runAnimTimer > 0.1) {
        this.runAnimTimer = 0;
        this.runFrame = (this.runFrame % 3) + 1;
      }
      if (this.x >= level.castleDoorX) {
        this.flagpoleDone = true;
      }
      return;
    }

    // 5. Normal Movement & Controls
    const accel = input.keys.run ? 0.18 : 0.12;
    const maxSpeed = input.keys.run ? 2.7 : 1.6;

    if (input.keys.left) {
      if (this.vx > 0.2) {
        // Skidding to left
        this.vx -= 0.25;
        this.isSkidding = true;
      } else {
        this.vx = Math.max(-maxSpeed, this.vx - accel);
        this.facingRight = false;
        this.isSkidding = false;
      }
    } else if (input.keys.right) {
      if (this.vx < -0.2) {
        // Skidding to right
        this.vx += 0.25;
        this.isSkidding = true;
      } else {
        this.vx = Math.min(maxSpeed, this.vx + accel);
        this.facingRight = true;
        this.isSkidding = false;
      }
    } else {
      // Friction decelerate
      if (Math.abs(this.vx) < 0.08) this.vx = 0;
      else this.vx += this.vx > 0 ? -0.1 : 0.1;
      this.isSkidding = false;
    }

    // Crouch (Super / Fire Mario only)
    this.isDucking = input.keys.down && this.state !== 'small';

    // Pipe Warp Check (standing on enterable pipe & pressing down)
    if (input.keys.down && this.onGround) {
      const tileX = Math.floor((this.x + 7) / TILE_SIZE);
      const underY = Math.floor((this.y + this.height + 2) / TILE_SIZE);
      const tile = level.getTile(tileX, underY);
      const data = level.blockData.get(`${tileX},${underY}`);
      if (data && data.enterable) {
        this.isEnteringPipe = true;
        this.audio.playPipe();
        return;
      }
    }

    // Jump with buffer and underwater swim
    if (input.jumpPressed) {
      this.jumpBuffer = 0.16;
    }
    if (this.jumpBuffer > 0) this.jumpBuffer -= delta;

    // Super Mega Jump (按按键 3: 跳得极高极高，轻松飞跃任何管道与障碍)
    if (input.superJumpPressed) {
      this.jumpBuffer = 0;
      this.vy = -9.2; // Soar 170+ px high into the sky!
      this.onGround = false;
      this.isJumping = true;
      if (this.state === 'small') this.audio.playJumpSmall();
      else this.audio.playJumpSuper();
      popups.push(new ScorePopup(this.x, this.y, '🚀SUPER JUMP!'));
    } else if (level && level.isUnderwater) {
      // Underwater swimming physics
      if (this.jumpBuffer > 0) {
        this.jumpBuffer = 0;
        this.vy = -3.0;
        this.audio.playJumpSmall();
      }
      this.vy += 6.0 * delta;
      if (this.vy > 1.8) this.vy = 1.8;
    } else {
      // Normal ground jump
      if (this.jumpBuffer > 0 && this.onGround) {
        this.jumpBuffer = 0;
        this.vy = -5.4;
        this.onGround = false;
        this.isJumping = true;
        if (this.state === 'small') this.audio.playJumpSmall();
        else this.audio.playJumpSuper();
      }

      // Variable jump gravity: fall slower if holding jump or superJump
      const grav = ((input.keys.jump || input.keys.superJump) && this.vy < 0) ? 0.22 : 0.44;
      this.vy += grav;
      if (this.vy > 6.0) this.vy = 6.0;
    }

    // Run animation frames
    if (this.onGround && Math.abs(this.vx) > 0.1) {
      this.runAnimTimer += delta * Math.abs(this.vx) * 8;
      if (this.runAnimTimer > 1.0) {
        this.runAnimTimer = 0;
        this.runFrame = (this.runFrame % 3) + 1;
      }
    } else {
      this.runFrame = 1;
    }

    // Fireball shooting
    if (input.firePressed && this.state === 'fire') {
      this.shootFireball(fireballs);
    }

    // 6. Horizontal Collision
    this.x += this.vx * 60 * delta;

    // Camera Left Edge Barrier (cannot walk left off screen)
    if (this.x < camera.x) {
      this.x = camera.x;
      this.vx = 0;
    }

    this.checkHorizontalBlockCollisions(level);

    // 7. Vertical Collision & Head Bumping
    this.y += this.vy;
    this.checkVerticalBlockCollisions(level, items, particles, popups);

    // 8. Pit Fall Check
    if (this.y > 250) {
      this.die();
    }

    // 9. Flagpole Grab Check
    if (this.x + this.width >= level.flagpoleX && this.x <= level.flagpoleX + 8 && this.y < 12 * TILE_SIZE) {
      this.isSlidingFlag = true;
      this.x = level.flagpoleX - 6;
      this.vx = 0;
      this.vy = 0;
      this.audio.playStageClear();
      popups.push(new ScorePopup(this.x, this.y, '5000'));
    }
  }

  checkHorizontalBlockCollisions(level) {
    const testTileX = this.vx > 0 ? Math.floor((this.x + this.width) / TILE_SIZE) : Math.floor(this.x / TILE_SIZE);
    const topTileY = Math.floor(this.y / TILE_SIZE);
    const bottomTileY = Math.floor((this.y + this.height - 1) / TILE_SIZE);

    for (let ty = topTileY; ty <= bottomTileY; ty++) {
      const tile = level.getTile(testTileX, ty);
      // Starman can phase straight through all green pipes!
      if (this.starmanTimer > 0 && tile && tile.startsWith('pipe')) {
        continue;
      }
      if (tile && tile !== 'flagpole' && tile !== 'flag' && tile !== 'castle_door') {
        if (this.vx > 0) {
          this.x = testTileX * TILE_SIZE - this.width;
        } else {
          this.x = (testTileX + 1) * TILE_SIZE;
        }
        this.vx = 0;
        break;
      }
    }
  }

  checkVerticalBlockCollisions(level, items, particles, popups) {
    const leftTileX = Math.floor((this.x + 2) / TILE_SIZE);
    const rightTileX = Math.floor((this.x + this.width - 2) / TILE_SIZE);

    if (this.vy > 0) {
      // Falling: Check Landing on Floor
      const bottomTileY = Math.floor((this.y + this.height) / TILE_SIZE);
      for (let tx = leftTileX; tx <= rightTileX; tx++) {
        const tile = level.getTile(tx, bottomTileY);
        if (tile === 'lava') {
          this.die();
          return;
        }
        if (tile && tile !== 'flagpole' && tile !== 'flag' && tile !== 'castle_door') {
          this.y = bottomTileY * TILE_SIZE - this.height;
          this.vy = 0;
          this.onGround = true;
          this.isJumping = false;
          return;
        }
      }
      this.onGround = false;
    } else if (this.vy < 0) {
      // Jumping: Check Bumping Blocks from Below
      const topTileY = Math.floor(this.y / TILE_SIZE);
      for (let tx = leftTileX; tx <= rightTileX; tx++) {
        const tile = level.getTile(tx, topTileY);
        if (tile && tile !== 'flagpole' && tile !== 'flag' && tile !== 'castle_door') {
          if (this.starmanTimer > 0 && tile.startsWith('pipe')) continue;
          this.y = (topTileY + 1) * TILE_SIZE;
          this.vy = 0;
          this.bumpBlock(tx, topTileY, level, items, particles, popups);
          return;
        }
      }
    }
  }

  bumpBlock(tx, ty, level, items, particles, popups) {
    const tile = level.getTile(tx, ty);
    const key = `${tx},${ty}`;
    const data = level.blockData.get(key);

    if (tile === 'qblock') {
      // Turn ? block into empty block
      level.setTile(tx, ty, 'empty_block');
      this.audio.playBump();

      const rand = Math.random();
      if (rand < 0.65) {
        // 65% Chance: Super Starman (满分100！无敌星)
        items.push(new StarItem(tx * TILE_SIZE, ty * TILE_SIZE));
        this.audio.playPowerupAppear();
        popups.push(new ScorePopup(tx * TILE_SIZE, (ty - 1) * TILE_SIZE, '★100分STAR!★'));
      } else if (rand < 0.75) {
        // 10% Chance: Poison Mushroom (毒蘑菇)
        items.push(new PoisonMushroomItem(tx * TILE_SIZE, ty * TILE_SIZE));
        this.audio.playPowerupAppear();
        popups.push(new ScorePopup(tx * TILE_SIZE, (ty - 1) * TILE_SIZE, 'POISON!'));
      } else if (rand < 0.90 || (data && data.content === 'mushroom')) {
        // 15% Chance: Super Mushroom / Fire Flower
        const isFire = this.state !== 'small';
        items.push(new MushroomItem(tx * TILE_SIZE, ty * TILE_SIZE, isFire));
        this.audio.playPowerupAppear();
      } else {
        // 10% Chance: Pop Coin
        items.push(new PopCoin(tx * TILE_SIZE, (ty - 1) * TILE_SIZE));
        this.audio.playCoin();
        popups.push(new ScorePopup(tx * TILE_SIZE, (ty - 1) * TILE_SIZE, '200'));
      }
    } else if (tile === 'brick') {
      if (this.state === 'small') {
        this.audio.playBump();
      } else {
        // Super Mario shatters brick!
        level.setTile(tx, ty, null);
        this.audio.playBump();
        const bx = tx * TILE_SIZE;
        const by = ty * TILE_SIZE;
        particles.push(new BrickShard(bx, by, -1.2, -3.5));
        particles.push(new BrickShard(bx + 8, by, 1.2, -3.5));
        particles.push(new BrickShard(bx, by + 8, -1.0, -2.0));
        particles.push(new BrickShard(bx + 8, by + 8, 1.0, -2.0));
        popups.push(new ScorePopup(bx, by, '50'));
      }
    }
  }

  draw(ctx, spriteSheet) {
    // Invulnerability flashing (flicker visibility)
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 20) % 2 === 0) {
      return;
    }

    let spriteName = '';
    const prefix = this.state === 'small' ? 'mario_small' : 'mario_super';

    if (this.isDead) {
      spriteName = 'mario_small_die';
    } else if (!this.onGround) {
      spriteName = `${prefix}_jump`;
    } else if (Math.abs(this.vx) > 0.1) {
      spriteName = `${prefix}_run_${this.runFrame}`;
    } else {
      spriteName = `${prefix}_idle`;
    }

    const spr = spriteSheet.get(spriteName);
    if (spr) {
      ctx.save();
      // Starman rainbow color effect
      if (this.starmanTimer > 0) {
        ctx.filter = `hue-rotate(${Math.floor(Date.now() / 2) % 360}deg)`;
      }

      if (!this.facingRight) {
        ctx.scale(-1, 1);
        ctx.drawImage(spr, -Math.floor(this.x) - 16, Math.floor(this.y));
      } else {
        ctx.drawImage(spr, Math.floor(this.x), Math.floor(this.y));
      }
      ctx.restore();
    }
  }
}
