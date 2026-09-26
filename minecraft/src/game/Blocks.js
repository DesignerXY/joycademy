import * as THREE from 'three';

// Block ID definitions
export const BLOCKS = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  BEDROCK: 4,
  OAK_LOG: 5,
  OAK_LEAVES: 6,
  SAND: 7,
  WATER: 8,
  PLANKS: 9,
  COBBLESTONE: 10,
  COAL_ORE: 11,
  IRON_ORE: 12,
  DIAMOND_ORE: 13,
  CRAFTING_TABLE: 14,
  BRICKS: 15,
  GLASS: 16,
  TORCH: 17,
  TNT: 18,
  FLOWER: 19,
  STICK: 20,
  DIAMOND: 21,
  DIAMOND_SWORD: 22,
  PUMPKIN: 23,
  OBSIDIAN: 24,
  NETHERRACK: 25,
  GLOWSTONE: 26,
  NETHER_PORTAL: 27,
  LAVA: 28,
  BUCKET: 29,
  WATER_BUCKET: 30,
  LAVA_BUCKET: 31,
  IRON_PICKAXE: 32,
  DIAMOND_PICKAXE: 33
};

// Block Metadata
export const BLOCK_DEFS = {
  [BLOCKS.AIR]: { name: '空气', transparent: true, solid: false, hardness: 0 },
  [BLOCKS.GRASS]: { name: '草方块', transparent: false, solid: true, hardness: 0.6, sound: 'grass' },
  [BLOCKS.DIRT]: { name: '泥土', transparent: false, solid: true, hardness: 0.5, sound: 'gravel' },
  [BLOCKS.STONE]: { name: '石头', transparent: false, solid: true, hardness: 1.5, sound: 'stone' },
  [BLOCKS.BEDROCK]: { name: '基岩', transparent: false, solid: true, hardness: 999, sound: 'stone' },
  [BLOCKS.OAK_LOG]: { name: '橡木原木', transparent: false, solid: true, hardness: 2.0, sound: 'wood' },
  [BLOCKS.OAK_LEAVES]: { name: '橡木树叶', transparent: true, solid: true, hardness: 0.2, sound: 'grass' },
  [BLOCKS.SAND]: { name: '沙子', transparent: false, solid: true, hardness: 0.5, sound: 'sand' },
  [BLOCKS.WATER]: { name: '水', transparent: true, solid: false, hardness: 0, liquid: true, sound: 'water' },
  [BLOCKS.PLANKS]: { name: '橡木木板', transparent: false, solid: true, hardness: 2.0, sound: 'wood' },
  [BLOCKS.COBBLESTONE]: { name: '圆石', transparent: false, solid: true, hardness: 2.0, sound: 'stone' },
  [BLOCKS.COAL_ORE]: { name: '煤矿石', transparent: false, solid: true, hardness: 3.0, sound: 'stone' },
  [BLOCKS.IRON_ORE]: { name: '铁矿石', transparent: false, solid: true, hardness: 3.0, sound: 'stone' },
  [BLOCKS.DIAMOND_ORE]: { name: '钻石矿石', transparent: false, solid: true, hardness: 4.0, sound: 'stone' },
  [BLOCKS.CRAFTING_TABLE]: { name: '工作台', transparent: false, solid: true, hardness: 2.5, sound: 'wood' },
  [BLOCKS.BRICKS]: { name: '红砖', transparent: false, solid: true, hardness: 2.0, sound: 'stone' },
  [BLOCKS.GLASS]: { name: '玻璃', transparent: true, solid: true, hardness: 0.3, sound: 'glass' },
  [BLOCKS.TORCH]: { name: '火把', transparent: true, solid: false, hardness: 0, light: 14, sound: 'wood' },
  [BLOCKS.TNT]: { name: 'TNT', transparent: false, solid: true, hardness: 0, sound: 'grass' },
  [BLOCKS.FLOWER]: { name: '小黄花', transparent: true, solid: false, hardness: 0, sound: 'grass' },
  [BLOCKS.STICK]: { name: '木棍', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'wood' },
  [BLOCKS.DIAMOND]: { name: '钻石', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'stone' },
  [BLOCKS.DIAMOND_SWORD]: { name: '钻石剑', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'stone', isWeapon: true, attackDamage: 7 },
  [BLOCKS.PUMPKIN]: { name: '南瓜头', transparent: false, solid: true, hardness: 1.0, sound: 'wood' },
  [BLOCKS.OBSIDIAN]: { name: '黑曜石', transparent: false, solid: true, hardness: 25.0, sound: 'stone' },
  [BLOCKS.NETHERRACK]: { name: '下界岩', transparent: false, solid: true, hardness: 0.4, sound: 'stone' },
  [BLOCKS.GLOWSTONE]: { name: '荧石', transparent: false, solid: true, hardness: 0.3, light: 15, sound: 'glass' },
  [BLOCKS.NETHER_PORTAL]: { name: '下界传送门', transparent: true, solid: false, hardness: 0, light: 11, sound: 'glass' },
  [BLOCKS.LAVA]: { name: '岩浆', transparent: false, solid: false, hardness: 0, liquid: true, light: 15, sound: 'water' },
  [BLOCKS.BUCKET]: { name: '铁桶', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'stone' },
  [BLOCKS.WATER_BUCKET]: { name: '水桶', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'water' },
  [BLOCKS.LAVA_BUCKET]: { name: '岩浆桶', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'stone' },
  [BLOCKS.IRON_PICKAXE]: { name: '铁镐', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'stone', isTool: true },
  [BLOCKS.DIAMOND_PICKAXE]: { name: '钻石镐', transparent: true, solid: false, hardness: 0, isItem: true, sound: 'stone', isTool: true }
};

