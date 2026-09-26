import React from 'react';
import { sound } from '../utils/audio';
import { SUBJECTS, GRADES } from '../data/curriculumData';
import {
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  FileText,
  Coins,
  Smile,
  Compass,
  Smartphone
} from 'lucide-react';

export default function Header({
  profile,
  soundEnabled,
  onToggleSound,
  onOpenMistakes,
  onOpenHonors,
  onOpenReport,
  onOpenCurriculumOverview,
  onOpenRelay,
  onSelectGrade,
  onSelectSubject,
  onSwitchToMobile
}) {
  const wrongCount = profile.wrongQuestions?.length || 0;
  const level = profile.level || 1;
  const exp = profile.exp || 0;
  const expProgress = (exp % 100);

  return (
    <header className="main-app-header">
      {/* 顶部主品牌栏 */}
      <div className="header-top-row">
        <div className="brand-logo-group">
          <div className="brand-icon-box">
            <Sparkles size={24} className="text-amber animate-pulse" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-title">智趣学堂 · 小学生游戏化学习大世界</h1>
            <span className="brand-sub">人教版教材知识点全覆盖 · 沉浸式闯关冒险</span>
          </div>
        </div>

        {/* 角色与功能快捷按钮区 */}
        <div className="header-actions-group">
          {/* 金币显示 */}
          <div className="currency-badge" title="探险获得的金币">
            <Coins size={18} className="text-amber" />
            <span className="currency-num">{profile.coins}</span>
          </div>

          {/* 角色等级与经验条 */}
          <div className="user-profile-badge">
            <span className="avatar-emoji">{profile.avatar}</span>
            <div className="profile-info">
              <span className="user-name">{profile.name} (Lv.{level})</span>
              <div className="exp-bar-mini" title={`当前经验: ${expProgress}/100`}>
                <div className="exp-fill-mini" style={{ width: `${expProgress}%` }}></div>
              </div>
            </div>
          </div>

          {/* 错题本入口 */}
          <button
            className="action-pill-btn mistakes-btn"
            onClick={() => {
              sound.playClick();
              onOpenMistakes();
            }}
            title="查看并重练错题"
          >
            <BookOpen size={16} />
            <span>错题本</span>
            {wrongCount > 0 && <span className="pill-badge">{wrongCount}</span>}
          </button>

          {/* 荣誉徽章入口 */}
          <button
            className="action-pill-btn honors-btn"
            onClick={() => {
              sound.playClick();
              onOpenHonors();
            }}
            title="查看已收集的岛屿黄金勋章"
          >
            <Award size={16} />
            <span>荣誉殿堂</span>
          </button>

          {/* 学习日报/家长看板 */}
          <button
            className="action-pill-btn report-btn"
            onClick={() => {
              sound.playClick();
              onOpenReport();
            }}
            title="查看学习报告与知识点掌握度"
          >
            <FileText size={16} />
            <span>学情报告</span>
          </button>

          {/* 火柴人荣耀接力 */}
          <button
            className="action-pill-btn relay-nav-btn"
            onClick={() => {
              sound.playClick();
              onOpenRelay();
            }}
            title="观摩火柴人火炬交接与荣耀仪式"
          >
            <span style={{ fontSize: '1.1rem' }}>🔥</span>
            <span>火柴人接力</span>
          </button>

          {/* 切换到手机版 */}
          {onSwitchToMobile && (
            <button
              className="action-pill-btn mobile-switch-pill"
              style={{ background: '#EEF2FF', color: '#4F46E5', borderColor: '#C7D2FE' }}
              onClick={() => {
                sound.playClick();
                onSwitchToMobile();
              }}
              title="切换到移动端体验"
            >
              <Smartphone size={16} />
              <span>手机版</span>
            </button>
          )}

          {/* 音效开关 */}
          <button
            className="icon-circle-btn sound-toggle-btn"
            onClick={() => {
              const res = onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? '静音音效' : '开启音效'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-muted" />}
          </button>

          {/* 返回总大厅 */}
          <a
            href="../"
            className="action-pill-btn hub-return-btn"
            style={{
              background: '#FEF3C7',
              color: '#B45309',
              borderColor: '#FDE68A',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
            title="返回少儿智趣成长与游戏中心主页"
          >
            <span>🏠</span>
            <span>返回大厅</span>
          </a>
        </div>
      </div>

      {/* 年级与学科矩阵导航条 */}
      <div className="curriculum-matrix-bar">
        {/* 年级导航 */}
        <div className="grades-nav-row">
          <span className="matrix-label">当前年级：</span>
          <div className="chips-scroller">
            {GRADES.map(g => (
              <button
                key={g.id}
                className={`grade-chip ${profile.grade === g.id ? 'active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  onSelectGrade(g.id);
                }}
              >
                {g.name}
                <span className="grade-tag-hot">教材全覆盖</span>
              </button>
            ))}
          </div>
        </div>

        {/* 学科导航 */}
        <div className="subjects-nav-row">
          <span className="matrix-label">探险学科：</span>
          <div className="subjects-group">
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                className={`subject-chip ${profile.subject === s.id ? 'active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  onSelectSubject(s.id);
                }}
              >
                <span className="subj-icon">{s.icon}</span>
                <span className="subj-name">{s.name}</span>
                {s.edition && <span className="subj-status-badge">{s.edition}</span>}
              </button>
            ))}
          </div>

          <button
            className="curriculum-overview-link"
            onClick={() => {
              sound.playClick();
              onOpenCurriculumOverview();
            }}
          >
            <Compass size={15} />
            <span>全学科知识图谱总览</span>
          </button>
        </div>
      </div>
    </header>
  );
}
