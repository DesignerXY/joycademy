// Fish TV Studio: Clickable News Channels, Animated Cartoons & Voice Narration (鱼鱼电视模式)

import { fishSound } from './sound.js';

export const TV_CHANNELS = [
  {
    id: 'news-ranchu',
    badge: '👑 荣耀头条',
    title: '兰寿金鱼宝宝荣获海底第一届萌鱼大奖！',
    summary: '标志性草莓头瘤与肉嘟嘟圆身材征服全体裁判，全场欢呼！',
    dialogue: '这里是海底星光电视台！我们的主角兰寿金鱼凭借超治愈的草莓肉瘤大头和呆萌摆尾，全票当选海底年度最萌小仙鱼！',
    character: 'ranchu_award'
  },
  {
    id: 'news-kitchen',
    badge: '🍮 美食奇闻',
    title: '水母奇幻面包坊全新研发出水晶发光布丁！',
    summary: '深海发光胶质结合珊瑚蜜糖，香甜Q弹引发小鱼排队抢购！',
    dialogue: '美食前线特报！水母大厨宣布全新配方出炉：水晶水母布丁闪亮登场！软嫩Q弹，吃一口就能开心一整天！',
    character: 'jelly_cook'
  },
  {
    id: 'news-mischief',
    badge: '🚨 紧急警报',
    title: '珊瑚礁捣蛋鱼现身！趁夜偷吃大家的深海脆海苔！',
    summary: '海龟巡逻队长呼吁小鱼们拿起泡泡网，一起出动抓住捣蛋鱼！',
    dialogue: '紧急警报！珊瑚礁里出现了一群爱做鬼脸偷吃零食的调皮捣蛋鱼！请勇敢的小探险家们火速拿起泡泡网，抓住这群淘气包！',
    character: 'mischief_run'
  },
  {
    id: 'news-jelly-dance',
    badge: '✨ 璀璨盛宴',
    title: '深海荧光水母群今夜上演梦幻星河华尔兹！',
    summary: '深海极光绽放，半透明触手与海底音符共舞，治愈全体海洋生物。',
    dialogue: '晚间艺术专栏：深海发光水母天团今夜点亮星光海洋！让我们跟随舒缓的节拍，一起欣赏奇幻治愈的水中芭蕾舞！',
    character: 'jelly_waltz'
  }
];

export class FishTV {
  constructor(canvas, subtitlesEl, onJumpMode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.subtitlesEl = subtitlesEl;
    this.onJumpMode = onJumpMode;

    this.currentChannelIndex = 0;
    this.isPlaying = true;
    this.animPhase = 0;
    this.animId = null;
    this.lastTime = 0;

    this.danmakuList = [
      { text: '兰寿大头太Q弹啦！', x: 260, y: 45, speed: 1.4, color: '#fef08a' },
      { text: '想吃刚出炉的水母布丁！', x: 480, y: 75, speed: 1.2, color: '#bae6fd' },
      { text: '快去抓住捣蛋鱼！', x: 380, y: 110, speed: 1.6, color: '#fbcfe8' }
    ];

    this.init();
  }

  init() {
    this.resize();
    this.playChannel(0);
    this.animate = this.animate.bind(this);
    this.animId = requestAnimationFrame(this.animate);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth || 640;
    const h = parent.clientHeight || 360;

    this.width = w;
    this.height = h;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.scale(dpr, dpr);
  }

  playChannel(idx) {
    this.currentChannelIndex = (idx + TV_CHANNELS.length) % TV_CHANNELS.length;
    const ch = TV_CHANNELS[this.currentChannelIndex];
    this.animPhase = 0;

    if (this.subtitlesEl) {
      this.subtitlesEl.innerHTML = `<strong>【播报】</strong> ${ch.dialogue}<br><span style="color: #cbd5e1; font-size: 13px;">${ch.summary}</span>`;
    }

    fishSound.playBubble();
    fishSound.speak(ch.dialogue);
  }

  next() {
    this.playChannel(this.currentChannelIndex + 1);
  }

