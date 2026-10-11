// Fish Aquarium & Adventure - Main Application Orchestrator

import confetti from 'canvas-confetti';
import { AquariumEngine, SPECIES_CATALOG } from './aquarium.js';
import { JellyfishKitchen, RECIPES } from './kitchen.js';
import { FishTV, TV_CHANNELS } from './tv.js';
import { MischiefGame } from './mischief.js';
import { PerlerBeadsStudio } from './beads.js';
import { fishSound } from './sound.js';

class FishApp {
  constructor() {
    this.currentMode = 'aquarium'; // 'aquarium' | 'kitchen' | 'tv' | 'mischief' | 'beads'

    this.aquarium = null;
    this.kitchen = null;
    this.tv = null;
    this.mischief = null;
    this.beads = null;

    this.init();
  }

  init() {
    this.initAquarium();
    this.initKitchen();
    this.initTV();
    this.initMischief();
    this.initBeads();
    this.bindGlobalEvents();
    this.renderSpeciesSidebar();
    this.updateHUD();

    // 定期刷新 HUD
    setInterval(() => {
      this.updateHUD();
    }, 1000);
  }

  initAquarium() {
    const canvas = document.getElementById('aquarium-canvas');
    if (canvas) {
      this.aquarium = new AquariumEngine(canvas);
      window.addEventListener('resize', () => {
        if (this.aquarium) this.aquarium.resize();
        if (this.tv) this.tv.resize();
      });
    }

    // 投喂按钮事件
    const feedPellet = document.getElementById('btn-feed-pellet');
    const feedPudding = document.getElementById('btn-feed-pudding');
    const feedBoba = document.getElementById('btn-feed-boba');

    if (feedPellet) feedPellet.addEventListener('click', () => {
      this.aquarium.dropFood('pellet');
    });
    if (feedPudding) feedPudding.addEventListener('click', () => {
      if (this.kitchen.inventory.gel >= 1) {
        this.kitchen.inventory.gel--;
        this.aquarium.dropFood('pudding');
        this.renderKitchen();
      } else {
        alert('发光水母胶质不足啦，快去水母工坊采集食材吧！');
      }
    });
    if (feedBoba) feedBoba.addEventListener('click', () => {
      this.aquarium.dropFood('boba');
    });
  }

  initKitchen() {
    this.kitchen = new JellyfishKitchen((recipe) => {
      // 烹饪出锅后，自动往水族箱投喂该美食！
      this.aquarium.dropFood(recipe.id);
      this.updateHUD();
      this.renderKitchen();
      alert(`🎉 ${recipe.name} 烹饪出锅！已送入水族箱投喂给兰寿与小鱼们！`);
    });

    this.renderKitchen();

    const gatherBtn = document.getElementById('btn-gather-ingredients');
    if (gatherBtn) {
      gatherBtn.addEventListener('click', () => {
        this.kitchen.gatherIngredients();
        this.renderKitchen();
        confetti({ particleCount: 30, spread: 50 });
      });
    }
  }

