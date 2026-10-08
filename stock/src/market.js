// Market Simulation Engine, Stock Definitions & Economic Events

export const STOCKS_DATA = [
  {
    id: 'sweet',
    code: '600888',
    name: '甜心冰淇淋工厂',
    shortName: '甜心工坊',
    symbol: '🍦',
    color: '#f43f5e',
    secondaryColor: '#fda4af',
    category: '大众消费 & 甜蜜零食',
    description: '全球最大的梦幻彩虹冰淇淋与快乐糖果制造商。拥有 3000 家奇趣甜品城堡，深受小朋友们喜爱！',
    secret: '受季节气温影响巨大！夏天极度炎热时销量翻倍；冬天是淡季。原材料牛奶、草莓和白糖价格也会影响利润。',
    character: '活泼可爱的冰淇淋小兔兔子，头顶草莓圣代！',
    initialPrice: 28.50,
    volatility: 0.035, // 稳健消费，波动中等
    pe: 22.4, // 市盈率
    pb: 3.8,  // 市净率
    marketCap: '128.5 亿',
    sharesTotal: 450000000,
    tags: ['消费白马', '夏日明星', '稳健分红', '儿童最爱']
  },
  {
    id: 'rocket',
    code: '688999',
    name: '星际神舟火箭科技',
    shortName: '星际科技',
    symbol: '🚀',
    color: '#8b5cf6',
    secondaryColor: '#c4b5fd',
    category: '前沿航天 & 人工智能',
    description: '研发可回收重型运载火箭、深空探测AI机器人和轨道太空站的硬核先锋科技企业。',
    secret: '高成长、高弹性！一旦技术突破成功点火发射，股价会迎来暴力飙升；如果研发遇到故障则会快速回调。',
    character: '戴着宇航员头盔的智能探索小柴犬，背着喷气推进器！',
    initialPrice: 86.00,
    volatility: 0.075, // 高风险高成长，波动大
    pe: 68.2,
    pb: 9.5,
    marketCap: '520.0 亿',
    sharesTotal: 604650000,
    tags: ['硬核科技', '太空经济', 'AI革命', '高成长高波动']
  },
  {
    id: 'gold',
    code: '601899',
    name: '恐龙黄金避险矿业',
    shortName: '恐龙黄金',
    symbol: '🦕',
    color: '#eab308',
    secondaryColor: '#fde047',
    category: '贵金属 & 全球避险之锚',
    description: '开采侏罗纪远古深层纯金矿藏。黄金自古是全人类公认的硬通货，是抵御一切市场动荡的天然盾牌。',
    secret: '“乱世买黄金”！每当地缘局势紧张、发生突发战争冲突时，全球资金都会涌入恐龙黄金避险！遇到“黄金坑”往往是绝佳抄底良机！',
    character: '浑身金灿灿的霸王龙宝宝，脖子上挂着闪亮大金币奖章！',
    initialPrice: 52.80,
    volatility: 0.045,
    pe: 18.6,
    pb: 2.9,
    marketCap: '360.8 亿',
    sharesTotal: 683330000,
    tags: ['避险之王', '黄金坑先锋', '抗通胀', '抗战争风险']
  },
  {
    id: 'bear',
    code: '300123',
    name: '熊博士开心大药房',
    shortName: '熊博士药业',
    symbol: '💊',
    color: '#06b6d4',
    secondaryColor: '#67e8f9',
    category: '生物医药 & 快乐健康',
    description: '拥有神奇彩虹维他命配方和特效感冒糖浆，致力于保护森林小动物和人类宝宝健康成长的医药龙头。',
    secret: '医药是典型的“防御性资产”。当流感病毒突袭或季节变换时，药品销量会井喷；新专利药获批更会触发强力涨停。',
    character: '戴着金丝眼镜、穿着白大褂的慈祥北极熊博士！',
    initialPrice: 41.20,
    volatility: 0.04,
    pe: 26.5,
    pb: 4.2,
    marketCap: '215.3 亿',
    sharesTotal: 522570000,
    tags: ['生物医药', '健康守护', '抗周期', '流感特效']
  },
  {
    id: 'solar',
    code: '600111',
    name: '绿野未来超级太阳能',
    shortName: '绿野光能',
    symbol: '⚡',
    color: '#10b981',
    secondaryColor: '#6ee7b7',
    category: '清洁能源 & 绿色电网',
    description: '制造全球超高转化率钙钛矿太阳能电池板，用阳光点亮未来智慧城市，告别污染与碳排放。',
    secret: '当传统石油发生危机、煤炭价格飙升或联合国宣布绿色环保巨额补贴时，清洁太阳能会成为全市场最抢手的香饽饽！',
    character: '头戴太阳花向日葵帽子、胸前带着发光绿宝石的精灵鹿！',
    initialPrice: 34.60,
    volatility: 0.05,
    pe: 31.0,
    pb: 4.6,
    marketCap: '198.6 亿',
    sharesTotal: 574000000,
    tags: ['碳中和', '绿色清洁', '能源替代', '政策利好']
  },
  {
    id: 'pipi',
    code: '300055',
    name: '皮皮萌乐元宇宙互娱',
    shortName: '皮皮互娱',
    symbol: '🎮',
    color: '#ec4899',
    secondaryColor: '#f472b6',
    category: '数字游戏 & 虚拟梦工场',
    description: '打造亿万级少儿冒险沙盒游戏《皮皮大乱斗》与超萌卡通动画大电影，手握超人气顶流IP。',
    secret: '暑假、寒假在线人数暴增是常规爆发点；新爆款游戏公测霸榜应用商店会引爆涨停潮；反之遇系统故障会短期震荡。',
    character: '戴着VR头显、手握游戏手柄的粉色皮皮猫！',
    initialPrice: 22.40,
    volatility: 0.065,
    pe: 45.2,
    pb: 6.8,
    marketCap: '112.0 亿',
    sharesTotal: 500000000,
    tags: ['数字文娱', '寒暑假行情', '爆款游戏', '元宇宙IP']
  }
];

