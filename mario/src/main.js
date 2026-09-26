// Super Mario Bros. Main Engine & State Orchestrator
import { SpriteSheet } from './gfx/SpriteSheet.js';
import { MarioAudio } from './engine/Audio.js';
import { InputManager } from './engine/Input.js';
import { Camera } from './engine/Camera.js';
import { Level1_1, TILE_SIZE } from './world/Level1_1.js';
import { UndergroundLevel } from './world/Underground.js';
import { WorldMinus1 } from './world/WorldMinus1.js';
import { WorldMinus2 } from './world/WorldMinus2.js';
import { Castle1_4 } from './world/Castle1_4.js';
import { WorldChampion } from './world/WorldChampion.js';
import { Mario } from './entities/Mario.js';
import { Goomba, Koopa, FastKoopa, Bowser, CheepCheep, Blooper } from './entities/Enemies.js';
import { PopCoin, ScorePopup, MushroomItem, PoisonMushroomItem, StarItem } from './entities/Items.js';

class MarioGame {
  constructor() {
    this.canvas = document.getElementById('mario-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // NES Resolution
    this.canvas.width = 256;
    this.canvas.height = 240;

    // Core Modules
    this.sprites = new SpriteSheet();
    this.audio = new MarioAudio();
    this.input = new InputManager();
    this.camera = new Camera(256, 240);

    // Game State
    this.state = 'TITLE'; // 'TITLE', 'PLAYING', 'UNDERGROUND', 'CLEAR', 'GAMEOVER'
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.time = 400;
    this.timeTimer = 0;
    this.qblockAnimTimer = 0;
    this.qblockFrame = 0;
    this.currentWorldName = '1-1';
    this.isHardcore = false;

    // Levels & Entities
    this.level = new Level1_1();
    this.underground = new UndergroundLevel();
    this.currentLevel = this.level;
    this.mario = new Mario(40, 192, this.audio);

    this.enemies = [];
    this.items = [];
    this.particles = [];
    this.popups = [];
    this.fireballs = [];

    this.initEnemies();
    this.initDOM();
    this.bindTouchControls();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  initEnemies() {
    this.enemies = [];
    const speedMult = this.isHardcore ? 1.9 : 1.0;
    for (const sp of this.currentLevel.enemySpawns) {
      let en = null;
      if (sp.type === 'goomba') en = new Goomba(sp.x, sp.y);
      else if (sp.type === 'koopa') en = new Koopa(sp.x, sp.y);
      else if (sp.type === 'fast_koopa') en = new FastKoopa(sp.x, sp.y);
      else if (sp.type === 'bowser') en = new Bowser(sp.x, sp.y);
      else if (sp.type === 'cheep') en = new CheepCheep(sp.x, sp.y);
      else if (sp.type === 'blooper') en = new Blooper(sp.x, sp.y);

      if (en) {
        en.vx *= speedMult;
        this.enemies.push(en);
      }
    }
  }

  initDOM() {
    const btnStart = document.getElementById('btn-start-game');
    const startOverlay = document.getElementById('start-overlay');
    const btnMute = document.getElementById('btn-sound-toggle');
    const btnReset = document.getElementById('btn-restart-game');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.audio.init();
        this.audio.startOverworldBGM();
        this.state = 'PLAYING';
        if (startOverlay) startOverlay.classList.add('hidden');
      });
    }

    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        btnMute.innerText = isMuted ? '🔇 静音' : '🔊 声音';
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.resetGame();
      });
    }

    const btnSuperJump = document.getElementById('btn-super-jump');
    if (btnSuperJump) {
      btnSuperJump.addEventListener('click', () => {
        this.input.superJumpPressed = true;
      });
    }

    const btnNext = document.getElementById('btn-next-level');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.advanceStage();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyN') {
        this.advanceStage();
      }
    });
  }

  bindTouchControls() {
    this.input.bindTouchButton('btn-touch-left', 'left');
    this.input.bindTouchButton('btn-touch-right', 'right');
    this.input.bindTouchButton('btn-touch-down', 'down');
    this.input.bindTouchButton('btn-touch-jump', 'jump');
    this.input.bindTouchButton('btn-touch-fire', 'run');
    this.input.bindTouchButton('btn-touch-superjump', 'superJump');
  }

  resetGame() {
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.time = 400;
    this.respawnMario();
    this.level = new Level1_1();
    this.currentLevel = this.level;
    this.initEnemies();
    this.camera.reset();
    this.state = 'PLAYING';
    this.audio.startOverworldBGM();
  }

  respawnMario() {
    this.mario = new Mario(40, 192, this.audio);
    this.items = [];
    this.fireballs = [];
    this.particles = [];
  }

  warpToUnderground() {
    this.state = 'UNDERGROUND';
    this.currentLevel = this.underground;
    this.mario.x = 40;
    this.mario.y = 40;
    this.mario.vx = 0;
    this.mario.vy = 0;
    this.camera.x = 0;
  }

  warpFromUnderground() {
    this.state = 'PLAYING';
    this.currentLevel = this.level;
    this.mario.x = 163 * TILE_SIZE + 4;
    this.mario.y = 10 * TILE_SIZE;
    this.mario.vx = 0;
    this.mario.vy = -3.5;
    this.camera.x = this.mario.x - 60;
    this.audio.playPipe();
  }

  loop(currentTime) {
    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    this.update(delta);
    this.render();

    this.input.update();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(delta) {
    // ? Block animation frames
    this.qblockAnimTimer += delta;
    if (this.qblockAnimTimer > 0.15) {
      this.qblockAnimTimer = 0;
      this.qblockFrame = (this.qblockFrame + 1) % 4;
    }

    if (this.state === 'PLAYING' || this.state === 'UNDERGROUND') {
      // Game Timer Countdown
      this.timeTimer += delta;
      if (this.timeTimer >= 1.0) {
        this.timeTimer = 0;
        this.time = Math.max(0, this.time - 1);
        if (this.time <= 0 && !this.mario.isDead) {
          this.mario.die();
        }
      }

      // 1. Update Mario
      this.mario.update(delta, this.input, this.currentLevel, this.items, this.particles, this.popups, this.fireballs, this.camera);

      // Check Pipe Warp
      if (this.mario.pipeWarpReady) {
        this.mario.pipeWarpReady = false;
        if (this.state === 'PLAYING') {
          this.warpToUnderground();
        }
      }

      // Check Underground Exit Pipe
      if (this.state === 'UNDERGROUND' && this.mario.x >= this.underground.exitPipeX) {
        this.warpFromUnderground();
      }

      // Check Underground Floating Coins
      if (this.state === 'UNDERGROUND') {
        for (const c of this.underground.coins) {
          if (!c.collected) {
            const dx = Math.abs((this.mario.x + 7) - (c.x + 8));
            const dy = Math.abs((this.mario.y + 10) - (c.y + 8));
            if (dx < 12 && dy < 14) {
              c.collected = true;
              this.coins++;
              this.score += 200;
              this.audio.playCoin();
              this.popups.push(new ScorePopup(c.x, c.y, '200'));
            }
          }
        }
      }

      // Check Flagpole Stage Clear
      if (this.mario.flagpoleDone) {
        this.mario.flagpoleDone = false;
        this.state = 'CLEAR';
        setTimeout(() => {
          this.advanceStage();
        }, 1500);
      }

      // Check Castle Bowser & Axe trigger
      if (this.currentLevel.isCastle && !this.currentLevel.bridgeCollapsed) {
        if (this.mario.x >= this.currentLevel.axeX - 6) {
          this.currentLevel.collapseBridge();
          this.audio.playBump();
          for (const en of this.enemies) {
            if (en instanceof Bowser) en.defeat();
          }
          this.popups.push(new ScorePopup(this.mario.x, this.mario.y, 'AXE!'));
          setTimeout(() => {
            if (this.currentWorldName === '1-4') {
              this.advanceStage();
            } else {
              this.showClearScreen();
            }
          }, 2500);
        }
      }

      // Check Mario Dead Restart
      if (this.mario.isDead && this.mario.y > 280) {
        this.lives--;
        if (this.lives > 0) {
          this.respawnMario();
          this.camera.reset();
        } else {
          this.state = 'GAMEOVER';
        }
      }

      // 2. Update Camera (in overworld)
      if (this.state === 'PLAYING') {
        this.camera.update(this.mario.x);
      }

      // 3. Update Enemies
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const en = this.enemies[i];
        // Only update active enemies near camera view
        if (en.x < this.camera.x + 300 && en.x > this.camera.x - 50) {
          en.update(delta, this.currentLevel);
        }

        if (en.isDead) {
          this.enemies.splice(i, 1);
          continue;
        }

        // Mario & Enemy Collision
        if (!this.mario.isDead && !en.isSquished) {
          const mx = this.mario.x + 2;
          const my = this.mario.y;
          const mw = this.mario.width - 4;
          const mh = this.mario.height;

          const ex = en.x;
          const ey = en.y;
          const ew = en.width;
          const eh = en.height;

          // AABB overlap test
          if (mx < ex + ew && mx + mw > ex && my < ey + eh && my + mh > ey) {
            // Stomp from above?
            const isStomp = this.mario.vy > 0 && (my + mh - this.mario.vy <= ey + 10);

            if (this.mario.starmanTimer > 0) {
              // Starman kills instantly
              en.isDead = true;
              this.audio.playStomp();
              this.score += 200;
              this.popups.push(new ScorePopup(en.x, en.y, '200'));
            } else if (isStomp) {
              en.stomp();
              this.mario.vy = -4.0; // Stomp bounce
              this.audio.playStomp();
              this.score += 100;
              this.popups.push(new ScorePopup(en.x, en.y, '100'));
            } else if (en.isShell && !en.isSliding) {
              // Kick shell!
              en.kick(this.mario.facingRight);
              this.audio.playStomp();
            } else {
              // Hurt Mario!
              this.mario.takeDamage();
            }
          }
        }
      }

      // 4. Update Items (Mushrooms, Coins)
      for (let i = this.items.length - 1; i >= 0; i--) {
        const it = this.items[i];
        it.update(delta, this.currentLevel);

        if (!it.done) {
          const dx = Math.abs((this.mario.x + 7) - (it.x + 8));
          const dy = Math.abs((this.mario.y + this.mario.height / 2) - (it.y + 8));
          if (dx < 14 && dy < 16) {
            if (it instanceof StarItem) {
              it.done = true;
              this.score += 1000;
              this.popups.push(new ScorePopup(it.x, it.y, '★STAR!★'));
              this.mario.upgradeToStar();
            } else if (it instanceof PoisonMushroomItem) {
              it.done = true;
              this.popups.push(new ScorePopup(it.x, it.y, 'POISON!'));
              this.mario.takePoison();
            } else if (it instanceof MushroomItem) {
              it.done = true;
              this.score += 1000;
              this.popups.push(new ScorePopup(it.x, it.y, '1000'));
              if (it.isFireFlower) this.mario.upgradeToFire();
              else this.mario.upgradeToSuper();
            }
          }
        }

        if (it.done) this.items.splice(i, 1);
      }

      // 5. Update Fireballs
      for (let i = this.fireballs.length - 1; i >= 0; i--) {
        const fb = this.fireballs[i];
        fb.update(delta, this.currentLevel);

        // Collision against enemies
        for (const en of this.enemies) {
          if (!en.isDead && !en.isSquished) {
            const fbx = fb.x; const fby = fb.y;
            if (fbx < en.x + en.width && fbx + fb.width > en.x && fby < en.y + en.height && fby + fb.height > en.y) {
              fb.done = true;
              en.isDead = true;
              this.audio.playStomp();
              this.score += 200;
              this.popups.push(new ScorePopup(en.x, en.y, '200'));
              break;
            }
          }
        }

        if (fb.done) this.fireballs.splice(i, 1);
      }

      // 6. Update Particles & Popups
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update(delta);
        if (this.particles[i].done) this.particles.splice(i, 1);
      }
      for (let i = this.popups.length - 1; i >= 0; i--) {
        this.popups[i].update(delta);
        if (this.popups[i].life <= 0) this.popups.splice(i, 1);
      }
    }
  }

  advanceStage() {
    if (this.currentWorldName === '1-1') {
      this.loadLevel('MINUS1');
    } else if (this.currentWorldName === '-1') {
      this.loadLevel('MINUS2');
    } else if (this.currentWorldName === '-2') {
      this.loadLevel('CASTLE');
    } else if (this.currentWorldName === '1-4') {
      this.loadLevel('CHAMPION');
    } else {
      this.showClearScreen();
    }
  }

  loadLevel(type) {
    if (type === 'MINUS1') {
      this.currentLevel = new WorldMinus1();
      this.currentWorldName = '-1';
    } else if (type === 'MINUS2') {
      this.currentLevel = new WorldMinus2();
      this.currentWorldName = '-2';
    } else if (type === 'CASTLE') {
      this.currentLevel = new Castle1_4();
      this.currentWorldName = '1-4';
    } else if (type === 'CHAMPION') {
      this.currentLevel = new WorldChampion();
      this.currentWorldName = 'S';
    } else {
      this.currentLevel = new Level1_1();
      this.currentWorldName = '1-1';
    }
    this.mario.x = 40;
    this.mario.y = this.currentLevel.isUnderwater ? 80 : 192;
    this.mario.vx = 0;
    this.mario.vy = 0;
    this.mario.isSlidingFlag = false;
    this.mario.walkToCastle = false;
    this.mario.flagpoleDone = false;
    this.camera.reset();
    this.initEnemies();
    this.items = [];
    this.fireballs = [];
    this.particles = [];
    this.time = 400;
    this.timeTimer = 0;
    this.state = 'PLAYING';
    this.audio.startOverworldBGM();
  }

  showClearScreen() {
    const overlay = document.getElementById('clear-overlay');
    if (overlay) overlay.classList.remove('hidden');
    const finalScore = document.getElementById('final-score');
    if (finalScore) {
      finalScore.innerHTML = `
        <div style="color: #fcbc00; font-size: 14px; margin-bottom: 6px; font-weight: bold;">THANK YOU MARIO!</div>
        <div style="color: #ffffff; font-size: 11px; margin-bottom: 10px;">★ ALL WORLDS & EXPANDED WORLD S CLEARED! ★</div>
        <div style="color: #4ade80; font-size: 13px; margin-bottom: 8px;">🏆 恭喜征服超难扩大关卡 (World S 4480px 巨型熔岩双库巴关)！</div>
        <div style="color: #f87171; font-size: 11px; line-height: 1.4;">最终总得分: ${this.score + this.time * 50}<br>无敌星穿管大师成就已达成！现已开启【狂暴极限模式 (HARDCORE)】！</div>
      `;
    }
    this.isHardcore = true;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Dynamic Environment Background
    if (this.currentLevel.isUnderwater) {
      ctx.fillStyle = '#1830a8';
    } else if (this.currentLevel.isCastle || this.state === 'UNDERGROUND') {
      ctx.fillStyle = '#000000';
    } else if (this.currentLevel.isBridge) {
      ctx.fillStyle = '#3868c8';
    } else {
      ctx.fillStyle = '#5c94fc';
    }
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply Camera Translation
    ctx.save();
    ctx.translate(-Math.floor(this.camera.x), 0);

    // 2. Scenery
    if (!this.currentLevel.isUnderwater && !this.currentLevel.isCastle && this.state !== 'UNDERGROUND') {
      this.drawScenery(ctx);
    } else if (this.currentLevel.isUnderwater) {
      // Gentle bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const t = performance.now() / 1000;
      for (let bx = 0; bx < 2000; bx += 80) {
        const by = (Math.sin(t + bx) * 20 + (240 - ((t * 40 + bx * 2) % 240)));
        ctx.fillRect(bx, by, 3, 3);
      }
    }

    // 3. Level Tiles
    this.drawTiles(ctx);

    // 4. Toad NPC in Castle
    if (this.currentLevel.isCastle) {
      const toadSpr = this.sprites.get('toad');
      if (toadSpr) {
        ctx.drawImage(toadSpr, this.currentLevel.toadX, 11 * TILE_SIZE);
      }
    }

    // 5. Underground Coins
    if (this.state === 'UNDERGROUND') {
      const spr = this.sprites.get(`coin_${this.qblockFrame}`);
      for (const c of this.underground.coins) {
        if (!c.collected && spr) {
          ctx.drawImage(spr, c.x, c.y);
        }
      }
    }

    // 6. Items & Projectiles
    for (const it of this.items) it.draw(ctx, this.sprites);
    for (const fb of this.fireballs) fb.draw(ctx, this.sprites);
    for (const p of this.particles) p.draw(ctx);

    // 7. Enemies
    for (const en of this.enemies) en.draw(ctx, this.sprites);

    // 8. Mario
    this.mario.draw(ctx, this.sprites);

    // 9. Popups
    for (const pop of this.popups) pop.draw(ctx);

    ctx.restore();

    // 10. Retro NES HUD at top
    this.drawHUD(ctx);
  }

  drawScenery(ctx) {
    for (let x = 0; x < 3400; x += 320) {
      ctx.fillStyle = '#00a800';
      ctx.beginPath();
      ctx.moveTo(x + 20, 208);
      ctx.lineTo(x + 60, 160);
      ctx.lineTo(x + 100, 208);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 120, 50, 48, 16);
      ctx.fillRect(x + 130, 42, 28, 24);

      ctx.fillStyle = '#80d010';
      ctx.fillRect(x + 180, 192, 36, 16);
    }
  }

  drawTiles(ctx) {
    const level = this.currentLevel;
    const startTileX = Math.floor(this.camera.x / TILE_SIZE);
    const endTileX = startTileX + 18;

    for (let ty = 0; ty < level.height; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const tile = level.getTile(tx, ty);
        if (!tile) continue;

        let sprName = tile;
        if (tile === 'qblock') sprName = `qblock_${this.qblockFrame}`;
        else if (tile === 'pipe_enter_l') sprName = 'pipe_tl';
        else if (tile === 'pipe_enter_r') sprName = 'pipe_tr';
        else if (tile === 'axe') sprName = 'axe';

        if (tile === 'bridge_tile') {
          ctx.fillStyle = '#b84418';
          ctx.fillRect(tx * TILE_SIZE, ty * TILE_SIZE, 16, 4);
          ctx.fillStyle = '#fc9838';
          ctx.fillRect(tx * TILE_SIZE, ty * TILE_SIZE + 4, 16, 4);
          continue;
        } else if (tile === 'lava') {
          ctx.fillStyle = '#d82800';
          ctx.fillRect(tx * TILE_SIZE, ty * TILE_SIZE, 16, 16);
          ctx.fillStyle = '#fcbc00';
          ctx.fillRect(tx * TILE_SIZE + (Math.floor(performance.now() / 150) % 8), ty * TILE_SIZE, 6, 4);
          continue;
        }

        const spr = this.sprites.get(sprName);
        if (spr) {
          ctx.drawImage(spr, tx * TILE_SIZE, ty * TILE_SIZE);
        } else if (tile === 'castle_door') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(tx * TILE_SIZE, ty * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  drawHUD(ctx) {
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';

    // MARIO & Score
    ctx.fillText('MARIO', 16, 16);
    ctx.fillText(String(this.score).padStart(6, '0'), 16, 26);

    // Coins
    const coinSpr = this.sprites.get(`coin_${this.qblockFrame}`);
    if (coinSpr) ctx.drawImage(coinSpr, 88, 18, 8, 8);
    ctx.fillText(`x${String(this.coins).padStart(2, '0')}`, 98, 26);

    // WORLD
    ctx.fillText('WORLD', 144, 16);
    ctx.fillText(this.state === 'UNDERGROUND' ? '1-1 B' : this.currentWorldName, 150, 26);
    if (this.isHardcore) {
      ctx.fillStyle = '#ff4444';
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.fillText('★HARD★', 142, 34);
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = '#ffffff';
    }

    // TIME
    ctx.fillText('TIME', 208, 16);
    ctx.fillText(String(this.time).padStart(3, '0'), 216, 26);

    // Game Over Overlay
    if (this.state === 'GAMEOVER') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('GAME OVER', 88, 110);
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.fillText('点击重置再来一局', 68, 135);
    }
  }
}

// Bootstrap Mario Game
window.addEventListener('DOMContentLoaded', () => {
  new MarioGame();
});
