// Aquarium Engine: Fish Physics, Swimming Animation, Feeding & Pet Interactions

import { fishSound } from './sound.js';

export const SPECIES_CATALOG = [
  {
    id: 'ranchu',
    name: '红白肉瘤兰寿',
    title: '主角 · 憨态可掬的胖嘟嘟金鱼王',
    symbol: '🦁',
    color: '#ff4d4f',
    secondaryColor: '#ffffff',
    wenColor: '#ff2a2d', // 头瘤肉瘤色
    bodyShape: 'round',
    speed: 3.2,
    desc: '日本金鱼之王，短圆蛋形身材，没有背鳍，头顶覆盖饱满可爱的草莓状肉瘤，摆起短尾巴一扭一扭，极具治愈感！'
  },
  {
    id: 'koi',
    name: '幸运三色锦鲤',
    title: '游姿高雅的祥瑞神鱼',
    symbol: '🎏',
    color: '#fa8c16',
    secondaryColor: '#ffffff',
    bodyShape: 'streamline',
    speed: 4.0,
    desc: '流线型修长身躯，红黑白三色斑纹相映成趣，两条灵动的长鱼须，象征好运与健康成长！'
  },
  {
    id: 'clownfish',
    name: '透红条纹小丑鱼',
    title: '海葵守护者 · 活泼小海仙',
    symbol: '🎪',
    color: '#ff7a45',
    secondaryColor: '#ffffff',
    bodyShape: 'medium',
    speed: 3.6,
    desc: '经典的小丑鱼，亮橙色带有三道珍珠白斑纹，最喜欢在水母与海葵触手间捉迷藏！'
  },
  {
    id: 'angelfish',
    name: '月光黑白神仙鱼',
    title: '芭蕾舞者 · 燕尾贵族',
    symbol: '🌙',
    color: '#722ed1',
    secondaryColor: '#d3adf7',
    bodyShape: 'tall',
    speed: 3.4,
    desc: '像风筝一样高耸的背鳍与腹鳍，轻柔舒展如黑色丝绸，在珊瑚丛中跳着优雅的海底华尔兹。'
  },
  {
    id: 'pufferfish',
    name: '圆球刺豚河鲀',
    title: '吸水变大气球的防御萌怪',
    symbol: '🐡',
    color: '#fadb14',
    secondaryColor: '#d48806',
    bodyShape: 'puffer',
    speed: 2.8,
    desc: '平时是一只悠哉的小胖鱼，遇到惊险就会咕咚吸饱海水变成浑身带软刺的圆滚滚气球！'
  },
  {
    id: 'jellyfish',
    name: '深海荧光小水母',
    title: '奇幻发光大厨 · 飘逸精灵',
    symbol: '🪼',
    color: '#13c2c2',
    secondaryColor: '#87e8de',
    bodyShape: 'jelly',
    speed: 2.5,
    desc: '半透明的伞状体一张一缩，拖着发光的触须，掌握制作水晶水母布丁的神奇秘方！'
  }
];