// 核心重大突发经济与市场事件（专门覆盖黄金坑、战争风云、夏日热浪、科技奇迹、医药突击、泡沫教训等）
export const MARKET_EVENTS = [
  {
    id: 'event-golden-pit',
    title: '🌟 惊现绝佳“黄金坑”！非理性恐慌砸出历史大底',
    theme: 'golden-pit',
    badge: '财富黄金坑',
    summary: '市场因一则虚假谣言引发集体盲目恐慌抛售，优质大白马股被严重“错杀砸入深坑”。但公司基本面依然极为健康，技术形态走出教科书般的“V型黄金坑”，吸引聪明价值资金进场暴风抄底！',
    explanation: '【什么是黄金坑？】大人在股票市场常说“千金难买黄金坑”！当一家非常优秀、每天都在赚钱的好公司，因为突发的谣言或整体市场恐慌，股价被砸出一个深坑时，价格远远低于它的真实价值。这时候坑底就像捡黄金一样，是勇敢者最好的低吸建仓机会！随后恐慌散去，股价就像压紧的弹簧一样强力报复性暴涨！',
    dialogue: '小牛播报员：前方高能预警！恐慌盘宣泄完毕，优质核心资产全线砸出深V黄金坑！这是聪明资金的最爱！',
    videoTopic: 'golden_pit',
    effects: {
      // 黄金坑机制：先砸盘跌入坑底(-6%~-9%)，然后赋予高反弹动力(+12%~+18%)
      sweet: { immediate: -0.05, reboundBonus: 0.12 },
      rocket: { immediate: -0.08, reboundBonus: 0.18 },
      gold: { immediate: 0.06, reboundBonus: 0.10 }, // 黄金本身抗跌甚至逆势上涨
      bear: { immediate: -0.04, reboundBonus: 0.08 },
      solar: { immediate: -0.06, reboundBonus: 0.14 },
      pipi: { immediate: -0.07, reboundBonus: 0.15 }
    }
  },
  {
    id: 'event-war-crisis',
    title: '⚔️ 地缘风云突变！局势动荡引发全球避险狂潮',
    theme: 'war',
    badge: '地缘风云',
    summary: '突发海峡局势紧张，国际商船运输航线受阻，纸币信用受到担忧。全球投资者火速开启避险模式，资金疯狂涌入【恐龙黄金矿业】和新能源板块，而普通高风险科技和非必须消费面临短期调整。',
    explanation: '【为什么战争会让黄金大涨？】自古以来有句老话叫“乱世买黄金”！因为黄金是全人类共识的真正硬通货，无论哪个国家都认可。突发战争或动荡时，大家担心纸币贬值、物价飞涨，就会疯狂买入黄金避险，从而推动金矿股票暴涨！同时石油天然气运不出来，太阳能清洁能源也会因为“替代效应”而大涨！',
    dialogue: '小牛播报员：紧急快报！地缘冲突阴云笼罩，资金全力涌向恐龙黄金避风港，黄金板块掀起涨停狂潮！',
    videoTopic: 'war_crisis',
    effects: {
      gold: { immediate: 0.10, reboundBonus: 0.08 },    // 黄金暴涨涨停
      solar: { immediate: 0.07, reboundBonus: 0.05 },   // 替代能源大涨
      sweet: { immediate: -0.04, reboundBonus: 0.02 },  // 消费受制
      rocket: { immediate: -0.06, reboundBonus: 0.03 }, // 科技估值承压
      bear: { immediate: 0.02, reboundBonus: 0.02 },    // 医药避险微涨
      pipi: { immediate: -0.05, reboundBonus: 0.02 }    // 游戏文娱承压
    }
  },
  {
    id: 'event-heatwave',
    title: '☀️ 40℃ 超级热浪袭城！全国冰淇淋爆单断货',
    theme: 'weather',
    badge: '季节消费狂欢',
    summary: '全国气温突破 40 度大关，小朋友和家长们在冷饮店排起长龙！【甜心冰淇淋工厂】日出货量创下历史新高，自动化生产线24小时连轴转，各家超市纷纷加价抢货！',
    explanation: '【供需关系决定价格与利润】天气极度炎热导致冰淇淋需求量出现几何级数暴增，供不应求！公司产品卖得越多，营业收入和净利润就越高，大人们查看季度财报发现业绩暴增300%，纷纷抢购股票，直接推高股价！',
    dialogue: '小牛播报员：太热啦！小兔子厂长宣布草莓冰淇淋全国售罄，甜心工坊单日流水破纪录，股价直接封死涨停！',
    videoTopic: 'heatwave',
    effects: {
      sweet: { immediate: 0.098, reboundBonus: 0.06 }, // 冰淇淋涨停
      solar: { immediate: 0.05, reboundBonus: 0.03 },  // 阳光充足发电量高
      pipi: { immediate: 0.03, reboundBonus: 0.02 },   // 天气热在家打游戏多
      rocket: { immediate: 0.01, reboundBonus: 0.01 },
      gold: { immediate: -0.01, reboundBonus: 0.00 },
      bear: { immediate: 0.02, reboundBonus: 0.01 }
    }
  },
  {
    id: 'event-rocket-launch',
    title: '🚀 星际神舟十号发射圆满成功！实现垂直软着陆回收',
    theme: 'tech',
    badge: '科技里程碑',
    summary: '【星际神舟火箭科技】新一代可重复使用星际飞船在酒泉基地成功发射入轨，并首次完成毫米级海上升空回收！发射成本降低85%，商业订单排到三年后！',
    explanation: '【科技创新如何重塑估值？】尖端科技拥有颠覆行业的力量。当关键技术突破成功，原本只能赚几千万的公司未来有可能赚上百亿，这就是科技股的“估值重构与成长溢价”！大人们愿意为未来的巨大潜力支付更高的买价！',
    dialogue: '小牛播报员：3、2、1，点火！火箭穿云破雾完美着陆！科技力量震动全球资本市场，星际科技一字涨停！',
    videoTopic: 'rocket_launch',
    effects: {
      rocket: { immediate: 0.10, reboundBonus: 0.08 }, // 科技龙头封死涨停
      solar: { immediate: 0.04, reboundBonus: 0.03 },  // 航天太阳能翼协同
      pipi: { immediate: 0.04, reboundBonus: 0.02 },   // 太空游戏IP大卖
      sweet: { immediate: 0.01, reboundBonus: 0.01 },
      gold: { immediate: -0.02, reboundBonus: 0.01 },
      bear: { immediate: 0.01, reboundBonus: 0.01 }
    }
  },
  {
    id: 'event-flu-season',
    title: '💊 冬春换季流感来袭！熊博士彩虹特效糖浆获国家专利',
    theme: 'medicine',
    badge: '健康守护利好',
    summary: '换季季节感冒增多，【熊博士开心大药房】最新研制的草莓味无苦味儿童感冒特效糖浆正式获批上市，各大医院与药店排队订购，产能全开！',
    explanation: '【医药股的抗周期防御与专利护城河】无论经济好坏，人们生病都需要吃药，所以医药行业被称为“抗周期防御性资产”。如果一家公司研发出了独家专利的新药，别的公司不能随便仿制，这就叫“专利护城河”，能持续带来丰厚的利润！',
    dialogue: '小牛播报员：熊博士的大药房迎来了甜蜜的奇迹！草莓味特效糖浆让宝宝吃药不再苦，医药板块全线飘红！',
    videoTopic: 'flu_medicine',
    effects: {
      bear: { immediate: 0.095, reboundBonus: 0.05 }, // 医药大涨
      sweet: { immediate: -0.02, reboundBonus: 0.01 },
      rocket: { immediate: 0.01, reboundBonus: 0.01 },
      gold: { immediate: 0.02, reboundBonus: 0.01 },
      solar: { immediate: 0.01, reboundBonus: 0.01 },
      pipi: { immediate: 0.02, reboundBonus: 0.01 }
    }
  },
  {
    id: 'event-bubble-burst',
    title: '🐻 盲目跟风爆炒泡沫破裂！警惕盲目追高与击鼓传花',
    theme: 'risk',
    badge: '风险教育警钟',
    summary: '某些投机资金此前不看公司业绩盲目追捧高位概念股，今天突发高位跳水获利了结，追高资金被套牢。而估值便宜、拥有高股息现金分红的稳健公司展现出强大抗跌性。',
    explanation: '【什么是股市泡沫与价值投资？】就像吹泡泡一样，如果一个公司的股价被炒得极高，但它根本不赚钱，这个价格就是脆弱的泡泡。一旦没有人愿意出更高价格接盘，泡泡就会瞬间破裂！大人们用血泪教训告诉我们：做投资千万不要跟风盲目追高，一定要学会看公司真正的实力和价格是否便宜！',
    dialogue: '小牛播报员：市场敲响风险警钟！潮水退去才知谁在裸泳，巴菲特爷爷说的对：别人贪婪时我恐惧，保住本金第一！',
    videoTopic: 'bubble_burst',
    effects: {
      pipi: { immediate: -0.08, reboundBonus: 0.02 },
      rocket: { immediate: -0.06, reboundBonus: 0.02 },
      sweet: { immediate: -0.01, reboundBonus: 0.03 }, // 低估值消费抗跌
      gold: { immediate: 0.04, reboundBonus: 0.03 },   // 避险保值
      bear: { immediate: 0.01, reboundBonus: 0.02 },
      solar: { immediate: -0.03, reboundBonus: 0.02 }
    }
  }
];