// Procedural Canvas Texture Generator
class TextureGenerator {
  static createPixelCanvas(width = 16, height = 16) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  }

  static addNoise(ctx, width, height, factor = 15) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * factor;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  static generateTexture(type, side = 'side') {
    const { canvas, ctx } = this.createPixelCanvas(16, 16);
    
    switch (type) {
      case BLOCKS.GRASS:
        if (side === 'top') {
          ctx.fillStyle = '#55a02e';
          ctx.fillRect(0, 0, 16, 16);
          this.addNoise(ctx, 16, 16, 25);
        } else if (side === 'bottom') {
          ctx.fillStyle = '#866043';
          ctx.fillRect(0, 0, 16, 16);
          this.addNoise(ctx, 16, 16, 20);
        } else {
          // Grass side with top green fringe
          ctx.fillStyle = '#866043';
          ctx.fillRect(0, 0, 16, 16);
          this.addNoise(ctx, 16, 16, 20);
          ctx.fillStyle = '#55a02e';
          ctx.fillRect(0, 0, 16, 4);
          for (let x = 0; x < 16; x += 2) {
            ctx.fillRect(x, 4, 1, Math.floor(Math.random() * 3) + 1);
          }
        }
        break;

      case BLOCKS.DIRT:
        ctx.fillStyle = '#866043';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 25);
        break;

      case BLOCKS.STONE:
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 30);
        break;

      case BLOCKS.BEDROCK:
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 80);
        break;

      case BLOCKS.OAK_LOG:
        if (side === 'top' || side === 'bottom') {
          ctx.fillStyle = '#ab8552';
          ctx.fillRect(0, 0, 16, 16);
          ctx.fillStyle = '#6b4e28';
          ctx.fillRect(3, 3, 10, 10);
          ctx.fillStyle = '#ab8552';
          ctx.fillRect(5, 5, 6, 6);
          this.addNoise(ctx, 16, 16, 15);
        } else {
          ctx.fillStyle = '#674d2b';
          ctx.fillRect(0, 0, 16, 16);
          ctx.fillStyle = '#48351c';
          for (let x = 0; x < 16; x += 4) {
            ctx.fillRect(x, 0, 2, 16);
          }
          this.addNoise(ctx, 16, 16, 20);
        }
        break;

      case BLOCKS.OAK_LEAVES:
        ctx.fillStyle = '#318020';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 40);
        // Cut out random pixels for transparent leaves
        const leavesData = ctx.getImageData(0, 0, 16, 16);
        for (let i = 0; i < leavesData.data.length; i += 16) {
          if (Math.random() < 0.25) leavesData.data[i + 3] = 180;
        }
        ctx.putImageData(leavesData, 0, 0);
        break;

      case BLOCKS.SAND:
        ctx.fillStyle = '#dbce9b';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 15);
        break;

      case BLOCKS.WATER:
        ctx.fillStyle = '#3f76e4';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 20);
        break;

      case BLOCKS.PLANKS:
        ctx.fillStyle = '#b8945f';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#7a5f39';
        ctx.fillRect(0, 3, 16, 1);
        ctx.fillRect(0, 7, 16, 1);
        ctx.fillRect(0, 11, 16, 1);
        ctx.fillRect(0, 15, 16, 1);
        this.addNoise(ctx, 16, 16, 15);
        break;

      case BLOCKS.COBBLESTONE:
        ctx.fillStyle = '#6b6b6b';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#484848';
        ctx.fillRect(0, 0, 8, 8);
        ctx.fillRect(8, 8, 8, 8);
        this.addNoise(ctx, 16, 16, 40);
        break;

      case BLOCKS.COAL_ORE:
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 20);
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(3, 4, 3, 3);
        ctx.fillRect(9, 3, 4, 3);
        ctx.fillRect(5, 10, 4, 3);
        ctx.fillRect(11, 11, 3, 3);
        break;

      case BLOCKS.IRON_ORE:
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 20);
        ctx.fillStyle = '#d8af93';
        ctx.fillRect(4, 3, 3, 3);
        ctx.fillRect(8, 5, 4, 3);
        ctx.fillRect(3, 11, 4, 3);
        ctx.fillRect(10, 10, 3, 3);
        break;

      case BLOCKS.DIAMOND_ORE:
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        this.addNoise(ctx, 16, 16, 20);
        ctx.fillStyle = '#4cede0';
        ctx.fillRect(4, 3, 3, 3);
        ctx.fillRect(9, 4, 4, 3);
        ctx.fillRect(3, 10, 4, 3);
        ctx.fillRect(11, 11, 3, 3);
        break;

      case BLOCKS.CRAFTING_TABLE:
        if (side === 'top') {
          ctx.fillStyle = '#b8945f';
          ctx.fillRect(0, 0, 16, 16);
          ctx.fillStyle = '#5c4524';
          ctx.fillRect(2, 2, 12, 12);
          ctx.fillStyle = '#9c733c';
          ctx.fillRect(4, 4, 8, 8);
          this.addNoise(ctx, 16, 16, 20);
        } else {
          ctx.fillStyle = '#b8945f';
          ctx.fillRect(0, 0, 16, 16);
          ctx.fillStyle = '#4d391e';
          ctx.fillRect(2, 4, 12, 8);
          this.addNoise(ctx, 16, 16, 20);
        }
        break;

      case BLOCKS.BRICKS:
        ctx.fillStyle = '#a04838';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#d0d0d0';
        ctx.fillRect(0, 3, 16, 1);
        ctx.fillRect(0, 7, 16, 1);
        ctx.fillRect(0, 11, 16, 1);
        ctx.fillRect(0, 15, 16, 1);
        ctx.fillRect(7, 0, 1, 4);
        ctx.fillRect(15, 4, 1, 4);
        ctx.fillRect(7, 8, 1, 4);
        ctx.fillRect(15, 12, 1, 4);
        this.addNoise(ctx, 16, 16, 15);
        break;

      case BLOCKS.GLASS:
        ctx.fillStyle = 'rgba(220, 240, 255, 0.3)';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 16, 1);
        ctx.fillRect(0, 0, 1, 16);
        ctx.fillRect(15, 0, 1, 16);
        ctx.fillRect(0, 15, 16, 1);
        ctx.fillRect(3, 3, 2, 2);
        ctx.fillRect(10, 11, 2, 2);
        break;

      case BLOCKS.TNT:
        if (side === 'top' || side === 'bottom') {
          ctx.fillStyle = '#d63031';
          ctx.fillRect(0, 0, 16, 16);
          ctx.fillStyle = '#636e72';
          ctx.fillRect(4, 4, 8, 8);
          ctx.fillStyle = '#2d3436';
          ctx.fillRect(7, 7, 2, 2);
          this.addNoise(ctx, 16, 16, 15);
        } else {
          // Red top and bottom, white label band in middle with TNT
          ctx.fillStyle = '#d63031';
          ctx.fillRect(0, 0, 16, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 4, 16, 8);
          ctx.fillStyle = '#000000';
          // Draw 'T'
          ctx.fillRect(2, 6, 3, 1);
          ctx.fillRect(3, 7, 1, 3);
          // Draw 'N'
          ctx.fillRect(6, 6, 1, 4);
          ctx.fillRect(7, 7, 1, 2);
          ctx.fillRect(8, 6, 1, 4);
          // Draw 'T'
          ctx.fillRect(11, 6, 3, 1);
          ctx.fillRect(12, 7, 1, 3);
          this.addNoise(ctx, 16, 16, 10);
        }
        break;

      case BLOCKS.TORCH:
        ctx.clearRect(0, 0, 16, 16);
        // Stick
        ctx.fillStyle = '#7a5f39';
        ctx.fillRect(7, 6, 2, 10);
        // Flame
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(6, 3, 4, 4);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(7, 2, 2, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(7, 4, 2, 1);
        break;

      case BLOCKS.FLOWER:
        ctx.clearRect(0, 0, 16, 16);
        // Stem
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(7, 7, 2, 9);
        ctx.fillRect(5, 11, 2, 2);
        // Flower Petals
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(5, 3, 6, 6);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(7, 5, 2, 2);
        break;

      case BLOCKS.STICK:
        ctx.clearRect(0, 0, 16, 16);
        for (let i = 0; i < 9; i++) {
          const x = 4 + i;
          const y = 11 - i;
          ctx.fillStyle = '#56381b';
          ctx.fillRect(x, y + 1, 1, 1);
          ctx.fillStyle = '#8e6239';
          ctx.fillRect(x, y, 1, 1);
          ctx.fillStyle = '#b68551';
          ctx.fillRect(x + 1, y, 1, 1);
        }
        break;

      case BLOCKS.DIAMOND: {
        ctx.clearRect(0, 0, 16, 16);
        const diamondOutline = [
          [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4],
          [4, 5], [11, 5],
          [3, 6], [12, 6],
          [3, 7], [12, 7],
          [4, 8], [11, 8],
          [5, 9], [10, 9],
          [6, 10], [9, 10],
          [7, 11], [8, 11]
        ];
        ctx.fillStyle = '#1b5f66';
        diamondOutline.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        
        ctx.fillStyle = '#37d6d6';
        ctx.fillRect(5, 5, 6, 1);
        ctx.fillRect(4, 6, 8, 2);
        ctx.fillRect(5, 8, 6, 1);
        ctx.fillRect(6, 9, 4, 1);
        ctx.fillRect(7, 10, 2, 1);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(6, 5, 2, 1);
        ctx.fillRect(5, 6, 2, 2);
        ctx.fillStyle = '#abffff';
        ctx.fillRect(8, 5, 2, 1);
        ctx.fillRect(7, 6, 3, 1);
        
        ctx.fillStyle = '#1a8b94';
        ctx.fillRect(9, 7, 2, 1);
        ctx.fillRect(7, 8, 3, 1);
        ctx.fillRect(7, 9, 2, 1);
        break;
      }

      case BLOCKS.DIAMOND_SWORD: {
        ctx.clearRect(0, 0, 16, 16);
        // Pommel & Handle
        ctx.fillStyle = '#4e3319';
        ctx.fillRect(2, 13, 2, 2);
        ctx.fillRect(3, 12, 1, 1);
        ctx.fillRect(4, 11, 1, 1);
        ctx.fillStyle = '#8f683a';
        ctx.fillRect(3, 13, 1, 1);
        ctx.fillRect(4, 12, 1, 1);

        // Guard
        ctx.fillStyle = '#1b5f66';
        ctx.fillRect(2, 10, 2, 1);
        ctx.fillRect(3, 9, 1, 2);
        ctx.fillRect(5, 11, 2, 1);
        ctx.fillRect(6, 12, 1, 2);
        ctx.fillStyle = '#37d6d6';
        ctx.fillRect(3, 10, 2, 2);
        ctx.fillRect(5, 12, 1, 1);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, 10, 1, 1);

        // Blade
        for (let i = 0; i < 7; i++) {
          const bx = 6 + i;
          const by = 8 - i;
          ctx.fillStyle = '#1b5f66';
          ctx.fillRect(bx - 1, by, 1, 1);
          ctx.fillRect(bx, by + 1, 1, 1);
          ctx.fillStyle = '#37d6d6';
          ctx.fillRect(bx, by, 1, 1);
          ctx.fillStyle = '#d0ffff';
          ctx.fillRect(bx, by - 1, 1, 1);
        }
        // Tip
        ctx.fillStyle = '#1b5f66';
        ctx.fillRect(13, 1, 1, 1);
        ctx.fillRect(14, 1, 1, 1);
        ctx.fillRect(14, 2, 1, 1);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(13, 2, 1, 1);
        break;
      }

      case BLOCKS.PUMPKIN: {
        ctx.fillStyle = '#d35400';
        ctx.fillRect(0, 0, 16, 16);
        // Vertical ribs
        ctx.fillStyle = '#ba4a00';
        ctx.fillRect(3, 0, 1, 16);
        ctx.fillRect(7, 0, 1, 16);
        ctx.fillRect(11, 0, 1, 16);
        ctx.fillRect(15, 0, 1, 16);
        this.addNoise(ctx, 16, 16, 15);

        if (side === 'top' || side === 'bottom') {
          // Pumpkin stem
          ctx.fillStyle = '#27ae60';
          ctx.fillRect(7, 7, 2, 2);
          ctx.fillStyle = '#1e8449';
          ctx.fillRect(6, 7, 1, 2);
        } else if (side === 'front') {
          // Carved Jack-o'-Lantern Face
          ctx.fillStyle = '#200900';
          // Triangle eyes
          ctx.fillRect(3, 4, 3, 3);
          ctx.fillRect(10, 4, 3, 3);
          // Triangle nose
          ctx.fillRect(7, 7, 2, 2);
          // Jagged toothy mouth
          ctx.fillRect(3, 11, 10, 3);
          // Teeth cutouts
          ctx.fillStyle = '#d35400';
          ctx.fillRect(5, 11, 2, 1);
          ctx.fillRect(9, 11, 2, 1);
          ctx.fillRect(7, 13, 2, 1);

          // Glowing inner highlights
          ctx.fillStyle = '#f39c12';
          ctx.fillRect(4, 5, 1, 1);
          ctx.fillRect(11, 5, 1, 1);
          ctx.fillRect(4, 12, 1, 1);
          ctx.fillRect(11, 12, 1, 1);
        }
        break;
      }

      case BLOCKS.OBSIDIAN: {
        ctx.fillStyle = '#120d1c';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#2b1b3d';
        for (let i = 0; i < 18; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        ctx.fillStyle = '#452b69';
        for (let i = 0; i < 8; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        this.addNoise(ctx, 16, 16, 25);
        break;
      }

      case BLOCKS.NETHERRACK: {
        ctx.fillStyle = '#6f1b1b';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#4c1010';
        for (let i = 0; i < 24; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        ctx.fillStyle = '#8f2929';
        for (let i = 0; i < 16; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        this.addNoise(ctx, 16, 16, 30);
        break;
      }

      case BLOCKS.GLOWSTONE: {
        ctx.fillStyle = '#d49b45';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#fce588';
        for (let i = 0; i < 28; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        ctx.fillStyle = '#8f5c1d';
        for (let i = 0; i < 14; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        this.addNoise(ctx, 16, 16, 20);
        break;
      }

      case BLOCKS.NETHER_PORTAL: {
        ctx.fillStyle = '#4a0e78';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#842cb8';
        for (let y = 0; y < 16; y++) {
          const shift = Math.floor(Math.sin(y * 0.8) * 3) + 7;
          ctx.fillRect((shift) % 16, y, 3, 1);
        }
        ctx.fillStyle = '#c568f8';
        for (let i = 0; i < 14; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        break;
      }

      case BLOCKS.LAVA: {
        ctx.fillStyle = '#cf4608';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#e87b12';
        for (let i = 0; i < 30; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        ctx.fillStyle = '#f1c40f';
        for (let i = 0; i < 12; i++) {
          ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
        }
        break;
      }

      case BLOCKS.BUCKET: {
        ctx.clearRect(0, 0, 16, 16);
        // Iron Bucket Outline & Body
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(4, 4, 8, 1);
        ctx.fillRect(3, 5, 2, 7);
        ctx.fillRect(11, 5, 2, 7);
        ctx.fillRect(5, 12, 6, 2);
        
        ctx.fillStyle = '#c5c5c5';
        ctx.fillRect(5, 5, 6, 7);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(5, 5, 2, 7);
        ctx.fillStyle = '#8e8e8e';
        ctx.fillRect(9, 7, 2, 5);
        break;
      }

      case BLOCKS.WATER_BUCKET: {
        ctx.clearRect(0, 0, 16, 16);
        // Bucket
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(4, 4, 8, 1);
        ctx.fillRect(3, 5, 2, 7);
        ctx.fillRect(11, 5, 2, 7);
        ctx.fillRect(5, 12, 6, 2);
        
        ctx.fillStyle = '#c5c5c5';
        ctx.fillRect(5, 5, 6, 7);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(5, 5, 2, 7);
        // Water inside
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(5, 6, 6, 4);
        ctx.fillStyle = '#3498db';
        ctx.fillRect(6, 6, 4, 2);
        ctx.fillStyle = '#a9cce3';
        ctx.fillRect(7, 6, 2, 1);
        break;
      }

      case BLOCKS.LAVA_BUCKET: {
        ctx.clearRect(0, 0, 16, 16);
        // Bucket
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(4, 4, 8, 1);
        ctx.fillRect(3, 5, 2, 7);
        ctx.fillRect(11, 5, 2, 7);
        ctx.fillRect(5, 12, 6, 2);
        
        ctx.fillStyle = '#c5c5c5';
        ctx.fillRect(5, 5, 6, 7);
        // Lava inside
        ctx.fillStyle = '#cf4608';
        ctx.fillRect(5, 6, 6, 4);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(6, 6, 4, 2);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(7, 6, 2, 1);
        break;
      }

      case BLOCKS.IRON_PICKAXE: {
        ctx.clearRect(0, 0, 16, 16);
        // Wooden handle
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = '#6b4c2b';
          ctx.fillRect(4 + i, 12 - i, 1, 1);
          ctx.fillStyle = '#9e7343';
          ctx.fillRect(4 + i + 1, 12 - i, 1, 1);
        }
        // Iron Pick Head
        ctx.fillStyle = '#333333';
        ctx.fillRect(8, 2, 6, 2);
        ctx.fillRect(12, 3, 2, 3);
        ctx.fillRect(6, 4, 3, 2);
        ctx.fillStyle = '#dcdde1';
        ctx.fillRect(9, 2, 4, 2);
        ctx.fillRect(12, 4, 2, 2);
        ctx.fillRect(7, 4, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 2, 2, 1);
        break;
      }

      case BLOCKS.DIAMOND_PICKAXE: {
        ctx.clearRect(0, 0, 16, 16);
        // Wooden handle
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = '#6b4c2b';
          ctx.fillRect(4 + i, 12 - i, 1, 1);
          ctx.fillStyle = '#9e7343';
          ctx.fillRect(4 + i + 1, 12 - i, 1, 1);
        }
        // Diamond Pick Head
        ctx.fillStyle = '#1b5f66';
        ctx.fillRect(8, 2, 6, 2);
        ctx.fillRect(12, 3, 2, 3);
        ctx.fillRect(6, 4, 3, 2);
        ctx.fillStyle = '#37d6d6';
        ctx.fillRect(9, 2, 4, 2);
        ctx.fillRect(12, 4, 2, 2);
        ctx.fillRect(7, 4, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 2, 2, 1);
        break;
      }

      default:
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, 16, 16);
        break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}

// Pre-create material textures dictionary
export class BlockMaterialManager {
  constructor() {
    this.textures = {};
    this.materials = {};
    this.colors = {};
    this.initMaterials();
  }

  initMaterials() {
    for (const [key, id] of Object.entries(BLOCKS)) {
      if (id === BLOCKS.AIR) continue;

      const def = BLOCK_DEFS[id];

      // Standard cube sides: [px (+X), nx (-X), py (+Y Top), ny (-Y Bottom), pz (+Z), nz (-Z)]
      if (id === BLOCKS.GRASS) {
        const top = TextureGenerator.generateTexture(id, 'top');
        const bottom = TextureGenerator.generateTexture(id, 'bottom');
        const side = TextureGenerator.generateTexture(id, 'side');

        const matSide = new THREE.MeshStandardMaterial({ map: side, roughness: 0.8 });
        const matTop = new THREE.MeshStandardMaterial({ map: top, roughness: 0.8 });
        const matBottom = new THREE.MeshStandardMaterial({ map: bottom, roughness: 0.8 });

        this.materials[id] = [matSide, matSide, matTop, matBottom, matSide, matSide];
        this.colors[id] = 0x55a02e;
      } else if (id === BLOCKS.OAK_LOG || id === BLOCKS.CRAFTING_TABLE) {
        const top = TextureGenerator.generateTexture(id, 'top');
        const side = TextureGenerator.generateTexture(id, 'side');

        const matSide = new THREE.MeshStandardMaterial({ map: side, roughness: 0.8 });
        const matTop = new THREE.MeshStandardMaterial({ map: top, roughness: 0.8 });

        this.materials[id] = [matSide, matSide, matTop, matTop, matSide, matSide];
        this.colors[id] = id === BLOCKS.OAK_LOG ? 0x674d2b : 0xb8945f;
      } else if (id === BLOCKS.TNT) {
        const top = TextureGenerator.generateTexture(id, 'top');
        const side = TextureGenerator.generateTexture(id, 'side');

        const matSide = new THREE.MeshStandardMaterial({ map: side, roughness: 0.8 });
        const matTop = new THREE.MeshStandardMaterial({ map: top, roughness: 0.8 });

        this.materials[id] = [matSide, matSide, matTop, matTop, matSide, matSide];
        this.colors[id] = 0xd63031;
      } else if (id === BLOCKS.PUMPKIN) {
        const top = TextureGenerator.generateTexture(id, 'top');
        const side = TextureGenerator.generateTexture(id, 'side');
        const front = TextureGenerator.generateTexture(id, 'front');

        const matSide = new THREE.MeshStandardMaterial({ map: side, roughness: 0.8 });
        const matTop = new THREE.MeshStandardMaterial({ map: top, roughness: 0.8 });
        const matFront = new THREE.MeshStandardMaterial({ map: front, roughness: 0.8 });

        // Standard cube sides: [px (+X), nx (-X), py (+Y Top), ny (-Y Bottom), pz (+Z Front), nz (-Z)]
        this.materials[id] = [matSide, matSide, matTop, matTop, matFront, matSide];
        this.colors[id] = 0xd35400;
      } else if (id === BLOCKS.NETHER_PORTAL) {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          opacity: 0.78,
          emissive: 0x8e44ad,
          emissiveIntensity: 0.85,
          side: THREE.DoubleSide
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];
        this.colors[id] = 0x8e44ad;
      } else if (id === BLOCKS.LAVA) {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          emissive: 0xd35400,
          emissiveIntensity: 0.8,
          roughness: 0.2
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];
        this.colors[id] = 0xe67e22;
      } else if (id === BLOCKS.GLOWSTONE) {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          emissive: 0xf1c40f,
          emissiveIntensity: 0.6,
          roughness: 0.5
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];
        this.colors[id] = 0xf39c12;
      } else if (id === BLOCKS.WATER || id === BLOCKS.GLASS) {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          opacity: id === BLOCKS.WATER ? 0.65 : 0.8,
          roughness: 0.1,
          depthWrite: id !== BLOCKS.WATER
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];
        this.colors[id] = id === BLOCKS.WATER ? 0x3f76e4 : 0xdcf0ff;
      } else if (id === BLOCKS.TORCH) {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.5,
          emissive: 0xffaa22,
          emissiveIntensity: 0.6
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];
        this.colors[id] = 0xf1c40f;
      } else if (id === BLOCKS.FLOWER || def.isItem) {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.5,
          side: THREE.DoubleSide
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];
        const itemColors = {
          [BLOCKS.STICK]: 0x8e6239,
          [BLOCKS.DIAMOND]: 0x37d6d6,
          [BLOCKS.DIAMOND_SWORD]: 0x37d6d6,
          [BLOCKS.BUCKET]: 0xdcdde1,
          [BLOCKS.WATER_BUCKET]: 0x3498db,
          [BLOCKS.LAVA_BUCKET]: 0xe67e22,
          [BLOCKS.IRON_PICKAXE]: 0xdcdde1,
          [BLOCKS.DIAMOND_PICKAXE]: 0x37d6d6,
          [BLOCKS.FLOWER]: 0xf1c40f
        };
        this.colors[id] = itemColors[id] || 0xf1c40f;
      } else {
        const tex = TextureGenerator.generateTexture(id, 'side');
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: def.transparent,
          roughness: 0.9
        });
        this.materials[id] = [mat, mat, mat, mat, mat, mat];

        const colorMap = {
          [BLOCKS.DIRT]: 0x866043,
          [BLOCKS.STONE]: 0x808080,
          [BLOCKS.BEDROCK]: 0x333333,
          [BLOCKS.OAK_LEAVES]: 0x318020,
          [BLOCKS.SAND]: 0xdbce9b,
          [BLOCKS.PLANKS]: 0xb8945f,
          [BLOCKS.COBBLESTONE]: 0x6b6b6b,
          [BLOCKS.COAL_ORE]: 0x222222,
          [BLOCKS.IRON_ORE]: 0xd8af93,
          [BLOCKS.DIAMOND_ORE]: 0x4cede0,
          [BLOCKS.BRICKS]: 0xa04838,
          [BLOCKS.STICK]: 0x8e6239,
          [BLOCKS.DIAMOND]: 0x37d6d6,
          [BLOCKS.DIAMOND_SWORD]: 0x37d6d6,
          [BLOCKS.PUMPKIN]: 0xd35400,
          [BLOCKS.OBSIDIAN]: 0x241438,
          [BLOCKS.NETHERRACK]: 0x6f1b1b,
          [BLOCKS.GLOWSTONE]: 0xf1c40f
        };
        this.colors[id] = colorMap[id] || 0x888888;
      }

      // Store single texture icon for HUD inventory
      this.textures[id] = TextureGenerator.generateTexture(id, id === BLOCKS.PUMPKIN ? 'front' : (id === BLOCKS.GRASS ? 'side' : 'side')).image.toDataURL();
    }
  }

  getMaterials(blockId) {
    return this.materials[blockId] || this.materials[BLOCKS.DIRT];
  }

  getTextureURL(blockId) {
    return this.textures[blockId] || '';
  }
}
