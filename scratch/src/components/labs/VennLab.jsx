import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Layers, Sparkles, Plus, Minus } from 'lucide-react';

export default function VennLab({ onComplete }) {
  const [onlyA, setOnlyA] = useState(6);
  const [overlap, setOverlap] = useState(3);
  const [onlyB, setOnlyB] = useState(5);

  const totalA = onlyA + overlap;
  const totalB = onlyB + overlap;
  const grandTotal = onlyA + overlap + onlyB;

  const updateVal = (setter, curr, delta, min = 1, max = 10) => {
    sound.playClick();
    const next = Math.max(min, Math.min(max, curr + delta));
    setter(next);
    if (onComplete) onComplete();
  };

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <Layers size={18} />
          <span>具象工坊 · 韦恩图集合与重叠实验</span>
        </div>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          观察左右两个交叠的圆环。调整参加<strong>【合唱队】</strong>、<strong>【舞蹈队】</strong>和<strong>【两项都参加】</strong>的人数，体会为什么求总人数必须减去重叠部分！
        </span>
      </div>

      <div className="venn-lab-body">
        {/* 动态韦恩图 SVG */}
        <div className="venn-svg-wrapper">
          <svg viewBox="0 0 340 220" width="320" height="200" className="venn-svg">
            {/* 集合 A (蓝色半透明圆) */}
            <circle cx="120" cy="110" r="85" fill="#3B82F6" fillOpacity="0.35" stroke="#2563EB" strokeWidth="3" />

            {/* 集合 B (粉色半透明圆) */}
            <circle cx="220" cy="110" r="85" fill="#EC4899" fillOpacity="0.35" stroke="#DB2777" strokeWidth="3" />

            {/* A 独有区域文字 */}
            <text x="75" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1D4ED8">
              仅参加合唱
            </text>
            <text x="75" y="130" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1E3A8A">
              {onlyA}人
            </text>

            {/* 重叠交集区域文字 */}
            <text x="170" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7E22CE">
              两项都参加
            </text>
            <text x="170" y="130" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#581C87">
              {overlap}人
            </text>

            {/* B 独有区域文字 */}
            <text x="265" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BE185D">
              仅参加舞蹈
            </text>
            <text x="265" y="130" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#831843">
              {onlyB}人
            </text>
          </svg>
        </div>

        {/* 控制与动态解析公式 */}
        <div className="venn-controls-col">
          <div className="venn-adjust-card">
            <div className="venn-adjust-row">
              <span className="row-label text-blue">🎵 合唱队总人数（{totalA}人）</span>
              <div className="btn-counter">
                <button onClick={() => updateVal(setOnlyA, onlyA, -1)}><Minus size={14} /></button>
                <span>仅合唱 {onlyA}</span>
                <button onClick={() => updateVal(setOnlyA, onlyA, 1)}><Plus size={14} /></button>
              </div>
            </div>

            <div className="venn-adjust-row">
              <span className="row-label text-purple">⭐ 两项都参加重叠人数（{overlap}人）</span>
              <div className="btn-counter">
                <button onClick={() => updateVal(setOverlap, overlap, -1)}><Minus size={14} /></button>
                <span>重叠 {overlap}</span>
                <button onClick={() => updateVal(setOverlap, overlap, 1)}><Plus size={14} /></button>
              </div>
            </div>

            <div className="venn-adjust-row">
              <span className="row-label text-pink">💃 舞蹈队总人数（{totalB}人）</span>
              <div className="btn-counter">
                <button onClick={() => updateVal(setOnlyB, onlyB, -1)}><Minus size={14} /></button>
                <span>仅舞蹈 {onlyB}</span>
                <button onClick={() => updateVal(setOnlyB, onlyB, 1)}><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <div className="venn-formula-card">
            <div className="formula-headline">🔥 核心公式演算：</div>
            <div className="formula-text">
              <strong>总人数 = 合唱队人数 + 舞蹈队人数 - 重叠人数</strong>
            </div>
            <div className="formula-eval">
              {totalA} + {totalB} - {overlap} = <span className="highlight-val">{grandTotal} 人</span>
            </div>
            <p className="venn-tip-note">
              💡 如果直接把 {totalA} 和 {totalB} 相加，这 {overlap} 个两项都参加的同学就被<strong>数了两次</strong>，所以必须要减掉一次重复的人数！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
