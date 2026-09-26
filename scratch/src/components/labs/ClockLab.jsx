import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { CheckCircle2, RotateCcw, Clock, Sparkles } from 'lucide-react';

export default function ClockLab({ labData, onComplete }) {
  const [hour, setHour] = useState(labData?.defaultHour || 8);
  const [minute, setMinute] = useState(labData?.defaultMinute || 15);
  const [isMatched, setIsMatched] = useState(false);

  const targetHour = labData?.targetTime?.hour || 9;
  const targetMinute = labData?.targetTime?.minute || 30;

  useEffect(() => {
    if (hour === targetHour && minute === targetMinute) {
      if (!isMatched) {
        setIsMatched(true);
        sound.playCorrect();
        if (onComplete) onComplete();
      }
    } else {
      setIsMatched(false);
    }
  }, [hour, minute, targetHour, targetMinute]);

  const addMinutes = (mins) => {
    sound.playClick();
    let totalMins = hour * 60 + minute + mins;
    if (totalMins < 0) totalMins += 12 * 60;
    const newTotal = totalMins % (12 * 60);
    const newH = Math.floor(newTotal / 60) === 0 ? 12 : Math.floor(newTotal / 60);
    const newM = newTotal % 60;
    setHour(newH);
    setMinute(newM);
  };

  const resetClock = () => {
    sound.playClick();
    setHour(labData?.defaultHour || 8);
    setMinute(labData?.defaultMinute || 15);
  };

  // 角度计算
  const minuteAngle = minute * 6; // 360 / 60 = 6 deg
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 30 deg per hour + 0.5 deg per min

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <Clock size={18} />
          <span>具象工坊 · 动态齿轮钟表实验</span>
        </div>
        <button className="lab-reset-btn" onClick={resetClock} title="重置钟表">
          <RotateCcw size={16} /> 重置
        </button>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          任务目标：请拨动指针或使用快调按钮，将时钟调整至 <strong>{targetHour}点{targetMinute < 10 ? '0' + targetMinute : targetMinute}分</strong>！
        </span>
      </div>

      <div className="clock-lab-body">
        {/* 钟表表盘 SVG */}
        <div className="clock-dial-wrapper">
          <svg className="clock-svg" viewBox="0 0 300 300" width="260" height="260">
            {/* 表盘底色 */}
            <circle cx="150" cy="150" r="140" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="8" />
            <circle cx="150" cy="150" r="132" fill="#F8FAFC" />

            {/* 60个刻度小格 */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isMajor = i % 5 === 0;
              const angle = i * 6 * (Math.PI / 180);
              const r1 = 130;
              const r2 = isMajor ? 116 : 124;
              const x1 = 150 + r1 * Math.sin(angle);
              const y1 = 150 - r1 * Math.cos(angle);
              const x2 = 150 + r2 * Math.sin(angle);
              const y2 = 150 - r2 * Math.cos(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#475569' : '#CBD5E1'}
                  strokeWidth={isMajor ? 3 : 1.5}
                />
              );
            })}

            {/* 12个数字 */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = i * 30 * (Math.PI / 180);
              const r = 100;
              const x = 150 + r * Math.sin(angle);
              const y = 150 - r * Math.cos(angle) + 6;
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#1E293B"
                  fontFamily="'Outfit', sans-serif"
                >
                  {num}
                </text>
              );
            })}

            {/* 时针 */}
            <line
              x1="150"
              y1="150"
              x2={150 + 65 * Math.sin(hourAngle * (Math.PI / 180))}
              y2={150 - 65 * Math.cos(hourAngle * (Math.PI / 180))}
              stroke="#6366F1"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* 分针 */}
            <line
              x1="150"
              y1="150"
              x2={150 + 95 * Math.sin(minuteAngle * (Math.PI / 180))}
              y2={150 - 95 * Math.cos(minuteAngle * (Math.PI / 180))}
              stroke="#EC4899"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* 中心轮轴 */}
            <circle cx="150" cy="150" r="8" fill="#F59E0B" />
            <circle cx="150" cy="150" r="3" fill="#FFFFFF" />
          </svg>

          {/* 数字显示屏 */}
          <div className="digital-clock-display">
            <span className="digital-time">
              {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}
            </span>
            <span className="digital-label">
              {hour} 时 {minute} 分
            </span>
          </div>
        </div>

        {/* 调节控制面板 */}
        <div className="clock-controls">
          <div className="control-group">
            <label>快速调时（分针调整）</label>
            <div className="btn-row">
              <button className="chip-btn" onClick={() => addMinutes(-15)}>-15分</button>
              <button className="chip-btn" onClick={() => addMinutes(-5)}>-5分</button>
              <button className="chip-btn" onClick={() => addMinutes(5)}>+5分</button>
              <button className="chip-btn" onClick={() => addMinutes(15)}>+15分</button>
              <button className="chip-btn" onClick={() => addMinutes(30)}>+30分</button>
            </div>
          </div>

          <div className="control-group">
            <label>时针微调</label>
            <div className="btn-row">
              <button className="chip-btn" onClick={() => addMinutes(-60)}>-1小时</button>
              <button className="chip-btn primary" onClick={() => addMinutes(60)}>+1小时</button>
            </div>
          </div>

          {/* 状态达成提示卡 */}
          <div className={`match-status-card ${isMatched ? 'success' : 'pending'}`}>
            {isMatched ? (
              <div className="match-content">
                <CheckCircle2 size={24} className="text-emerald" />
                <div>
                  <strong>太棒了！时间完全匹配！</strong>
                  <p>你已经成功掌握了时针与分针的联动规律（分针走一圈，时针走1大格）。</p>
                </div>
              </div>
            ) : (
              <div className="match-content">
                <span className="indicator-dot"></span>
                <span>当前时间与目标 <strong>{targetHour}:{targetMinute < 10 ? '0' + targetMinute : targetMinute}</strong> 还不一致，继续拨动吧！</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
