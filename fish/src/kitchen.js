// Jellyfish Food Crafting & Kitchen Workshop (水母魔法料理厨房)

import { fishSound } from './sound.js';

export const RECIPES = [
  {
    id: 'pudding',
    name: '水晶水母布丁',
    icon: '🍮',
    desc: '水母大厨特调！Q弹软嫩，晶莹剔透，兰寿金鱼一见到就会摇尾巴抢着吃！',
    reqs: { gel: 2, nectar: 1 },
    effect: '饱食度 +40 · 开心度 +35 · 兰寿最爱'
  },
  {
    id: 'boba',
    name: '水母珍珠啵啵茶',
    icon: '🧋',
    desc: '含深海发光微粒，喝完鱼身四周会冒出五彩梦幻气泡，游动更轻快！',
    reqs: { gel: 1, pearl: 1, shrimp: 1 },
    effect: '饱食度 +30 · 喷吐彩虹气泡 · 速度提升'
  },
  {
    id: 'cracker',
    name: '发光海苔仙贝',
    icon: '🍘',
    desc: '精选深海脆海苔与鲜美小虾研磨烘烤，香脆可口，宠物鱼茁壮成长的营养餐。',
    reqs: { kelp: 2, shrimp: 1 },
    effect: '饱食度 +25 · 宠物经验 +35'
  },
  {
    id: 'cake',
    name: '深海荧光海星蛋糕',
    icon: '🍰',
    desc: '五层彩虹荧光霜糖大蛋糕！水族世界最高级的盛宴，吃完触发升级庆典！',
    reqs: { gel: 2, nectar: 2, pearl: 1 },
    effect: '饱食度 +60 · 开心度 +50 · 经验 +100'
  }
];

export class JellyfishKitchen {
  constructor(onFoodCooked) {
    this.onFoodCooked = onFoodCooked;
    // 玩家拥有的食材背包
    this.inventory = {
      gel: 8,      // 发光水母胶质
      kelp: 6,     // 深海脆海苔
      shrimp: 6,   // 七彩小虾米
      nectar: 5,   // 珊瑚蜜糖
      pearl: 4     // 珍珠亮粉
    };

    this.selectedRecipe = RECIPES[0];
    this.isCooking = false;
  }

  // 采集/补充食材
  gatherIngredients() {
    this.inventory.gel += Math.floor(2 + Math.random() * 3);
    this.inventory.kelp += Math.floor(2 + Math.random() * 3);
    this.inventory.shrimp += Math.floor(2 + Math.random() * 2);
    this.inventory.nectar += Math.floor(1 + Math.random() * 2);
    this.inventory.pearl += Math.floor(1 + Math.random() * 2);
    fishSound.playBubble();
  }

  canCook(recipe) {
    for (const [key, count] of Object.entries(recipe.reqs)) {
      if ((this.inventory[key] || 0) < count) {
        return false;
      }
    }
    return true;
  }

  cook(recipe, callback) {
    if (!this.canCook(recipe)) {
      return false;
    }

    // 扣除材料
    for (const [key, count] of Object.entries(recipe.reqs)) {
      this.inventory[key] -= count;
    }

    this.isCooking = true;
    fishSound.playBubble();

    setTimeout(() => {
      this.isCooking = false;
      fishSound.playCookDone();
      if (this.onFoodCooked) {
        this.onFoodCooked(recipe);
      }
      if (callback) callback(recipe);
    }, 1200);

    return true;
  }
}