  prev() {
    this.playChannel(this.currentChannelIndex - 1);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (!this.isPlaying) {
      fishSound.stopSpeak();
    } else {
      const ch = TV_CHANNELS[this.currentChannelIndex];
      fishSound.speak(ch.dialogue);
    }
    return this.isPlaying;
  }

  animate(time) {
    const dt = Math.min(0.1, (time - this.lastTime) / 1000 || 0.016);
    this.lastTime = time;

    if (this.isPlaying) {
      this.animPhase += dt;

      // 弹幕移动
      this.danmakuList.forEach(d => {
        d.x -= d.speed;
        if (d.x < -180) {
          d.x = this.width + 50 + Math.random() * 150;
          d.y = 35 + Math.random() * 85;
        }
      });
    }

    this.render();
    this.animId = requestAnimationFrame(this.animate);
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const ch = TV_CHANNELS[this.currentChannelIndex];

    // 1. 演播厅背景 (绚丽深海舞台)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. 演播厅聚光灯
    ctx.save();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(w * 0.15, h);
    ctx.lineTo(w * 0.85, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. 核心动画片角色场景
    this.renderCartoonScene(ctx, w, h, ch);

    // 4. 浮动弹幕
    ctx.font = 'bold 13px Noto Sans SC, sans-serif';
    this.danmakuList.forEach(d => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      const tw = ctx.measureText(d.text).width;
      ctx.beginPath();
      ctx.roundRect(d.x - 6, d.y - 14, tw + 12, 20, 10);
      ctx.fill();

      ctx.fillStyle = d.color;
      ctx.fillText(d.text, d.x, d.y);
    });

    // 5. 电视顶部状态栏
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, w, 30);