export class MarketEngine {
  constructor() {
    this.stocks = new Map();
    this.day = 1;
    this.timeSlot = '09:30'; // 9:30 - 15:00
    this.tickCount = 0;
    this.currentEvent = null;
    this.activeReboundQueue = [];
    this.historyEvents = [];
    this.listeners = new Set();
    this.initStocks();
  }

  initStocks() {
    STOCKS_DATA.forEach(data => {
      const price = data.initialPrice;
      const history = [];
      // 生成初始 30 根历史 K 线数据，让图表开箱即有丰富的 K 线走势
      let p = price * 0.9;
      for (let i = 30; i >= 1; i--) {
        const change = (Math.random() - 0.48) * (p * data.volatility);
        const open = p;
        const close = +(open + change).toFixed(2);
        const high = +(Math.max(open, close) + Math.random() * (p * 0.015)).toFixed(2);
        const low = +(Math.min(open, close) - Math.random() * (p * 0.015)).toFixed(2);
        const volume = Math.floor(10000 + Math.random() * 50000);
        history.push({ day: -i, open, high, low, close, volume });
        p = close;
      }

      this.stocks.set(data.id, {
        ...data,
        currentPrice: p,
        prevClose: history[history.length - 2]?.close || p,
        openPrice: history[history.length - 1]?.open || p,
        highPrice: Math.max(p, history[history.length - 1]?.high || p),
        lowPrice: Math.min(p, history[history.length - 1]?.low || p),
        changePercent: 0,
        volumeToday: 32000,
        klineHistory: history,
        orderBook: this.generateOrderBook(p)
      });
    });
  }

