import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { SUBJECTS, GRADES, getCurriculumUnits } from '../data/curriculumData';
import { X, Award, Trophy, Star, Lock, CheckCircle2 } from 'lucide-react';

export default function HonorModal({ profile, onClose }) {
  const [activeSubject, setActiveSubject] = useState(profile.subject || 'math');
  const [activeGrade, setActiveGrade] = useState(profile.grade || 3);

  const earnedBadges = new Set(profile.badges || []);
  const currentUnits = getCurriculumUnits(activeSubject, activeGrade);

  // 计算当前年级学科已获得的徽章
  const currentBadges = currentUnits.map(u => u.boss?.badge).filter(Boolean);
  const currentEarnedCount = currentBadges.filter(b => earnedBadges.has(b.id)).length;

  const handleSubjClick = (id) => {
    sound.playClick();
    setActiveSubject(id);
  };

  const handleGradeClick = (gId) => {
    sound.playClick();
    setActiveGrade(gId);
  };

  const subjObj = SUBJECTS.find(s => s.id === activeSubject);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="standard-modal honor-modal" onClick={e => e.stopPropagation()}>
        <div className="standard-modal-header bg-honor">
          <div className="header-title-flex">
            <Trophy size={26} className="text-amber" />
            <div>
              <h3>荣誉殿堂 · 领主黄金勋章墙</h3>
              <span className="subtitle">击败单元领主 Boss 即可解锁对应的专属黄金徽章</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <div className="standard-modal-body">
          {/* 学科切换导航 */}
          <div className="overview-subj-nav" style={{ marginBottom: '12px' }}>
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                className={`overview-tab ${activeSubject === s.id ? 'active' : ''}`}
                onClick={() => handleSubjClick(s.id)}
              >
                <span className="mr-1">{s.icon}</span> {s.name}
              </button>
            ))}
          </div>

          {/* 年级切换导航 */}
          <div className="overview-grade-row" style={{ marginBottom: '16px' }}>
            <span>学段选择：</span>
            {GRADES.map(g => (
              <button
                key={g.id}
                className={`grade-pill ${activeGrade === g.id ? 'active' : ''}`}
                onClick={() => handleGradeClick(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* 进度横幅 */}
          <div className="honor-summary-banner">
            <div className="badge-count-stat">
              【{subjObj?.name} · {activeGrade}年级】已收集徽章：<strong>{currentEarnedCount}</strong> / {currentBadges.length}
              <span style={{ marginLeft: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                （全学科累计获得: {earnedBadges.size} 枚）
              </span>
            </div>
            <div className="honor-progress-track">
              <div
                className="honor-progress-fill"
                style={{ width: `${currentBadges.length > 0 ? (currentEarnedCount / currentBadges.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* 徽章网格展示 */}
          <div className="badges-grid-showcase">
            {currentUnits.map(unit => {
              const badge = unit.boss?.badge;
              if (!badge) return null;
              const isEarned = earnedBadges.has(badge.id);

              return (
                <div key={badge.id} className={`badge-card ${isEarned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon-bubble">
                    <span className="badge-emoji">{badge.icon}</span>
                    {!isEarned && (
                      <div className="badge-lock-overlay">
                        <Lock size={18} />
                      </div>
                    )}
                  </div>
                  <h4 className="badge-name">{badge.name}</h4>
                  <span className="badge-unit-source">{unit.name}</span>
                  <p className="badge-description">{badge.desc}</p>
                  {isEarned ? (
                    <div className="earned-mark">
                      <CheckCircle2 size={14} className="text-emerald mr-1" /> 已解锁
                    </div>
                  ) : (
                    <div className="locked-mark" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      击败Boss解锁
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