    // 红色 LIVE 闪烁灯
    const blink = Math.floor(Date.now() / 600) % 2 === 0;
    ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(18, 15, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 12px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('LIVE · 鱼鱼动画小电视', 32, 19);

    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'right';
    ctx.fillText(ch.badge, w - 16, 19);
    ctx.textAlign = 'left';

    // 底部新闻跑马灯
    ctx.fillStyle = 'rgba(234, 88, 12, 0.9)';
    ctx.fillRect(0, h - 26, w, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Noto Sans SC, sans-serif';
    ctx.fillText(`📢 焦点节目：${ch.title}`, 14, h - 9);
  }

  // 播放对应鱼鱼小动画片
  renderCartoonScene(ctx, w, h, ch) {
    const t = this.animPhase;
    const cx = w * 0.5;
    const cy = h * 0.5;

    if (ch.character === 'ranchu_award') {
      // ===== 动画片 1: 兰寿金鱼登台领奖走秀 =====
      const sway = Math.sin(t * 3) * 15;
      const rx = cx + sway;
      const ry = cy + 10;

      // 金色领奖舞台
      ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 65, 120, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // 飘落金色彩带
      for (let i = 0; i < 8; i++) {
        const fallY = (cy - 100 + ((t * 80 + i * 35) % 180));
        ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#ec4899';
        ctx.fillRect(cx - 100 + i * 28, fallY, 6, 6);
      }

      // 呆萌小兰寿
      ctx.save();
      ctx.translate(rx, ry);

      // 短尾巴摆动
      const tailWiggle = Math.sin(t * 8) * 0.4;
      ctx.save();
      ctx.translate(-35, 0);
      ctx.rotate(tailWiggle);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-20, -25, -35, -10);
      ctx.quadraticCurveTo(-20, 0, 0, 0);
      ctx.quadraticCurveTo(-20, 25, -35, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 胖胖圆身体
      ctx.fillStyle = '#ff4d4f';
      ctx.beginPath();
      ctx.ellipse(0, 0, 38, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // 白肚皮
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-5, 8, 26, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // 草莓肉瘤头
      ctx.fillStyle = '#ff2a2d';
      [
        { x: 22, y: -10, r: 10 },
        { x: 30, y: -4, r: 11 },
        { x: 31, y: 6, r: 11 },
        { x: 24, y: 12, r: 10 },
        { x: 20, y: 0, r: 12 }
      ].forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 眼睛
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(22, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(24, -8, 2, 0, Math.PI * 2);
      ctx.fill();

      // 闪耀黄金皇冠
      ctx.font = '28px serif';
      ctx.fillText('👑', 10, -25);
      ctx.restore();

      // 旁边鼓掌欢呼的小水母观众
      ctx.font = '32px serif';
      ctx.fillText('🪼', cx - 120, cy + 40);
      ctx.fillText('🪼', cx + 90, cy + 40);
      ctx.font = 'bold 15px Noto Sans SC, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('🏆 海底年度最萌小金鱼！', cx - 90, cy - 70);

    } else if (ch.character === 'jelly_cook') {
      // ===== 动画片 2: 水母大厨熬制布丁 =====
      const cookBounce = Math.sin(t * 6) * 8;

      // 巨大贝壳魔法大锅
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(cx, cy + 45, 45, 0, Math.PI);
      ctx.fill();

      // 锅里咕嘟咕嘟冒出彩虹泡沫
      for (let i = 0; i < 5; i++) {
        const bubbleY = cy + 40 - ((t * 40 + i * 15) % 45);
        ctx.fillStyle = ['#38bdf8', '#c084fc', '#f43f5e', '#facc15'][i % 4];
        ctx.beginPath();
        ctx.arc(cx - 30 + i * 15, bubbleY, 5 + Math.sin(t + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 戴厨师帽的水母大厨
      const jx = cx;
      const jy = cy - 20 + cookBounce;
      ctx.font = '54px serif';
      ctx.fillText('🪼', jx - 27, jy);
      ctx.font = '28px serif';
      ctx.fillText('👩‍🍳', jx - 14, jy - 35);
      ctx.fillText('🥄', jx + 28, jy + 10);

      // DuangDuang弹跳出的大布丁
      const puddingY = cy - 65 + Math.abs(Math.sin(t * 4)) * -25;
      ctx.font = '42px serif';
      ctx.fillText('🍮', cx - 21, puddingY);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px Noto Sans SC, sans-serif';
      ctx.fillText('✨ Q弹水晶水母布丁新鲜出炉！', cx - 110, cy - 80);

    } else if (ch.character === 'mischief_run') {
      // ===== 动画片 3: 捣蛋鱼被探照灯逮个正着 =====
      // 探照灯光束
      const spotX = cx + Math.sin(t * 2) * 50;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(spotX, cy, 65, 0, Math.PI * 2);
      ctx.fill();

      // 戴眼罩的捣蛋黑鱼
      const fishX = spotX - 10;
      const fishY = cy + Math.sin(t * 8) * 8;
      ctx.save();
      ctx.translate(fishX, fishY);
      ctx.font = '48px serif';
      ctx.fillText('🐟', -20, 15);
      ctx.font = '20px serif';
      ctx.fillText('🥷', -5, -15); // 小蒙面眼罩
      ctx.fillText('🍘', 16, 20);  // 抱着偷来的仙贝
      ctx.restore();

      // 海龟巡逻爷爷
      ctx.font = '50px serif';
      ctx.fillText('🐢', cx - 120, cy + 20);
      ctx.font = '22px serif';
      ctx.fillText('🔦', cx - 80, cy + 10);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 16px Noto Sans SC, sans-serif';
      ctx.fillText('🚨 捣蛋鱼：哎呀，被发现了快跑！', cx - 100, cy - 70);

    } else {
      // ===== 动画片 4: 深海发光水母星河舞会 =====
      for (let i = 0; i < 4; i++) {
        const jx = cx - 100 + i * 65;
        const jy = cy + Math.sin(t * 2 + i * 1.5) * 35;
        ctx.fillStyle = ['#14b8a6', '#8b5cf6', '#ec4899', '#06b6d4'][i];
        ctx.save();
        ctx.translate(jx, jy);
        ctx.font = '48px serif';
        ctx.fillText('🪼', -20, 10);
        ctx.restore();
      }

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 16px Noto Sans SC, sans-serif';
      ctx.fillText('🌌 深海荧光舞会 · 治愈星河夜', cx - 95, cy - 70);
    }
  }
}
