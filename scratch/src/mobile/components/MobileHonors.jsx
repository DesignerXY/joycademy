import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { SUBJECTS, GRADES, getCurriculumUnits } from '../../data/curriculumData';
import { Trophy, Award, Lock, Star } from 'lucide-react';

export default function MobileHonors({ profile }) {
  const [activeSubject, setActiveSubject] = useState(profile.subject || 'math');
  const [activeGrade, setActiveGrade] = useState(profile.grade || 3);

  const earnedBadges = new Set(profile.badges || []);
  const currentUnits = getCurriculumUnits(activeSubject, activeGrade);
  const currentBadges = currentUnits.map(u => u.boss?.badge).filter(Boolean);
  const currentEarnedCount = currentBadges.filter(b => earnedBadges.has(b.id)).length;

  return (
    <div className="m-subview-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Trophy size={20} className="text-amber" />
          <span>荣誉殿堂勋章墙</span>
        </h3>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: 9999 }}>
          已获 {currentEarnedCount} / {currentBadges.length} 勋章
        </span>
      </div>

      {/* 学科筛选 */}
      <div className="m-chips-row" style={{ marginBottom: 8 }}>
        {SUBJECTS.map(s => (
          <button
            key={s.id}
            className={`m-subject-chip m-pressable ${activeSubject === s.id ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveSubject(s.id);
            }}
          >
            <span>{s.icon}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* 年级筛选 */}
      <div className="m-chips-row" style={{ marginBottom: 14 }}>
        {GRADES.map(g => (
          <button
            key={g.id}
            className={`m-chip-btn m-pressable ${activeGrade === g.id ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveGrade(g.id);
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* 勋章网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {currentBadges.map((badge, idx) => {
          const isUnlocked = earnedBadges.has(badge.id);
          return (
            <div
              key={badge.id || idx}
              style={{
                background: isUnlocked ? '#FFFDF5' : '#F8FAFC',
                border: `1.5px solid ${isUnlocked ? '#FDE68A' : '#E2E8F0'}`,
                borderRadius: 12,
                padding: 12,
                textAlign: 'center',
                opacity: isUnlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 4, filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                {badge.icon || '🏅'}
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: isUnlocked ? '#B45309' : '#64748B', marginBottom: 2 }}>
                {badge.name}
              </h4>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                {isUnlocked ? '已征服领主' : '击败领主解锁'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
