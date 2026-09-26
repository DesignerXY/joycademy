import React from 'react';
import { SUBJECTS, GRADES } from '../../data/curriculumData';
import { BarChart3, TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react';

export default function MobileReport({
  profile,
  currentSubject = 'math',
  currentGrade = 3
}) {
  const stats = profile.studyStats || {};
  const totalSolved = stats.totalQuestionsSolved || 0;
  const correctCount = stats.correctCount || 0;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;
  const bossDefeated = stats.bossDefeated || 0;
  const wrongCount = profile.wrongQuestions?.length || 0;

  const currentSubjObj = SUBJECTS.find(s => s.id === currentSubject) || SUBJECTS[0];
  const currentGradeObj = GRADES.find(g => g.id === currentGrade) || GRADES[2];

  const totalStars = Object.values(profile.unitProgress || {}).reduce(
    (sum, cur) => sum + (cur?.stars || 0),
    0
  );

  return (
    <div className="m-subview-wrapper">
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
          <BarChart3 size={20} className="text-blue-600" />
          <span>学生学情全维看板</span>
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>
          {profile.name} · {currentGradeObj.name} · {currentSubjObj.name}
        </p>
      </div>

      {/* 4 大核心指标 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#EFF6FF', padding: 12, borderRadius: 10, border: '1px solid #BFDBFE' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E40AF' }}>累计答题</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1D4ED8', marginTop: 2 }}>
            {totalSolved} <small style={{ fontSize: '0.75rem' }}>题</small>
          </div>
        </div>

        <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 10, border: '1px solid #BBF7D0' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>综合正确率</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803D', marginTop: 2 }}>
            {accuracy}%
          </div>
        </div>

        <div style={{ background: '#FAF5FF', padding: 12, borderRadius: 10, border: '1px solid #E9D5FF' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B21A8' }}>击败领主</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7E22CE', marginTop: 2 }}>
            {bossDefeated} <small style={{ fontSize: '0.75rem' }}>个</small>
          </div>
        </div>

        <div style={{ background: '#FFFBEB', padding: 12, borderRadius: 10, border: '1px solid #FDE68A' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400E' }}>探险总星级</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#B45309', marginTop: 2 }}>
            {totalStars} <small style={{ fontSize: '0.75rem' }}>★</small>
          </div>
        </div>
      </div>

      {/* 建议与总结卡片 */}
      <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>学情诊断与导师建议</span>
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
          {wrongCount === 0
            ? '基础非常扎实！建议在具象工坊中继续多动手做实验，巩固逻辑思维与知识点迁移能力。'
            : `当前错题本有 ${wrongCount} 道待巩固题目，建议利用课余碎片时间点击底栏【错题本】进行重练攻坚，查漏补缺！`}
        </p>
      </div>
    </div>
  );
}
