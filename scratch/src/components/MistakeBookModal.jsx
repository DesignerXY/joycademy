import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { recordQuestionResult } from '../utils/storage';
import { SUBJECTS, GRADES } from '../data/curriculumData';
import { X, BookOpen, RotateCcw, CheckCircle2, HelpCircle, Filter } from 'lucide-react';

export default function MistakeBookModal({
  profile,
  currentSubject = 'math',
  currentGrade = 3,
  onClose,
  onProfileUpdated
}) {
  const allMistakes = profile.wrongQuestions || [];
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'current'
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [retryAnswer, setRetryAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const currentSubjObj = SUBJECTS.find(s => s.id === currentSubject) || SUBJECTS[0];
  const currentGradeObj = GRADES.find(g => g.id === currentGrade) || GRADES[2];

  const displayedMistakes = allMistakes.filter(m => {
    if (filterMode === 'all') return true;
    return (m.subject || 'math') === currentSubject && (m.grade || 3) === currentGrade;
  });

  const [shuffledMistakeOptions, setShuffledMistakeOptions] = useState([]);

  const cleanOptionText = (text) => {
    if (!text) return '';
    return String(text).replace(/^[A-Da-d][.、:：\s]+/, '').trim();
  };

  useEffect(() => {
    if (!selectedMistake || !selectedMistake.options) return;
    const list = selectedMistake.options.map((opt, originalIdx) => ({
      text: cleanOptionText(opt),
      originalIdx,
      isCorrect: originalIdx === selectedMistake.rightAns
    }));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setShuffledMistakeOptions(list);
    setRetryAnswer(null);
    setShowResult(false);
  }, [selectedMistake]);

  const handleRetryAnswer = (optItem, displayIdx) => {
    if (retryAnswer !== null) return;
    setRetryAnswer(displayIdx);
    setShowResult(true);

    const isRight = optItem.isCorrect;
    if (isRight) {
      sound.playCorrect();
      recordQuestionResult(
        selectedMistake.subject || currentSubject,
        selectedMistake.grade || currentGrade,
        selectedMistake.unitId,
        { id: selectedMistake.id, ...selectedMistake },
        true,
        optItem.originalIdx
      );
      onProfileUpdated();
    } else {
      sound.playWrong();
    }
  };

  const handleStartRetry = (item) => {
    sound.playClick();
    setSelectedMistake(item);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="standard-modal mistakes-modal" onClick={e => e.stopPropagation()}>
        <div className="standard-modal-header bg-mistake">
          <div className="header-title-flex">
            <BookOpen size={24} />
            <div>
              <h3>错题复习本</h3>
              <span className="subtitle">攻克薄弱考点 · 重新答对即可消除错题</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <div className="standard-modal-body">
          {/* 筛选选项卡 */}
          {!selectedMistake && (
            <div className="mistake-filter-tabs">
              <button
                className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => setFilterMode('all')}
              >
                全部错题 ({allMistakes.length})
              </button>
              <button
                className={`filter-btn ${filterMode === 'current' ? 'active' : ''}`}
                onClick={() => setFilterMode('current')}
              >
                仅当前 ({currentGradeObj.name}{currentSubjObj.name})
              </button>
            </div>
          )}

          {displayedMistakes.length === 0 ? (
            <div className="empty-state-view">
              <CheckCircle2 size={56} className="text-emerald animate-bounce" />
              <h4>太厉害了！当前没有待解决的错题！</h4>
              <p>你的答题准确率极高，继续保持这股探险劲头吧！</p>
            </div>
          ) : selectedMistake ? (
            /* 错题重练界面 */
            <div className="mistake-retry-arena">
              <button className="back-link-btn" onClick={() => setSelectedMistake(null)}>
                ← 返回错题列表
              </button>

              <div className="question-card mt-3">
                <div className="mb-2">
                  <span className="q-tag">
                    {selectedMistake.grade ? `${selectedMistake.grade}年级` : ''}{' '}
                    {SUBJECTS.find(s => s.id === selectedMistake.subject)?.name || '数学'}
                  </span>
                </div>
                <h3 className="question-title">{selectedMistake.question}</h3>

                <div className="options-grid">
                  {shuffledMistakeOptions.map((optItem, displayIdx) => {
                    let btnStyle = 'option-btn';
                    if (retryAnswer !== null) {
                      if (optItem.isCorrect) {
                        btnStyle += ' correct';
                      } else if (displayIdx === retryAnswer) {
                        btnStyle += ' wrong';
                      }
                    }
                    return (
                      <button
                        key={displayIdx}
                        className={btnStyle}
                        onClick={() => handleRetryAnswer(optItem, displayIdx)}
                        disabled={retryAnswer !== null}
                      >
                        <span className="opt-letter">{['A', 'B', 'C', 'D'][displayIdx]}</span>
                        <span className="opt-text">{optItem.text}</span>
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className={`explanation-card ${shuffledMistakeOptions[retryAnswer]?.isCorrect ? 'success' : 'failed'}`}>
                    <div className="exp-status">
                      {shuffledMistakeOptions[retryAnswer]?.isCorrect ? (
                        <>
                          <CheckCircle2 size={20} className="text-emerald" />
                          <strong>重练成功！此题已从错题本消除！</strong>
                        </>
                      ) : (
                        <>
                          <HelpCircle size={20} className="text-rose" />
                          <strong>仍未答对，请看名师点拨再琢磨一下：</strong>
                        </>
                      )}
                    </div>
                    <p className="exp-body">{selectedMistake.analysis}</p>
                    {shuffledMistakeOptions[retryAnswer]?.isCorrect && (
                      <button className="chip-btn primary mt-3" onClick={() => setSelectedMistake(null)}>
                        返回继续消灭其他错题
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 错题列表 */
            <div className="mistakes-list">
              <div className="list-banner">
                <span>共有 <strong>{displayedMistakes.length}</strong> 道需要复习的难题</span>
              </div>
              {displayedMistakes.map((m, i) => {
                const subObj = SUBJECTS.find(s => s.id === m.subject);
                return (
                  <div key={m.qKey || m.id || i} className="mistake-item-card">
                    <div className="item-main">
                      <span className="q-tag">
                        {m.grade || 3}年级 {subObj?.name || '数学'} · 难题 #{i + 1}
                      </span>
                      <h4 className="q-preview">{m.question}</h4>
                    </div>
                    <button className="chip-btn primary retry-btn" onClick={() => handleStartRetry(m)}>
                      <RotateCcw size={14} className="mr-1 inline" /> 立即重练
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
