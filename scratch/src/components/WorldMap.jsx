import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { getUnitProgress } from '../utils/storage';
import { SUBJECTS, GRADES } from '../data/curriculumData';
import { Star, Trophy, Lock, Compass, Flame } from 'lucide-react';

export default function WorldMap({ units, profile, subject = 'math', grade = 3, onSelectUnit }) {
  const [semesterFilter, setSemesterFilter] = useState('all'); // 'all' | 'upper' | 'lower'

  const currentSubjectObj = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];
  const currentGradeObj = GRADES.find(g => g.id === grade) || GRADES[2];

  const hasSemesters = units.some(u => u.semester);

  const filteredUnits = units.filter(u => {
    if (!hasSemesters || semesterFilter === 'all') return true;
    return u.semester === semesterFilter;
  });

  // 统计当前学科与年级获得的星星与勋章
  let subjectGradeStars = 0;
  let subjectGradeBadges = 0;
  units.forEach((u, i) => {
    const p = getUnitProgress(profile, subject, grade, u.id, i === 0);
    subjectGradeStars += (p.stars || 0);
    if (p.badge) subjectGradeBadges += 1;
  });

  const maxStars = units.length * 3;

  return (
    <div className="world-map-section">
      {/* 顶部探险地图控制栏 */}
      <div className="map-top-bar">
        <div className="map-title-box">
          <div className="title-with-icon">
            <Compass className="text-amber animate-spin-slow" size={26} />
            <h2>
              {currentGradeObj.name}{currentSubjectObj.name} · {units.length} 座冒险岛屿大地图
            </h2>
          </div>
          <p className="map-desc">
            {currentSubjectObj.edition || '标准教材'}知识点全覆盖 · 四阶闭环闯关探险
          </p>
        </div>

        {/* 探险总成就统计徽章 */}
        <div className="map-stats-ribbon">
          <div className="stat-pill">
            <Star className="text-amber fill-amber" size={18} />
            <span>
              当前星级：<strong>{subjectGradeStars}</strong> / {maxStars}
            </span>
          </div>
          <div className="stat-pill">
            <Trophy className="text-indigo fill-indigo" size={18} />
            <span>
              已获勋章：<strong>{subjectGradeBadges}</strong> / {units.length}
            </span>
          </div>
        </div>

        {/* 学期分册筛选（若存在上下册） */}
        {hasSemesters && (
          <div className="semester-tabs">
            <button
              className={`tab-btn ${semesterFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setSemesterFilter('all');
              }}
            >
              全部 {units.length} 单元
            </button>
            <button
              className={`tab-btn ${semesterFilter === 'upper' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setSemesterFilter('upper');
              }}
            >
              上册
            </button>
            <button
              className={`tab-btn ${semesterFilter === 'lower' ? 'active' : ''}`}
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

      {/* 岛屿群冒险地图网格 */}
      <div className="islands-grid">
        {filteredUnits.map((unit, index) => {
          const progress = getUnitProgress(profile, subject, grade, unit.id, index === 0);

          const isUnlocked = progress.unlocked || index === 0;
          const isCompleted = progress.completed;
          const stars = progress.stars || 0;

          return (
            <div
              key={unit.id}
              className={`island-card ${isUnlocked ? 'unlocked' : 'locked'} ${
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
              style={{
                '--island-gradient': unit.bgColor || 'linear-gradient(135deg, #667eea, #764ba2)'
              }}
            >
              {/* 岛屿序号标签 */}
              <div className="island-badge-header">
                <span className="semester-tag">
                  {unit.semester ? (unit.semester === 'upper' ? '上册 ' : '下册 ') : ''}
                  第 {unit.number || index + 1} 单元
                </span>
                {isCompleted ? (
                  <span className="status-tag conquered">
                    <Trophy size={13} className="mr-1" /> 已通关
                  </span>
                ) : isUnlocked ? (
                  <span className="status-tag active">
                    <Flame size={13} className="mr-1" /> 可挑战
                  </span>
                ) : (
                  <span className="status-tag locked">
                    <Lock size={13} className="mr-1" /> 未解锁
                  </span>
                )}
              </div>

              {/* 岛屿主题大图标与名称 */}
              <div className="island-visual">
                <div
                  className="island-icon-sphere"
                  style={{ background: unit.bgColor || 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  <span className="island-emoji">{unit.icon || '🏝️'}</span>
                </div>
                <div className="island-name-col">
                  <h3 className="island-title">{unit.name}</h3>
                  <span className="island-theme-title">{unit.theme || '知识探索营'}</span>
                </div>
              </div>

              {/* 知识点简介 */}
              <p className="island-summary">{unit.summary}</p>

              {/* 底部星级与进入按钮 */}
              <div className="island-card-footer">
                <div className="stars-row">
                  {Array.from({ length: 3 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      size={18}
                      className={sIdx < stars ? 'star-gold fill-gold' : 'star-dim'}
                    />
                  ))}
                </div>

                <button className="island-enter-btn" disabled={!isUnlocked}>
                  {isCompleted ? '再次温习' : isUnlocked ? '登岛探险' : '锁定中'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
