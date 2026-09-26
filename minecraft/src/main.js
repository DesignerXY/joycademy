import * as THREE from 'three';
import { BlockMaterialManager, BLOCKS, BLOCK_DEFS } from './game/Blocks.js';
import { World } from './game/World.js';
import { PlayerController } from './game/PlayerController.js';
import { DayNightCycle } from './game/DayNightCycle.js';
import { AudioEngine } from './game/AudioEngine.js';
import { InventorySystem } from './game/InventorySystem.js';
import { SaveSystem } from './game/SaveSystem.js';
import { VillagerManager } from './game/Villager.js';

class MinecraftApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) return;
    this.seed = 'minecraft123';

    // 1. Initialize Three.js Scene & Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add Fog
    this.scene.fog = new THREE.FogExp2(0xa0c0ff, 0.015);

    // 2. Initialize Game Engine Systems
    this.materialManager = new BlockMaterialManager();
    this.world = new World(this.scene, this.materialManager, this.seed);
    this.audioEngine = new AudioEngine();
    this.player = new PlayerController(this.camera, this.canvas, this.world, this.audioEngine);
    this.dayNight = new DayNightCycle(this.scene);
    this.inventory = new InventorySystem(this.materialManager, this.audioEngine);
    this.villagers = new VillagerManager(this.world, this.audioEngine);

    // 3. First-Person Hand & Held Item Model
    this.handGroup = new THREE.Group();
    this.camera.add(this.handGroup);
    this.scene.add(this.camera);
    this.swingProgress = 0;
    this.initHandModel();

    // 4. Particle Effects & Active Entities (TNT, breaking particles)
    this.particles = [];
    this.activeEntities = [];

    // Stats & Loops
    this.clock = new THREE.Clock();
    this.fpsCount = 0;
    this.fpsTimer = 0;
    this.survivalTimer = 0;
    this.isPaused = true;
    this.isInventoryOpen = false;

    this.mousePos = { x: 0, y: 0 };

    this.initDOM();
    this.initEventListeners();
    this.loadSavedState();

    // Spawn player on ground level
    const surfaceY = this.world.generator.getHeight(0, 0);
    this.player.position.set(0.5, surfaceY + 2, 0.5);

    // Initial render
    this.updateHUD();
    this.updateHandModel();
    this.animate();
  }

  initHandModel() {
    // Hand base position (bottom right in front of camera)
    this.handGroup.position.set(0.38, -0.32, -0.55);
    this.handGroup.rotation.set(0.2, -0.3, 0.1);

    // Block holder mesh (for 3D voxel blocks)
    const geom = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const materials = this.materialManager.getMaterials(BLOCKS.GRASS);
    this.heldBlockMesh = new THREE.Mesh(geom, materials);
    this.handGroup.add(this.heldBlockMesh);

    // Item holder mesh (for flat items like Diamond Sword, Stick, Diamond)
    const itemGeom = new THREE.PlaneGeometry(0.42, 0.42);
    const dummyMat = new THREE.MeshStandardMaterial({ transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
    this.heldItemMesh = new THREE.Mesh(itemGeom, dummyMat);
    this.heldItemMesh.visible = false;
    this.handGroup.add(this.heldItemMesh);
  }

  updateHandModel() {
    const activeBlockId = this.inventory.getActiveBlockId();
    if (activeBlockId === BLOCKS.AIR) {
      this.heldBlockMesh.visible = false;
      this.heldItemMesh.visible = false;
    } else if (BLOCK_DEFS[activeBlockId]?.isItem) {
      this.heldBlockMesh.visible = false;
      this.heldItemMesh.visible = true;
      const mat = this.materialManager.getMaterials(activeBlockId)[0];
      this.heldItemMesh.material = mat;

      if (activeBlockId === BLOCKS.DIAMOND_SWORD) {
        this.heldItemMesh.scale.set(1.35, 1.35, 1.35);
        this.heldItemMesh.rotation.set(0.1, 0.35, -0.45);
        this.heldItemMesh.position.set(0.04, 0.08, -0.05);
      } else {
        this.heldItemMesh.scale.set(0.9, 0.9, 0.9);
        this.heldItemMesh.rotation.set(0, 0, 0);
        this.heldItemMesh.position.set(0, 0, 0);
      }
    } else {
      this.heldItemMesh.visible = false;
      this.heldBlockMesh.visible = true;
      const mats = this.materialManager.getMaterials(activeBlockId);
      this.heldBlockMesh.material = mats;
    }
  }

  swingHand() {
    this.swingProgress = 1.0;
  }

  initDOM() {
    this.dom = {
      startOverlay: document.getElementById('start-overlay'),
      pauseMenu: document.getElementById('pause-menu'),
      inventoryWindow: document.getElementById('inventory-window'),
      btnStart: document.getElementById('btn-start-game'),
      btnResume: document.getElementById('btn-resume'),
      btnMode: document.getElementById('btn-toggle-gamemode'),
      btnTime: document.getElementById('btn-toggle-time'),
      btnWeather: document.getElementById('btn-toggle-weather'),
      btnSave: document.getElementById('btn-save-world'),
      btnReset: document.getElementById('btn-reset-world'),
      btnCloseInv: document.getElementById('btn-close-inventory'),
      seedInput: document.getElementById('seed-input'),
      renderDistSlider: document.getElementById('render-distance-slider'),
      renderDistVal: document.getElementById('render-dist-val'),
      fpsCounter: document.getElementById('fps-counter'),
      posInfo: document.getElementById('pos-info'),
      biomeInfo: document.getElementById('biome-info'),
      targetBlockInfo: document.getElementById('target-block-info'),
      gamemodeInfo: document.getElementById('gamemode-info'),
      healthContainer: document.getElementById('health-container'),
      hungerContainer: document.getElementById('hunger-container'),
      hotbar: document.getElementById('hotbar'),
      handItemName: document.getElementById('hand-item-name'),
      craftingGrid: document.getElementById('crafting-grid'),
      craftingResult: document.getElementById('crafting-result'),
      inventoryGrid: document.getElementById('inventory-grid'),
      inventoryHotbarGrid: document.getElementById('inventory-hotbar-grid'),
      toast: document.getElementById('toast'),
      cursorItem: document.getElementById('cursor-item'),
      tradingWindow: document.getElementById('trading-window'),
      tradingTitle: document.getElementById('trading-title'),
      tradingList: document.getElementById('trading-list'),
      btnCloseTrading: document.getElementById('btn-close-trading')
    };
  }

  initEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start Game Button
    this.dom.btnStart.addEventListener('click', () => {
      this.seed = this.dom.seedInput.value || 'minecraft123';
      this.audioEngine.init();
      this.dom.startOverlay.classList.add('hidden');
      this.player.lockMouse();
      this.isPaused = false;
    });

    // Mouse Clicks in Game (Break / Place / Villager Interact)
    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.player.mouseLocked || this.isPaused || this.isInventoryOpen || !this.dom.tradingWindow.classList.contains('hidden')) return;

      this.swingHand();

      // Check if aiming at a villager
      const eyePos = this.player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
      const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      const hitVillager = this.villagers.raycast(eyePos, cameraDir, 4.0);

      if (e.button === 0) {
        // Left Click: Attack Villager or Break Block
        if (hitVillager) {
          this.audioEngine.playSound('villager');
          this.showToast(`轻击了 ${hitVillager.name}!`);
          return;
        }
        this.breakTargetBlock();
      } else if (e.button === 2) {
        // Right Click: Interact with Villager or Place Block
        if (hitVillager) {
          this.audioEngine.playSound('villager');
          this.openTrading(hitVillager);
          return;
        }
        this.placeOrInteractBlock();
      }
    });

    // Close Trading Window Button
    this.dom.btnCloseTrading.addEventListener('click', () => {
      this.closeTrading();
    });

    // Track mouse position for cursor item dragging
    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      if (this.isInventoryOpen && this.dom.cursorItem) {
        this.dom.cursorItem.style.left = `${e.clientX}px`;
        this.dom.cursorItem.style.top = `${e.clientY}px`;
      }
    });

    // Prevent Context Menu on Right Click
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // Scroll wheel for hotbar selection
    window.addEventListener('wheel', (e) => {
      if (!this.player.mouseLocked) return;
      if (e.deltaY > 0) {
        this.inventory.activeHotbarIndex = (this.inventory.activeHotbarIndex + 1) % 9;
      } else {
        this.inventory.activeHotbarIndex = (this.inventory.activeHotbarIndex + 8) % 9;
      }
      this.audioEngine.playSound('click');
      this.updateHUD();
      this.updateHandModel();
    });

    // Keydown for 1-9 Hotbar & Inventory Toggle & Pause & Trading
    window.addEventListener('keydown', (e) => {
      if (e.code.startsWith('Digit') && e.code !== 'Digit0') {
        const num = parseInt(e.code.replace('Digit', '')) - 1;
        if (num >= 0 && num < 9) {
          this.inventory.activeHotbarIndex = num;
          this.audioEngine.playSound('click');
          this.updateHUD();
          this.updateHandModel();
        }
      }

      if (e.code === 'KeyE') {
        if (!this.dom.tradingWindow.classList.contains('hidden')) {
          this.closeTrading();
          return;
        }
        if (!this.dom.startOverlay.classList.contains('hidden')) return;
        this.toggleInventory();
      }

      if (e.code === 'Escape') {
        if (!this.dom.tradingWindow.classList.contains('hidden')) {
          this.closeTrading();
        } else if (this.isInventoryOpen) {
          this.toggleInventory();
        } else {
          this.togglePauseMenu();
        }
      }
    });

    // Pause Menu Buttons
    this.dom.btnResume.addEventListener('click', () => {
      this.togglePauseMenu();
    });

    this.dom.btnMode.addEventListener('click', () => {
      this.player.gameMode = this.player.gameMode === 'survival' ? 'creative' : 'survival';
      if (this.player.gameMode === 'creative') {
        this.player.health = 20;
        this.player.hunger = 20;
      }
      this.updateHUD();
      this.showToast(`切换为: ${this.player.gameMode === 'survival' ? '生存模式' : '创造模式'}`);
    });

    this.dom.btnTime.addEventListener('click', () => {
      this.dayNight.time = (this.dayNight.time + 0.5) % 1.0;
      this.showToast('时间已切换');
    });

    this.dom.btnWeather.addEventListener('click', () => {
      this.dayNight.toggleWeather();
      this.showToast(`天气已切换: ${this.dayNight.isRaining ? '降雨' : '晴朗'}`);
    });

    this.dom.btnSave.addEventListener('click', () => {
      this.saveCurrentGame();
    });

    this.dom.btnReset.addEventListener('click', () => {
      if (confirm('确定要重置世界数据吗？')) {
        SaveSystem.clearSave();
        location.reload();
      }
    });

    this.dom.btnCloseInv.addEventListener('click', () => {
      this.toggleInventory();
    });

    this.dom.renderDistSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.dom.renderDistVal.innerText = val;
      this.world.renderDistance = val;
    });

    // Crafting result slot click
    this.dom.craftingResult.addEventListener('click', () => {
      this.inventory.takeCraftingResult();
      this.updateInventoryUI();
      this.updateHUD();
      this.updateHandModel();
    });
  }

  breakTargetBlock() {
    if (!this.player.targetBlock || !this.player.targetBlock.hit) return;

    const { x, y, z, blockId } = this.player.targetBlock;
    if (blockId === BLOCKS.BEDROCK && this.player.gameMode !== 'creative') {
      this.showToast('基岩无法被破坏！');
      return;
    }

    // Special: Ignited TNT on hit in survival or creative
    if (blockId === BLOCKS.TNT) {
      this.igniteTNT(x, y, z);
      return;
    }

    // Remove block
    this.world.setBlock(x, y, z, BLOCKS.AIR);
    this.audioEngine.playSound('break');

    // Spawn break particles
    this.spawnBreakParticles(x, y, z, blockId);

    // Add broken block to inventory (Diamond Ore drops Diamond!)
    if (blockId !== BLOCKS.AIR && blockId !== BLOCKS.WATER) {
      const dropId = blockId === BLOCKS.DIAMOND_ORE ? BLOCKS.DIAMOND : blockId;
      this.inventory.addItem(dropId, 1);
      this.updateHUD();
      this.updateHandModel();
    }
  }

  placeOrInteractBlock() {
    if (!this.player.targetBlock || !this.player.targetBlock.hit) return;

    const { x, y, z, blockId, placePos } = this.player.targetBlock;

    // Check interaction with Crafting Table
    if (blockId === BLOCKS.CRAFTING_TABLE) {
      this.inventory.craftingMode = 3;
      this.toggleInventory(true);
      return;
    }

    // Place active block
    const activeBlockId = this.inventory.getActiveBlockId();
    if (activeBlockId === BLOCKS.AIR) return;

    // Items (Diamond Sword, Stick, Diamond) cannot be placed as blocks
    if (BLOCK_DEFS[activeBlockId]?.isItem) return;

    // Prevent placing block inside player's body
    const playerMinX = this.player.position.x - this.player.radius;
    const playerMaxX = this.player.position.x + this.player.radius;
    const playerMinY = this.player.position.y;
    const playerMaxY = this.player.position.y + this.player.height;
    const playerMinZ = this.player.position.z - this.player.radius;
    const playerMaxZ = this.player.position.z + this.player.radius;

    if (
      placePos.x + 1 > playerMinX && placePos.x < playerMaxX &&
      placePos.y + 1 > playerMinY && placePos.y < playerMaxY &&
      placePos.z + 1 > playerMinZ && placePos.z < playerMaxZ
    ) {
      return; // Traps player
    }

    this.world.setBlock(placePos.x, placePos.y, placePos.z, activeBlockId);
    this.audioEngine.playSound('place');

    if (this.player.gameMode !== 'creative') {
      this.inventory.useActiveBlock();
      this.updateHUD();
      this.updateHandModel();
    }
  }

  igniteTNT(x, y, z) {
    // Remove static block
    this.world.setBlock(x, y, z, BLOCKS.AIR);

    // Spawn flashing TNT entity
    const geom = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    const mats = this.materialManager.getMaterials(BLOCKS.TNT);
    const tntMesh = new THREE.Mesh(geom, mats);
    tntMesh.position.set(x + 0.5, y + 0.5, z + 0.5);
    this.scene.add(tntMesh);

    const tntEntity = {
      mesh: tntMesh,
      x: x + 0.5,
      y: y + 0.5,
      z: z + 0.5,
      timeLeft: 2.2,
      flashTimer: 0
    };

    this.activeEntities.push(tntEntity);
    this.audioEngine.playSound('place');
  }

  explodeTNT(entity) {
    this.scene.remove(entity.mesh);
    entity.mesh.geometry.dispose();

    const ex = Math.floor(entity.x);
    const ey = Math.floor(entity.y);
    const ez = Math.floor(entity.z);
    const radius = 3.5;

    this.audioEngine.playSound('explode');

    // Blast destruction
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist <= radius) {
            const bx = Math.floor(ex + dx);
            const by = Math.floor(ey + dy);
            const bz = Math.floor(ez + dz);
            const bId = this.world.getBlock(bx, by, bz);
            if (bId !== BLOCKS.BEDROCK && bId !== BLOCKS.AIR && bId !== BLOCKS.WATER) {
              this.world.setBlock(bx, by, bz, BLOCKS.AIR);
              if (Math.random() < 0.3) {
                this.spawnBreakParticles(bx, by, bz, bId, 4);
              }
            }
          }
        }
      }
    }

    // Player knockback & damage
    const pPos = this.player.position;
    const distToPlayer = pPos.distanceTo(new THREE.Vector3(entity.x, entity.y, entity.z));
    if (distToPlayer < 7 && this.player.gameMode === 'survival') {
      const damage = Math.floor((7 - distToPlayer) * 3);
      this.player.takeDamage(damage);

      // Knockback impulse
      const impulse = pPos.clone().sub(new THREE.Vector3(entity.x, entity.y, entity.z)).normalize();
      this.player.velocity.add(impulse.multiplyScalar(12));
      this.player.velocity.y = Math.max(this.player.velocity.y, 6);
    }
  }

  spawnBreakParticles(x, y, z, blockId, count = 12) {
    const color = this.materialManager.colors[blockId] || 0x888888;
    const geom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const mat = new THREE.MeshBasicMaterial({ color });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geom, mat);
      p.position.set(
        x + 0.5 + (Math.random() - 0.5) * 0.6,
        y + 0.5 + (Math.random() - 0.5) * 0.6,
        z + 0.5 + (Math.random() - 0.5) * 0.6
      );

      const vx = (Math.random() - 0.5) * 4;
      const vy = Math.random() * 4 + 1.5;
      const vz = (Math.random() - 0.5) * 4;

      this.scene.add(p);
      this.particles.push({
        mesh: p,
        vx, vy, vz,
        life: 0.5 + Math.random() * 0.3
      });
    }
  }

  togglePauseMenu() {
    if (!this.dom.startOverlay.classList.contains('hidden')) return;

    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.player.unlockMouse();
      this.dom.pauseMenu.classList.remove('hidden');
    } else {
      this.dom.pauseMenu.classList.add('hidden');
      this.player.lockMouse();
    }
  }

  toggleInventory(forceCrafting3x3 = false) {
    this.isInventoryOpen = !this.isInventoryOpen;

    if (this.isInventoryOpen) {
      this.player.unlockMouse();
      this.dom.inventoryWindow.classList.remove('hidden');
      if (forceCrafting3x3) {
        this.inventory.craftingMode = 3;
      }
      this.updateInventoryUI();
    } else {
      this.dom.inventoryWindow.classList.add('hidden');
      this.inventory.returnHeldItem();
      this.inventory.returnCraftingGridItems();
      this.updateCursorItem();
      this.player.lockMouse();
      // Reset crafting mode to 2x2
      this.inventory.craftingMode = 2;
      this.updateHUD();
      this.updateHandModel();
    }
  }

  updateCursorItem() {
    if (!this.dom.cursorItem) return;

    const held = this.inventory.heldItem;
    if (held && held.blockId !== BLOCKS.AIR && held.count > 0 && this.isInventoryOpen) {
      this.dom.cursorItem.innerHTML = `
        <div class="slot-icon" style="background-image: url(${this.materialManager.getTextureURL(held.blockId)})"></div>
        <span class="slot-count">${held.count}</span>
      `;
      this.dom.cursorItem.classList.remove('hidden');
      this.dom.cursorItem.style.left = `${this.mousePos.x}px`;
      this.dom.cursorItem.style.top = `${this.mousePos.y}px`;
    } else {
      this.dom.cursorItem.classList.add('hidden');
      this.dom.cursorItem.innerHTML = '';
    }
  }

  updateHUD() {
    // 1. Status Bars
    this.dom.healthContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.className = `heart ${i * 2 < this.player.health ? 'heart-full' : 'heart-empty'}`;
      this.dom.healthContainer.appendChild(heart);
    }

    this.dom.hungerContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const hunger = document.createElement('div');
      hunger.className = `hunger ${i * 2 < this.player.hunger ? 'hunger-full' : 'hunger-empty'}`;
      this.dom.hungerContainer.appendChild(hunger);
    }

    // 2. Hotbar Slots
    this.dom.hotbar.innerHTML = '';
    this.inventory.hotbarSlots.forEach((slot, index) => {
      const slotEl = document.createElement('div');
      slotEl.className = `hotbar-slot ${index === this.inventory.activeHotbarIndex ? 'active' : ''}`;

      const keyLabel = document.createElement('span');
      keyLabel.className = 'slot-key';
      keyLabel.innerText = index + 1;
      slotEl.appendChild(keyLabel);

      if (slot.blockId !== BLOCKS.AIR && slot.count > 0) {
        const icon = document.createElement('div');
        icon.className = 'slot-icon';
        icon.style.backgroundImage = `url(${this.materialManager.getTextureURL(slot.blockId)})`;
        slotEl.appendChild(icon);

        const count = document.createElement('span');
        count.className = 'slot-count';
        count.innerText = slot.count;
        slotEl.appendChild(count);
      }

      slotEl.addEventListener('click', () => {
        this.inventory.activeHotbarIndex = index;
        this.updateHUD();
        this.updateHandModel();
      });

      this.dom.hotbar.appendChild(slotEl);
    });

    // Active item title display
    const activeSlot = this.inventory.hotbarSlots[this.inventory.activeHotbarIndex];
    if (activeSlot && activeSlot.blockId !== BLOCKS.AIR && activeSlot.count > 0) {
      const def = BLOCK_DEFS[activeSlot.blockId];
      this.dom.handItemName.innerText = def ? def.name : '';
      this.dom.handItemName.classList.add('show');
    } else {
      this.dom.handItemName.classList.remove('show');
    }

    this.dom.gamemodeInfo.innerText = `模式: ${this.player.gameMode === 'survival' ? '生存模式 (Survival)' : '创造模式 (Creative)'}`;
  }

  updateInventoryUI() {
    // 1. Crafting Grid (2x2 or 3x3)
    const size = this.inventory.craftingMode;
    const gridClass = size === 3 ? 'grid-3x3' : 'grid-2x2';
    this.dom.craftingGrid.className = gridClass;
    this.dom.craftingGrid.innerHTML = '';

    const numSlots = size * size;
    for (let i = 0; i < numSlots; i++) {
      const slotData = this.inventory.craftingGrid[i];
      const slotEl = this.createSlotElement(slotData, (e) => {
        this.inventory.handleCraftingSlotClick(slotData, e.button === 2, e.shiftKey);
        this.inventory.checkCraftingRecipe();
        this.updateInventoryUI();
        this.updateCursorItem();
        this.updateHUD();
        this.updateHandModel();
      });
      this.dom.craftingGrid.appendChild(slotEl);
    }

    // Crafting Result Slot
    this.dom.craftingResult.innerHTML = '';
    const resData = this.inventory.craftingResult;
    if (resData.blockId !== BLOCKS.AIR && resData.count > 0) {
      const icon = document.createElement('div');
      icon.className = 'slot-icon';
      icon.style.backgroundImage = `url(${this.materialManager.getTextureURL(resData.blockId)})`;
      this.dom.craftingResult.appendChild(icon);

      const count = document.createElement('span');
      count.className = 'slot-count';
      count.innerText = resData.count;
      this.dom.craftingResult.appendChild(count);
    }

    // 2. Storage Inventory Grid
    this.dom.inventoryGrid.innerHTML = '';
    this.inventory.inventorySlots.forEach((slotData) => {
      const slotEl = this.createSlotElement(slotData, (e) => {
        this.inventory.handleSlotClick(slotData, e.button === 2);
        this.updateInventoryUI();
        this.updateCursorItem();
        this.updateHUD();
        this.updateHandModel();
      });
      this.dom.inventoryGrid.appendChild(slotEl);
    });

    // 3. Hotbar Grid in Inventory
    this.dom.inventoryHotbarGrid.innerHTML = '';
    this.inventory.hotbarSlots.forEach((slotData) => {
      const slotEl = this.createSlotElement(slotData, (e) => {
        this.inventory.handleSlotClick(slotData, e.button === 2);
        this.updateInventoryUI();
        this.updateCursorItem();
        this.updateHUD();
        this.updateHandModel();
      });
      this.dom.inventoryHotbarGrid.appendChild(slotEl);
    });

    this.updateCursorItem();
  }

  createSlotElement(slotData, onClick) {
    const slotEl = document.createElement('div');
    slotEl.className = 'item-slot';

    if (slotData && slotData.blockId !== BLOCKS.AIR && slotData.count > 0) {
      const icon = document.createElement('div');
      icon.className = 'slot-icon';
      icon.style.backgroundImage = `url(${this.materialManager.getTextureURL(slotData.blockId)})`;
      slotEl.appendChild(icon);

      const count = document.createElement('span');
      count.className = 'slot-count';
      count.innerText = slotData.count;
      slotEl.appendChild(count);
    }

    slotEl.addEventListener('mousedown', onClick);
    return slotEl;
  }

  saveCurrentGame() {
    const success = SaveSystem.saveGame({
      seed: this.seed,
      player: this.player,
      world: this.world,
      inventory: this.inventory
    });
    if (success) {
      this.showToast('存档已成功保存！');
    } else {
      this.showToast('保存失败！');
    }
  }

  loadSavedState() {
    const saved = SaveSystem.loadGame();
    if (!saved) return;

    if (saved.seed) this.seed = saved.seed;
    if (saved.player) {
      this.player.position.set(saved.player.x, saved.player.y, saved.player.z);
      this.player.rotation.set(saved.player.rx, saved.player.ry, 0);
      this.player.gameMode = saved.player.mode || 'survival';
      this.player.health = saved.player.health || 20;
      this.player.hunger = saved.player.hunger || 20;
    }
    if (saved.modifiedBlocks) {
      for (const [key, bId] of saved.modifiedBlocks) {
        this.world.modifiedBlocks.set(key, bId);
      }
    }
    if (saved.hotbar) {
      this.inventory.hotbarSlots = saved.hotbar;
    }
    if (saved.inventory) {
      this.inventory.inventorySlots = saved.inventory;
    }
  }

  showToast(msg) {
    this.dom.toast.innerText = msg;
    this.dom.toast.classList.remove('hidden');
    setTimeout(() => {
      this.dom.toast.classList.add('hidden');
    }, 2500);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update FPS
    this.fpsTimer += delta;
    this.fpsCount++;
    if (this.fpsTimer >= 1.0) {
      this.dom.fpsCounter.innerText = `FPS: ${this.fpsCount}`;
      this.fpsCount = 0;
      this.fpsTimer = 0;
    }

    if (!this.isPaused) {
      this.player.update(delta);
      this.world.updateLoadedChunks(this.player.position.x, this.player.position.z);
      this.dayNight.update(delta, this.player.position);

      // Natural Hunger and Health regeneration
      if (this.player.gameMode === 'survival') {
        this.survivalTimer += delta;
        if (this.survivalTimer >= 4.0) {
          this.survivalTimer = 0;

          // Hunger drain
          if (this.player.velocity.lengthSq() > 0.1) {
            this.player.hunger = Math.max(0, this.player.hunger - 0.5);
          }

          // Starvation damage
          if (this.player.hunger <= 0) {
            this.player.takeDamage(1);
          } else if (this.player.hunger >= 18 && this.player.health < 20) {
            // Health regen
            this.player.health = Math.min(20, this.player.health + 1);
          }

          // Check Player Death
          if (this.player.health <= 0) {
            this.showToast('💀 你阵亡了！');
            const surfaceY = this.world.generator.getHeight(0, 0);
            this.player.position.set(0.5, surfaceY + 2, 0.5);
            this.player.health = 20;
            this.player.hunger = 20;
          }

          this.updateHUD();
        }
      }

      // Update Hand Swing Animation
      if (this.swingProgress > 0) {
        const activeBlockId = this.inventory.getActiveBlockId();
        const isSword = activeBlockId === BLOCKS.DIAMOND_SWORD;
        const swingSpeed = isSword ? 6.5 : 4.0;
        this.swingProgress -= delta * swingSpeed;
        if (this.swingProgress < 0) this.swingProgress = 0;

        const swingFactor = isSword ? 0.7 : 0.45;
        const swingAngle = Math.sin(this.swingProgress * Math.PI) * swingFactor;
        this.handGroup.rotation.set(0.2 - swingAngle, -0.3 + swingAngle * 0.6, 0.1 - swingAngle * 0.9);
        this.handGroup.position.set(0.38 - swingAngle * 0.12, -0.32 - swingAngle * 0.18, -0.55 + swingAngle * 0.15);
      } else {
        this.handGroup.rotation.set(0.2, -0.3, 0.1);
        this.handGroup.position.set(0.38, -0.32, -0.55);
      }

      // Update Active Entities (e.g. Primed TNT)
      for (let i = this.activeEntities.length - 1; i >= 0; i--) {
        const ent = this.activeEntities[i];
        ent.timeLeft -= delta;
        ent.flashTimer += delta;

        // Pulse scale / flash
        const scale = 1.0 + Math.sin(ent.flashTimer * 16) * 0.1;
        ent.mesh.scale.set(scale, scale, scale);

        if (ent.timeLeft <= 0) {
          this.explodeTNT(ent);
          this.activeEntities.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= delta;
        p.vy -= 16.0 * delta; // Gravity

        p.mesh.position.x += p.vx * delta;
        p.mesh.position.y += p.vy * delta;
        p.mesh.position.z += p.vz * delta;

        p.mesh.rotation.x += 4 * delta;
        p.mesh.rotation.y += 4 * delta;

        if (p.life <= 0) {
          this.scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          this.particles.splice(i, 1);
        }
      }

      // Update Villagers
      this.villagers.update(delta, this.player.position);

      // Update Debug Info
      const pos = this.player.position;
      this.dom.posInfo.innerText = `XYZ: ${Math.floor(pos.x)} / ${Math.floor(pos.y)} / ${Math.floor(pos.z)}`;
      this.dom.biomeInfo.innerText = `生物群系: ${this.world.getBiome(pos.x, pos.z)}`;

      // Raycast aim check for villager or block
      const eyePos = this.player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
      const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      const hitVillager = this.villagers.raycast(eyePos, cameraDir, 4.0);

      if (hitVillager) {
        this.dom.targetBlockInfo.innerText = `指向: ${hitVillager.name} [右键交易]`;
      } else {
        const target = this.player.targetBlock;
        if (target && target.hit) {
          const def = BLOCK_DEFS[target.blockId];
          this.dom.targetBlockInfo.innerText = `指向: ${def ? def.name : '未知'} (${target.x}, ${target.y}, ${target.z})`;
        } else {
          this.dom.targetBlockInfo.innerText = '指向: 无';
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  openTrading(villager) {
    this.currentVillager = villager;
    this.player.unlockMouse();
    this.dom.tradingTitle.innerText = `${villager.name} - 物品交易`;
    this.dom.tradingList.innerHTML = '';

    villager.trades.forEach((trade) => {
      const row = document.createElement('div');
      row.className = 'trade-row';

      let inputHtml = `
        <div class="trade-item">
          <div class="slot-icon" style="background-image: url(${this.materialManager.getTextureURL(trade.input.blockId)})"></div>
          <span>x${trade.input.count}</span>
        </div>
      `;
      if (trade.input.secondary) {
        inputHtml += `
          <span>+</span>
          <div class="trade-item">
            <div class="slot-icon" style="background-image: url(${this.materialManager.getTextureURL(trade.input.secondary.blockId)})"></div>
            <span>x${trade.input.secondary.count}</span>
          </div>
        `;
      }

      const outputHtml = `
        <div class="trade-item">
          <div class="slot-icon" style="background-image: url(${this.materialManager.getTextureURL(trade.output.blockId)})"></div>
          <span>x${trade.output.count}</span>
        </div>
      `;

      row.innerHTML = `
        <div class="trade-inputs">${inputHtml}</div>
        <div class="trade-arrow">&rarr;</div>
        <div class="trade-output">${outputHtml}</div>
      `;

      const btn = document.createElement('button');
      btn.className = 'trade-btn';
      btn.innerText = '兑换';
      btn.addEventListener('click', () => {
        this.executeTrade(trade);
      });

      row.appendChild(btn);
      this.dom.tradingList.appendChild(row);
    });

    this.dom.tradingWindow.classList.remove('hidden');
  }

  closeTrading() {
    this.dom.tradingWindow.classList.add('hidden');
    this.currentVillager = null;
    this.player.lockMouse();
  }

  executeTrade(trade) {
    const countItem = (bId) => {
      let total = 0;
      for (const slot of this.inventory.hotbarSlots) {
        if (slot.blockId === bId) total += slot.count;
      }
      for (const slot of this.inventory.inventorySlots) {
        if (slot.blockId === bId) total += slot.count;
      }
      return total;
    };

    const hasPrimary = countItem(trade.input.blockId) >= trade.input.count;
    const hasSecondary = !trade.input.secondary || countItem(trade.input.secondary.blockId) >= trade.input.secondary.count;

    if (!hasPrimary || !hasSecondary) {
      this.showToast('材料不足，无法兑换！');
      this.audioEngine.playSound('click');
      return;
    }

    const deductItem = (bId, amount) => {
      for (const slot of this.inventory.hotbarSlots) {
        if (slot.blockId === bId) {
          const take = Math.min(slot.count, amount);
          slot.count -= take;
          amount -= take;
          if (slot.count <= 0) slot.blockId = BLOCKS.AIR;
          if (amount <= 0) return;
        }
      }
      for (const slot of this.inventory.inventorySlots) {
        if (slot.blockId === bId) {
          const take = Math.min(slot.count, amount);
          slot.count -= take;
          amount -= take;
          if (slot.count <= 0) slot.blockId = BLOCKS.AIR;
          if (amount <= 0) return;
        }
      }
    };

    deductItem(trade.input.blockId, trade.input.count);
    if (trade.input.secondary) {
      deductItem(trade.input.secondary.blockId, trade.input.secondary.count);
    }

    this.inventory.addItem(trade.output.blockId, trade.output.count);

    this.audioEngine.playSound('trade');
    const outName = BLOCK_DEFS[trade.output.blockId]?.name || '物品';
    this.showToast(`交易成功！获得 ${outName} x${trade.output.count}`);
    this.updateHUD();
    this.updateHandModel();
  }
}

// Instantiate App on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new MinecraftApp();
});
