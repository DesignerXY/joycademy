// Joycademy Stock Market Adventure - Main Application Orchestrator

import confetti from 'canvas-confetti';
import { MarketEngine, STOCKS_DATA, MARKET_EVENTS } from './market.js';
import { StockChart } from './chart.js';
import { TVStudio } from './tv_studio.js';
import { sound } from './sound.js';

class StockApp {
  constructor() {
    this.engine = new MarketEngine();
    this.selectedStockId = 'sweet';
    this.viewMode = 'split'; // 'split' | 'pro' | 'kids'
    this.tradeMode = 'buy';  // 'buy' | 'sell'
    this.sellRatio = 0.5;
    this.speedIndex = 0;
    this.speeds = [
      { label: '⚡ 速度: 1x (标准)', interval: 1000 },
      { label: '⚡ 速度: 2x (较快)', interval: 500 },
      { label: '⚡ 速度: 5x (极速)', interval: 200 },
      { label: '⏸️ 市场暂停', interval: 0 }
    ];

    // 玩家财富账户体系
    this.account = {
      cash: 100000.0, // 初始可用现金 ￥100,000
      initialCash: 100000.0,
      holdings: {
        sweet: { shares: 0, totalCost: 0, avgPrice: 0 },
        rocket: { shares: 0, totalCost: 0, avgPrice: 0 },
        gold: { shares: 0, totalCost: 0, avgPrice: 0 },
        bear: { shares: 0, totalCost: 0, avgPrice: 0 },
        solar: { shares: 0, totalCost: 0, avgPrice: 0 },
        pipi: { shares: 0, totalCost: 0, avgPrice: 0 }
      }
    };

    this.chart = null;
    this.tvStudio = null;
    this.timerId = null;

    // 财商问答题库
    this.quizzes = [
      {
        question: '世界上突发地缘战争或动荡冲突时，哪种股票最可能因为资金避险而暴涨？',
        options: [
          { text: '🦕 恐龙黄金避险矿业 (避险硬通货)', correct: true },
          { text: '🍦 甜心冰淇淋工厂', correct: false },
          { text: '🎮 皮皮元宇宙游戏', correct: false }
        ],
        explanation: '回答正确！自古有“乱世买黄金”的说法，黄金具有强大的避险保值能力！奖励 ￥10,000 启动金！'
      },
      {
        question: '当一家天天赚钱的好公司因为突发谣言被恐慌错杀砸入深坑，这个绝佳买点被称为什么？',
        options: [
          { text: '🌟 “千金难买黄金坑”', correct: true },
          { text: '🌧️ 倒霉大泥潭', correct: false },
          { text: '🐻 熊市深渊', correct: false }
        ],
        explanation: '太聪明了！这就是经典的“黄金坑”形态，往往是聪明资金以打折价格低吸好资产的绝佳良机！'
      },
      {
        question: '夏天全国气温高达 40 度，哪个行业的公司最容易因为供不应求而业绩暴增？',
        options: [
          { text: '🍦 甜心冰淇淋工厂 (冷饮消费)', correct: true },
          { text: '🚀 星际火箭探索', correct: false },
          { text: '🦕 恐龙黄金避险', correct: false }
        ],
        explanation: '答对了！供求关系决定短期利润，炎炎夏日冰淇淋爆单断货，业绩暴增推高股价！'
      }
    ];
    this.currentQuizIndex = 0;

    this.init();
  }

  init() {
    this.initDOM();
    this.initChart();
    this.initTVStudio();
    this.bindEvents();
    this.renderStockList();
    this.renderExplorerCards();
    this.renderQuiz();
    this.updateActiveStockUI();
    this.updatePortfolioUI();
    this.startSimulation();
  }

  initDOM() {
    // 渲染电视演播室主题选择栏
    const tvBar = document.getElementById('tv-topics-bar');
    if (tvBar) {
      tvBar.innerHTML = MARKET_EVENTS.map((e, idx) => `
        <button class="topic-chip-btn ${idx === 0 ? 'active' : ''}" data-topic-index="${idx}">
          ${e.badge}
        </button>
      `).join('');
    }
  }

