import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Square, Maximize2, RotateCcw, Sparkles } from 'lucide-react';

export default function GeoLab({ isAreaMode = false, onComplete }) {
  const [length, setLength] = useState(6);
  const [width, setWidth] = useState(4);
  const [mode, setMode] = useState(isAreaMode ? 'area' : 'perimeter'); // 'perimeter' | 'area'

  const perimeter = (length + width) * 2;
  const area = length * width;

  const handleLengthChange = (val) => {
    sound.playClick();
    setLength(Math.max(1, Math.min(10, val)));
    if (onComplete) onComplete();
  };

  const handleWidthChange = (val) => {
    sound.playClick();
    setWidth(Math.max(1, Math.min(8, val)));
    if (onComplete) onComplete();
  };

  const setAsSquare = (side) => {
    sound.playClick();
    setLength(side);
    setWidth(side);
    if (onComplete) onComplete();
  };

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <Square size={18} />
          <span>具象工坊 · 动态几何周长与面积实验台</span>
        </div>
        <div className="mode-toggle-group">
          <button
            className={`toggle-btn ${mode === 'perimeter' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setMode('perimeter');
            }}
          >
            周长模式 (一周长度)
          </button>
          <button
            className={`toggle-btn ${mode === 'area' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setMode('area');
            }}
          >
            面积模式 (方块铺满)
          </button>
        </div>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          拖动或点击调整<strong>【长】</strong>和<strong>【宽】</strong>，观察方格纸上的图形变化，对比红线周长与方格面积！
        </span>
      </div>

      <div className="geo-lab-body">
        {/* 方格网格画板 */}
        <div className="grid-canvas-wrapper">
          <div className="dimension-label top-label">长 = {length} 厘米</div>
          <div className="canvas-with-left">
            <div className="dimension-label left-label">宽 = {width} 厘米</div>
            <div
              className={`geo-grid-board ${mode}`}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${length}, 28px)`,
                gridTemplateRows: `repeat(${width}, 28px)`
              }}
            >
              {Array.from({ length: length * width }).map((_, i) => (
                <div key={i} className="geo-cell" title={`第 ${i + 1} 个面积单位(1cm²)`}>
                  {mode === 'area' && length * width <= 40 ? i + 1 : ''}
                </div>
              ))}
            </div>
          </div>
          <div className="shape-type-badge">
            {length === width ? '✨ 当前图形：正方形 (四边等长)' : '🔷 当前图形：长方形 (对边相等)'}
          </div>
        </div>

        {/* 控制与公式解析 */}
        <div className="geo-controls-col">
          <div className="slider-control-card">
            <div className="slider-row">
              <span className="slider-title">图形长度：{length} 厘米</span>
              <div className="btn-counter">
                <button onClick={() => handleLengthChange(length - 1)}>-</button>
                <span>{length}</span>
                <button onClick={() => handleLengthChange(length + 1)}>+</button>
              </div>
            </div>

            <div className="slider-row">
              <span className="slider-title">图形宽度：{width} 厘米</span>
              <div className="btn-counter">
                <button onClick={() => handleWidthChange(width - 1)}>-</button>
                <span>{width}</span>
                <button onClick={() => handleWidthChange(width + 1)}>+</button>
              </div>
            </div>

            <div className="quick-presets">
              <span>快捷一键变身：</span>
              <button className="chip-btn" onClick={() => setAsSquare(4)}>
                4×4 正方形
              </button>
              <button className="chip-btn" onClick={() => setAsSquare(5)}>
                5×5 正方形
              </button>
            </div>
          </div>

          {/* 公式与结果大卡 */}
          <div className={`formula-result-card ${mode}`}>
            {mode === 'perimeter' ? (
              <>
                <div className="formula-type">📐 周长计算 (外围红线一整圈)：</div>
                <div className="formula-calc">
                  {length === width ? (
                    <>
                      <strong>正方形周长 = 边长 × 4</strong>
                      <div className="calc-process">{length} × 4 = <span className="highlight-val">{perimeter} 厘米</span></div>
                    </>
                  ) : (
                    <>
                      <strong>长方形周长 = (长 + 宽) × 2</strong>
                      <div className="calc-process">({length} + {width}) × 2 = <span className="highlight-val">{perimeter} 厘米</span></div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="formula-type">🗺️ 面积计算 (内部铺满方块总数)：</div>
                <div className="formula-calc">
                  {length === width ? (
                    <>
                      <strong>正方形面积 = 边长 × 边长</strong>
                      <div className="calc-process">{length} × {length} = <span className="highlight-val">{area} 平方厘米</span></div>
                    </>
                  ) : (
                    <>
                      <strong>长方形面积 = 长 × 宽</strong>
                      <div className="calc-process">{length} × {width} = <span className="highlight-val">{area} 平方厘米</span></div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
