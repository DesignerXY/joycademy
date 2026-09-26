import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { recordQuestionResult } from '../../utils/storage';
import { SUBJECTS, GRADES } from '../../data/curriculumData';
import { BookOpen, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

export default function MobileMistakes({
  profile,
  currentSubject = 'math',
  currentGrade = 3,
  onProfileUpdated
}) {
  const allMistakes = profile.wrongQuestions || [];
  const [filterMode, setFilterMode] = useState('all');
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [retryAnswer, setRetryAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const displayedMistakes = allMistakes.filter(m => {
    if (filterMode === 'all') return true;
    return (m.subject || 'math') === currentSubject && (m.grade || 3) === currentGrade;
  });

  const [shuffledOptions, setShuffledOptions] = useState([]);

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
    setShuffledOptions(list);
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
        selectedMistake.unitId || 'unknown',
        selectedMistake,
        true,
        optItem.originalIdx
      );
    } else {
      sound.playWrong();
    }
    if (onProfileUpdated) onProfileUpdated();
  };

  return (
    <div className="m-subview-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
          <BookOpen size={20} className="text-rose-500" />
          <span>错题攻坚复习本</span>
        </h3>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B91C1C', background: '#FEE2E2', padding: '2px 8px', borderRadius: 9999 }}>
          {allMistakes.length} 道错题
        </span>
      </div>

      {/* 筛选条 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <button
          className={`m-chip-btn m-pressable ${filterMode === 'all' ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setFilterMode('all');
            setSelectedMistake(null);
          }}
        >
          全部错题 ({allMistakes.length})
        </button>
        <button
          className={`m-chip-btn m-pressable ${filterMode === 'current' ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setFilterMode('current');
            setSelectedMistake(null);
          }}
        >
          当前科目与年级
        </button>
      </div>

      {allMistakes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748B' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
          <h4 style={{ fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>哇！目前没有任何错题记录</h4>
          <p style={{ fontSize: '0.8rem' }}>保持细心与专注，你已经击败了所有题目考点！</p>
        </div>
      ) : selectedMistake ? (
        /* 错题重练区 */
        <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: 9999 }}>
              重练挑战
            </span>
            <button
              className="m-pressable"
              style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}
              onClick={() => setSelectedMistake(null)}
            >
              返回列表
            </button>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', marginBottom: 12, lineHeight: 1.5 }}>
            {selectedMistake.question}
          </h4>

          <div className="m-options-col">
            {shuffledOptions.map((opt, oIdx) => {
              const isSelected = retryAnswer === oIdx;
              let optClass = '';
              if (retryAnswer !== null) {
                if (opt.isCorrect) optClass = 'correct';
                else if (isSelected) optClass = 'wrong';
              }

              return (
                <button
                  key={oIdx}
                  className={`m-quiz-opt-btn m-pressable ${optClass}`}
                  disabled={retryAnswer !== null}
                  onClick={() => handleRetryAnswer(opt, oIdx)}
                >
                  <span className="m-opt-badge">{String.fromCharCode(65 + oIdx)}</span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div style={{ marginTop: 12, padding: 10, background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>💡 错因解析：</div>
              <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                {selectedMistake.explanation || '仔细审题，抓住关键词与数量关系！'}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 错题卡片列表 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayedMistakes.map((m, idx) => (
            <div
              key={idx}
              className="m-pressable"
              style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}
              onClick={() => {
                sound.playClick();
                setSelectedMistake(m);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>
                  错题 #{idx + 1}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <RotateCcw size={12} /> 点击重做
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
                {m.question}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
