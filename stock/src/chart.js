// Canvas Chart Engine: Candlestick (K-Line), Moving Averages & Kids Rainbow Sparkline

export class StockChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = 'candlestick'; // 'candlestick' (大人专业K线) | 'sparkline' (儿童彩虹折线)
    this.currentStock = null;
    this.hoverIndex = -1;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isHovering = false;
    this.buyMarkers = []; // 买入点标记 { price, dayIndex }
    this.sellMarkers = []; // 卖出点标记 { price, dayIndex }

    this.initEvents();
  }

  setMode(mode) {
    this.mode = mode;
    this.render();
  }

  addTradeMarker(type, price) {
    if (!this.currentStock) return;
    const dayIndex = this.currentStock.klineHistory.length - 1;
    if (type === 'buy') {
      this.buyMarkers.push({ price, dayIndex, time: Date.now() });
    } else {
      this.sellMarkers.push({ price, dayIndex, time: Date.now() });
    }
    this.render();
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
      this.isHovering = true;
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.hoverIndex = -1;
      this.render();
    });
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight || 340;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.scale(dpr, dpr);
    this.displayWidth = w;
    this.displayHeight = h;
    this.render();
  }

  setStock(stock) {
    this.currentStock = stock;
    this.render();
  }

  // 计算移动平均线 (MA)
  calculateMA(history, period) {
    const ma = [];
    for (let i = 0; i < history.length; i++) {
      if (i < period - 1) {
        ma.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += history[i - j].close;
        }
        ma.push(+(sum / period).toFixed(2));
      }
    }
    return ma;
  }

  render() {
    if (!this.currentStock || !this.displayWidth) return;
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;

    // 清空背景
    ctx.clearRect(0, 0, w, h);

    // 渐变暗色科技背景
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0c111e');
    bgGrad.addColorStop(1, '#080c15');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const history = this.currentStock.klineHistory;
    if (!history || history.length === 0) return;

    // 划分区域：顶部主图 (K线/折线 72% 高度)，底部副图 (成交量 22% 高度)
    const paddingLeft = 14;
    const paddingRight = 65; // 留出右侧价格轴
    const paddingTop = 32;
    const mainHeight = h * 0.65;
    const volTop = mainHeight + 24;
    const volHeight = h - volTop - 20;
    const plotWidth = w - paddingLeft - paddingRight;

    // 查找主图最高最低价
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    history.forEach(k => {
      minPrice = Math.min(minPrice, k.low);
      maxPrice = Math.max(maxPrice, k.high);
      maxVol = Math.max(maxVol, k.volume || 1);
    });

    const priceBuffer = (maxPrice - minPrice) * 0.1 || 1.0;
    minPrice = Math.max(0.1, minPrice - priceBuffer);
    maxPrice += priceBuffer;

    const priceToY = (p) => paddingTop + (1 - (p - minPrice) / (maxPrice - minPrice)) * mainHeight;
    const volToH = (v) => (v / (maxVol || 1)) * volHeight;

    // 绘制网格背景线与右侧价格刻度
    this.drawGrid(ctx, w, h, paddingLeft, paddingRight, paddingTop, mainHeight, minPrice, maxPrice);

    // 计算均线 MA5, MA10, MA20
    const ma5 = this.calculateMA(history, 5);
    const ma10 = this.calculateMA(history, 10);
    const ma20 = this.calculateMA(history, 20);

    const barWidth = Math.max(4, (plotWidth / history.length) * 0.75);
    const stepX = plotWidth / history.length;

    if (this.mode === 'candlestick') {
      // ===== 大人专业 K 线模式 =====
      history.forEach((k, i) => {
        const x = paddingLeft + i * stepX + stepX * 0.5;
        const isUp = k.close >= k.open;
        // A股红涨绿跌
        const color = isUp ? '#ef4444' : '#10b981';

        // 1. 绘制成交量柱状图
        const vH = volToH(k.volume);
        ctx.fillStyle = isUp ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.45)';
        ctx.fillRect(x - barWidth / 2, volTop + volHeight - vH, barWidth, vH);

        // 2. 绘制上下影线
        const highY = priceToY(k.high);
        const lowY = priceToY(k.low);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // 3. 绘制实体蜡烛
        const openY = priceToY(k.open);
        const closeY = priceToY(k.close);
        const topY = Math.min(openY, closeY);
        const bodyH = Math.max(2, Math.abs(closeY - openY));

        ctx.fillStyle = color;
        ctx.fillRect(x - barWidth / 2, topY, barWidth, bodyH);
      });

      // 绘制 MA 均线
      this.drawMALine(ctx, ma5, stepX, paddingLeft, priceToY, '#facc15', 'MA5');
      this.drawMALine(ctx, ma10, stepX, paddingLeft, priceToY, '#c084fc', 'MA10');
      this.drawMALine(ctx, ma20, stepX, paddingLeft, priceToY, '#38bdf8', 'MA20');

      // 绘制顶部大人指标图例
      this.drawLegend(ctx, paddingLeft, 18, [
        { label: 'MA5: ' + (ma5[ma5.length - 1] || '--'), color: '#facc15' },
        { label: 'MA10: ' + (ma10[ma10.length - 1] || '--'), color: '#c084fc' },
        { label: 'MA20: ' + (ma20[ma20.length - 1] || '--'), color: '#38bdf8' }
      ]);
    } else {
      // ===== 儿童萌趣彩虹趋势线模式 =====
      // 绘制平滑彩虹曲线与梦幻发光渐变填充
      const points = history.map((k, i) => ({
        x: paddingLeft + i * stepX + stepX * 0.5,
        y: priceToY(k.close)
      }));

      // 底部渐变填充
      const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, mainHeight + paddingTop);
      areaGrad.addColorStop(0, `${this.currentStock.color}55`);
      areaGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, mainHeight + paddingTop);
      ctx.lineTo(points[0].x, mainHeight + paddingTop);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // 彩虹发光主线条
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.strokeStyle = this.currentStock.color;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = this.currentStock.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0; // 重置

      // 最后一个最新价格节点：动态呼吸光环与吉祥物表情
      const lastPoint = points[points.length - 1];
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.currentStock.color;
      ctx.stroke();

      // 成交量柱状图 (柔和彩色气泡柱)
      history.forEach((k, i) => {
        const x = paddingLeft + i * stepX + stepX * 0.5;
        const vH = volToH(k.volume);
        ctx.fillStyle = `${this.currentStock.color}40`;
        ctx.fillRect(x - barWidth / 2, volTop + volHeight - vH, barWidth, vH);
      });

      // 顶部儿童趣味提示
      this.drawKidsLegend(ctx, paddingLeft, 18, this.currentStock);
    }

    // 绘制买入/卖出标记图钉
    this.drawTradeMarkers(ctx, stepX, paddingLeft, priceToY);

    // 绘制十字光标与交互浮层
    if (this.isHovering && this.mouseX >= paddingLeft && this.mouseX <= w - paddingRight) {
      const idx = Math.min(
        history.length - 1,
        Math.max(0, Math.floor((this.mouseX - paddingLeft) / stepX))
      );
      this.drawCrosshair(ctx, idx, stepX, paddingLeft, priceToY, history, w, paddingRight, mainHeight, paddingTop);
    }
  }

  drawGrid(ctx, w, h, pl, pr, pt, mh, minP, maxP) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.font = '11px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';

    const rows = 4;
    for (let i = 0; i <= rows; i++) {
      const y = pt + (mh / rows) * i;
      ctx.beginPath();
      ctx.moveTo(pl, y);
      ctx.lineTo(w - pr, y);
      ctx.stroke();

      // 右侧标尺价格
      const pVal = maxP - ((maxP - minP) / rows) * i;
      ctx.fillText(`￥${pVal.toFixed(2)}`, w - pr + 8, y + 4);
    }

    // 成交量分割线
    const volTop = mh + 24;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.moveTo(pl, volTop);
    ctx.lineTo(w - pr, volTop);
    ctx.stroke();
    ctx.fillText('成交量 (VOL)', pl, volTop - 5);
  }

  drawMALine(ctx, ma, stepX, pl, priceToY, color) {
    ctx.beginPath();
    let started = false;
    ma.forEach((val, i) => {
      if (val !== null) {
        const x = pl + i * stepX + stepX * 0.5;
        const y = priceToY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  drawLegend(ctx, x, y, items) {
    let curX = x;
    ctx.font = '12px Outfit, sans-serif';
    items.forEach(it => {
      ctx.fillStyle = it.color;
      ctx.fillRect(curX, y - 9, 8, 8);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(it.label, curX + 12, y - 1);
      curX += ctx.measureText(it.label).width + 24;
    });
  }

  drawKidsLegend(ctx, x, y, stock) {
    ctx.font = 'bold 13px Outfit, Noto Sans SC, sans-serif';
    ctx.fillStyle = stock.color;
    ctx.fillText(`${stock.symbol} ${stock.name} · 快乐探索走势线`, x, y);
    ctx.font = '11px Noto Sans SC, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`(向上走代表公司赚大钱！彩虹发光点是现在的最新价格哦)`, x + 240, y);
  }

  drawTradeMarkers(ctx, stepX, pl, priceToY) {
    // 买入：绿色/金色向上小箭头
    this.buyMarkers.forEach(m => {
      const x = pl + m.dayIndex * stepX + stepX * 0.5;
      const y = priceToY(m.price);
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('买', x, y + 3);
    });

    // 卖出：紫色向下小标记
    this.sellMarkers.forEach(m => {
      const x = pl + m.dayIndex * stepX + stepX * 0.5;
      const y = priceToY(m.price);
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('卖', x, y + 3);
    });
  }

  drawCrosshair(ctx, idx, stepX, pl, priceToY, history, w, pr, mh, pt) {
    const k = history[idx];
    if (!k) return;
    const x = pl + idx * stepX + stepX * 0.5;
    const y = priceToY(k.close);

    // 虚线十字光标
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;

    // 纵线
    ctx.beginPath();
    ctx.moveTo(x, pt);
    ctx.lineTo(x, pt + mh);
    ctx.stroke();

    // 横线
    ctx.beginPath();
    ctx.moveTo(pl, y);
    ctx.lineTo(w - pr, y);
    ctx.stroke();
    ctx.restore();

    // 悬浮详情小卡片 (Tooltip)
    const isUp = k.close >= k.open;
    const chgPct = (((k.close - k.open) / k.open) * 100).toFixed(2);
    const boxW = 150;
    const boxH = 92;
    let boxX = x + 15;
    if (boxX + boxW > w - pr) boxX = x - boxW - 15;
    const boxY = Math.max(pt + 10, Math.min(y - 40, pt + mh - boxH - 10));

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = isUp ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px Outfit, Noto Sans SC, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`交易周期: Day ${Math.abs(k.day)}`, boxX + 10, boxY + 18);

    ctx.font = '11px Outfit, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`开盘: ￥${k.open.toFixed(2)}`, boxX + 10, boxY + 36);
    ctx.fillText(`收盘: ￥${k.close.toFixed(2)}`, boxX + 80, boxY + 36);
    ctx.fillText(`最高: ￥${k.high.toFixed(2)}`, boxX + 10, boxY + 54);
    ctx.fillText(`最低: ￥${k.low.toFixed(2)}`, boxX + 80, boxY + 54);

    ctx.fillStyle = isUp ? '#ef4444' : '#10b981';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`涨跌: ${isUp ? '+' : ''}${chgPct}%`, boxX + 10, boxY + 74);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`量: ${(k.volume / 100).toFixed(0)}手`, boxX + 80, boxY + 74);
  }
}
