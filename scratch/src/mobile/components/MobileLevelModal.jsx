import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { recordQuestionResult, completeUnitStep } from '../../utils/storage';

// 具象工坊组件复用
import ClockLab from '../../components/labs/ClockLab';
import FractionLab from '../../components/labs/FractionLab';
import GeoLab from '../../components/labs/GeoLab';
import CompassLab from '../../components/labs/CompassLab';
import ScaleLab from '../../components/labs/ScaleLab';
import VennLab from '../../components/labs/VennLab';
import CalendarLab from '../../components/labs/CalendarLab';
import UniversalLab from '../../components/labs/UniversalLab';

import {
  X,
  Sparkles,
  BookOpen,
  Wrench,
  Swords,
  Crown,
  Volume2,
  Heart,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  ShieldAlert
} from 'lucide-react';

export default function MobileLevelModal({
  unit,
  profile,
  subject = profile?.subject || 'math',
  grade = profile?.grade || 3,
  onClose,
  onProfileUpdated
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [difficulty, setDifficulty] = useState('medium');

  // 趣味挑战状态
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // 打乱选项状态
  const [shuffledChallengeOptions, setShuffledChallengeOptions] = useState([]);
  const [shuffledBossOptions, setShuffledBossOptions] = useState([]);

  // Boss战状态
  const [bossIdx, setBossIdx] = useState(0);
  const [bossHp, setBossHp] = useState(unit.boss?.hp || 3);
  const [bossAns, setBossAns] = useState(null);
  const [bossShowExp, setBossShowExp] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const cleanOptionText = (text) => {
    if (!text) return '';
    return String(text).replace(/^[A-Da-d][.、:：\s]+/, '').trim();
  };

  const activeChallengeList = useMemo(() => {
    if (!unit.challengesByDifficulty) return unit.challenges || [];
    const list = unit.challengesByDifficulty[difficulty];
    if (list && list.length > 0) return list;
    return unit.challenges || [];
  }, [unit, difficulty]);

  useEffect(() => {
    const q = activeChallengeList[challengeIdx];
    if (q && q.options) {
      const list = q.options.map((opt, originalIdx) => ({
        text: cleanOptionText(opt),
        originalIdx,
        isCorrect: originalIdx === q.answer
      }));
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      setShuffledChallengeOptions(list);
    }
    setSelectedAns(null);
    setShowExplanation(false);
  }, [challengeIdx, difficulty, activeChallengeList]);

  useEffect(() => {
    const bq = unit.boss?.questions?.[bossIdx];
    if (bq && bq.options) {
      const list = bq.options.map((opt, originalIdx) => ({
        text: cleanOptionText(opt),
        originalIdx,
        isCorrect: originalIdx === bq.answer
      }));
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      setShuffledBossOptions(list);
    }
    setBossAns(null);
    setBossShowExp(false);
  }, [bossIdx, unit]);

  const handleSpeak = (text) => {
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speech.speak(text, {
        lang: subject === 'english' ? 'en-US' : 'zh-CN',
        onEnd: () => setIsSpeaking(false)
      });
    }
  };

  const goToStep = (step) => {
    sound.playClick();
    speech.stop();
    setIsSpeaking(false);
    setCurrentStep(step);
    completeUnitStep(subject, grade, unit.id, step);
    if (onProfileUpdated) onProfileUpdated();
  };

  const handleAnswerChallenge = (optItem, displayIdx) => {
    if (selectedAns !== null) return;
    const q = activeChallengeList[challengeIdx];
    setSelectedAns(displayIdx);
    setShowExplanation(true);

    const isRight = optItem.isCorrect;
    if (isRight) {
      sound.playCorrect();
      setStreak(prev => prev + 1);
      recordQuestionResult(subject, grade, unit.id, q, true, optItem.originalIdx);
    } else {
      sound.playWrong();
      setStreak(0);
      setHearts(prev => Math.max(0, prev - 1));
      recordQuestionResult(subject, grade, unit.id, q, false, optItem.originalIdx);
    }
    if (onProfileUpdated) onProfileUpdated();
  };

  const nextChallenge = () => {
    sound.playClick();
    speech.stop();
    setIsSpeaking(false);
    setSelectedAns(null);
    setShowExplanation(false);

    if (challengeIdx + 1 < activeChallengeList.length) {
      setChallengeIdx(prev => prev + 1);
    } else {
      sound.playFanfare();
      setChallengeCompleted(true);
      completeUnitStep(subject, grade, unit.id, 3);
      if (onProfileUpdated) onProfileUpdated();
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleBossAnswer = (optItem, displayIdx) => {
    if (bossAns !== null) return;
    const q = unit.boss.questions[bossIdx];
    setBossAns(displayIdx);
    setBossShowExp(true);

    const isRight = optItem.isCorrect;
    if (isRight) {
      sound.playHit();
      setBossHp(prev => Math.max(0, prev - 1));
      recordQuestionResult(subject, grade, unit.id, q, true, optItem.originalIdx);
    } else {
      sound.playWrong();
      recordQuestionResult(subject, grade, unit.id, q, false, optItem.originalIdx);
    }
    if (onProfileUpdated) onProfileUpdated();
  };

  const nextBossQuestion = () => {
    sound.playClick();
    speech.stop();
    setIsSpeaking(false);
    setBossAns(null);
    setBossShowExp(false);

    if (bossIdx + 1 < unit.boss.questions.length && bossHp > 1) {
      setBossIdx(prev => prev + 1);
    } else {
      sound.playVictory();
      setBossDefeated(true);
      completeUnitStep(subject, grade, unit.id, 4);
      if (onProfileUpdated) onProfileUpdated();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  };

  const renderLab = () => {
    const labType = unit.lab?.type;
    switch (labType) {
      case 'clock':
        return <ClockLab labData={unit.lab} onComplete={() => {}} />;
      case 'fraction':
        return <FractionLab labData={unit.lab} onComplete={() => {}} />;
      case 'geo':
        return <GeoLab labData={unit.lab} onComplete={() => {}} />;
      case 'compass':
        return <CompassLab labData={unit.lab} onComplete={() => {}} />;
      case 'scale':
        return <ScaleLab labData={unit.lab} onComplete={() => {}} />;
      case 'venn':
        return <VennLab labData={unit.lab} onComplete={() => {}} />;
      case 'calendar':
        return <CalendarLab labData={unit.lab} onComplete={() => {}} />;
      default:
        return <UniversalLab unit={unit} onComplete={() => {}} />;
    }
  };

  const knowledge = unit.knowledge || unit.concept || {};
  const currentChallengeQ = activeChallengeList[challengeIdx] || activeChallengeList[0] || (unit.challenges && unit.challenges[0]) || { question: '请选择正确答案', options: [] };
  const bossQuestions = unit.boss?.questions || [];
  const currentBossQ = bossQuestions[bossIdx] || bossQuestions[0] || { question: '准备迎击领主！', options: [] };

  return (
    <div className="m-modal-fullscreen">
      {/* 顶部标题栏 */}
      <div className="m-modal-header" style={{ background: unit.bgColor || 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
        <div className="m-header-left">
          <div className="m-modal-unit-icon">
            {unit.icon || '🏝️'}
          </div>
          <div>
            <div className="m-modal-unit-sub">第 {unit.number} 单元 · {unit.theme}</div>
            <h3 className="m-modal-unit-name">{unit.name}</h3>
          </div>
        </div>

        <button id="m-level-modal-close" className="m-modal-close-btn m-pressable" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* 步骤分段条 */}
      <div className="m-step-tabs">
        <button
          className={`m-step-tab m-pressable ${currentStep === 1 ? 'active' : ''}`}
          onClick={() => goToStep(1)}
        >
          <BookOpen size={14} />
          <span>学堂</span>
        </button>
        <button
          className={`m-step-tab m-pressable ${currentStep === 2 ? 'active' : ''}`}
          onClick={() => goToStep(2)}
        >
          <Wrench size={14} />
          <span>工坊</span>
        </button>
        <button
          className={`m-step-tab m-pressable ${currentStep === 3 ? 'active' : ''}`}
          onClick={() => goToStep(3)}
        >
          <Swords size={14} />
          <span>挑战</span>
        </button>
        <button
          className={`m-step-tab m-pressable ${currentStep === 4 ? 'active' : ''}`}
          onClick={() => goToStep(4)}
        >
          <Crown size={14} />
          <span>Boss战</span>
        </button>
      </div>

      {/* 主体滚动区 */}
      <div className="m-modal-scroll-body">
        {/* Step 1: 魔法学堂 */}
        {currentStep === 1 && (
          <div className="m-subview-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4F46E5', background: '#EEF2FF', padding: '3px 8px', borderRadius: 9999 }}>
                📖 核心知识点导学
              </span>
              <button
                className="m-pressable"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#B45309',
                  background: '#FEF3C7',
                  padding: '4px 10px',
                  borderRadius: 9999
                }}
                onClick={() => handleSpeak(`${unit.name}。${knowledge.concept || ''}。顺口溜：${knowledge.tips || ''}`)}
              >
                <Volume2 size={14} />
                <span>{isSpeaking ? '停止' : '朗读'}</span>
              </button>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: 8, color: '#1E293B' }}>
              💡 核心概念点解
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
              {knowledge.concept || unit.summary || '掌握知识点核心概念，探索更多数理奥秘！'}
            </p>

            {knowledge.tips && (
              <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', padding: '10px 12px', borderRadius: 6, margin: '12px 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', marginBottom: 2 }}>🌟 记忆顺口溜</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#78350F', lineHeight: 1.5 }}>{knowledge.tips}</div>
              </div>
            )}

            {knowledge.formula && (
              <div style={{ background: '#F0FDF4', border: '1.5px dashed #86EFAC', padding: '10px 12px', borderRadius: 8, margin: '12px 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', marginBottom: 2 }}>⚡ 核心法则 / 公式</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>{knowledge.formula}</div>
              </div>
            )}

            {knowledge.examples && knowledge.examples.length > 0 && (
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: 8, margin: '12px 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', marginBottom: 4 }}>🌈 生活中的趣味实例</div>
                <ul style={{ paddingLeft: 18, fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                  {knowledge.examples.map((eg, idx) => (
                    <li key={idx}>{eg}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="m-enter-btn m-pressable"
              style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '12px 0', fontSize: '0.95rem' }}
              onClick={() => goToStep(2)}
            >
              <span>前往具象工坊动手实验</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: 具象工坊 */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: 12 }}>
              {renderLab()}
            </div>
            <button
              className="m-enter-btn m-pressable"
              style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '12px 0', fontSize: '0.95rem' }}
              onClick={() => goToStep(3)}
            >
              <span>实验完成！开启趣味挑战</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: 趣味挑战 */}
        {currentStep === 3 && (
          <div>
            {challengeCompleted ? (
              <div className="m-subview-wrapper" style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>🎉</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B', marginBottom: 6 }}>
                  趣味挑战全员通关！
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 18 }}>
                  你已经掌握了本单元核心考点，准备好面对强大的守关领主了吗？
                </p>
                <button
                  className="m-enter-btn m-pressable"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: '1rem', background: '#DC2626' }}
                  onClick={() => goToStep(4)}
                >
                  <Flame size={18} />
                  <span>挑战领主 Boss！</span>
                </button>
              </div>
            ) : (
              <div className="m-subview-wrapper">
                {/* 顶栏：生命与连胜 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        size={18}
                        className={i < hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}
                        style={{ color: i < hearts ? '#F43F5E' : '#CBD5E1', fill: i < hearts ? '#F43F5E' : 'transparent' }}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>
                    第 {challengeIdx + 1} / {activeChallengeList.length} 题
                  </span>
                </div>

                {/* 难度切换 */}
                {unit.challengesByDifficulty && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    {[
                      { key: 'easy', label: '基础' },
                      { key: 'medium', label: '进阶' },
                      { key: 'hard', label: '奥数' }
                    ].map(d => (
                      <button
                        key={d.key}
                        className={`m-chip-btn m-pressable ${difficulty === d.key ? 'active' : ''}`}
                        onClick={() => {
                          setDifficulty(d.key);
                          setChallengeIdx(0);
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* 题干 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.5 }}>
                    {currentChallengeQ.question}
                  </h4>
                  <button
                    className="m-icon-btn m-pressable"
                    onClick={() => handleSpeak(currentChallengeQ.question)}
                    title="读题"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {/* 选项 */}
                <div className="m-options-col">
                  {shuffledChallengeOptions.map((opt, oIdx) => {
                    const isSelected = selectedAns === oIdx;
                    let optClass = '';
                    if (selectedAns !== null) {
                      if (opt.isCorrect) optClass = 'correct';
                      else if (isSelected) optClass = 'wrong';
                    }

                    return (
                      <button
                        key={oIdx}
                        className={`m-quiz-opt-btn m-pressable ${optClass}`}
                        disabled={selectedAns !== null}
                        onClick={() => handleAnswerChallenge(opt, oIdx)}
                      >
                        <span className="m-opt-badge">{String.fromCharCode(65 + oIdx)}</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 解析与下一题 */}
                {showExplanation && (
                  <div style={{ marginTop: 14, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>💡 题目解析：</div>
                    <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                      {currentChallengeQ.explanation || '理解题干关键概念，理清数量关系即可迎刃而解！'}
                    </div>

                    <button
                      className="m-enter-btn m-pressable"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '10px 0' }}
                      onClick={nextChallenge}
                    >
                      <span>{challengeIdx + 1 < activeChallengeList.length ? '下一题' : '完成挑战'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: 领主Boss战 */}
        {currentStep === 4 && (
          <div>
            {bossDefeated ? (
              <div className="m-subview-wrapper" style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ fontSize: '3.2rem', marginBottom: 8 }}>🏆</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1E293B', marginBottom: 6 }}>
                  击败领主 Boss！荣获本单元黄金勋章！
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20 }}>
                  恭喜你成功征服【{unit.name}】，智慧值与勋章已收入你的荣耀殿堂！
                </p>
                <button
                  className="m-enter-btn m-pressable"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: '1rem' }}
                  onClick={onClose}
                >
                  <Award size={18} />
                  <span>收下勋章，返回大地图</span>
                </button>
              </div>
            ) : (
              <div>
                {/* Boss 血条卡片 */}
                <div className="m-boss-header">
                  <div className="m-boss-info">
                    <div className="m-boss-avatar">
                      {unit.boss?.avatar || '👾'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 900 }}>{unit.boss?.name || '守关领主'}</span>
                        <span style={{ fontSize: '0.78rem', color: '#F87171', fontWeight: 800 }}>
                          HP: {bossHp} / {unit.boss?.hp || 3}
                        </span>
                      </div>
                      <div className="m-boss-hp-track">
                        <div
                          className="m-boss-hp-fill"
                          style={{ width: `${(bossHp / (unit.boss?.hp || 3)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boss 题目 */}
                <div className="m-subview-wrapper">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.5 }}>
                      {currentBossQ.question}
                    </h4>
                    <button
                      className="m-icon-btn m-pressable"
                      onClick={() => handleSpeak(currentBossQ.question)}
                      title="读题"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  <div className="m-options-col">
                    {shuffledBossOptions.map((opt, oIdx) => {
                      const isSelected = bossAns === oIdx;
                      let optClass = '';
                      if (bossAns !== null) {
                        if (opt.isCorrect) optClass = 'correct';
                        else if (isSelected) optClass = 'wrong';
                      }

                      return (
                        <button
                          key={oIdx}
                          className={`m-quiz-opt-btn m-pressable ${optClass}`}
                          disabled={bossAns !== null}
                          onClick={() => handleBossAnswer(opt, oIdx)}
                        >
                          <span className="m-opt-badge">{String.fromCharCode(65 + oIdx)}</span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {bossShowExp && (
                    <div style={{ marginTop: 14, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>💡 领主绝学解析：</div>
                      <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                        {currentBossQ.explanation || '沉着冷静，公式记牢，一击制胜！'}
                      </div>

                      <button
                        className="m-enter-btn m-pressable"
                        style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '10px 0' }}
                        onClick={nextBossQuestion}
                      >
                        <span>{bossHp <= 1 ? '给予领主最终一击！' : '迎击下一个回合'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
