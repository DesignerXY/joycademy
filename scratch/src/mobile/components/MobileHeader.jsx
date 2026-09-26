import React from 'react';
import { sound } from '../../utils/audio';
import { SUBJECTS, GRADES } from '../../data/curriculumData';
import { Sparkles, Coins, Volume2, VolumeX, Monitor } from 'lucide-react';

export default function MobileHeader({
  profile,
  soundEnabled,
  onToggleSound,
  onSelectGrade,
  onSelectSubject,
  onSwitchToDesktop
}) {
  const level = profile.level || 1;

  return (
    <header className="m-header-container">
      {/* 顶部主状态栏 */}
      <div className="m-header-main-row">
        <div className="m-brand-box">
          <div className="m-brand-logo">
            <Sparkles size={18} />
          </div>
          <span className="m-brand-title">智趣学堂</span>
        </div>

        <div className="m-header-actions">
          {/* 金币 */}
          <div className="m-coin-badge" title="金币">
            <Coins size={14} className="text-amber" />
            <span>{profile.coins}</span>
          </div>

          {/* 角色 */}
          <div className="m-avatar-badge">
            <span className="m-avatar-emoji">{profile.avatar}</span>
            <span>Lv.{level}</span>
          </div>

          {/* 音效切换 */}
          <button
            className="m-icon-btn m-pressable"
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? '静音' : '开启音效'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-muted" />}
          </button>

          {/* 切换电脑版 */}
          {onSwitchToDesktop && (
            <button
              className="m-mode-switch-btn m-pressable"
              onClick={() => {
                sound.playClick();
                onSwitchToDesktop();
              }}
              title="切换到电脑桌面版"
            >
              <Monitor size={12} />
              <span>电脑版</span>
            </button>
          )}

          {/* 返回总大厅 */}
          <a
            href="../"
            className="m-mode-switch-btn m-pressable"
            style={{ textDecoration: 'none', background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}
            title="返回少儿智趣成长与游戏中心主页"
          >
            <span>🏠 大厅</span>
          </a>
        </div>
      </div>

      {/* 年级与学科横向滑动选择条 */}
      <div className="m-curriculum-scrollers">
        {/* 年级滑动栏 */}
        <div className="m-chips-row">
          <span className="m-row-label">年级:</span>
          {GRADES.map(g => (
            <button
              key={g.id}
              className={`m-chip-btn m-pressable ${profile.grade === g.id ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                onSelectGrade(g.id);
              }}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* 学科滑动栏 */}
        <div className="m-chips-row">
          <span className="m-row-label">学科:</span>
          {SUBJECTS.map(s => (
            <button
              key={s.id}
              className={`m-subject-chip m-pressable ${profile.subject === s.id ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                onSelectSubject(s.id);
              }}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
