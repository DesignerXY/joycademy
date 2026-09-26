import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { PieChart, RotateCcw, Sparkles, Check } from 'lucide-react';

export default function FractionLab({ onComplete }) {
  const [denominator, setDenominator] = useState(6);
  const [selectedSlices, setSelectedSlices] = useState(new Set([0, 1])); // 2/6 selected by default

  const toggleSlice = (idx) => {
    sound.playClick();
    const next = new Set(selectedSlices);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setSelectedSlices(next);

    if (next.size > 0 && onComplete) {
      onComplete();
    }
  };

  const changeDenominator = (d) => {
    sound.playClick();
    setDenominator(d);
    setSelectedSlices(new Set([0]));
  };

  const numerator = selectedSlices.size;

  // 生成扇形 SVG 路径
  const makeSectorPath = (index, total) => {
    const anglePerSector = (2 * Math.PI) / total;
    const startAngle = index * anglePerSector - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSector - Math.PI / 2;

    const cx = 130;
    const cy = 130;
    const r = 110;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArcFlag = anglePerSector > Math.PI ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <PieChart size={18} />
          <span>具象工坊 · 彩虹披萨切片与分数实验</span>
        </div>
        <button
          className="lab-reset-btn"
          onClick={() => {
            sound.playClick();
            setSelectedSlices(new Set([0]));
          }}
        >
          <RotateCcw size={16} /> 清空选区
        </button>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          动手实验：点击切换<strong>【平均分的份数】</strong>，再点击披萨扇形切片进行品尝或着色，直观感受分子与分母！
        </span>
      </div>

      <div className="fraction-lab-body">
        {/* 交互式披萨 SVG */}
        <div className="fraction-visual-col">
          <svg className="pizza-svg" viewBox="0 0 260 260" width="240" height="240">
            {/* 披萨盘底 */}
            <circle cx="130" cy="130" r="122" fill="#FFE8D6" stroke="#DDBEA9" strokeWidth="6" />

            {/* 扇形切片 */}
            {Array.from({ length: denominator }).map((_, i) => {
              const isSelected = selectedSlices.has(i);
              return (
                <path
                  key={i}
                  d={makeSectorPath(i, denominator)}
                  fill={isSelected ? '#FF7A59' : '#FFF1E6'}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  className="pizza-slice"
                  onClick={() => toggleSlice(i)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                />
              );
            })}

            {/* 中心提示圆 */}
            <circle cx="130" cy="130" r="24" fill="#FFFFFF" stroke="#FF7A59" strokeWidth="3" />
            <text x="130" y="136" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF7A59">
              🍕
            </text>
          </svg>

          <span className="visual-caption">（提示：点击任意扇形区域即可选取/取消）</span>
        </div>

        {/* 分数解构与读法展示 */}
        <div className="fraction-control-col">
          <div className="fraction-math-card">
            <div className="fraction-large-display">
              <span className="fraction-top" title="分子：表示取的份数">{numerator}</span>
              <span className="fraction-divider"></span>
              <span className="fraction-bottom" title="分母：表示平均分的总份数">{denominator}</span>
            </div>
            <div className="fraction-explanation">
              <div className="fraction-pinyin">
                读作：<strong>{getChineseNumber(denominator)}分之{getChineseNumber(numerator)}</strong>
              </div>
              <p className="fraction-meaning">
                把这块大披萨<strong>平均分成了 {denominator} 份</strong>（分母），<br />
                当前一共选取了 <strong>{numerator} 份</strong>（分子）。
              </p>
            </div>
          </div>

          <div className="denominator-selector">
            <label>调整分母（平均分成的总份数）：</label>
            <div className="chips-grid">
              {[2, 3, 4, 6, 8, 12].map((d) => (
                <button
                  key={d}
                  className={`chip-btn ${denominator === d ? 'active' : ''}`}
                  onClick={() => changeDenominator(d)}
                >
                  {denominator === d && <Check size={14} className="mr-1" />}
                  平均分 {d} 份
                </button>
              ))}
            </div>
          </div>

          <div className="fraction-rule-box">
            <strong>💡 魔法顺口溜：</strong>
            <p>平均分是前提，总份数当分母；吃了拿了几份数，高高坐上当分子！</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getChineseNumber(n) {
  const map = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return map[n] || n;
}