  renderKitchen() {
    // 渲染食材背包
    const invGrid = document.getElementById('kitchen-inv-grid');
    if (invGrid) {
      const inv = this.kitchen.inventory;
      invGrid.innerHTML = `
        <div class="inv-pill"><span>🪼</span><div class="count">${inv.gel}</div><small>水母胶质</small></div>
        <div class="inv-pill"><span>🌿</span><div class="count">${inv.kelp}</div><small>深海海苔</small></div>
        <div class="inv-pill"><span>🦐</span><div class="count">${inv.shrimp}</div><small>七彩小虾</small></div>
        <div class="inv-pill"><span>🪸</span><div class="count">${inv.nectar}</div><small>珊瑚蜜糖</small></div>
        <div class="inv-pill"><span>🦪</span><div class="count">${inv.pearl}</div><small>珍珠亮粉</small></div>
      `;
    }

    // 渲染菜谱列表
    const recipesList = document.getElementById('kitchen-recipes-list');
    if (recipesList) {
      recipesList.innerHTML = RECIPES.map(r => {
        const canCook = this.kitchen.canCook(r);
        return `
          <div class="recipe-row-card ${canCook ? '' : 'disabled'}" data-recipe-id="${r.id}">
            <div style="font-size: 32px;">${r.icon}</div>
            <div class="recipe-info" style="flex:1;">
              <h5>${r.name}</h5>
              <p>${r.desc}</p>
              <span style="font-size: 11px; color: #fde047;">✨ ${r.effect}</span>
            </div>
            <button class="btn-cook-action" data-recipe-id="${r.id}" ${canCook ? '' : 'disabled'}>
              ${canCook ? '👩‍🍳 烹饪并投喂' : '材料不足'}
            </button>
          </div>
        `;
      }).join('');

      recipesList.querySelectorAll('.btn-cook-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const rId = btn.dataset.recipeId;
          const recipe = RECIPES.find(r => r.id === rId);
          if (recipe) {
            this.kitchen.cook(recipe);
          }
        });
      });
    }
  }

  initTV() {
    const tvCanvas = document.getElementById('fish-tv-canvas');
    const tvSubtitles = document.getElementById('fish-tv-subtitles');
    if (tvCanvas) {
      this.tv = new FishTV(tvCanvas, tvSubtitles, (mode) => {
        this.switchMode(mode);
      });
    }

    // 渲染频道列表
    const chList = document.getElementById('tv-channels-list');
    if (chList) {
      chList.innerHTML = TV_CHANNELS.map((ch, idx) => `
        <div class="channel-card-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
          <div class="channel-badge">${ch.badge}</div>
          <div class="channel-title">${ch.title}</div>
        </div>
      `).join('');

      chList.addEventListener('click', (e) => {
        const item = e.target.closest('.channel-card-item');
        if (item) {
          const idx = parseInt(item.dataset.idx, 10);
          chList.querySelectorAll('.channel-card-item').forEach(c => c.classList.remove('active'));
          item.classList.add('active');
          if (this.tv) this.tv.playChannel(idx);
        }
      });
    }

    // 电视控制按钮
    const btnPrev = document.getElementById('btn-tv-prev');
    const btnPlay = document.getElementById('btn-tv-play');
    const btnNext = document.getElementById('btn-tv-next');

    if (btnPrev) btnPrev.addEventListener('click', () => {
      if (this.tv) {
        this.tv.prev();
        this.syncTvChannelHighlight();
      }
    });
    if (btnNext) btnNext.addEventListener('click', () => {
      if (this.tv) {
        this.tv.next();
        this.syncTvChannelHighlight();
      }
    });
    if (btnPlay) btnPlay.addEventListener('click', () => {
      if (this.tv) {
        const isPlay = this.tv.togglePlay();
        btnPlay.textContent = isPlay ? '⏸️ 暂停动画' : '▶️ 播放动画';
      }
    });
  }

  syncTvChannelHighlight() {
    if (!this.tv) return;
    const curIdx = this.tv.currentChannelIndex;
    const items = document.querySelectorAll('.channel-card-item');
    items.forEach((it, idx) => {
      it.classList.toggle('active', idx === curIdx);
    });
  }

  initMischief() {
    const arena = document.getElementById('mischief-game-container');
    if (arena) {
      this.mischief = new MischiefGame(arena, (score) => {
        // 游戏奖励食材
        this.kitchen.inventory.gel += 3;
        this.kitchen.inventory.pearl += 2;
        this.renderKitchen();
        this.updateHUD();
      });
    }
  }

  initBeads() {
    const beadsBox = document.getElementById('beads-studio-container');
    if (beadsBox) {
      this.beads = new PerlerBeadsStudio(beadsBox);
    }
  }

  bindGlobalEvents() {
    // 1. 声音静音开关
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = fishSound.toggleMute();
        soundBtn.textContent = isMuted ? '🔇 声音: 静音' : '🔊 声音: 开启';
      });
    }

    // 2. 模式导航切换
    document.querySelectorAll('.mode-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // 切换视口区域显隐
    const secAquarium = document.getElementById('sec-aquarium');
    const secKitchen = document.getElementById('sec-kitchen');
    const secTv = document.getElementById('sec-tv');
    const secMischief = document.getElementById('sec-mischief');
    const secBeads = document.getElementById('sec-beads');

    if (secAquarium) secAquarium.style.display = mode === 'aquarium' ? 'grid' : 'none';
    if (secKitchen) secKitchen.style.display = mode === 'kitchen' ? 'grid' : 'none';
    if (secTv) secTv.style.display = mode === 'tv' ? 'block' : 'none';
    if (secMischief) secMischief.style.display = mode === 'mischief' ? 'block' : 'none';
    if (secBeads) secBeads.style.display = mode === 'beads' ? 'block' : 'none';

    fishSound.playBubble();

    if (mode === 'aquarium' && this.aquarium) {
      setTimeout(() => this.aquarium.resize(), 50);
    } else if (mode === 'tv' && this.tv) {
      setTimeout(() => this.tv.resize(), 50);
    }
  }

  renderSpeciesSidebar() {
    const list = document.getElementById('species-select-list');
    if (!list) return;

    list.innerHTML = SPECIES_CATALOG.map(s => {
      const isSel = s.id === this.aquarium.playerSpeciesId;
      return `
        <div class="species-card-btn ${isSel ? 'active' : ''}" data-species-id="${s.id}">
          <div class="species-card-icon">${s.symbol}</div>
          <div class="species-card-info">
            <h5>${s.name}</h5>
            <p>${s.title}</p>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.species-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.dataset.speciesId;
        list.querySelectorAll('.species-card-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.aquarium.switchSpecies(sId);
        this.updateHUD();
      });
    });
  }

  updateHUD() {
    if (!this.aquarium) return;
    const stats = this.aquarium.petStats;

    const fillHunger = document.getElementById('hud-fill-hunger');
    const valHunger = document.getElementById('hud-val-hunger');
    const fillHappy = document.getElementById('hud-fill-happy');
    const valHappy = document.getElementById('hud-val-happy');
    const valLevel = document.getElementById('hud-val-level');
    const valAffection = document.getElementById('hud-val-affection');

    if (fillHunger) fillHunger.style.width = `${Math.min(100, Math.max(0, stats.hunger))}%`;
    if (valHunger) valHunger.textContent = `${Math.floor(stats.hunger)}%`;

    if (fillHappy) fillHappy.style.width = `${Math.min(100, Math.max(0, stats.happiness))}%`;
    if (valHappy) valHappy.textContent = `${Math.floor(stats.happiness)}%`;

    if (valLevel) valLevel.textContent = `Lv.${stats.level}`;
    if (valAffection) valAffection.textContent = `${stats.affection} 颗`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new FishApp();
});
