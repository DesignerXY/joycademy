import { BLOCKS, BLOCK_DEFS } from './Blocks.js';

export class InventorySystem {
  constructor(materialManager, audioEngine) {
    this.materialManager = materialManager;
    this.audioEngine = audioEngine;

    // Hotbar (9 slots)
    this.hotbarSlots = [
      { blockId: BLOCKS.GRASS, count: 64 },
      { blockId: BLOCKS.DIRT, count: 64 },
      { blockId: BLOCKS.STONE, count: 64 },
      { blockId: BLOCKS.OAK_LOG, count: 32 },
      { blockId: BLOCKS.OAK_LEAVES, count: 32 },
      { blockId: BLOCKS.PLANKS, count: 64 },
      { blockId: BLOCKS.COBBLESTONE, count: 64 },
      { blockId: BLOCKS.GLASS, count: 32 },
      { blockId: BLOCKS.BRICKS, count: 32 }
    ];

    // Main Inventory (27 slots)
    this.inventorySlots = Array(27).fill(null).map(() => ({ blockId: BLOCKS.AIR, count: 0 }));
    // Add default initial blocks to inventory
    this.inventorySlots[0] = { blockId: BLOCKS.SAND, count: 32 };
    this.inventorySlots[1] = { blockId: BLOCKS.COAL_ORE, count: 16 };
    this.inventorySlots[2] = { blockId: BLOCKS.IRON_ORE, count: 16 };
    this.inventorySlots[3] = { blockId: BLOCKS.DIAMOND_ORE, count: 8 };

    this.activeHotbarIndex = 0;

    // 2x2 or 3x3 Crafting Grid State
    this.craftingMode = 2; // 2 or 3
    this.craftingGrid = Array(9).fill(null).map(() => ({ blockId: BLOCKS.AIR, count: 0 }));
    this.craftingResult = { blockId: BLOCKS.AIR, count: 0 };

    this.heldItem = null; // Item held on cursor during UI dragging
  }

  getActiveBlockId() {
    const slot = this.hotbarSlots[this.activeHotbarIndex];
    return slot && slot.count > 0 ? slot.blockId : BLOCKS.AIR;
  }

  useActiveBlock() {
    const slot = this.hotbarSlots[this.activeHotbarIndex];
    if (!slot || slot.count <= 0) return false;

    slot.count--;
    if (slot.count <= 0) {
      slot.blockId = BLOCKS.AIR;
    }
    return true;
  }

  addItem(blockId, amount = 1) {
    if (blockId === BLOCKS.AIR) return;

    // First try stacking into existing hotbar slots
    for (const slot of this.hotbarSlots) {
      if (slot.blockId === blockId && slot.count < 64) {
        const space = 64 - slot.count;
        const add = Math.min(space, amount);
        slot.count += add;
        amount -= add;
        if (amount <= 0) return;
      }
    }

    // Try stacking into existing inventory slots
    for (const slot of this.inventorySlots) {
      if (slot.blockId === blockId && slot.count < 64) {
        const space = 64 - slot.count;
        const add = Math.min(space, amount);
        slot.count += add;
        amount -= add;
        if (amount <= 0) return;
      }
    }

    // Fill empty hotbar slot
    for (const slot of this.hotbarSlots) {
      if (slot.blockId === BLOCKS.AIR || slot.count === 0) {
        slot.blockId = blockId;
        slot.count = Math.min(64, amount);
        return;
      }
    }

    // Fill empty inventory slot
    for (const slot of this.inventorySlots) {
      if (slot.blockId === BLOCKS.AIR || slot.count === 0) {
        slot.blockId = blockId;
        slot.count = Math.min(64, amount);
        return;
      }
    }
  }