  initChart() {
    const canvas = document.getElementById('stock-canvas');
    if (canvas) {
      this.chart = new StockChart(canvas);
      window.addEventListener('resize', () => {
        if (this.chart) this.chart.resize();
        if (this.tvStudio) this.tvStudio.initCanvasSize();
      });
      setTimeout(() => {
        if (this.chart) {
          this.chart.resize();
          this.chart.setStock(this.engine.getStock(this.selectedStockId));
        }
      }, 50);
    }
  }

  initTVStudio() {
    const tvCanvas = document.getElementById('tv-canvas');
    const subtitlesEl = document.getElementById('tv-subtitles-box');
    if (tvCanvas) {
      this.tvStudio = new TVStudio(tvCanvas, subtitlesEl, (eventId) => {
        this.triggerMarketEvent(eventId);
      });
    }
  }

  bindEvents() {
    // 1. 声音开关
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        soundBtn.textContent = isMuted ? '🔇 声音: 静音' : '🔊 声音: 开启';
      });
    }

    // 2. 模拟速度切换
    const speedBtn = document.getElementById('btn-speed-toggle');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
        const s = this.speeds[this.speedIndex];
        speedBtn.textContent = s.label;
        this.startSimulation();
      });
    }

    // 3. 视界模式切换 (大人 / 儿童 / 双屏)
    const modeBtn = document.getElementById('btn-mode-toggle');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        if (this.viewMode === 'split') {
          this.viewMode = 'pro';
          modeBtn.textContent = '💼 视界: 大人专业';
        } else if (this.viewMode === 'pro') {
          this.viewMode = 'kids';
          modeBtn.textContent = '🧸 视界: 儿童萌趣';
        } else {
          this.viewMode = 'split';
          modeBtn.textContent = '🌟 视界: 双屏合璧';
        }
        this.applyViewMode();
      });
    }

    // 4. 图表形态切换 (K线 / 彩虹线)
    const tabKline = document.getElementById('tab-chart-kline');
    const tabRainbow = document.getElementById('tab-chart-rainbow');
    if (tabKline && tabRainbow) {
      tabKline.addEventListener('click', () => {
        tabKline.classList.add('active');
        tabRainbow.classList.remove('active');
        if (this.chart) this.chart.setMode('candlestick');
      });
      tabRainbow.addEventListener('click', () => {
        tabRainbow.classList.add('active');
        tabKline.classList.remove('active');
        if (this.chart) this.chart.setMode('sparkline');
      });
    }

    // 5. 补充模拟资金
    const topupBtn = document.getElementById('btn-add-funds');
    if (topupBtn) {
      topupBtn.addEventListener('click', () => {
        this.account.cash += 50000;
        this.account.initialCash += 50000;
        sound.playBuy();
        this.updatePortfolioUI();
        this.updateTradePreview();
      });
    }

    // 6. 买卖模式切换
    const tabBuy = document.getElementById('tab-trade-buy');
    const tabSell = document.getElementById('tab-trade-sell');
    const groupMoney = document.getElementById('group-money-input');
    const groupSell = document.getElementById('group-sell-input');
    const submitBtn = document.getElementById('btn-trade-submit');

    if (tabBuy && tabSell) {
      tabBuy.addEventListener('click', () => {
        this.tradeMode = 'buy';
        tabBuy.className = 'trade-tab active-buy';
        tabSell.className = 'trade-tab';
        groupMoney.classList.remove('hidden');
        groupSell.classList.add('hidden');
        submitBtn.className = 'btn-execute-trade buy-mode';
        submitBtn.innerHTML = '<span>🚀 确认买入</span>';
        this.updateTradePreview();
      });

      tabSell.addEventListener('click', () => {
        this.tradeMode = 'sell';
        tabSell.className = 'trade-tab active-sell';
        tabBuy.className = 'trade-tab';
        groupMoney.classList.add('hidden');
        groupSell.classList.remove('hidden');
        submitBtn.className = 'btn-execute-trade sell-mode';
        submitBtn.innerHTML = '<span>💰 确认卖出</span>';
        this.updateTradePreview();
      });
    }

    // 7. 用户输入文字投多少钱 (实时计算并更新预览)
    const moneyInput = document.getElementById('input-trade-money');
    if (moneyInput) {
      moneyInput.addEventListener('input', () => {
        this.updateTradePreview();
      });
    }

    // 8. 快捷金额预设按钮
    document.querySelectorAll('.quick-amount-chips .chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = btn.dataset.amount;
        const sellRatio = btn.dataset.sellRatio;

        if (amt) {
          if (amt === 'half') {
            moneyInput.value = Math.max(100, Math.floor(this.account.cash * 0.5));
          } else if (amt === 'all') {
            moneyInput.value = Math.floor(this.account.cash);
          } else {
            moneyInput.value = amt;
          }
          this.updateTradePreview();
        } else if (sellRatio) {
          this.sellRatio = parseFloat(sellRatio);
          this.updateTradePreview();
        }
      });
    });

    // 9. 执行交易买入/卖出
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.executeTrade();
      });
    }

    // 10. TV 演播室专题切换
    const tvBar = document.getElementById('tv-topics-bar');
    if (tvBar) {
      tvBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.topic-chip-btn');
        if (btn) {
          const idx = parseInt(btn.dataset.topicIndex, 10);
          tvBar.querySelectorAll('.topic-chip-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (this.tvStudio) this.tvStudio.playTopic(idx);
        }
      });
    }

    // 11. TV 演播室播放控制
    const prevBtn = document.getElementById('btn-tv-prev');
    const playBtn = document.getElementById('btn-tv-play');
    const nextBtn = document.getElementById('btn-tv-next');
    const voiceBtn = document.getElementById('btn-tv-voice');
    const applyMarketBtn = document.getElementById('btn-apply-event-to-market');

    if (prevBtn) prevBtn.addEventListener('click', () => {
      if (this.tvStudio) {
        this.tvStudio.prevTopic();
        this.syncTvTopicBar();
      }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (this.tvStudio) {
        this.tvStudio.nextTopic();
        this.syncTvTopicBar();
      }
    });
    if (playBtn) playBtn.addEventListener('click', () => {
      if (this.tvStudio) {
        const playing = this.tvStudio.togglePlay();
        playBtn.textContent = playing ? '⏸️ 暂停播报' : '▶️ 播放播报';
      }
    });
    if (voiceBtn) voiceBtn.addEventListener('click', () => {
      if (this.tvStudio) {
        const ev = this.tvStudio.getCurrentEvent();
        sound.speak(`${ev.dialogue}。${ev.explanation}`);
      }
    });
    if (applyMarketBtn) applyMarketBtn.addEventListener('click', () => {
      if (this.tvStudio) {
        this.tvStudio.applyToMarket();
      }
    });

    // 订阅市场数据变化
    this.engine.subscribe(() => {
      this.onMarketUpdate();
    });
  }

  syncTvTopicBar() {
    if (!this.tvStudio) return;
    const curIdx = this.tvStudio.currentTopicIndex;
    const tvBar = document.getElementById('tv-topics-bar');
    if (tvBar) {
      tvBar.querySelectorAll('.topic-chip-btn').forEach((b, i) => {
        b.classList.toggle('active', i === curIdx);
      });
    }
  }

  applyViewMode() {
    const proSection = document.getElementById('adults-pro-container');
    const kidsMood = document.getElementById('kids-mood-bar');
    const tabKline = document.getElementById('tab-chart-kline');
    const tabRainbow = document.getElementById('tab-chart-rainbow');

    if (this.viewMode === 'pro') {
      if (proSection) proSection.style.display = 'block';
      if (kidsMood) kidsMood.style.display = 'none';
      if (tabKline) tabKline.click();
    } else if (this.viewMode === 'kids') {
      if (proSection) proSection.style.display = 'none';
      if (kidsMood) kidsMood.style.display = 'flex';
      if (tabRainbow) tabRainbow.click();
    } else {
      if (proSection) proSection.style.display = 'block';
      if (kidsMood) kidsMood.style.display = 'flex';
    }
  }

  startSimulation() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    const currentSpeed = this.speeds[this.speedIndex];
    if (currentSpeed.interval > 0) {
      this.timerId = setInterval(() => {
        this.engine.tick();
      }, currentSpeed.interval);
    }
  }

  // 触发特定市场事件
  triggerMarketEvent(eventId) {
    const event = this.engine.triggerEvent(eventId);
    if (!event) return;

    sound.playAlert();
    this.syncTvTopicBar();

    // 如果触发了黄金坑，播放金币特效并给予反馈
    if (eventId === 'event-golden-pit') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#eab308', '#fde047', '#f59e0b']
      });
    }
  }

  // 市场步进更新
  onMarketUpdate() {
    // 1. 更新顶部时间
    const clockText = document.getElementById('market-status-text');
    const dayText = document.getElementById('market-day-text');
    if (clockText) clockText.textContent = `开市中 · ${this.engine.timeSlot}`;
    if (dayText) dayText.textContent = `Day ${this.engine.day}`;

    // 2. 刷新股票列表价格
    this.renderStockList();

    // 3. 刷新选中股票的图表与详情
    const stock = this.engine.getStock(this.selectedStockId);
    if (stock) {
      if (this.chart) this.chart.render();
      this.updateActiveStockUI();
    }

    // 4. 刷新财富净值与持仓
    this.updatePortfolioUI();
    this.updateTradePreview();
  }

  // 渲染左侧 6 只股票列表卡片
  renderStockList() {
    const container = document.getElementById('stock-list-container');
    if (!container) return;

    const stocks = this.engine.getAllStocks();
    container.innerHTML = stocks.map(stock => {
      const isSelected = stock.id === this.selectedStockId;
      const isUp = stock.changePercent >= 0;
      const chgColor = isUp ? 'var(--up-red)' : 'var(--down-green)';
      const holding = this.account.holdings[stock.id];
      const hasHolding = holding && holding.shares > 0;

      return `
        <div class="stock-card-item ${isSelected ? 'selected' : ''}" data-stock-id="${stock.id}">
          <div class="stock-item-head">
            <div class="stock-brand">
              <span class="stock-symbol">${stock.symbol}</span>
              <div class="stock-name-grp">
                <h4>${stock.shortName}</h4>
                <span>${stock.code}</span>
              </div>
            </div>
            <div class="stock-price-grp">
              <div class="stock-cur-price" style="color: ${chgColor};">￥${stock.currentPrice.toFixed(2)}</div>
              <div class="stock-chg-badge" style="background: ${isUp ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}; color: ${chgColor};">
                ${isUp ? '+' : ''}${stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
          <div class="stock-card-desc">${stock.category}</div>
          ${hasHolding ? `
            <div class="stock-holding-badge">
              <span>持有: ${holding.shares} 股</span>
              <span>(市价 ￥${(holding.shares * stock.currentPrice).toFixed(0)})</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // 点击切换股票
    container.querySelectorAll('.stock-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.stockId;
        this.selectStock(id);
      });
    });
  }

  selectStock(stockId) {
    this.selectedStockId = stockId;
    const stock = this.engine.getStock(stockId);
    if (this.chart && stock) {
      this.chart.setStock(stock);
    }
    this.renderStockList();
    this.updateActiveStockUI();
    this.updateTradePreview();
  }

  // 刷新当前活跃股票的图表头、大人指标与儿童心情栏
  updateActiveStockUI() {
    const stock = this.engine.getStock(this.selectedStockId);
    if (!stock) return;

    // 头部信息
    const iconEl = document.getElementById('chart-stock-icon');
    const nameEl = document.getElementById('chart-stock-name');
    const tagsEl = document.getElementById('chart-stock-tags');

    if (iconEl) iconEl.textContent = stock.symbol;
    if (nameEl) nameEl.textContent = `${stock.name} (${stock.code}) · ￥${stock.currentPrice.toFixed(2)}`;
    if (tagsEl) {
      tagsEl.innerHTML = stock.tags.map(t => `<span class="mini-tag">${t}</span>`).join('');
    }

    // 儿童天气心情栏
    const moodIcon = document.getElementById('mood-icon');
    const moodTitle = document.getElementById('mood-title');
    const moodDesc = document.getElementById('mood-desc');

    if (moodIcon && moodTitle && moodDesc) {
      if (stock.changePercent >= 5.0) {
        moodIcon.textContent = '🌈';
        moodTitle.textContent = '彩虹暴涨 · 市场抢筹！';
        moodDesc.textContent = `“哇！${stock.name} 今日暴涨 +${stock.changePercent}%，大家疯狂排队抢购，公司太红火啦！”`;
      } else if (stock.changePercent >= 0.5) {
        moodIcon.textContent = '☀️';
        moodTitle.textContent = '艳阳高照 · 稳步上行';
        moodDesc.textContent = `“经营蒸蒸日上，买入力量很强，股价稳稳向上攀升！”`;
      } else if (stock.changePercent > -4.0) {
        moodIcon.textContent = '⛅';
        moodTitle.textContent = '多云微风 · 正常震荡';
        moodDesc.textContent = `“买卖双方势均力敌，价格在小幅波动整理，等待新的消息刺激。”`;
      } else {
        moodIcon.textContent = '⛈️';
        moodTitle.textContent = '暴风雨洗盘 · 警惕恐慌';
        moodDesc.textContent = `“遇到市场恐慌下挫！注意看看是不是千金难买的【黄金坑】，不要盲目害怕哦！”`;
      }
    }

    // 大人财务指标
    const peEl = document.getElementById('metric-pe');
    const pbEl = document.getElementById('metric-pb');
    const capEl = document.getElementById('metric-market-cap');
    const ampEl = document.getElementById('metric-amplitude');

    if (peEl) peEl.textContent = `${stock.pe} 倍`;
    if (pbEl) pbEl.textContent = `${stock.pb} 倍`;
    if (capEl) capEl.textContent = stock.marketCap;
    if (ampEl) {
      const amp = (((stock.highPrice - stock.lowPrice) / stock.prevClose) * 100).toFixed(1);
      ampEl.textContent = `${amp}%`;
    }

    // 五档买卖盘口
    const asksList = document.getElementById('order-asks-list');
    const bidsList = document.getElementById('order-bids-list');

    if (asksList && bidsList && stock.orderBook) {
      // 卖盘从五到一倒序
      const asksHtml = stock.orderBook.asks.slice().reverse().map(a => `
        <div class="order-row">
          <span class="ask-color">${a.level}</span>
          <span style="color: #cbd5e1;">￥${a.price.toFixed(2)}</span>
          <span style="color: #64748b;">${(a.volume / 100).toFixed(0)}手</span>
        </div>
      `).join('');
      asksList.innerHTML = asksHtml;

      // 买盘从一到五正序
      const bidsHtml = stock.orderBook.bids.map(b => `
        <div class="order-row">
          <span class="bid-color">${b.level}</span>
          <span style="color: #cbd5e1;">￥${b.price.toFixed(2)}</span>
          <span style="color: #64748b;">${(b.volume / 100).toFixed(0)}手</span>
        </div>
      `).join('');
      bidsList.innerHTML = bidsHtml;
    }

    // 更新当前持仓小卡片
    const holding = this.account.holdings[stock.id] || { shares: 0, totalCost: 0, avgPrice: 0 };
    const curVal = holding.shares * stock.currentPrice;
    const pnl = curVal - holding.totalCost;
    const pnlPct = holding.totalCost > 0 ? ((pnl / holding.totalCost) * 100).toFixed(2) : '0.00';

    const holdSharesEl = document.getElementById('hold-shares');
    const holdValEl = document.getElementById('hold-value');
    const holdAvgEl = document.getElementById('hold-avg-cost');
    const holdPnlEl = document.getElementById('hold-pnl');

    if (holdSharesEl) holdSharesEl.textContent = `${holding.shares} 股`;
    if (holdValEl) holdValEl.textContent = `￥${curVal.toFixed(2)}`;
    if (holdAvgEl) holdAvgEl.textContent = holding.shares > 0 ? `￥${holding.avgPrice.toFixed(2)}` : '--';
    if (holdPnlEl) {
      const isUp = pnl >= 0;
      holdPnlEl.style.color = isUp ? 'var(--up-red)' : 'var(--down-green)';
      holdPnlEl.textContent = `${isUp ? '+' : ''}￥${pnl.toFixed(2)} (${isUp ? '+' : ''}${pnlPct}%)`;
    }
  }

  // 刷新财富面板
  updatePortfolioUI() {
    let stockMarketValue = 0;
    let holdingCount = 0;

    Object.keys(this.account.holdings).forEach(id => {
      const h = this.account.holdings[id];
      const s = this.engine.getStock(id);
      if (h && s && h.shares > 0) {
        stockMarketValue += h.shares * s.currentPrice;
        holdingCount++;
      }
    });

    const totalAssets = this.account.cash + stockMarketValue;
    const totalProfit = totalAssets - this.account.initialCash;
    const profitRate = ((totalProfit / this.account.initialCash) * 100).toFixed(2);

    const valAssets = document.getElementById('val-total-assets');
    const subChange = document.getElementById('sub-total-change');
    const valCash = document.getElementById('val-cash');
    const valStock = document.getElementById('val-stock-market');
    const subCount = document.getElementById('sub-holding-count');
    const valProfit = document.getElementById('val-profit');
    const subProfitRate = document.getElementById('sub-profit-rate');

    if (valAssets) valAssets.textContent = `￥${totalAssets.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (subChange) subChange.textContent = `初始本金 ￥${this.account.initialCash.toLocaleString()}`;
    if (valCash) valCash.textContent = `￥${this.account.cash.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (valStock) valStock.textContent = `￥${stockMarketValue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (subCount) subCount.textContent = `持有 ${holdingCount} 只股票`;

    if (valProfit && subProfitRate) {
      const isUp = totalProfit >= 0;
      valProfit.className = `asset-value ${isUp ? 'up' : 'down'}`;
      valProfit.textContent = `${isUp ? '+' : ''}￥${totalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      subProfitRate.textContent = `总收益率: ${isUp ? '+' : ''}${profitRate}%`;
    }

    // 财商称号晋升
    this.updateWisdomRank(totalAssets);
  }

  updateWisdomRank(totalAssets) {
    const iconEl = document.getElementById('wisdom-icon');
    const nameEl = document.getElementById('wisdom-rank-name');
    const descEl = document.getElementById('wisdom-rank-desc');

    if (!iconEl || !nameEl || !descEl) return;

    if (totalAssets >= 200000) {
      iconEl.textContent = '👑';
      nameEl.textContent = '股市巴菲特传人';
      descEl.textContent = '资产翻倍！复利奇迹的创造者！';
    } else if (totalAssets >= 150000) {
      iconEl.textContent = '🌟';
      nameEl.textContent = '黄金坑抄底大师';
      descEl.textContent = '懂得在恐惧中发现被错杀的钻石！';
    } else if (totalAssets >= 120000) {
      iconEl.textContent = '🎯';
      nameEl.textContent = '敏锐价值猎手';
      descEl.textContent = '善于根据经济事件准确出击！';
    } else if (totalAssets > 100000) {
      iconEl.textContent = '🐷';
      nameEl.textContent = '储蓄小猪达人';
      descEl.textContent = '初尝投资盈利的喜悦！';
    } else {
      iconEl.textContent = '🌱';
      nameEl.textContent = '理财小苗';
      descEl.textContent = '多多探索，寻找你的第一桶金！';
    }
  }

  // 计算交易预估 (我输入文字投多少钱 ➔ 显示买多少股、花多少钱、剩多少钱)
  updateTradePreview() {
    const stock = this.engine.getStock(this.selectedStockId);
    if (!stock) return;

    const previewBox = document.getElementById('calc-preview-text');
    const maxInvestLabel = document.getElementById('label-max-invest');
    const holdingSharesLabel = document.getElementById('label-holding-shares');
    const holding = this.account.holdings[stock.id] || { shares: 0, totalCost: 0, avgPrice: 0 };

    if (maxInvestLabel) {
      maxInvestLabel.textContent = `可用现金: ￥${this.account.cash.toLocaleString()}`;
    }
    if (holdingSharesLabel) {
      holdingSharesLabel.textContent = `当前持仓: ${holding.shares} 股`;
    }

    if (!previewBox) return;

    if (this.tradeMode === 'buy') {
      const moneyInput = document.getElementById('input-trade-money');
      const inputAmount = parseFloat(moneyInput?.value) || 0;

      if (inputAmount <= 0) {
        previewBox.innerHTML = `请输入计划投入金额（如 <strong>￥5000</strong>），系统将为您自动撮合买入股数。`;
        return;
      }

      if (inputAmount > this.account.cash) {
        previewBox.innerHTML = `<span style="color: #ef4444;">⚠️ 投入金额 ￥${inputAmount.toLocaleString()} 超出当前可用现金 ￥${this.account.cash.toLocaleString()}，请调整金额或点击上方“+领￥5万”补充投资金。</span>`;
        return;
      }

      const sharesCanBuy = Math.floor(inputAmount / stock.currentPrice);
      if (sharesCanBuy <= 0) {
        previewBox.innerHTML = `<span style="color: #f59e0b;">💡 当前股票价格 ￥${stock.currentPrice.toFixed(2)}，投入金额不足买入 1 股，请增加投入金额。</span>`;
        return;
      }

      const actualCost = +(sharesCanBuy * stock.currentPrice).toFixed(2);
      const remainCash = +(this.account.cash - actualCost).toFixed(2);

      previewBox.innerHTML = `
        🎯 计划投入: <strong>￥${inputAmount.toLocaleString()}</strong><br>
        📈 以现价 <strong>￥${stock.currentPrice.toFixed(2)}</strong> 可买入: <strong>${sharesCanBuy} 股</strong><br>
        💵 实际扣款: <strong>￥${actualCost.toFixed(2)}</strong> | 剩余现金: <strong>￥${remainCash.toFixed(2)}</strong>
      `;
    } else {
      // 卖出模式
      if (holding.shares <= 0) {
        previewBox.innerHTML = `<span style="color: #94a3b8;">⚠️ 您当前未持有 ${stock.name}，无法进行卖出，请先切换到买入模式建仓。</span>`;
        return;
      }

      const sellShares = Math.max(1, Math.floor(holding.shares * this.sellRatio));
      const returnMoney = +(sellShares * stock.currentPrice).toFixed(2);
      const costOfSold = holding.avgPrice * sellShares;
      const profit = +(returnMoney - costOfSold).toFixed(2);
      const isProfit = profit >= 0;

      previewBox.innerHTML = `
        📉 计划卖出比例: <strong>${(this.sellRatio * 100).toFixed(0)}% (${sellShares} 股)</strong><br>
        💰 预计收回现金: <strong>￥${returnMoney.toFixed(2)}</strong><br>
        ${isProfit ? '🎉 预期实现盈利' : '📉 预期浮动亏损'}: <strong style="color: ${isProfit ? 'var(--up-red)' : 'var(--down-green)'};">${isProfit ? '+' : ''}￥${profit.toFixed(2)}</strong>
      `;
    }
  }

  // 确认执行交易
  executeTrade() {
    const stock = this.engine.getStock(this.selectedStockId);
    if (!stock) return;

    const holding = this.account.holdings[stock.id];

    if (this.tradeMode === 'buy') {
      const moneyInput = document.getElementById('input-trade-money');
      const inputAmount = parseFloat(moneyInput?.value) || 0;

      if (inputAmount <= 0 || inputAmount > this.account.cash) {
        alert('请输入有效的投入金额，且不能超过可用现金！');
        return;
      }

      const shares = Math.floor(inputAmount / stock.currentPrice);
      if (shares <= 0) {
        alert(`至少需要 ￥${stock.currentPrice.toFixed(2)} 才能买入 1 股！`);
        return;
      }

      const cost = +(shares * stock.currentPrice).toFixed(2);
      this.account.cash -= cost;

      // 更新持仓成本与数量
      const prevTotalCost = holding.totalCost;
      const prevShares = holding.shares;
      holding.shares += shares;
      holding.totalCost = +(prevTotalCost + cost).toFixed(2);
      holding.avgPrice = +(holding.totalCost / holding.shares).toFixed(2);

      // 播放买入音效与添加图表买点
      sound.playBuy();
      if (this.chart) this.chart.addTradeMarker('buy', stock.currentPrice);

      // 如果当前是黄金坑事件中买入，奖励礼花！
      if (this.engine.currentEvent?.id === 'event-golden-pit') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }

      this.updatePortfolioUI();
      this.updateActiveStockUI();
      this.renderStockList();
      this.updateTradePreview();
    } else {
      // 卖出操作
      if (holding.shares <= 0) {
        alert('您尚未持有该股票！');
        return;
      }

      const sellShares = Math.max(1, Math.floor(holding.shares * this.sellRatio));
      const revenue = +(sellShares * stock.currentPrice).toFixed(2);
      const costOfSold = holding.avgPrice * sellShares;
      const profit = revenue - costOfSold;

      this.account.cash += revenue;
      holding.shares -= sellShares;
      holding.totalCost = Math.max(0, +(holding.totalCost - costOfSold).toFixed(2));
      if (holding.shares === 0) {
        holding.avgPrice = 0;
        holding.totalCost = 0;
      }

      // 音效与反馈
      if (profit >= 0) {
        sound.playProfit();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        sound.playLoss();
      }

      if (this.chart) this.chart.addTradeMarker('sell', stock.currentPrice);

      this.updatePortfolioUI();
      this.updateActiveStockUI();
      this.renderStockList();
      this.updateTradePreview();
    }
  }

  // 渲染儿童自主探索卡片 (6只股票的档案与秘密)
  renderExplorerCards() {
    const container = document.getElementById('explorer-cards-container');
    if (!container) return;

    const stocks = this.engine.getAllStocks();
    container.innerHTML = stocks.map(s => `
      <div class="explorer-card" data-stock-id="${s.id}">
        <div class="explorer-card-head">
          <div class="explorer-icon">${s.symbol}</div>
          <div class="explorer-name">
            <h4>${s.name}</h4>
            <span>代码: ${s.code} · ${s.category}</span>
          </div>
        </div>
        <div class="explorer-body">
          <p>${s.description}</p>
          <div class="secret-box">
            <strong>🔑 波动秘密与超能力：</strong><br>
            ${s.secret}
          </div>
        </div>
      </div>
    `).join('');

    // 点击探索卡片直接切换到该股票
    container.querySelectorAll('.explorer-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.stockId;
        this.selectStock(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // 渲染财商小问答
  renderQuiz() {
    const q = this.quizzes[this.currentQuizIndex];
    const qText = document.getElementById('quiz-question-text');
    const optBox = document.getElementById('quiz-options-box');

    if (!qText || !optBox) return;

    qText.textContent = `题目 (${this.currentQuizIndex + 1}/${this.quizzes.length})：${q.question}`;
    optBox.innerHTML = q.options.map((opt, i) => `
      <button class="btn-start-quiz" data-opt-index="${i}">${opt.text}</button>
    `).join('');

    optBox.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.optIndex, 10);
        const selected = q.options[idx];
        if (selected.correct) {
          sound.playProfit();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.7 }
          });
          this.account.cash += 10000;
          this.updatePortfolioUI();
          alert(`🎉 恭喜你！${q.explanation}`);
          this.currentQuizIndex = (this.currentQuizIndex + 1) % this.quizzes.length;
          this.renderQuiz();
        } else {
          sound.playLoss();
          alert('❌ 思考一下，再试一次哦！想想为什么避险或供需关系会影响这个资产！');
        }
      });
    });
  }
}

// 页面加载完成后启动应用
window.addEventListener('DOMContentLoaded', () => {
  new StockApp();
});
