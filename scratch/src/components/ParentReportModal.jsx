import React from 'react';
import { SUBJECTS, GRADES, getCurriculumUnits } from '../data/curriculumData';
import { X, FileText, CheckCircle2, TrendingUp, Award, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ParentReportModal({
  profile,
  currentSubject = 'math',
  currentGrade = 3,
  onClose
}) {
  const stats = profile.studyStats || {};
  const totalSolved = stats.totalQuestionsSolved || 0;
  const correctCount = stats.correctCount || 0;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;
  const bossDefeated = stats.bossDefeated || 0;
  const wrongCount = profile.wrongQuestions?.length || 0;

  const currentSubjObj = SUBJECTS.find(s => s.id === currentSubject) || SUBJECTS[0];
  const currentGradeObj = GRADES.find(g => g.id === currentGrade) || GRADES[2];
  const currentUnits = getCurriculumUnits(currentSubject, currentGrade);

  const totalStars = Object.values(profile.unitProgress || {}).reduce(
    (sum, cur) => sum + (cur?.stars || 0),
    0
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="standard-modal report-modal" onClick={e => e.stopPropagation()}>
        <div className="standard-modal-header bg-report">
          <div className="header-title-flex">
            <FileText size={24} />
            <div>
              <h3>小学生学情报告与家长看板</h3>
              <span className="subtitle">
                学生：{profile.name} · {currentGradeObj.name}{currentSubjObj.name}（{currentSubjObj.edition}）
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <div className="standard-modal-body">
          {/* 四大核心指标卡 */}
          <div className="report-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">累计答题数</span>
              <span className="kpi-val text-blue">{totalSolved} <small>题</small></span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">综合准确率</span>
              <span className="kpi-val text-emerald">{accuracy}%</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">征服领主Boss</span>
              <span className="kpi-val text-purple">{bossDefeated} <small>个</small></span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">点亮探险星级</span>
              <span className="kpi-val text-amber">{totalStars} <small>★</small></span>
            </div>
          </div>

          {/* 学习表现综合评价 */}
          <div className="evaluation-card mt-4">
            <div className="eval-header">
              <TrendingUp size={20} className="text-emerald" />
              <h4>
                {currentGradeObj.name}{currentSubjObj.name} · 名师综合学情诊断：
              </h4>
            </div>
            <p className="eval-text">
              {accuracy >= 90
                ? `该学生在${currentGradeObj.name}${currentSubjObj.name}学科思维敏捷，对教材核心考点掌握极为扎实！在具象教具操作与变种题逻辑推理中表现出色，自主探索能力优异。`
                : accuracy >= 75
                ? `整体学习基础良好，能够较好理解教材大纲知识体系。在易错变种题细节上稍加巩固，即可冲刺满分！`
                : `学习态度积极认真，建议多在【具象工坊】中动手做实验并复听语音伴读，结合直观模型加深对知识点本质的理解。`}
            </p>
          </div>

          {/* 薄弱点与待巩固单元 */}
          <div className="weak-points-section mt-4">
            <h4>
              <AlertTriangle size={18} className="text-amber inline mr-1" />
              全学科错题分布与温习提醒：
            </h4>
            {wrongCount > 0 ? (
              <div className="weak-alert-box">
                当前错题本中尚有 <strong>{wrongCount} 道</strong> 题目待巩固。建议引导孩子在“错题本”中使用【立即重练】功能完成闭环复习。
              </div>
            ) : (
              <div className="all-clear-box">
                <ShieldCheck size={20} className="text-emerald inline mr-1" />
                当前所有错题均已被学生全部攻克消除，学业掌握状态优秀！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