  // Handle slot clicks for regular inventory & hotbar
  handleSlotClick(slotData, isRightClick = false) {
    this.audioEngine.playSound('click');

    // Case 1: Cursor is currently empty
    if (!this.heldItem || this.heldItem.count <= 0) {
      if (slotData.blockId !== BLOCKS.AIR && slotData.count > 0) {
        if (isRightClick && slotData.count > 1) {
          const take = Math.ceil(slotData.count / 2);
          this.heldItem = { blockId: slotData.blockId, count: take };
          slotData.count -= take;
        } else {
          this.heldItem = { blockId: slotData.blockId, count: slotData.count };
          slotData.blockId = BLOCKS.AIR;
          slotData.count = 0;
        }
      }
      return;
    }

    // Case 2: Cursor has an item
    if (slotData.blockId === BLOCKS.AIR || slotData.count <= 0) {
      // Slot is empty
      if (isRightClick) {
        slotData.blockId = this.heldItem.blockId;
        slotData.count = 1;
        this.heldItem.count--;
        if (this.heldItem.count <= 0) this.heldItem = null;
      } else {
        slotData.blockId = this.heldItem.blockId;
        slotData.count = this.heldItem.count;
        this.heldItem = null;
      }
    } else if (slotData.blockId === this.heldItem.blockId) {
      // Same block type: stack
      const space = 64 - slotData.count;
      if (space > 0) {
        if (isRightClick) {
          slotData.count++;
          this.heldItem.count--;
          if (this.heldItem.count <= 0) this.heldItem = null;
        } else {
          const add = Math.min(space, this.heldItem.count);
          slotData.count += add;
          this.heldItem.count -= add;
          if (this.heldItem.count <= 0) this.heldItem = null;
        }
      }
    } else {
      // Different block type: swap if left click
      if (!isRightClick) {
        const temp = { blockId: slotData.blockId, count: slotData.count };
        slotData.blockId = this.heldItem.blockId;
        slotData.count = this.heldItem.count;
        this.heldItem = temp;
      }
    }
  }

  // Handle slot clicks specifically for crafting grid (places 1 item per click)
  handleCraftingSlotClick(slotData, isRightClick = false, isShiftKey = false) {
    this.audioEngine.playSound('click');

    // Case 1: Cursor has an item to place into crafting
    if (this.heldItem && this.heldItem.count > 0) {
      if (slotData.blockId === BLOCKS.AIR || slotData.count <= 0) {
        // Place 1 item (or all if shift-click)
        const putAmount = isShiftKey ? this.heldItem.count : 1;
        slotData.blockId = this.heldItem.blockId;
        slotData.count = putAmount;
        this.heldItem.count -= putAmount;
        if (this.heldItem.count <= 0) this.heldItem = null;
      } else if (slotData.blockId === this.heldItem.blockId) {
        // Same block: add 1
        if (slotData.count < 64) {
          const putAmount = isShiftKey ? Math.min(64 - slotData.count, this.heldItem.count) : 1;
          slotData.count += putAmount;
          this.heldItem.count -= putAmount;
          if (this.heldItem.count <= 0) this.heldItem = null;
        }
      } else {
        // Different block: swap
        const temp = { blockId: slotData.blockId, count: slotData.count };
        slotData.blockId = this.heldItem.blockId;
        slotData.count = this.heldItem.count;
        this.heldItem = temp;
      }
      return;
    }

    // Case 2: Cursor is empty
    if (slotData.blockId !== BLOCKS.AIR && slotData.count > 0) {
      // Take item from crafting slot back to cursor
      if (isRightClick && slotData.count > 1) {
        const take = Math.ceil(slotData.count / 2);
        this.heldItem = { blockId: slotData.blockId, count: take };
        slotData.count -= take;
      } else {
        this.heldItem = { blockId: slotData.blockId, count: slotData.count };
        slotData.blockId = BLOCKS.AIR;
        slotData.count = 0;
      }
    } else {
      // Empty slot and empty cursor: take 1 item from active hotbar slot
      const activeSlot = this.hotbarSlots[this.activeHotbarIndex];
      if (activeSlot && activeSlot.blockId !== BLOCKS.AIR && activeSlot.count > 0) {
        slotData.blockId = activeSlot.blockId;
        slotData.count = 1;
        activeSlot.count--;
        if (activeSlot.count <= 0) activeSlot.blockId = BLOCKS.AIR;
      }
    }
  }

