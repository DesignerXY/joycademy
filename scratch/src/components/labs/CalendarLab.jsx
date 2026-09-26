import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Calendar, Clock, Sparkles, HelpCircle } from 'lucide-react';

const MONTHS_DATA = [
  { m: 1, days: 31, type: '大月' },
  { m: 2, days: 28, leapDays: 29, type: '特殊月' },
  { m: 3, days: 31, type: '大月' },
  { m: 4, days: 30, type: '小月' },
  { m: 5, days: 31, type: '大月' },
  { m: 6, days: 30, type: '小月' },
  { m: 7, days: 31, type: '大月' },
  { m: 8, days: 31, type: '大月' },
  { m: 9, days: 30, type: '小月' },
  { m: 10, days: 31, type: '大月' },
  { m: 11, days: 30, type: '小月' },
  { m: 12, days: 31, type: '大月' }
];

export default function CalendarLab({ onComplete }) {
  const [activeTab, setActiveTab] = useState('months'); // 'months' | 'leap' | 'clock24'
  const [testYear, setTestYear] = useState(2024);
  const [selectedHour, setSelectedHour] = useState(20); // 8 PM = 20:00

  // 闰年判断
  const isLeap = (year) => {
    if (year % 100 === 0) {
      return year % 400 === 0;
    }
    return year % 4 === 0;
  };

  const handleYearChange = (delta) => {
    sound.playClick();
    setTestYear(prev => prev + delta);
    if (onComplete) onComplete();
  };

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <Calendar size={18} />
          <span>具象工坊 · 年月日与24时计时法实验台</span>
        </div>
        <div className="mode-toggle-group">
          <button
            className={`toggle-btn ${activeTab === 'months' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setActiveTab('months'); }}
          >
            大月小月与拳头歌
          </button>
          <button
            className={`toggle-btn ${activeTab === 'leap' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setActiveTab('leap'); }}
          >
            平年/闰年计算器
          </button>
          <button
            className={`toggle-btn ${activeTab === 'clock24' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setActiveTab('clock24'); }}
          >
            24小时计时法转换
          </button>
        </div>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          {activeTab === 'months' && '探索一年12个月的天数分布，掌握【7个大月、4个小月和特殊2月】的规律！'}
          {activeTab === 'leap' && '输入任意年份，探索四年一闰、百年不闰、四百年又闰的神奇历法规则！'}
          {activeTab === 'clock24' && '滑动时钟滑块，观察12小时普通计时法与24小时计时法的对照变换！'}
        </span>
      </div>

      {activeTab === 'months' && (
        <div className="months-grid-view">
          <div className="mnemonic-banner">
            <strong>✊ 拳头记忆顺口溜：</strong>
            <span>一三五七八十腊（十二月），三十一天永不差；四六九冬（十一月）三十整，平年二月二十八！</span>
          </div>

          <div className="calendar-months-grid">
            {MONTHS_DATA.map(item => (
              <div
                key={item.m}
                className={`month-card ${item.type === '大月' ? 'big' : item.type === '小月' ? 'small' : 'special'}`}
              >
                <div className="month-name">{item.m} 月</div>
                <div className="month-type-badge">{item.type}</div>
                <div className="month-days">
                  {item.m === 2 ? '28 或 29' : item.days} 天
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leap' && (
        <div className="leap-year-view">
          <div className="year-selector-box">
            <span>输入/调整年份：</span>
            <button className="chip-btn" onClick={() => handleYearChange(-4)}>-4年</button>
            <button className="chip-btn" onClick={() => handleYearChange(-1)}>-1年</button>
            <span className="current-year-display">{testYear} 年</span>
            <button className="chip-btn" onClick={() => handleYearChange(1)}>+1年</button>
            <button className="chip-btn" onClick={() => handleYearChange(4)}>+4年</button>
          </div>

          <div className={`leap-result-card ${isLeap(testYear) ? 'leap' : 'common'}`}>
            <div className="result-title">
              {isLeap(testYear) ? '🎉 该年份是【闰年】' : '📘 该年份是【平年】'}
            </div>
            <div className="result-detail">
              {isLeap(testYear) ? (
                <>
                  <p>全年共有 <strong>366 天</strong>，其中 2 月有 <strong>29 天</strong>！</p>
                  <p className="rule-note">判断依据：{testYear} 是 4 的倍数{testYear % 100 === 0 ? '，且整百年能被400整除' : ''}。</p>
                </>
              ) : (
                <>
                  <p>全年共有 <strong>365 天</strong>，其中 2 月有 <strong>28 天</strong>。</p>
                  <p className="rule-note">判断依据：{testYear} 不能被 4 整除（或整百年不能被400整除）。</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clock24' && (
        <div className="clock24-view">
          <div className="clock-slider-row">
            <label>调整时间点：{selectedHour}:00</label>
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => {
                sound.playClick();
                setSelectedHour(parseInt(e.target.value, 10));
                if (onComplete) onComplete();
              }}
              className="time-range-slider"
            />
          </div>

          <div className="conversion-compare-cards">
            <div className="time-card standard">
              <div className="card-tag">普通计时法（12小时制）</div>
              <div className="time-val">
                {selectedHour === 0
                  ? '午夜 12:00'
                  : selectedHour < 12
                  ? `上午 ${selectedHour}:00`
                  : selectedHour === 12
                  ? '中午 12:00'
                  : `晚上 ${selectedHour - 12}:00`}
              </div>
              <span className="card-hint">必须加上“上午”、“下午”或“晚上”等时间词</span>
            </div>

            <div className="convert-arrow">➔</div>

            <div className="time-card military">
              <div className="card-tag">24 时计时法</div>
              <div className="time-val">{selectedHour < 10 ? '0' + selectedHour : selectedHour}:00</div>
              <span className="card-hint">
                {selectedHour >= 12
                  ? `下午/晚上时数 + 12（如：${selectedHour - 12} + 12 = ${selectedHour}）`
                  : '上午时数保持不变'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
