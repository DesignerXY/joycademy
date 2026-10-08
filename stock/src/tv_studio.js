// Animated Video News Broadcast Studio: Interactive 2D Canvas Cartoon Anchor & Visualized Economic Explanations

import { sound } from './sound.js';
import { MARKET_EVENTS } from './market.js';

export class TVStudio {
  constructor(canvas, subtitlesEl, onTriggerMarketEvent) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.subtitlesEl = subtitlesEl;
    this.onTriggerMarketEvent = onTriggerMarketEvent;

    this.isPlaying = true;
    this.currentTopicIndex = 0;
    this.animFrameId = null;
    this.lastTime = 0;
    this.anchorMouthOpen = 0;
    this.anchorBlink = 0;
    this.sceneAnimPhase = 0;
    this.danmakuList = [];

    // 预置弹幕池
    this.danmakuPool = [
      '千金难买黄金坑，抄底真香！',
      '乱世买黄金，避险看恐龙矿业！',
      '夏天冰淇淋工厂排长队，业绩稳了！',
      '科技才是第一生产力，火箭飞天！',
      '巴菲特爷爷说：别人恐惧我贪婪！',
      '终于看懂大人天天看的财经新闻了！',
      '供求关系决定短期价格，学到了！',
      '分散投资，鸡蛋不要放在一个篮子！'
    ];