  returnHeldItem() {
    if (this.heldItem && this.heldItem.count > 0) {
      this.addItem(this.heldItem.blockId, this.heldItem.count);
      this.heldItem = null;
    }
  }

  returnCraftingGridItems() {
    for (const slot of this.craftingGrid) {
      if (slot.blockId !== BLOCKS.AIR && slot.count > 0) {
        this.addItem(slot.blockId, slot.count);
        slot.blockId = BLOCKS.AIR;
        slot.count = 0;
      }
    }
    this.craftingResult = { blockId: BLOCKS.AIR, count: 0 };
  }

  // Check crafting recipes
  checkCraftingRecipe() {
    const grid = this.craftingGrid;
    const isGridEmpty = grid.every(s => s.blockId === BLOCKS.AIR || s.count === 0);

    if (isGridEmpty) {
      this.craftingResult = { blockId: BLOCKS.AIR, count: 0 };
      return;
    }

    const totalNonAir = grid.filter(s => s.blockId !== BLOCKS.AIR && s.count > 0).length;
    const countType = (type) => grid.filter(s => s.blockId === type && s.count > 0).length;

    // Recipe 1: 1 Oak Log -> 4 Oak Planks
    if (countType(BLOCKS.OAK_LOG) === 1 && totalNonAir === 1) {
      this.craftingResult = { blockId: BLOCKS.PLANKS, count: 4 };
      return;
    }

    // Recipe 2: 4 Planks (2x2) -> Crafting Table
    if (countType(BLOCKS.PLANKS) === 4 && totalNonAir === 4) {
      this.craftingResult = { blockId: BLOCKS.CRAFTING_TABLE, count: 1 };
      return;
    }

    // Recipe: 2 Planks -> 4 Sticks
    if (countType(BLOCKS.PLANKS) === 2 && totalNonAir === 2) {
      this.craftingResult = { blockId: BLOCKS.STICK, count: 4 };
      return;
    }

    // Recipe: 1 Diamond Ore -> 1 Diamond
    if (countType(BLOCKS.DIAMOND_ORE) === 1 && totalNonAir === 1) {
      this.craftingResult = { blockId: BLOCKS.DIAMOND, count: 1 };
      return;
    }

    // Recipe: 2 Diamonds + 1 Stick -> 1 Diamond Sword
    if (totalNonAir === 3 && countType(BLOCKS.DIAMOND) === 2 && countType(BLOCKS.STICK) === 1) {
      this.craftingResult = { blockId: BLOCKS.DIAMOND_SWORD, count: 1 };
      return;
    }

    // Recipe: 1 Coal Ore + 1 Stick -> 4 Torches
    if (totalNonAir === 2 && countType(BLOCKS.COAL_ORE) === 1 && countType(BLOCKS.STICK) === 1) {
      this.craftingResult = { blockId: BLOCKS.TORCH, count: 4 };
      return;
    }

    // Recipe 3: 4 Dirt -> 1 Cobblestone
    if (countType(BLOCKS.DIRT) === 4 && totalNonAir === 4) {
      this.craftingResult = { blockId: BLOCKS.COBBLESTONE, count: 1 };
      return;
    }

    // Recipe 4: 4 Cobblestone -> 4 Bricks
    if (countType(BLOCKS.COBBLESTONE) === 4 && totalNonAir === 4) {
      this.craftingResult = { blockId: BLOCKS.BRICKS, count: 4 };
      return;
    }

    // Recipe 5: 1 Coal Ore + 1 Planks -> 4 Torches
    if (totalNonAir === 2 && countType(BLOCKS.COAL_ORE) === 1 && countType(BLOCKS.PLANKS) === 1) {
      this.craftingResult = { blockId: BLOCKS.TORCH, count: 4 };
      return;
    }

    // Recipe 6: 4 Sand + 1 Coal Ore -> 1 TNT
    if (totalNonAir === 5 && countType(BLOCKS.SAND) === 4 && countType(BLOCKS.COAL_ORE) === 1) {
      this.craftingResult = { blockId: BLOCKS.TNT, count: 1 };
      return;
    }

    // Recipe 7: 1 Sand + 1 Coal Ore -> 4 Glass
    if (totalNonAir === 2 && countType(BLOCKS.SAND) === 1 && countType(BLOCKS.COAL_ORE) === 1) {
      this.craftingResult = { blockId: BLOCKS.GLASS, count: 4 };
      return;
    }

    // Recipe 8: 1 Flower -> 2 Sand
    if (totalNonAir === 1 && countType(BLOCKS.FLOWER) === 1) {
      this.craftingResult = { blockId: BLOCKS.SAND, count: 2 };
      return;
    }

    // Recipe 9: 4 Flowers + 1 Dirt -> 2 Pumpkins (Craft Pumpkin)
    if (totalNonAir === 5 && countType(BLOCKS.FLOWER) === 4 && countType(BLOCKS.DIRT) === 1) {
      this.craftingResult = { blockId: BLOCKS.PUMPKIN, count: 2 };
      return;
    }

    // Recipe 10: 3 Iron Ore -> 1 Iron Bucket (铁桶)
    if (totalNonAir === 3 && countType(BLOCKS.IRON_ORE) === 3) {
      this.craftingResult = { blockId: BLOCKS.BUCKET, count: 1 };
      return;
    }

    // Recipe 11: 3 Iron Ore + 2 Sticks -> 1 Iron Pickaxe (铁镐)
    if (totalNonAir === 5 && countType(BLOCKS.IRON_ORE) === 3 && countType(BLOCKS.STICK) === 2) {
      this.craftingResult = { blockId: BLOCKS.IRON_PICKAXE, count: 1 };
      return;
    }

    // Recipe 12: 3 Diamonds + 2 Sticks -> 1 Diamond Pickaxe (钻石镐)
    if (totalNonAir === 5 && countType(BLOCKS.DIAMOND) === 3 && countType(BLOCKS.STICK) === 2) {
      this.craftingResult = { blockId: BLOCKS.DIAMOND_PICKAXE, count: 1 };
      return;
    }

    // Recipe 13: 4 Cobblestone + 1 Water Bucket -> 2 Obsidian (黑曜石)
    if (totalNonAir === 5 && countType(BLOCKS.COBBLESTONE) === 4 && countType(BLOCKS.WATER_BUCKET) === 1) {
      this.craftingResult = { blockId: BLOCKS.OBSIDIAN, count: 2 };
      return;
    }

    // Recipe 14: 4 Obsidian + 1 Torch -> 2 Nether Portal (下界传送门)
    if (totalNonAir === 5 && countType(BLOCKS.OBSIDIAN) === 4 && countType(BLOCKS.TORCH) === 1) {
      this.craftingResult = { blockId: BLOCKS.NETHER_PORTAL, count: 2 };
      return;
    }

    this.craftingResult = { blockId: BLOCKS.AIR, count: 0 };
  }