  generateOrderBook(currentPrice) {
    const bids = []; // 买一 ~ 买五
    const asks = []; // 卖一 ~ 卖五
    for (let i = 1; i <= 5; i++) {
      bids.push({
        level: `买${i}`,
        price: +(currentPrice - i * 0.05).toFixed(2),
        volume: Math.floor(100 + Math.random() * 900) * 100
      });
      asks.push({
        level: `卖${i}`,
        price: +(currentPrice + i * 0.05).toFixed(2),
        volume: Math.floor(100 + Math.random() * 900) * 100
      });
    }
    return { bids, asks };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  getStock(id) {
    return this.stocks.get(id);
  }

  getAllStocks() {
    return Array.from(this.stocks.values());
  }

  // 触发指定事件
  triggerEvent(eventId) {
    const event = MARKET_EVENTS.find(e => e.id === eventId);
    if (!event) return null;

    this.currentEvent = {
      ...event,
      timestamp: Date.now(),
      day: this.day
    };
    this.historyEvents.unshift(this.currentEvent);

    // 针对各股票施加即时冲击
    this.stocks.forEach(stock => {
      const effect = event.effects[stock.id];
      if (effect) {
        const deltaPct = effect.immediate;
        const newPrice = +(stock.currentPrice * (1 + deltaPct)).toFixed(2);
        stock.currentPrice = Math.max(1.0, newPrice);
        stock.highPrice = Math.max(stock.highPrice, stock.currentPrice);
        stock.lowPrice = Math.min(stock.lowPrice, stock.currentPrice);
        stock.volumeToday += Math.floor(50000 + Math.random() * 100000);
        stock.orderBook = this.generateOrderBook(stock.currentPrice);

        // 如果该事件有后劲反弹 (比如黄金坑的报复性反弹)
        if (effect.reboundBonus) {
          this.activeReboundQueue.push({
            stockId: stock.id,
            totalBonus: effect.reboundBonus,
            remainingTicks: 5,
            bonusPerTick: effect.reboundBonus / 5
          });
        }
      }
    });

    this.notify();
    return this.currentEvent;
  }

  // 市场步进一个时钟周期 (tick)
  tick() {
    this.tickCount++;

    // 模拟时间推移 (09:30 -> 15:00)
    const minutes = 9 * 60 + 30 + Math.floor(this.tickCount * 5);
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    this.timeSlot = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    if (this.tickCount % 24 === 0) {
      this.day++;
    }

    // 推进反弹队列
    const activeRebounds = [];
    this.activeReboundQueue.forEach(item => {
      const stock = this.stocks.get(item.stockId);
      if (stock) {
        const bonusPct = item.bonusPerTick * (0.8 + Math.random() * 0.4);
        stock.currentPrice = +(stock.currentPrice * (1 + bonusPct)).toFixed(2);
        stock.highPrice = Math.max(stock.highPrice, stock.currentPrice);
        stock.volumeToday += Math.floor(20000 * Math.random());
      }
      item.remainingTicks--;
      if (item.remainingTicks > 0) {
        activeRebounds.push(item);
      }
    });
    this.activeReboundQueue = activeRebounds;

    // 常规价格波动 (模拟微观撮合与情绪噪声)
    this.stocks.forEach(stock => {
      const noise = (Math.random() - 0.495) * stock.volatility * stock.currentPrice * 0.4;
      const momentum = (stock.currentPrice - stock.openPrice) * 0.01;
      let newPrice = +(stock.currentPrice + noise + momentum).toFixed(2);

      // 单日涨跌幅限制 (-10% ~ +10%，科技股 -20% ~ +20%)
      const maxLimitPct = stock.category.includes('科技') ? 0.20 : 0.10;
      const maxPrice = +(stock.prevClose * (1 + maxLimitPct)).toFixed(2);
      const minPrice = +(stock.prevClose * (1 - maxLimitPct)).toFixed(2);

      newPrice = Math.min(maxPrice, Math.max(minPrice, newPrice));
      if (newPrice <= 0.5) newPrice = 0.5;

      stock.currentPrice = newPrice;
      stock.highPrice = Math.max(stock.highPrice, newPrice);
      stock.lowPrice = Math.min(stock.lowPrice, newPrice);
      stock.changePercent = +(((newPrice - stock.prevClose) / stock.prevClose) * 100).toFixed(2);
      stock.volumeToday += Math.floor(1000 + Math.random() * 5000);
      stock.orderBook = this.generateOrderBook(newPrice);

      // 实时更新最近一根 K 线
      const lastK = stock.klineHistory[stock.klineHistory.length - 1];
      if (lastK) {
        lastK.close = newPrice;
        lastK.high = Math.max(lastK.high, newPrice);
        lastK.low = Math.min(lastK.low, newPrice);
        lastK.volume = stock.volumeToday;
      }

      // 如果一天结束，压入新一根 K 线
      if (this.tickCount % 24 === 0) {
        stock.klineHistory.push({
          day: this.day,
          open: newPrice,
          high: newPrice,
          low: newPrice,
          close: newPrice,
          volume: 0
        });
        if (stock.klineHistory.length > 50) {
          stock.klineHistory.shift();
        }
        stock.prevClose = newPrice;
        stock.openPrice = newPrice;
        stock.highPrice = newPrice;
        stock.lowPrice = newPrice;
        stock.volumeToday = 0;
      }
    });

    // 随机事件触发机制 (每 35~50 个 tick 自动触发一个市场事件，如果当前没有发生事件)
    if (this.tickCount % 36 === 0 && !this.currentEvent) {
      const randomEvent = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
      this.triggerEvent(randomEvent.id);
    } else if (this.currentEvent && this.tickCount % 16 === 0) {
      // 事件过期淡出
      this.currentEvent = null;
    }

    this.notify();
  }
}
