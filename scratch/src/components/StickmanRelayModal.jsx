import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { X, Flame, Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

/**
 * 真实木质火柴组件 (MatchStick)
 * 每个肢体、身躯由真正的带红磷药头的木质火柴构成
 */
function MatchStick({
  x1,
  y1,
  x2,
  y2,
  headAt = 'end',
  thickness = 7,
  stickColor = '#E2B179',
  headColor = '#DC2626'
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <g transform={`translate(${x1}, ${y1}) rotate(${angle})`}>
      {/* 真实木质火柴梗 */}
      <rect
        x="0"
        y={-thickness / 2}
        width={Math.max(2, length - 6)}
        height={thickness}
        rx="2"
        fill={stickColor}
        stroke="#8B4513"
        strokeWidth="1.2"
      />
      {/* 火柴木质纤维高光 */}
      <line
        x1="2"
        y1={-thickness / 4}
        x2={Math.max(2, length - 8)}
        y2={-thickness / 4}
        stroke="#FFF8E7"
        strokeWidth="1.2"
        opacity="0.65"
      />
      {/* 火柴红磷/硫磺药头 (Oval Match Head) */}
      {headAt === 'end' && (
        <g transform={`translate(${length - 3}, 0)`}>
          <ellipse
            cx="0"
            cy="0"
            rx={thickness * 0.95}
            ry={thickness * 0.78}
            fill={headColor}
            stroke="#7F1D1D"
            strokeWidth="1.2"
          />
          {/* 药头圆润光泽点 */}
          <circle cx="-1" cy={-thickness * 0.25} r={thickness * 0.28} fill="#FCA5A5" opacity="0.9" />
        </g>
      )}
      {headAt === 'start' && (
        <g transform="translate(0, 0)">
          <ellipse
            cx="0"
            cy="0"
            rx={thickness * 0.95}
            ry={thickness * 0.78}
            fill={headColor}
            stroke="#7F1D1D"
            strokeWidth="1.2"
          />
          <circle cx="-1" cy={-thickness * 0.25} r={thickness * 0.28} fill="#FCA5A5" opacity="0.9" />
        </g>
      )}
    </g>
  );
}

export default function StickmanRelayModal({ currentGrade = 3, currentSubject = 'math', onContinue, onClose }) {
  // 动画阶段: 'running' -> 'handover' -> 'celebrate'
  const [animPhase, setAnimPhase] = useState('running');

  useEffect(() => {
    sound.playClick();
    const t1 = setTimeout(() => {
      setAnimPhase('handover');
      sound.playCorrect();
    }, 1800);

    const t2 = setTimeout(() => {
      setAnimPhase('celebrate');
      sound.playLevelUp();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleReplay = () => {
    sound.playClick();
    setAnimPhase('running');
    setTimeout(() => {
      setAnimPhase('handover');
      sound.playCorrect();
    }, 1800);
    setTimeout(() => {
      setAnimPhase('celebrate');
      sound.playLevelUp();
      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (e) {}
    }, 3200);
  };

  return (
    <div className="modal-backdrop stickman-modal-backdrop" onClick={onClose}>
      <div className="standard-modal stickman-relay-card" onClick={e => e.stopPropagation()}>
        <div className="standard-modal-header bg-relay">
          <div className="header-title-flex">
            <Flame size={28} className="text-amber animate-pulse" />
            <div>
              <h3>真·火柴人薪火相传 · 荣耀接力</h3>
              <span className="subtitle">由纯正实木火柴拼成的智慧勇者 · 传递真理圣火！</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <div className="stickman-stage-container">
          {/* 跑道与星空舞台 */}
          <div className="track-sky-bg">
            <div className="relay-stars-field"></div>
            <div className="relay-stadium-lights">
              <span className="stadium-lamp lamp-l"></span>
              <span className="stadium-lamp lamp-r"></span>
            </div>

            {/* 火柴人奔跑与交接主舞台 SVG */}
            <div className="stickman-svg-arena">
              <svg viewBox="0 0 620 250" className="stickman-track-svg">
                {/* 跑道底线与标线 */}
                <line x1="20" y1="210" x2="600" y2="210" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="10,6" />
                <line x1="20" y1="215" x2="600" y2="215" stroke="#E2E8F0" strokeWidth="2" />

                {/* 赛场跑道旁的复古“智趣火柴盒” (Classic Matchbox) */}
                <g transform="translate(30, 160)">
                  <rect x="0" y="0" width="70" height="38" rx="4" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
                  <rect x="4" y="4" width="62" height="30" rx="2" fill="#FEF3C7" />
                  <text x="35" y="18" fill="#1E40AF" fontSize="9" fontWeight="900" textAnchor="middle">智趣安全火柴</text>
                  <text x="35" y="28" fill="#B45309" fontSize="7" fontWeight="bold" textAnchor="middle">★ 薪火相传 ★</text>
                  {/* 火柴盒侧面红磷摩擦引火条 */}
                  <rect x="0" y="38" width="70" height="6" fill="#7F1D1D" rx="1" />
                </g>

                {/* ===================== 火柴人 A (手持火炬，全速奔跑而来) ===================== */}
                <g className={`stickman-a ${animPhase}`}>
                  {/* 火柴学士帽 */}
                  <polygon points="120,58 140,48 160,58 140,68" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                  <rect x="137" y="58" width="6" height="5" fill="#F59E0B" />
                  <line x1="140" y1="60" x2="155" y2="72" stroke="#F59E0B" strokeWidth="2" />

                  {/* 火柴人头部：圆润木质切片 + 俏皮表情 */}
                  <circle cx="140" cy="80" r="17" fill="#FEEBC8" stroke="#8B4513" strokeWidth="3" />
                  <ellipse cx="140" cy="74" rx="14" ry="4" fill="#DC2626" opacity="0.15" />
                  {/* 欢笑眼睛与笑脸 */}
                  <circle cx="145" cy="78" r="2.5" fill="#0F172A" />
                  <circle cx="136" cy="78" r="2.5" fill="#0F172A" />
                  <path d="M 135 86 Q 140 92 147 86" fill="none" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />

                  {/* 1. 身体躯干：一整根粗壮纵向火柴 */}
                  <MatchStick x1={140} y1={97} x2={140} y2={152} thickness={8} headAt="end" />

                  {/* 2. 左臂（奔跑时前摆持有火炬） */}
                  <MatchStick x1={140} y1={112} x2={168} y2={102} thickness={6} headAt="end" />
                  {/* 3. 右臂（后摆平衡） */}
                  <MatchStick x1={140} y1={112} x2={114} y2={132} thickness={6} headAt="end" />

                  {/* 4. 左腿（大腿 + 小腿组合火柴） */}
                  <MatchStick x1={140} y1={152} x2={166} y2={184} thickness={7} headAt="end" />
                  <MatchStick x1={166} y1={184} x2={184} y2={208} thickness={6} headAt="end" />

                  {/* 5. 右腿（大腿 + 小腿组合火柴） */}
                  <MatchStick x1={140} y1={152} x2={116} y2={178} thickness={7} headAt="end" />
                  <MatchStick x1={116} y1={178} x2={96} y2={204} thickness={6} headAt="end" />

                  {/* 火柴人持有的【燃烧大火炬】(在 running 阶段跟随 A) */}
                  {animPhase === 'running' && (
                    <g className="torch-group" transform="translate(170, 88)">
                      {/* 火炬柄也是一根金黄火柴 */}
                      <MatchStick x1={0} y1={24} x2={0} y2={-6} thickness={7} headAt="end" headColor="#EF4444" />
                      {/* 炽热烈焰 */}
                      <circle cx="0" cy="-6" r="10" fill="#F59E0B" opacity="0.3" className="pulse-halo" />
                      <path d="M 0 -22 C 9 -8, 11 0, 0 10 C -11 0, -9 -8, 0 -22 Z" fill="#EF4444" className="animate-flame" />
                      <path d="M 0 -15 C 5 -5, 6 2, 0 8 C -6 2, -5 -5, 0 -15 Z" fill="#FDE047" />
                      {/* 飞舞火星 */}
                      <circle cx="5" cy="-24" r="1.5" fill="#F59E0B" />
                      <circle cx="-4" cy="-28" r="1.2" fill="#EF4444" />
                    </g>
                  )}
                </g>

                {/* ===================== 击掌交接火花 (Phase: handover / celebrate) ===================== */}
                {(animPhase === 'handover' || animPhase === 'celebrate') && (
                  <g className="handover-sparks" transform="translate(305, 96)">
                    <circle cx="0" cy="0" r="24" fill="rgba(245, 158, 11, 0.25)" className="pulse-halo" />
                    <line x1="-18" y1="-18" x2="18" y2="18" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="18" y1="-18" x2="-18" y2="18" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="0" y1="-22" x2="0" y2="22" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                    <line x1="-22" y1="0" x2="22" y2="0" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                    <text x="0" y="-24" textAnchor="middle" fill="#EA580C" fontSize="16" fontWeight="900">✨ 圣火接力 High-Five!</text>
                  </g>
                )}

                {/* ===================== 火柴人 B (迎接圣火的新年级火柴人) ===================== */}
                <g className={`stickman-b ${animPhase}`}>
                  {/* 头部：木质切片 + 灿烂笑脸 */}
                  <circle cx="380" cy="80" r="17" fill="#FEEBC8" stroke="#8B4513" strokeWidth="3" />
                  <ellipse cx="380" cy="74" rx="14" ry="4" fill="#DC2626" opacity="0.15" />
                  <circle cx="375" cy="78" r="2.5" fill="#0F172A" />
                  <circle cx="384" cy="78" r="2.5" fill="#0F172A" />
                  <path d="M 374 86 Q 380 92 386 86" fill="none" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />

                  {/* 1. 身体躯干：一整根纵向火柴 */}
                  <MatchStick x1={380} y1={97} x2={380} y2={152} thickness={8} headAt="end" />

                  {/* 2. 手臂火柴 (交接前张开双手迎接，交接后高高举起火炬欢庆) */}
                  {animPhase !== 'celebrate' ? (
                    <>
                      {/* 接棒前左手伸向 A */}
                      <MatchStick x1={380} y1={112} x2={330} y2={105} thickness={6} headAt="end" />
                      {/* 右手后摆平衡 */}
                      <MatchStick x1={380} y1={112} x2={414} y2={128} thickness={6} headAt="end" />
                    </>
                  ) : (
                    <>
                      {/* 胜利后高举双臂 */}
                      <MatchStick x1={380} y1={112} x2={418} y2={70} thickness={6} headAt="end" />
                      <MatchStick x1={380} y1={112} x2={346} y2={76} thickness={6} headAt="end" />
                    </>
                  )}

                  {/* 3. 腿部双火柴 (交接前稳稳站立，交接后兴奋腾空飞跃) */}
                  {animPhase !== 'celebrate' ? (
                    <>
                      <MatchStick x1={380} y1={152} x2={364} y2={208} thickness={7} headAt="end" />
                      <MatchStick x1={380} y1={152} x2={396} y2={208} thickness={7} headAt="end" />
                    </>
                  ) : (
                    <>
                      {/* 欢腾大跨步 */}
                      <MatchStick x1={380} y1={152} x2={358} y2={184} thickness={7} headAt="end" />
                      <MatchStick x1={358} y1={184} x2={350} y2={206} thickness={6} headAt="end" />
                      <MatchStick x1={380} y1={152} x2={406} y2={180} thickness={7} headAt="end" />
                      <MatchStick x1={406} y1={180} x2={424} y2={202} thickness={6} headAt="end" />
                    </>
                  )}

                  {/* 火柴人持有的【燃烧大火炬】(在 handover / celebrate 阶段交到 B 手中) */}
                  {(animPhase === 'handover' || animPhase === 'celebrate') && (
                    <g
                      className="torch-group"
                      transform={animPhase === 'celebrate' ? 'translate(426, 44)' : 'translate(325, 96)'}
                    >
                      <MatchStick x1={0} y1={26} x2={0} y2={-8} thickness={7} headAt="end" headColor="#EF4444" />
                      <circle cx="0" cy="-8" r="14" fill="#F59E0B" opacity="0.3" className="pulse-halo" />
                      <path
                        d="M 0 -26 C 10 -10, 13 0, 0 12 C -13 0, -10 -10, 0 -26 Z"
                        fill="#EF4444"
                        className="animate-flame-big"
                      />
                      <path d="M 0 -18 C 6 -6, 8 2, 0 9 C -8 2, -6 -6, 0 -18 Z" fill="#FDE047" />
                      <circle cx="6" cy="-28" r="2" fill="#FBBF24" />
                      <circle cx="-5" cy="-32" r="1.5" fill="#EF4444" />
                    </g>
                  )}
                </g>

                {/* ===================== 终点：知识荣耀神殿城堡 ===================== */}
                <g transform="translate(520, 136)">
                  <rect x="0" y="24" width="56" height="50" fill="#4338CA" rx="4" />
                  <polygon points="-6,24 28,-4 62,24" fill="#6366F1" />
                  <rect x="20" y="48" width="16" height="26" fill="#FEF3C7" rx="2" />
                  <line x1="28" y1="-4" x2="28" y2="-22" stroke="#F59E0B" strokeWidth="2.5" />
                  <polygon points="28,-22 50,-15 28,-8" fill="#EF4444" />
                  <text x="28" y="40" fill="#FDE047" fontSize="10" fontWeight="900" textAnchor="middle">★ 神殿 ★</text>
                </g>
              </svg>
            </div>
          </div>

          {/* 状态徽记与激励语 */}
          <div className="relay-status-banner">
            {animPhase === 'running' && (
              <div className="status-tip running">
                🏃 <strong>木质火柴人学长</strong> 正手持智慧火柴火炬全力冲刺，准备交棒！
              </div>
            )}
            {animPhase === 'handover' && (
              <div className="status-tip handover">
                🔥 <strong>火柴头碰撞！圣火交接！</strong> 知识在两代火柴人掌心迸发出耀眼火花！
              </div>
            )}
            {animPhase === 'celebrate' && (
              <div className="status-tip celebrate">
                🎉 <strong>交接成功！向更高知识神殿进发！</strong> 勇者火柴人高举圣火，冲向新学段！
              </div>
            )}
          </div>

          <div className="relay-actions-row">
            <button className="relay-btn secondary" onClick={handleReplay}>
              <RotateCcw size={16} /> 重新观摩火柴人接力
            </button>
            <button
              className="relay-btn primary"
              onClick={() => {
                sound.playClick();
                if (onContinue) onContinue();
                else onClose();
              }}
            >
              继续前行探索 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