export class AquariumEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 800;
    this.height = 500;

    // 玩家控制的鱼
    this.playerSpeciesId = 'ranchu';
    this.player = null;

    // 水族箱生态系统
    this.petFishes = [];
    this.foodItems = [];
    this.bubbles = [];
    this.hearts = [];
    this.seaweeds = [];

    // 宠物数据统计
    this.petStats = {
      level: 1,
      exp: 0,
      hunger: 80, // 0 - 100
      happiness: 85, // 0 - 100
      affection: 20
    };

    // 输入控制
    this.keys = {};
    this.mouseTarget = null;
    this.isMouseDown = false;

    this.animId = null;
    this.lastTime = 0;

    this.init();
  }

  init() {
    this.resize();
    this.initPlayer();
    this.initPets();
    this.initEnvironment();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    this.animId = requestAnimationFrame(this.animate);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth || 800;
    const h = parent.clientHeight || 500;

    this.width = w;
    this.height = h;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.scale(dpr, dpr);
  }

  initPlayer() {
    const species = SPECIES_CATALOG.find(s => s.id === this.playerSpeciesId) || SPECIES_CATALOG[0];
    this.player = {
      species: species,
      x: this.width * 0.4,
      y: this.height * 0.5,
      vx: 0,
      vy: 0,
      angle: 0,
      targetAngle: 0,
      tailPhase: 0,
      scale: 1.0,
      isPuffed: false,
      isPlayer: true
    };
  }

  switchSpecies(speciesId) {
    const species = SPECIES_CATALOG.find(s => s.id === speciesId);
    if (!species) return;
    this.playerSpeciesId = speciesId;
    this.player.species = species;
    fishSound.playBubble();
  }

  initPets() {
    // 放入几只其他悠闲漫游的宠物鱼伴侣
    const otherSpecies = SPECIES_CATALOG.filter(s => s.id !== this.playerSpeciesId);
    this.petFishes = [];
    for (let i = 0; i < 4; i++) {
      const sp = otherSpecies[i % otherSpecies.length];
      this.petFishes.push({
        species: sp,
        x: Math.random() * (this.width - 100) + 50,
        y: Math.random() * (this.height - 120) + 60,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.0,
        angle: 0,
        tailPhase: Math.random() * Math.PI * 2,
        scale: 0.75 + Math.random() * 0.25,
        wanderTimer: Math.random() * 3,
        isPlayer: false
      });
    }
  }

  initEnvironment() {
    // 海底摇曳海藻
    this.seaweeds = [];
    const count = Math.floor(this.width / 50);
    for (let i = 0; i < count; i++) {
      this.seaweeds.push({
        x: i * 50 + (Math.random() - 0.5) * 20,
        height: 80 + Math.random() * 120,
        phase: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? '#10b981' : '#059669',
        width: 12 + Math.random() * 8
      });
    }

    // 初始环境漂浮气泡
    this.bubbles = [];
    for (let i = 0; i < 25; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 2 + Math.random() * 5,
        speed: 0.5 + Math.random() * 1.2,
        wobble: Math.random() * Math.PI * 2
      });
    }
  }

  bindEvents() {
    // 键盘监听
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // 鼠标/触控交互
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handlePointerClick(x, y);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseTarget = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    // 触控支持
    this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch) {
        const rect = this.canvas.getBoundingClientRect();
        this.handlePointerClick(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    }, { passive: true });
  }

  handlePointerClick(x, y) {
    // 检查是否点击抚摸鱼鱼 (爱心互动)
    let petted = false;
    const allFishes = [this.player, ...this.petFishes];
    for (const f of allFishes) {
      const dist = Math.hypot(f.x - x, f.y - y);
      if (dist < 45 * f.scale) {
        this.spawnHeart(f.x, f.y - 20);
        fishSound.playHeart();
        this.petStats.happiness = Math.min(100, this.petStats.happiness + 6);
        this.petStats.affection += 2;
        petted = true;
        break;
      }
    }

    if (!petted) {
      // 点击水域产生涟漪和水泡，并引导主角游过来
      this.mouseTarget = { x, y };
      this.spawnBubble(x, y, 6);
      fishSound.playBubble();
    }
  }

  // 投喂食物 (可投喂普通鱼粮或特制水母美食)
  dropFood(foodType = 'pellet') {
    const types = {
      pellet: { name: '营养小虾粒', color: '#f97316', hungerVal: 15, expVal: 10, icon: '🦐' },
      pudding: { name: '水晶水母布丁', color: '#38bdf8', hungerVal: 35, expVal: 30, icon: '🍮' },
      boba: { name: '水母珍珠啵啵', color: '#c084fc', hungerVal: 25, expVal: 20, icon: '🧋' },
      cake: { name: '海星发光蛋糕', color: '#f43f5e', hungerVal: 50, expVal: 60, icon: '🍰' }
    };

    const info = types[foodType] || types.pellet;
    const x = Math.random() * (this.width - 120) + 60;
    this.foodItems.push({
      x: x,
      y: 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.8 + Math.random() * 0.6,
      r: 8,
      ...info
    });

    fishSound.playBubble();
  }

  spawnHeart(x, y) {
    this.hearts.push({
      x,
      y,
      vy: -1.2,
      opacity: 1.0,
      scale: 0.8 + Math.random() * 0.4
    });
  }

  spawnBubble(x, y, count = 1) {
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        r: 3 + Math.random() * 5,
        speed: 1.0 + Math.random() * 1.5,
        wobble: Math.random() * Math.PI * 2
      });
    }
  }

  animate(time) {
    const dt = Math.min(0.1, (time - this.lastTime) / 1000 || 0.016);
    this.lastTime = time;

    this.update(dt);
    this.render();

    this.animId = requestAnimationFrame(this.animate);
  }

  update(dt) {
    // 1. 更新主角移动
    const p = this.player;
    let ax = 0;
    let ay = 0;
    const speed = p.species.speed * 45;

    // 键盘驱动
    if (this.keys['w'] || this.keys['arrowup']) ay -= speed;
    if (this.keys['s'] || this.keys['arrowdown']) ay += speed;
    if (this.keys['a'] || this.keys['arrowleft']) ax -= speed;
    if (this.keys['d'] || this.keys['arrowright']) ax += speed;

    // 鼠标按住时吸引
    if (this.isMouseDown && this.mouseTarget) {
      const dx = this.mouseTarget.x - p.x;
      const dy = this.mouseTarget.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 15) {
        ax += (dx / dist) * speed * 1.2;
        ay += (dy / dist) * speed * 1.2;
      }
    }

    p.vx += ax * dt;
    p.vy += ay * dt;

    // 水阻尼
    p.vx *= 0.94;
    p.vy *= 0.94;

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // 边界碰撞弹回
    const pad = 35;
    if (p.x < pad) { p.x = pad; p.vx *= -0.5; }
    if (p.x > this.width - pad) { p.x = this.width - pad; p.vx *= -0.5; }
    if (p.y < pad) { p.y = pad; p.vy *= -0.5; }
    if (p.y > this.height - pad) { p.y = this.height - pad; p.vy *= -0.5; }

    // 鱼体旋转方向与摆尾频率
    const curSpeed = Math.hypot(p.vx, p.vy);
    if (curSpeed > 0.5) {
      p.targetAngle = Math.atan2(p.vy, p.vx);
    }
    // 平滑朝向插值
    p.angle = this.lerpAngle(p.angle, p.targetAngle, 0.12);
    p.tailPhase += (curSpeed * 0.08 + 1.8) * dt * 10;

    // 游动时偶尔在尾部吐小气泡
    if (curSpeed > 8 && Math.random() < 0.25) {
      const tailX = p.x - Math.cos(p.angle) * 30;
      const tailY = p.y - Math.sin(p.angle) * 30;
      this.spawnBubble(tailX, tailY, 1);
    }

    // 2. 更新其他宠物鱼游动与食物搜寻
    this.petFishes.forEach(pet => {
      pet.wanderTimer -= dt;
      if (pet.wanderTimer <= 0) {
        pet.wanderTimer = 2 + Math.random() * 3;
        pet.vx = (Math.random() - 0.5) * 2.5;
        pet.vy = (Math.random() - 0.5) * 1.5;
      }

      // 如果有沉落的食物，小鱼会兴奋地游向最近的食物！
      if (this.foodItems.length > 0) {
        let nearestFood = null;
        let minDist = 220;
        this.foodItems.forEach(f => {
          const d = Math.hypot(f.x - pet.x, f.y - pet.y);
          if (d < minDist) {
            minDist = d;
            nearestFood = f;
          }
        });
        if (nearestFood) {
          const dx = nearestFood.x - pet.x;
          const dy = nearestFood.y - pet.y;
          pet.vx += (dx / minDist) * 1.8;
          pet.vy += (dy / minDist) * 1.8;
        }
      }

      pet.vx *= 0.96;
      pet.vy *= 0.96;
      pet.x += pet.vx;
      pet.y += pet.vy;

      if (pet.x < pad) { pet.x = pad; pet.vx *= -1; }
      if (pet.x > this.width - pad) { pet.x = this.width - pad; pet.vx *= -1; }
      if (pet.y < pad) { pet.y = pad; pet.vy *= -1; }
      if (pet.y > this.height - pad) { pet.y = this.height - pad; pet.vy *= -1; }

      const spd = Math.hypot(pet.vx, pet.vy);
      if (spd > 0.2) {
        pet.angle = Math.atan2(pet.vy, pet.vx);
      }
      pet.tailPhase += (spd * 0.1 + 1.5) * dt * 8;
    });

    // 3. 更新食物沉落与吞食检测
    const remainFoods = [];
    this.foodItems.forEach(food => {
      food.y += food.vy;
      food.x += food.vx;

      let eaten = false;
      const allFishes = [this.player, ...this.petFishes];
      for (const fish of allFishes) {
        const d = Math.hypot(fish.x - food.x, fish.y - food.y);
        if (d < 30 * fish.scale) {
          // 吃掉食物！
          eaten = true;
          fishSound.playEat();
          this.spawnHeart(fish.x, fish.y - 15);
          this.petStats.hunger = Math.min(100, this.petStats.hunger + food.hungerVal);
          this.petStats.exp += food.expVal;
          if (this.petStats.exp >= 100 * this.petStats.level) {
            this.petStats.level++;
            fishSound.playCookDone();
          }
          break;
        }
      }

      // 未被吃掉且未沉底则继续保留
      if (!eaten && food.y < this.height - 20) {
        remainFoods.push(food);
      }
    });
    this.foodItems = remainFoods;

    // 4. 更新气泡上升
    this.bubbles.forEach(b => {
      b.y -= b.speed;
      b.x += Math.sin(b.wobble) * 0.4;
      b.wobble += 0.05;
      if (b.y < -10) {
        b.y = this.height + 10;
        b.x = Math.random() * this.width;
      }
    });

    // 5. 更新爱心浮动
    const remainHearts = [];
    this.hearts.forEach(h => {
      h.y += h.vy;
      h.opacity -= dt * 0.8;
      if (h.opacity > 0) {
        remainHearts.push(h);
      }
    });
    this.hearts = remainHearts;

    // 6. 饥饿度缓慢消耗
    this.petStats.hunger = Math.max(0, this.petStats.hunger - dt * 0.4);
  }

  lerpAngle(a, b, t) {
    const diff = (b - a + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    return a + diff * t;
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. 水族箱深蓝渐变水体背景
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#0284c7'); // 表层阳光海蓝
    oceanGrad.addColorStop(0.5, '#0369a1');
    oceanGrad.addColorStop(1, '#0c2340'); // 深处幽蓝
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. 丁达尔神光 (God Rays 光束从水面透下)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(w * (0.15 + i * 0.25), 0);
      ctx.lineTo(w * (0.05 + i * 0.28), h);
      ctx.lineTo(w * (0.2 + i * 0.28), h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. 绘制海底沙滩与海草
    this.drawSeabed(ctx, w, h);

    // 4. 绘制漂浮水泡
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    this.bubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 5. 绘制沉落的食物颗粒
    this.foodItems.forEach(f => {
      ctx.save();
      ctx.font = '16px serif';
      ctx.fillText(f.icon, f.x - 8, f.y);
      ctx.restore();
    });

    // 6. 绘制所有宠物鱼伴侣
    this.petFishes.forEach(f => {
      this.drawFish(ctx, f);
    });

    // 7. 绘制主角鱼 (带专属发光脚底环与小皇冠)
    this.drawFish(ctx, this.player);

    // 8. 绘制浮动爱心
    this.hearts.forEach(h => {
      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.font = `${Math.floor(20 * h.scale)}px serif`;
      ctx.fillText('💖', h.x - 10, h.y);
      ctx.restore();
    });
  }

  drawSeabed(ctx, w, h) {
    // 海底沙地
    const sandGrad = ctx.createLinearGradient(0, h - 35, 0, h);
    sandGrad.addColorStop(0, '#d97706');
    sandGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.moveTo(0, h - 25);
    ctx.quadraticCurveTo(w * 0.3, h - 40, w * 0.6, h - 25);
    ctx.quadraticCurveTo(w * 0.85, h - 15, w, h - 30);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 贝壳与鹅卵石
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(w * 0.25, h - 18, 6, 0, Math.PI * 2);
    ctx.arc(w * 0.68, h - 15, 8, 0, Math.PI * 2);
    ctx.arc(w * 0.82, h - 22, 5, 0, Math.PI * 2);
    ctx.fill();

    // 摇曳海草
    this.seaweeds.forEach(sw => {
      const sway = Math.sin(sw.phase + Date.now() * 0.002) * 16;
      ctx.fillStyle = sw.color;
      ctx.beginPath();
      ctx.moveTo(sw.x - sw.width * 0.5, h);
      ctx.quadraticCurveTo(sw.x + sway * 0.5, h - sw.height * 0.5, sw.x + sway, h - sw.height);
      ctx.quadraticCurveTo(sw.x + sway * 0.5, h - sw.height * 0.5, sw.x + sw.width * 0.5, h);
      ctx.closePath();
      ctx.fill();
    });
  }

  // 核心鱼类绘制函数 (精湛细腻的兰寿、锦鲤、小丑鱼、水母、河鲀等矢量渲染)
  drawFish(ctx, f) {
    ctx.save();
    ctx.translate(f.x, f.y);

    // 如果向左游，翻转Y轴保持正立
    const isFacingLeft = Math.cos(f.angle) < 0;
    ctx.rotate(f.angle);
    if (isFacingLeft) {
      ctx.scale(1, -1);
    }
    ctx.scale(f.scale, f.scale);

    const sp = f.species;
    const tailWiggle = Math.sin(f.tailPhase) * 0.35;

    // 主角专属金色主角光环
    if (f.isPlayer) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 24, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (sp.id === 'ranchu') {
      // ===== 经典兰寿金鱼 (圆蛋身材 + 头顶草莓肉瘤 + 飘逸短双尾) =====
      // 1. 摆动双尾鳍
      ctx.save();
      ctx.translate(-22, 0);
      ctx.rotate(tailWiggle);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.strokeStyle = '#ff4d4f';
      ctx.lineWidth = 1.5;

      // 上尾叶
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, -18, -24, -8);
      ctx.quadraticCurveTo(-14, 0, 0, 0);
      ctx.fill();
      ctx.stroke();

      // 下尾叶
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, 18, -24, 8);
      ctx.quadraticCurveTo(-14, 0, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 2. 圆滚滚蛋形躯体 (无背鳍，平滑背部弧线)
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 19, 0, 0, Math.PI * 2);
      ctx.fill();

      // 白色肚皮花纹
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2, 6, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. 头部草莓肉瘤 (Headgrowth / Wen - 兰寿的灵魂标志)
      ctx.fillStyle = sp.wenColor;
      const wenNodes = [
        { x: 16, y: -8, r: 7 },
        { x: 22, y: -4, r: 8 },
        { x: 23, y: 4, r: 8 },
        { x: 18, y: 8, r: 7 },
        { x: 14, y: 0, r: 9 },
        { x: 20, y: 0, r: 8.5 }
      ];
      wenNodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. 呆萌小圆眼
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(16, -5, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(17.5, -6, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // 5. 小胸鳍摇摆
      ctx.save();
      ctx.translate(6, 10);
      ctx.rotate(tailWiggle * 0.8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 4, Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 主角头顶小王冠
      if (f.isPlayer) {
        ctx.font = '14px serif';
        ctx.fillText('👑', 8, -18);
      }
    } else if (sp.id === 'clownfish') {
      // ===== 小丑鱼 (橙白三条纹) =====
      // 尾鳍
      ctx.save();
      ctx.translate(-22, 0);
      ctx.rotate(tailWiggle);
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-14, -10);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-14, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 身体
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // 三道经典白色条纹
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      [-10, 0, 10].forEach(stripeX => {
        ctx.beginPath();
        ctx.ellipse(stripeX, 0, 3.5, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // 眼睛
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(14, -3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (sp.id === 'jellyfish') {
      // ===== 发光水母 (半透明钟罩 + 律动触须) =====
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.15;
      ctx.fillStyle = 'rgba(19, 194, 194, 0.7)';
      ctx.beginPath();
      ctx.arc(6, 0, 16 * pulse, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.fill();

      // 触须
      ctx.strokeStyle = 'rgba(135, 232, 222, 0.8)';
      ctx.lineWidth = 2;
      for (let t = -10; t <= 10; t += 5) {
        ctx.beginPath();
        ctx.moveTo(4, t);
        const wave = Math.sin(t + Date.now() * 0.006) * 6;
        ctx.lineTo(-18, t + wave);
        ctx.stroke();
      }
    } else if (sp.id === 'pufferfish') {
      // ===== 河鲀刺豚 =====
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // 身上萌点小刺
      ctx.fillStyle = sp.secondaryColor;
      for (let a = 0; a < Math.PI * 2; a += Math.PI * 0.35) {
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 16, Math.sin(a) * 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 大眼睛
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(10, -4, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 通用流线鱼形 (锦鲤 / 神仙鱼)
      ctx.save();
      ctx.translate(-22, 0);
      ctx.rotate(tailWiggle);
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, -12);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-18, 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(16, -3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
