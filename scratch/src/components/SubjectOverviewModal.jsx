import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { SUBJECTS, GRADES, getCurriculumUnits, OTHER_SUBJECTS_SYLLABUS } from '../data/curriculumData';
import { X, BookOpen, Compass, CheckCircle2, Star, Sparkles, Trophy, Award, FlaskConical } from 'lucide-react';

export default function SubjectOverviewModal({ onClose }) {
  const [activeSubject, setActiveSubject] = useState('math');
  const [activeGrade, setActiveGrade] = useState(1);

  const handleSubjClick = (id) => {
    sound.playClick();
    setActiveSubject(id);
  };

  const handleGradeClick = (gId) => {
    sound.playClick();
    setActiveGrade(gId);
  };

  const currentSubjectObj = SUBJECTS.find(s => s.id === activeSubject);
  const isPlayableGrade = activeGrade <= 6;
  const currentUnits = isPlayableGrade ? getCurriculumUnits(activeSubject, activeGrade) : [];
  const hasSemesters = currentUnits.some(u => u.semester === 'lower');

  const upperUnits = currentUnits.filter(u => u.semester === 'upper' || !u.semester);
  const lowerUnits = currentUnits.filter(u => u.semester === 'lower');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="standard-modal overview-modal" onClick={e => e.stopPropagation()}>
        <div className="standard-modal-header bg-overview">
          <div className="header-title-flex">
            <Compass size={26} className="text-amber" />
            <div>
              <h3>全学科·全学段知识图谱总览</h3>
              <span className="subtitle">
                {currentSubjectObj?.name}（{currentSubjectObj?.edition}）· 一至六年级全课程知识点与闯关矩阵
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <div className="standard-modal-body">
          {/* 学科切换标签 */}
          <div className="overview-subj-nav">
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                className={`overview-tab ${activeSubject === s.id ? 'active' : ''}`}
                onClick={() => handleSubjClick(s.id)}
              >
                <span className="mr-1">{s.icon}</span> {s.name}
                <span className="mini-tag">{s.edition}</span>
              </button>
            ))}
          </div>

          {/* 年级选择 */}
          <div className="overview-grade-row">
            <span>学段选择：</span>
            {GRADES.map(g => (
              <button
                key={g.id}
                className={`grade-pill ${activeGrade === g.id ? 'active' : ''} has-content`}
                onClick={() => handleGradeClick(g.id)}
              >
                {g.name}
                <span className="grade-badge-dot">★</span>
              </button>
            ))}
          </div>

          {/* 课程矩阵展示 */}
          <div className="syllabus-display-container">
            {isPlayableGrade ? (
              <div className="math-full-syllabus">
                <div className="syllabus-highlight-banner">
                  <Sparkles size={20} className="text-amber" />
                  <span>
                    <strong>{currentSubjectObj?.name}（{currentSubjectObj?.edition}）{activeGrade}年级</strong>
                    ：共收录 {currentUnits.length} 个核心探险关卡，配有知识卡片、互动实验操练、课标必考变种题及领主Boss战！
                  </span>
                </div>

                {hasSemesters ? (
                  <div className="units-two-col-grid">
                    <div className="semester-col">
                      <h4 className="col-title">📘 {activeGrade}年级上册（{upperUnits.length} 个单元）</h4>
                      <div className="col-units-list">
                        {upperUnits.map(u => (
                          <div key={u.id} className="syllabus-unit-pill">
                            <span className="unit-idx">{u.number}.</span>
                            <span className="unit-icon">{u.icon}</span>
                            <div className="unit-details">
                              <strong>{u.name}</strong>
                              <small>{u.theme}</small>
                            </div>
                            <div className="unit-tags-row">
                              {u.labType && <span className="lab-tag-pill">🧪实验</span>}
                              <span className="status-playable">可挑战</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="semester-col">
                      <h4 className="col-title">📗 {activeGrade}年级下册（{lowerUnits.length} 个单元）</h4>
                      <div className="col-units-list">
                        {lowerUnits.map(u => (
                          <div key={u.id} className="syllabus-unit-pill">
                            <span className="unit-idx">{u.number}.</span>
                            <span className="unit-icon">{u.icon}</span>
                            <div className="unit-details">
                              <strong>{u.name}</strong>
                              <small>{u.theme}</small>
                            </div>
                            <div className="unit-tags-row">
                              {u.labType && <span className="lab-tag-pill">🧪实验</span>}
                              <span className="status-playable">可挑战</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-units-list single-col-grid">
                    {currentUnits.map(u => (
                      <div key={u.id} className="syllabus-unit-pill">
                        <span className="unit-idx">{u.number}.</span>
                        <span className="unit-icon">{u.icon}</span>
                        <div className="unit-details">
                          <strong>{u.name}</strong>
                          <small>{u.theme}</small>
                        </div>
                        <div className="unit-tags-row">
                          {u.labType && <span className="lab-tag-pill">🧪实验</span>}
                          <span className="status-playable">可挑战</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* 4-6年级规划纲要展示 */
              <div className="other-subject-syllabus">
                <div className="other-intro-banner">
                  <span>
                    {currentSubjectObj?.name} · {activeGrade}年级教育部新课标规划纲要（后续探险版图陆续开放）：
                  </span>
                </div>

                <div className="other-units-grid">
                  {(OTHER_SUBJECTS_SYLLABUS[activeSubject]?.grade3 || [
                    { unit: 1, title: '综合认知与高阶素养', keypoints: ['逻辑思维', '学科整合', '项目式探究'] },
                    { unit: 2, title: '专题拓展与实践创新', keypoints: ['动手实践', '模型建构', '深度拓展'] }
                  ]).map((item, idx) => (
                    <div key={idx} className="other-unit-card">
                      <div className="other-unit-header">
                        <span className="u-num">第 {item.unit || idx + 1} 单元</span>
                        <h4>{item.title}</h4>
                      </div>
                      <div className="other-keypoints">
                        {item.keypoints?.map((kp, kIdx) => (
                          <span key={kIdx} className="kp-tag">✓ {kp}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