    this.initCanvasSize();
    this.initDanmaku();
    this.animate = this.animate.bind(this);
    this.playTopic(0);
  }

  initCanvasSize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth || 640;
    const h = parent.clientHeight || 360;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.scale(dpr, dpr);
    this.displayWidth = w;
    this.displayHeight = h;
  }

  initDanmaku() {
    this.danmakuList = [
      { text: '千金难买黄金坑！', x: 200, y: 40, speed: 1.2, color: '#fef08a' },
      { text: '避险快买黄金！', x: 450, y: 70, speed: 1.5, color: '#fed7aa' },
      { text: '小牛主播讲得太清楚啦！', x: 600, y: 100, speed: 1.0, color: '#a7f3d0' }
    ];
  }

  playTopic(index) {
    this.currentTopicIndex = (index + MARKET_EVENTS.length) % MARKET_EVENTS.length;
    const event = MARKET_EVENTS[this.currentTopicIndex];
    this.sceneAnimPhase = 0;

    // 更新字幕文本
    if (this.subtitlesEl) {
      this.subtitlesEl.innerHTML = `<strong>【播报】</strong> ${event.dialogue}<br><span style="color: #cbd5e1; font-size: 13px;">${event.explanation}</span>`;
    }

    // 播放提示音并语音朗读
    sound.playAlert();
    sound.speak(`${event.dialogue}。${event.explanation}`, () => {
      this.anchorMouthOpen = 0;
    });

    if (!this.animFrameId) {
      this.lastTime = performance.now();
      this.animFrameId = requestAnimationFrame(this.animate);
    }
  }

  nextTopic() {
    this.playTopic(this.currentTopicIndex + 1);
  }

  prevTopic() {
    this.playTopic(this.currentTopicIndex - 1);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (!this.isPlaying) {
      sound.stopSpeak();
    } else {
      const event = MARKET_EVENTS[this.currentTopicIndex];
      sound.speak(event.dialogue);
    }
    return this.isPlaying;
  }

  // 把当前视频讲解的事件直接施加于大盘，触发剧烈联动！
  applyToMarket() {
    const event = MARKET_EVENTS[this.currentTopicIndex];
    if (this.onTriggerMarketEvent) {
      this.onTriggerMarketEvent(event.id);
    }
  }

  getCurrentEvent() {
    return MARKET_EVENTS[this.currentTopicIndex];
  }

  animate(time) {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    if (this.isPlaying) {
      this.sceneAnimPhase += dt * 1.5;

      // 小牛主播嘴巴动效 (拟真说话)
      this.anchorMouthOpen = Math.sin(time * 0.015) > 0 ? 1 : 0;
      // 眨眼动画
      this.anchorBlink = Math.sin(time * 0.002) > 0.96 ? 1 : 0;

      // 弹幕位移
      this.danmakuList.forEach(d => {
        d.x -= d.speed;
        if (d.x < -200) {
          d.x = this.displayWidth + 50 + Math.random() * 150;
          d.y = 35 + Math.random() * 90;
          d.text = this.danmakuPool[Math.floor(Math.random() * this.danmakuPool.length)];
        }
      });
    }

    this.draw();
    this.animFrameId = requestAnimationFrame(this.animate);
  }

  draw() {
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;
    if (!w || !h) return;

    ctx.clearRect(0, 0, w, h);

    const event = MARKET_EVENTS[this.currentTopicIndex];

    // 1. 演播室演播大屏幕背景 (新闻直播室演播大厅视觉)
    this.drawStudioBackground(ctx, w, h, event);

    // 2. 视频核心动画演播场景 (黄金坑、战争、热浪、火箭等图解)
    this.drawVisualTopicScene(ctx, w, h, event);

    // 3. 动态卡通小牛新闻主播 (在演播台前手持话筒)
    this.drawAnchor(ctx, w, h);

    // 4. 浮动弹幕
    this.drawDanmaku(ctx);

    // 5. 顶部演播室状态条 (LIVE, BREAKING NEWS, 跑马灯)
    this.drawBroadcastHUD(ctx, w, h, event);
  }

  drawStudioBackground(ctx, w, h, event) {
    // 演播室渐变底色
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    if (event.theme === 'golden-pit') {
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(1, '#311025');
    } else if (event.theme === 'war') {
      bgGrad.addColorStop(0, '#1c1917');
      bgGrad.addColorStop(1, '#450a0a');
    } else if (event.theme === 'weather') {
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#7c2d12');
    } else if (event.theme === 'tech') {
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#2e1065');
    } else {
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 演播室科技光束与舞台顶灯
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2 + i * w * 0.2, 0);
      ctx.lineTo(w * 0.1 + i * w * 0.25, h * 0.75);
      ctx.lineTo(w * 0.3 + i * w * 0.25, h * 0.75);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // 根据当前专题绘制对应的动态图解场景
  drawVisualTopicScene(ctx, w, h, event) {
    const sceneW = w * 0.65;
    const sceneH = h * 0.65;
    const sceneX = w * 0.3;
    const sceneY = h * 0.12;

    // 视频演示框 (模拟演播厅大屏)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(sceneX, sceneY, sceneW, sceneH, 16);
    ctx.fill();
    ctx.stroke();
    ctx.clip();

    const t = this.sceneAnimPhase;

    if (event.theme === 'golden-pit') {
      // ===== 黄金坑专题动画演示 =====
      this.drawGoldenPitScene(ctx, sceneX, sceneY, sceneW, sceneH, t);
    } else if (event.theme === 'war') {
      // ===== 战争与避险黄金专题动画演示 =====
      this.drawWarCrisisScene(ctx, sceneX, sceneY, sceneW, sceneH, t);
    } else if (event.theme === 'weather') {
      // ===== 40℃夏日热浪冰淇淋爆单动画演示 =====
      this.drawHeatwaveScene(ctx, sceneX, sceneY, sceneW, sceneH, t);
    } else if (event.theme === 'tech') {
      // ===== 星际可回收火箭发射动画演示 =====
      this.drawRocketLaunchScene(ctx, sceneX, sceneY, sceneW, sceneH, t);
    } else if (event.theme === 'medicine') {
      // ===== 熊博士彩虹特效药研发动画演示 =====
      this.drawMedicineScene(ctx, sceneX, sceneY, sceneW, sceneH, t);
    } else {
      // ===== 泡沫破灭风险防范演示 =====
      this.drawBubbleBurstScene(ctx, sceneX, sceneY, sceneW, sceneH, t);
    }

    ctx.restore();
  }

  // 1. 黄金坑专属动画
  drawGoldenPitScene(ctx, x, y, w, h, t) {
    // 绘制股票走势：平稳 -> 恐慌深砸大坑 -> 金光闪烁 -> 报复性暴力反弹
    const startY = y + h * 0.4;
    const pitBottomY = y + h * 0.85;
    const reboundEndY = y + h * 0.2;

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 20, startY);
    ctx.lineTo(x + w * 0.25, startY + 10);
    // 恐慌砸盘跌入坑
    ctx.bezierCurveTo(x + w * 0.35, startY + 20, x + w * 0.4, pitBottomY, x + w * 0.5, pitBottomY);
    // 黄金坑底筑底，绝地反弹飙升
    ctx.bezierCurveTo(x + w * 0.6, pitBottomY, x + w * 0.7, startY, x + w * 0.9, reboundEndY);
    ctx.stroke();

    // 黄金坑底金光大礼包特效
    const pitX = x + w * 0.5;
    const glowR = 25 + Math.sin(t * 4) * 8;
    ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
    ctx.beginPath();
    ctx.arc(pitX, pitBottomY - 10, glowR, 0, Math.PI * 2);
    ctx.fill();

    // 标注文字
    ctx.font = 'bold 15px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('😱 恐慌被错杀', x + w * 0.25, startY - 10);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 16px Outfit, Noto Sans SC, sans-serif';
    ctx.fillText('✨ 千金难买“黄金坑”', pitX - 70, pitBottomY - 35);
    ctx.font = '12px Noto Sans SC, sans-serif';
    ctx.fillText('优质资产绝佳低吸点！', pitX - 58, pitBottomY - 18);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 16px Outfit, Noto Sans SC, sans-serif';
    ctx.fillText('🚀 价值重估大爆发！', x + w * 0.65, reboundEndY + 24);

    // 动态挖宝小金人
    ctx.font = '30px serif';
    ctx.fillText('⛏️', pitX - 15, pitBottomY + 12);
  }

  // 2. 战争与恐龙黄金避险动画
  drawWarCrisisScene(ctx, x, y, w, h, t) {
    // 乌云与闪电背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x, y, w, h);

    // 恐龙大元帅守护黄金宝箱
    const dinoX = x + w * 0.35;
    const dinoY = y + h * 0.65;
    ctx.font = '54px serif';
    ctx.fillText('🦕', dinoX - 30, dinoY);
    ctx.font = '40px serif';
    ctx.fillText('👑', dinoX - 20, dinoY - 45);
    ctx.fillText('🛡️', dinoX + 45, dinoY - 10);
    ctx.fillText('💰', dinoX + 90, dinoY);

    // 避险黄金箭头发射升空
    const arrowY = y + h * 0.7 - ((t * 60) % (h * 0.5));
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 18px Outfit, Noto Sans SC, sans-serif';
    ctx.fillText('恐龙黄金股价 📈 +10.00% 封涨停！', x + 30, y + 40);

    ctx.fillStyle = '#fde047';
    ctx.font = '14px Noto Sans SC, sans-serif';
    ctx.fillText('“乱世买黄金” —— 全球避险硬通货！', x + 30, y + 68);

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.75, y + h * 0.75);
    ctx.lineTo(x + w * 0.75, arrowY);
    ctx.stroke();
    ctx.fillText('⬆ 狂飙避险', x + w * 0.7, arrowY - 10);
  }

  // 3. 夏日热浪冰淇淋爆单
  drawHeatwaveScene(ctx, x, y, w, h, t) {
    // 太阳公公戴墨镜
    const sunX = x + w * 0.75;
    const sunY = y + h * 0.35;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '36px serif';
    ctx.fillText('🕶️', sunX - 18, sunY + 12);

    // 气温计突破 40℃
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('🌡️ 40.5 ℃ 超级热浪！', x + 30, y + 40);

    // 冰淇淋工厂爆单
    const factoryX = x + w * 0.25;
    const factoryY = y + h * 0.75;
    ctx.font = '48px serif';
    ctx.fillText('🍦', factoryX, factoryY);
    ctx.fillText('🍨', factoryX + 60, factoryY - 10);
    ctx.fillText('🍧', factoryX + 120, factoryY);

    ctx.font = 'bold 15px Noto Sans SC, sans-serif';
    ctx.fillStyle = '#fda4af';
    ctx.fillText('【甜心冰淇淋工坊】出货量同比暴增 300%！', x + 30, y + 72);
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Noto Sans SC, sans-serif';
    ctx.fillText('供不应求 ➔ 净利润激增 ➔ 股价一字封涨停！', x + 30, y + 96);
  }

  // 4. 星际火箭发射成功
  drawRocketLaunchScene(ctx, x, y, w, h, t) {
    // 火箭升空与尾焰
    const rocketProgress = (t * 0.6) % 1;
    const rx = x + w * 0.5;
    const ry = y + h * 0.85 - rocketProgress * (h * 0.7);

    // 尾焰喷射粒子
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(rx + 15, ry + 45, 12 + Math.sin(t * 10) * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '50px serif';
    ctx.fillText('🚀', rx, ry);

    ctx.font = 'bold 20px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText('星际神舟十号回收成功！', x + 30, y + 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Noto Sans SC, sans-serif';
    ctx.fillText('颠覆式科技创新 ➔ 降低运输成本 85%！', x + 30, y + 68);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('高成长科技估值重塑，股价势不可挡！', x + 30, y + 92);
  }

  // 5. 熊博士药房
  drawMedicineScene(ctx, x, y, w, h, t) {
    ctx.font = '54px serif';
    ctx.fillText('🐻‍❄️', x + w * 0.2, y + h * 0.7);
    ctx.fillText('🧪', x + w * 0.45, y + h * 0.65);
    ctx.fillText('💊', x + w * 0.7, y + h * 0.7);

    ctx.font = 'bold 20px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('熊博士草莓特效糖浆获国家专利！', x + 30, y + 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Noto Sans SC, sans-serif';
    ctx.fillText('医药行业“抗周期”特性：无论牛熊都需要治病！', x + 30, y + 68);
    ctx.fillStyle = '#67e8f9';
    ctx.fillText('独家专利护城河建立，防御属性极佳！', x + 30, y + 92);
  }

  // 6. 泡沫破裂与价值投资
  drawBubbleBurstScene(ctx, x, y, w, h, t) {
    const bubbleSize = 30 + Math.sin(t * 3) * 10;
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + w * 0.5, y + h * 0.55, bubbleSize, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '36px serif';
    ctx.fillText('💥', x + w * 0.5 - 18, y + h * 0.55 + 12);

    ctx.font = 'bold 18px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('警惕盲目跟风！泡沫终将破裂！', x + 30, y + 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Noto Sans SC, sans-serif';
    ctx.fillText('不看公司真实业绩只听故事，容易高位站岗。', x + 30, y + 68);
    ctx.fillStyle = '#fde047';
    ctx.fillText('学会价值投资与分散投资，才能长久战胜市场！', x + 30, y + 92);
  }

  // 绘制动态卡通主播小牛牛 (在演播台前)
  drawAnchor(ctx, w, h) {
    const deskX = w * 0.05;
    const deskY = h * 0.45;
    const anchorX = deskX + 55;
    const anchorY = deskY + 65;

    // 演播主播台
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(deskX, deskY + 50, 150, 95, [14, 14, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // 演播台台标 "财商 TV"
    ctx.font = 'bold 13px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#eab308';
    ctx.textAlign = 'center';
    ctx.fillText('📺 财商 TV', deskX + 75, deskY + 95);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('小牛财经主播台', deskX + 75, deskY + 115);
    ctx.textAlign = 'left';

    // 卡通小金牛身体 (西装革履)
    ctx.fillStyle = '#1e1b4b'; // 蓝色西装
    ctx.beginPath();
    ctx.roundRect(anchorX - 35, anchorY - 10, 70, 70, 10);
    ctx.fill();

    // 红色领带
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY - 6);
    ctx.lineTo(anchorX - 8, anchorY + 28);
    ctx.lineTo(anchorX, anchorY + 38);
    ctx.lineTo(anchorX + 8, anchorY + 28);
    ctx.closePath();
    ctx.fill();

    // 小金牛头部 (圆润金黄色)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(anchorX, anchorY - 40, 32, 0, Math.PI * 2);
    ctx.fill();

    // 牛角 (两支金色小角)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(anchorX - 25, anchorY - 62);
    ctx.quadraticCurveTo(anchorX - 42, anchorY - 78, anchorX - 22, anchorY - 80);
    ctx.quadraticCurveTo(anchorX - 18, anchorY - 68, anchorX - 12, anchorY - 65);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(anchorX + 25, anchorY - 62);
    ctx.quadraticCurveTo(anchorX + 42, anchorY - 78, anchorX + 22, anchorY - 80);
    ctx.quadraticCurveTo(anchorX + 18, anchorY - 68, anchorX + 12, anchorY - 65);
    ctx.fill();

    // 眼睛 (带眨眼动效)
    ctx.fillStyle = '#0f172a';
    if (this.anchorBlink) {
      ctx.fillRect(anchorX - 18, anchorY - 45, 10, 3);
      ctx.fillRect(anchorX + 8, anchorY - 45, 10, 3);
    } else {
      ctx.beginPath();
      ctx.arc(anchorX - 13, anchorY - 45, 5, 0, Math.PI * 2);
      ctx.arc(anchorX + 13, anchorY - 45, 5, 0, Math.PI * 2);
      ctx.fill();

      // 眼神高光
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(anchorX - 11, anchorY - 47, 2, 0, Math.PI * 2);
      ctx.arc(anchorX + 15, anchorY - 47, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 腮红
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(anchorX - 22, anchorY - 35, 6, 0, Math.PI * 2);
    ctx.arc(anchorX + 22, anchorY - 35, 6, 0, Math.PI * 2);
    ctx.fill();

    // 嘴巴 (说话动效)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    if (this.anchorMouthOpen && this.isPlaying) {
      ctx.arc(anchorX, anchorY - 26, 6, 0, Math.PI * 2);
    } else {
      ctx.arc(anchorX, anchorY - 28, 4, 0, Math.PI);
    }
    ctx.fill();

    // 麦克风话筒
    ctx.fillStyle = '#64748b';
    ctx.fillRect(anchorX + 28, anchorY + 5, 6, 30);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(anchorX + 31, anchorY + 4, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 弹幕图层
  drawDanmaku(ctx) {
    ctx.font = 'bold 13px Noto Sans SC, sans-serif';
    this.danmakuList.forEach(d => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      const textW = ctx.measureText(d.text).width;
      ctx.beginPath();
      ctx.roundRect(d.x - 6, d.y - 14, textW + 12, 20, 10);
      ctx.fill();

      ctx.fillStyle = d.color;
      ctx.fillText(d.text, d.x, d.y);
    });
  }

  // 演播室顶部与底部 HUD 条
  drawBroadcastHUD(ctx, w, h, event) {
    // 顶部条
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, w, 32);

    // LIVE 闪烁红点
    const isBlink = Math.floor(Date.now() / 600) % 2 === 0;
    ctx.fillStyle = isBlink ? '#ef4444' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(18, 16, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('LIVE · 财商 TV 市场突发速报演播室', 32, 20);

    // 当前专题徽章
    ctx.font = 'bold 12px Noto Sans SC, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'right';
    ctx.fillText(`【${event.badge}】`, w - 16, 20);
    ctx.textAlign = 'left';

    // 演播室屏幕底部跑马灯
    ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
    ctx.fillRect(0, h - 26, w, 26);
    ctx.font = 'bold 12px Noto Sans SC, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`⚡ BREAKING NEWS 紧急关注：${event.title}`, 14, h - 9);
  }
}