  // Get full structured recipe catalog for Recipe Book UI
  getRecipeBookData() {
    return [
      {
        category: '基础与建筑 (Basics & Building)',
        items: [
          { name: '橡木木板 (Oak Planks)', input: '1 橡木原木', output: '4 橡木木板', desc: '放入任意1个原木即可分解为4块木板' },
          { name: '工作台 (Crafting Table)', input: '4 橡木木板 (2x2)', output: '1 工作台', desc: '在2x2网格中填满木板，放置后右键打开3x3大合成台' },
          { name: '木棍 (Sticks)', input: '2 橡木木板 (垂直排列)', output: '4 木棍', desc: '制造各种工具与火把的核心基础材料' },
          { name: '圆石 (Cobblestone)', input: '4 泥土', output: '1 圆石', desc: '生存初期缺少镐子时可用泥土压制圆石' },
          { name: '红砖 (Bricks)', input: '4 圆石', output: '4 红砖', desc: '坚固漂亮的建筑方块' },
          { name: '玻璃 (Glass)', input: '1 沙子 + 1 煤矿石', output: '4 玻璃', desc: '高温烧制沙子得到透明玻璃' }
        ]
      },
      {
        category: '工具与武器 (Tools & Weapons)',
        items: [
          { name: '铁镐 (Iron Pickaxe)', input: '3 铁矿石 + 2 木棍', output: '1 铁镐', desc: '顶部横排3个铁矿石，中间竖排2根木棍。开采速度极大提升' },
          { name: '钻石镐 (Diamond Pickaxe)', input: '3 钻石 + 2 木棍', output: '1 钻石镐', desc: '顶部3颗钻石，中间2根木棍。坚不可摧，可快速采集黑曜石' },
          { name: '钻石剑 (Diamond Sword)', input: '2 钻石 + 1 木棍', output: '1 钻石剑', desc: '竖排2颗钻石加底部1根木棍，造成7点高额近战伤害' }
        ]
      },
      {
        category: '特殊道具与生存 (Special Items & Survival)',
        items: [
          { name: '铁桶 (Bucket)', input: '3 铁矿石', output: '1 空铁桶', desc: '网格中放入3个铁矿石(V字或任意3格)。手持空桶对准水面或岩浆右键即可装桶！' },
          { name: '水桶 (Water Bucket)', input: '手持铁桶右键水面', output: '水桶', desc: '可在任意位置右键倒出水！也可在村民处兑换钻石' },
          { name: '岩浆桶 (Lava Bucket)', input: '手持铁桶右键下界岩浆', output: '岩浆桶', desc: '盛装炽热岩浆，可倒出作为光源或陷阱' },
          { name: '火把 (Torches)', input: '1 煤矿石 + 1 木棍 (或木板)', output: '4 火把', desc: '放置提供明亮照明，驱散黑暗与僵尸生成' },
          { name: 'TNT 炸药', input: '4 沙子 + 1 煤矿石', output: '1 TNT', desc: '放置后左键点击即可引爆，剧烈爆炸破坏大片方块！' },
          { name: '雕刻南瓜头 (Pumpkin)', input: '4 小黄花 + 1 泥土', output: '2 南瓜头', desc: '可作为发光万圣节头套，也可与村民交易钻石' }
        ]
      },
      {
        category: '下界传送门与维度 (Nether Dimension)',
        items: [
          { name: '黑曜石 (Obsidian)', input: '4 圆石 + 1 水桶', output: '2 黑曜石', desc: '冷水淬火硬化圆石形成黑曜石；或在下界与铁匠交易获取' },
          { name: '下界传送门方块 (Nether Portal)', input: '4 黑曜石 + 1 火把', output: '2 传送门方块', desc: '黑曜石注入火焰能量。放置后走入其中即可穿梭于【主世界】与【下界】之间！' }
        ]
      }
    ];
  }

  takeCraftingResult() {
    if (this.craftingResult.blockId === BLOCKS.AIR || this.craftingResult.count <= 0) return;

    // If heldItem is empty, pick up result to cursor
    if (!this.heldItem) {
      this.heldItem = { blockId: this.craftingResult.blockId, count: this.craftingResult.count };
    } else if (this.heldItem.blockId === this.craftingResult.blockId && this.heldItem.count + this.craftingResult.count <= 64) {
      this.heldItem.count += this.craftingResult.count;
    } else {
      // Put directly into inventory
      this.addItem(this.craftingResult.blockId, this.craftingResult.count);
    }
    this.audioEngine.playSound('click');

    // Consume 1 item from each non-empty crafting grid slot
    for (const slot of this.craftingGrid) {
      if (slot.blockId !== BLOCKS.AIR && slot.count > 0) {
        slot.count--;
        if (slot.count <= 0) {
          slot.blockId = BLOCKS.AIR;
        }
      }
    }

    this.checkCraftingRecipe();
  }
}
