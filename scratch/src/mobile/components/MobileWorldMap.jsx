import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { getUnitProgress } from '../../utils/storage';
import { SUBJECTS, GRADES } from '../../data/curriculumData';
import { Star, Trophy, Lock, Flame, ChevronRight } from 'lucide-react';

export default function MobileWorldMap({
  units,
  profile,
  subject = 'math',
  grade = 3,
  onSelectUnit
}) {
  const [semesterFilter, setSemesterFilter] = useState('all');

  const currentSubjectObj = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];
  const currentGradeObj = GRADES.find(g => g.id === grade) || GRADES[2];

  const hasSemesters = units.some(u => u.semester);

  const filteredUnits = units.filter(u => {
    if (!hasSemesters || semesterFilter === 'all') return true;
    return u.semester === semesterFilter;
  });

  // 统计星级与勋章
  let totalStars = 0;
  let totalBadges = 0;
  units.forEach((u, i) => {
    const p = getUnitProgress(profile, subject, grade, u.id, i === 0);
    totalStars += (p.stars || 0);
    if (p.badge) totalBadges += 1;
  });

  return (
    <div className="m-world-map">
      {/* 顶部轻量英雄横幅 */}
      <div className="m-hero-card">
        <div className="m-hero-top">
          <span className="m-hero-tag">
            {currentGradeObj.name} · {currentSubjectObj.name}
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
            {currentSubjectObj.edition}
          </span>
        </div>
        <h2 className="m-hero-title">
          嗨，小探险家 {profile.name}！
        </h2>
        <p style={{ fontSize: '0.78rem', opacity: 0.9, lineHeight: 1.4 }}>
          课本核心知识点已化身为趣味岛屿，快来挑战领主赢得勋章吧！
        </p>

        {/* 3格精炼战绩 */}
        <div className="m-hero-stats-grid">
          <div className="m-stat-card">
            <span className="m-stat-val">💰 {profile.coins}</span>
            <span className="m-stat-lbl">金币</span>
          </div>
          <div className="m-stat-card">
            <span className="m-stat-val">⭐ {totalStars}</span>
            <span className="m-stat-lbl">已得星级</span>
          </div>
          <div className="m-stat-card">
            <span className="m-stat-val">🏆 {totalBadges}</span>
            <span className="m-stat-lbl">收集勋章</span>
          </div>
        </div>
      </div>

      {/* 探索控制栏 */}
      <div className="m-map-control-bar">
        <div className="m-map-title-box">
          <h3>
            <span>🏝️</span>
            <span>{filteredUnits.length} 座探索岛屿</span>
          </h3>
        </div>

        {hasSemesters && (
          <div className="m-semester-pills">
            <button
              className={`m-pill-btn ${semesterFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setSemesterFilter('all');
              }}
            >
              全部
            </button>
            <button
              className={`m-pill-btn ${semesterFilter === 'upper' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setSemesterFilter('upper');
              }}
            >
              上册
            </button>
            <button
              className={`m-pill-btn ${semesterFilter === 'lower' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setSemesterFilter('lower');
              }}
            >
              下册
            </button>
          </div>
        )}
      </div>

      {/* 岛屿卡片流 */}
      <div className="m-island-list">
        {filteredUnits.map((unit, index) => {
          const progress = getUnitProgress(profile, subject, grade, unit.id, index === 0);
          const isUnlocked = progress.unlocked || index === 0;
          const isCompleted = progress.completed;
          const stars = progress.stars || 0;

          return (
            <div
              key={unit.id}
              id={`m-island-card-${unit.id}`}
              className={`m-island-card ${isUnlocked ? 'unlocked' : 'locked'} ${
                isCompleted ? 'completed' : ''
              }`}
              onClick={() => {
                if (isUnlocked) {
                  sound.playClick();
                  onSelectUnit(unit);
                } else {
                  sound.playWrong();
                }
              }}
            >
              <div className="m-card-top-row">
                <span className="m-unit-tag">
                  {unit.semester ? (unit.semester === 'upper' ? '上册 ' : '下册 ') : ''}
                  第 {unit.number || index + 1} 单元
                </span>

                {isCompleted ? (
                  <span className="m-card-status-badge conquered">
                    <Trophy size={11} /> 已通关
                  </span>
                ) : isUnlocked ? (
                  <span className="m-card-status-badge active">
                    <Flame size={11} /> 可挑战
                  </span>
                ) : (
                  <span className="m-card-status-badge locked">
                    <Lock size={11} /> 未解锁
                  </span>
                )}
              </div>

              <div className="m-card-body-row">
                <div
                  className="m-island-sphere"
                  style={{ background: unit.bgColor || 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                >
                  {unit.icon || '🏝️'}
                </div>
                <div className="m-island-texts">
                  <h4 className="m-island-name">{unit.name}</h4>
                  <p className="m-island-summary">{unit.summary || unit.theme}</p>
                </div>
              </div>

              <div className="m-card-bottom-row">
                <div className="m-stars-wrap">
                  {Array.from({ length: 3 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      size={16}
                      className={sIdx < stars ? 'text-amber fill-amber' : 'text-slate-300'}
                      style={{ color: sIdx < stars ? '#F59E0B' : '#CBD5E1', fill: sIdx < stars ? '#F59E0B' : 'transparent' }}
                    />
                  ))}
                </div>

                <button
                  className="m-enter-btn m-pressable"
                  disabled={!isUnlocked}
                >
                  <span>{isCompleted ? '温习' : isUnlocked ? '登岛闯关' : '锁定'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
