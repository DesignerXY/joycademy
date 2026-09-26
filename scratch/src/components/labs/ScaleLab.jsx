import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Scale, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

const ITEMS_TO_MEASURE = [
  { id: 'eraser', name: '卡通橡皮擦', lengthMm: 35, icon: '🧼', desc: '3厘米5毫米（35毫米）' },
  { id: 'pencil', name: '削好的铅笔', lengthMm: 140, icon: '✏️', desc: '1分米4厘米（140毫米）' },
  { id: 'paperclip', name: '彩色回形针', lengthMm: 28, icon: '📎', desc: '2厘米8毫米（28毫米）' },
  { id: 'book', name: '数学教材厚度', lengthMm: 7, icon: '📘', desc: '大约 7 毫米' }
];

export default function ScaleLab({ onComplete }) {
  const [activeTab, setActiveTab] = useState('ruler'); // 'ruler' | 'weight'
  const [selectedItem, setSelectedItem] = useState(ITEMS_TO_MEASURE[0]);

  // 天平称重状态
  const [leftWeight, setLeftWeight] = useState(1000); // 1000g = 1kg
  const [rightWeight, setRightWeight] = useState(1000);

  const handleSelectItem = (item) => {
    sound.playClick();
    setSelectedItem(item);
    if (onComplete) onComplete();
  };

  const addRightWeight = (w) => {
    sound.playClick();
    setRightWeight(prev => Math.max(0, prev + w));
    if (onComplete) onComplete();
  };

  const resetWeights = () => {
    sound.playClick();
    setRightWeight(0);
  };

  // 倾斜角度：依据差值
  const diff = rightWeight - leftWeight;
  const tiltAngle = Math.max(-20, Math.min(20, diff / 50));

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <Scale size={18} />
          <span>具象工坊 · 长度度量尺与重力天平</span>
        </div>
        <div className="mode-toggle-group">
          <button
            className={`toggle-btn ${activeTab === 'ruler' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveTab('ruler');
            }}
          >
            <Ruler size={14} className="mr-1 inline" /> 毫米/厘米/分米 测量尺
          </button>
          <button
            className={`toggle-btn ${activeTab === 'weight' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveTab('weight');
            }}
          >
            <Scale size={14} className="mr-1 inline" /> 克/千克/吨 天平称重
          </button>
        </div>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          {activeTab === 'ruler'
            ? '点击选择不同物品，对齐直尺的【0刻度】，观察毫米(mm)、厘米(cm)与分米(dm)的刻度关系！'
            : '在天平右盘添加不同克数的砝码，让天平达到两端平衡（1千克 = 1000克）！'}
        </span>
      </div>

      {activeTab === 'ruler' ? (
        <div className="ruler-lab-body">
          <div className="item-picker-row">
            <span>选择待测物体：</span>
            {ITEMS_TO_MEASURE.map(item => (
              <button
                key={item.id}
                className={`chip-btn ${selectedItem.id === item.id ? 'active' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                <span>{item.icon}</span> {item.name}
              </button>
            ))}
          </div>

          <div className="ruler-viewport">
            {/* 待测物品模拟条 */}
            <div className="object-on-ruler" style={{ width: `${selectedItem.lengthMm * 2.8}px` }}>
              <span className="object-emoji">{selectedItem.icon}</span>
              <span className="object-length-tag">{selectedItem.name}</span>
            </div>

            {/* 刻度直尺 SVG */}
            <div className="svg-ruler-wrapper">
              <svg viewBox="0 0 500 90" width="100%" height="90" className="ruler-svg">
                {/* 尺身 */}
                <rect x="0" y="20" width="500" height="65" rx="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />

                {/* 刻度线 (0 到 15 厘米) */}
                {Array.from({ length: 151 }).map((_, mm) => {
                  const x = 20 + mm * 2.8;
                  const isCm = mm % 10 === 0;
                  const isHalfCm = mm % 5 === 0 && !isCm;
                  const y2 = isCm ? 55 : isHalfCm ? 45 : 36;
                  return (
                    <g key={mm}>
                      <line
                        x1={x}
                        y1="20"
                        x2={x}
                        y2={y2}
                        stroke="#854D0E"
                        strokeWidth={isCm ? 2 : 1}
                      />
                      {isCm && (
                        <text
                          x={x}
                          y="72"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="bold"
                          fill="#713F12"
                        >
                          {mm / 10}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="measurement-readout">
            <div className="readout-card">
              <div className="label">精准测量读数：</div>
              <div className="value-mm">{selectedItem.lengthMm} 毫米 (mm)</div>
              <div className="conversion-text">
                = {Math.floor(selectedItem.lengthMm / 10)} 厘米 {selectedItem.lengthMm % 10} 毫米
                {selectedItem.lengthMm >= 100 ? `（即 ${(selectedItem.lengthMm / 100).toFixed(1)} 分米）` : ''}
              </div>
            </div>
            <div className="ruler-tips">
              <strong>📏 测量秘籍：</strong>
              <p>测量物体时，通常将物体的左端对齐直尺的 <strong>0刻度线</strong>；如果从其他刻度开始量，要用终点刻度减去起点刻度！</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="scale-lab-body">
          <div className="scale-stage">
            <svg viewBox="0 0 400 240" width="340" height="200" className="balance-svg">
              {/* 底座与立柱 */}
              <path d="M 180 220 L 220 220 L 205 100 L 195 100 Z" fill="#64748B" />
              <rect x="150" y="215" width="100" height="15" rx="4" fill="#475569" />

              {/* 横梁 (带倾斜旋转) */}
              <g transform={`rotate(${tiltAngle} 200 100)`}>
                <rect x="50" y="95" width="300" height="10" rx="3" fill="#0284C7" />
                <circle cx="200" cy="100" r="8" fill="#F59E0B" />

                {/* 左托盘 */}
                <line x1="80" y1="100" x2="80" y2="150" stroke="#94A3B8" strokeWidth="2" />
                <path d="M 40 150 Q 80 170 120 150 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />

                {/* 右托盘 */}
                <line x1="320" y1="100" x2="320" y2="150" stroke="#94A3B8" strokeWidth="2" />
                <path d="M 280 150 Q 320 170 360 150 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
              </g>
            </svg>

            <div className="pan-weights-info">
              <div className="pan-box left">
                <span className="pan-title">左盘（待测物品：一袋大米）</span>
                <span className="pan-weight-display">1000 克 (1 千克)</span>
              </div>
              <div className="pan-box right">
                <span className="pan-title">右盘（砝码重量）</span>
                <span className="pan-weight-display">{rightWeight} 克</span>
              </div>
            </div>
          </div>

          <div className="weights-controls">
            <div className="weights-buttons-row">
              <span>放入砝码：</span>
              <button className="chip-btn" onClick={() => addRightWeight(100)}>+100克</button>
              <button className="chip-btn" onClick={() => addRightWeight(200)}>+200克</button>
              <button className="chip-btn primary" onClick={() => addRightWeight(500)}>+500克</button>
              <button className="chip-btn" onClick={resetWeights}>清空砝码</button>
            </div>

            <div className={`balance-result-banner ${diff === 0 ? 'balanced' : 'unbalanced'}`}>
              {diff === 0 ? (
                <div className="success-inline">
                  <CheckCircle2 size={20} className="text-emerald" />
                  <strong>平衡达成！</strong> 1000克 = 1千克。两端完全水平！
                </div>
              ) : diff < 0 ? (
                <span>⚠️ 右盘砝码还差 {Math.abs(diff)} 克，请继续添加砝码！</span>
              ) : (
                <span>⚠️ 右盘砝码过重，超出了 {diff} 克，请调整砝码！</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
