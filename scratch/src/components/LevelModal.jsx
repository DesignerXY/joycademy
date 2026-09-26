import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { recordQuestionResult, completeUnitStep } from '../utils/storage';

// 具象工坊组件
import ClockLab from './labs/ClockLab';
import FractionLab from './labs/FractionLab';
import GeoLab from './labs/GeoLab';
import CompassLab from './labs/CompassLab';
import ScaleLab from './labs/ScaleLab';
import VennLab from './labs/VennLab';
import CalendarLab from './labs/CalendarLab';
import UniversalLab from './labs/UniversalLab';
import StickmanRelayModal from './StickmanRelayModal';

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
  HelpCircle,
  Flame,
  ShieldAlert
} from 'lucide-react';

export default function LevelModal({
  unit,
  profile,
  subject = profile?.subject || 'math',
  grade = profile?.grade || 3,
  onClose,
  onProfileUpdated
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: 魔法学堂, 2: 具象工坊, 3: 趣味挑战, 4: 领主Boss战

  // 难度等级模式状态: 'easy' (基础筑基), 'medium' (能力跃升), 'hard' (思维拔高/奥数)
  const [difficulty, setDifficulty] = useState('medium');
  const [showStickmanRelay, setShowStickmanRelay] = useState(false);

  // 趣味挑战状态
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // 选项随机打乱状态（确保每次出现顺序均不同）
  const [shuffledChallengeOptions, setShuffledChallengeOptions] = useState([]);
  const [shuffledBossOptions, setShuffledBossOptions] = useState([]);

  // Boss战状态
  const [bossIdx, setBossIdx] = useState(0);
  const [bossHp, setBossHp] = useState(unit.boss?.hp || 3);
  const [bossAns, setBossAns] = useState(null);
  const [bossShowExp, setBossShowExp] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  // 清洗选项前缀中的 A. B. C. D. 防止打乱后出现重叠前缀
  const cleanOptionText = (text) => {
    if (!text) return '';
    return String(text).replace(/^[A-Da-d][.、:：\s]+/, '').trim();
  };

  // 动态根据难度自适应题目池
  const activeChallengeList = React.useMemo(() => {
    const all = unit.challenges || [];
    if (all.length === 0) return [];

    if (difficulty === 'easy') {
      const easyOnes = all.filter(q => q.difficulty === 'easy');
      if (easyOnes.length > 0) return easyOnes;
      return all.slice(0, Math.max(1, Math.ceil(all.length / 2)));
    }
    if (difficulty === 'hard') {
      const hardOnes = all.filter(
        q => q.difficulty === 'hard' || (q.question && (q.question.includes('拔高') || q.question.includes('变种') || q.question.includes('奥数') || q.question.includes('挑战')))
      );
      if (hardOnes.length > 0) return hardOnes;
      return all.slice(Math.floor(all.length / 2));
    }
    return all;
  }, [unit.challenges, difficulty]);

  // 当关卡挑战题改变时，洗牌随机重排选项次序
  useEffect(() => {
    const q = activeChallengeList[challengeIdx] || unit.challenges?.[0];
    if (!q || !q.options) return;
    const list = q.options.map((opt, originalIdx) => ({
      text: cleanOptionText(opt),
      originalIdx,
      isCorrect: originalIdx === q.answer
    }));
    // Fisher-Yates 洗牌算法
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setShuffledChallengeOptions(list);
    setSelectedAns(null);
    setShowExplanation(false);
  }, [challengeIdx, difficulty, unit, activeChallengeList]);

  // 当 Boss 战题目改变时，洗牌随机重排选项次序
  useEffect(() => {
    const q = unit.boss?.questions?.[bossIdx];
    if (!q || !q.options) return;
    const list = q.options.map((opt, originalIdx) => ({
      text: cleanOptionText(opt),
      originalIdx,
      isCorrect: originalIdx === q.answer
    }));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setShuffledBossOptions(list);
    setBossAns(null);
    setBossShowExp(false);
  }, [bossIdx, unit, currentStep]);

  // 播放或停止语音切换
  const handleSpeak = (text) => {
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speech.speak(text, () => {
      setIsSpeaking(false);
    });
  };

  // 切换四阶主步骤
  const goToStep = (step) => {
    sound.playClick();
    speech.stop();
    setIsSpeaking(false);
    setCurrentStep(step);
    // 存档第一或第二步
    if (step === 2) {
      completeUnitStep(subject, grade, unit.id, 1);
      onProfileUpdated();
    }
  };

  // 具象工坊完成
  const handleLabDone = () => {
    sound.playCorrect();
    completeUnitStep(subject, grade, unit.id, 2);
    onProfileUpdated();
    goToStep(3);
  };

  // 趣味挑战：答题 (optItem 携带随机乱序后的 isCorrect 与 originalIdx)
  const handleChallengeAnswer = (optItem, displayIdx) => {
    if (selectedAns !== null) return; // 已选定
    const q = activeChallengeList[challengeIdx] || unit.challenges[0];
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
    onProfileUpdated();
  };

  // 下一道挑战题
  const nextChallenge = () => {
    sound.playClick();
    speech.stop();
    setIsSpeaking(false);
    setSelectedAns(null);
    setShowExplanation(false);

    if (challengeIdx + 1 < activeChallengeList.length) {
      setChallengeIdx(prev => prev + 1);
    } else {
      // 挑战通关
      sound.playFanfare();
      setChallengeCompleted(true);
      completeUnitStep(subject, grade, unit.id, 3);
      onProfileUpdated();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Boss战：答题 (optItem 携带随机乱序后的 isCorrect 与 originalIdx)
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
    onProfileUpdated();
  };

  // 下一道Boss题
  const nextBossQuestion = () => {
    sound.playClick();
    speech.stop();
    setIsSpeaking(false);
    setBossAns(null);
    setBossShowExp(false);

    if (bossIdx + 1 < unit.boss.questions.length && bossHp > 1) {
      setBossIdx(prev => prev + 1);
    } else {
      // Boss 被彻底击败！
      sound.playVictory();
      setBossDefeated(true);
      completeUnitStep(subject, grade, unit.id, 4);
      onProfileUpdated();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FF69B4', '#00CED1', '#7B68EE']
      });
    }
  };

  // 渲染具象工坊
  const renderLab = () => {
    switch (unit.labType) {
      case 'clock':
        return <ClockLab labData={unit.labData} onComplete={() => {}} />;
      case 'fraction':
        return <FractionLab onComplete={() => {}} />;
      case 'geo':
      case 'area':
        return <GeoLab isAreaMode={unit.labType === 'area'} onComplete={() => {}} />;
      case 'compass':
        return <CompassLab onComplete={() => {}} />;
      case 'scale':
        return <ScaleLab onComplete={() => {}} />;
      case 'venn':
        return <VennLab onComplete={() => {}} />;
      case 'calendar':
        return <CalendarLab onComplete={() => {}} />;
      default:
        return <UniversalLab unit={unit} onComplete={() => {}} />;
    }
  };

  const currentChallengeQ = activeChallengeList[challengeIdx] || activeChallengeList[0] || unit.challenges[0];
  const currentBossQ = unit.boss.questions[bossIdx] || unit.boss.questions[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="level-modal" onClick={e => e.stopPropagation()}>
        {/* 顶部标题栏与关闭按钮 */}
        <div className="level-modal-header" style={{ background: unit.bgColor }}>
          <div className="header-left">
            <span className="unit-icon-large">{unit.icon}</span>
            <div>
              <div className="unit-subtitle">
                第 {unit.number} 单元 · {unit.theme}
              </div>
              <h2 className="unit-main-title">{unit.name}</h2>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 四阶导航步骤条 */}
        <div className="step-tabs-bar">
          <button
            className={`step-tab-item ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => goToStep(1)}
          >
            <BookOpen size={16} />
            <span>1. 魔法学堂</span>
          </button>
          <button
            className={`step-tab-item ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => goToStep(2)}
          >
            <Wrench size={16} />
            <span>2. 具象工坊</span>
          </button>
          <button
            className={`step-tab-item ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => goToStep(3)}
          >
            <Swords size={16} />
            <span>3. 趣味挑战</span>
          </button>
          <button
            className={`step-tab-item ${currentStep === 4 ? 'active' : ''}`}
            onClick={() => goToStep(4)}
          >
            <Crown size={16} />
            <span>4. 领主Boss战</span>
          </button>
        </div>

        {/* 核心内容区 */}
        <div className="level-modal-content">
          {/* ========== STEP 1: 魔法学堂 ========== */}
          {currentStep === 1 && (
            <div className="step-content step-school">
              <div className="school-card">
                <div className="card-top-bar">
                  <span className="badge-tag">📖 名师趣味导学</span>
                  <button
                    className={`audio-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                    onClick={() =>
                      handleSpeak(
                        `${unit.name}。${unit.knowledge.concept}。顺口溜：${unit.knowledge.tips}`
                      )
                    }
                  >
                    <Volume2 size={16} /> {isSpeaking ? '停止朗读' : '语音伴读'}
                  </button>
                </div>

                <div className="concept-section">
                  <h3>💡 核心概念点解：</h3>
                  <p className="concept-text">{unit.knowledge.concept}</p>
                </div>

                <div className="rhyme-box">
                  <span className="rhyme-label">🌟 记忆顺口溜：</span>
                  <span className="rhyme-body">{unit.knowledge.tips}</span>
                </div>

                <div className="formula-box">
                  <span className="formula-title">📐 核心定律与公式：</span>
                  <div className="formula-highlight-large">{unit.knowledge.formula}</div>
                </div>

                <div className="examples-section">
                  <h4>🌈 生活中的趣味实例：</h4>
                  <ul>
                    {unit.knowledge.examples.map((eg, i) => (
                      <li key={i}>{eg}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="step-footer-actions">
                <button className="primary-action-btn" onClick={() => goToStep(2)}>
                  <span>掌握概念，进入【具象工坊】动手实验</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 2: 具象工坊 ========== */}
          {currentStep === 2 && (
            <div className="step-content step-lab">
              {renderLab()}
              <div className="step-footer-actions">
                <button className="primary-action-btn" onClick={handleLabDone}>
                  <span>实验探索完成，开启【趣味挑战】</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 3: 趣味挑战 ========== */}
          {currentStep === 3 && (
            <div className="step-content step-challenges">
              {!challengeCompleted ? (
                <div className="challenge-arena">
                  {/* 难度等级切换器 */}
                  <div className="difficulty-mode-bar">
                    <span className="diff-title">🎯 挑战难度：</span>
                    <div className="diff-btn-group">
                      <button
                        className={`diff-tag-btn easy ${difficulty === 'easy' ? 'active' : ''}`}
                        onClick={() => {
                          sound.playClick();
                          setDifficulty('easy');
                          setChallengeIdx(0);
                          setSelectedAns(null);
                          setShowExplanation(false);
                        }}
                      >
                        🟢 基础筑基
                      </button>
                      <button
                        className={`diff-tag-btn medium ${difficulty === 'medium' ? 'active' : ''}`}
                        onClick={() => {
                          sound.playClick();
                          setDifficulty('medium');
                          setChallengeIdx(0);
                          setSelectedAns(null);
                          setShowExplanation(false);
                        }}
                      >
                        🟡 能力跃升
                      </button>
                      <button
                        className={`diff-tag-btn hard ${difficulty === 'hard' ? 'active' : ''}`}
                        onClick={() => {
                          sound.playClick();
                          setDifficulty('hard');
                          setChallengeIdx(0);
                          setSelectedAns(null);
                          setShowExplanation(false);
                        }}
                      >
                        🔴 思维拔高(奥数)
                      </button>
                    </div>
                  </div>

                  {/* 状态栏：生命值、题号、连击 */}
                  <div className="challenge-status-bar">
                    <div className="hearts-box">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Heart
                          key={i}
                          size={22}
                          className={i < hearts ? 'heart-full' : 'heart-empty'}
                        />
                      ))}
                    </div>
                    <div className="question-progress-tag">
                      第 {challengeIdx + 1} / {activeChallengeList.length} 题
                    </div>
                    {streak > 1 && (
                      <div className="streak-tag">
                        🔥 连击 × {streak}
                      </div>
                    )}
                  </div>

                  {/* 题干卡片 */}
                  <div className="question-card">
                    <div className="question-header">
                      <span className="q-badge">关卡题目 · {difficulty === 'easy' ? '基础' : difficulty === 'hard' ? '拔高奥数' : '标准'}</span>
                      <button
                        className={`audio-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(currentChallengeQ.question)}
                      >
                        <Volume2 size={16} /> {isSpeaking ? '停止' : '读题'}
                      </button>
                    </div>
                    <h3 className="question-title">{currentChallengeQ.question}</h3>

                    {/* 选项按钮 (每次出现随机打乱顺序) */}
                    <div className="options-grid">
                      {shuffledChallengeOptions.map((optItem, displayIdx) => {
                        let btnStyle = 'option-btn';
                        if (selectedAns !== null) {
                          if (optItem.isCorrect) {
                            btnStyle += ' correct';
                          } else if (displayIdx === selectedAns) {
                            btnStyle += ' wrong';
                          }
                        }
                        return (
                          <button
                            key={displayIdx}
                            className={btnStyle}
                            onClick={() => handleChallengeAnswer(optItem, displayIdx)}
                            disabled={selectedAns !== null}
                          >
                            <span className="opt-letter">
                              {['A', 'B', 'C', 'D'][displayIdx]}
                            </span>
                            <span className="opt-text">{optItem.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* 答题后解析 */}
                    {showExplanation && (
                      <div
                        className={`explanation-card ${
                          shuffledChallengeOptions[selectedAns]?.isCorrect ? 'success' : 'failed'
                        }`}
                      >
                        <div className="exp-status">
                          {shuffledChallengeOptions[selectedAns]?.isCorrect ? (
                            <>
                              <CheckCircle2 size={20} className="text-emerald" />
                              <strong>回答正确！太聪明了！获得 +5 金币与经验值！</strong>
                            </>
                          ) : (
                            <>
                              <HelpCircle size={20} className="text-rose" />
                              <strong>哎呀答错了，别灰心，已经为你收录进【错题本】！</strong>
                            </>
                          )}
                        </div>
                        <p className="exp-body">
                          <strong>名师点拨：</strong>
                          {currentChallengeQ.explanation}
                        </p>
                        <button className="primary-action-btn next-btn" onClick={nextChallenge}>
                          <span>下一题</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="challenge-success-view">
                  <Award size={64} className="text-amber animate-bounce" />
                  <h2>🎉 恭喜！本单元趣味挑战全部通关！</h2>
                  <p>你已经熟练掌握了该单元的基础知识点，获得了 1 星战绩与 20 金币！</p>
                  <button className="primary-action-btn" onClick={() => goToStep(4)}>
                    <span>前往【领主Boss战】，赢取岛屿黄金徽章！</span>
                    <Crown size={20} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 4: 领主Boss战 ========== */}
          {currentStep === 4 && (
            <div className="step-content step-boss">
              {!bossDefeated ? (
                <div className="boss-battle-arena">
                  {/* Boss 对决抬头 */}
                  <div className="boss-profile-bar">
                    <div className="boss-avatar-box">
                      <span className="boss-emoji">{unit.boss.avatar}</span>
                    </div>
                    <div className="boss-info">
                      <div className="boss-name-row">
                        <span className="boss-title">👑 {unit.boss.title}</span>
                        <h3>{unit.boss.name}</h3>
                      </div>
                      <div className="boss-hp-track">
                        <div
                          className="boss-hp-fill"
                          style={{
                            width: `${(bossHp / (unit.boss.hp || 3)) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="hp-text">Boss 生命值：{bossHp} / {unit.boss.hp || 3}</span>
                    </div>
                  </div>

                  {/* Boss 试炼考题 */}
                  <div className="question-card boss-question-card">
                    <div className="question-header">
                      <span className="q-badge boss-badge">Boss 终极大考验 · 第 {bossIdx + 1} 关</span>
                      <button
                        className={`audio-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(currentBossQ.question)}
                      >
                        <Volume2 size={16} /> {isSpeaking ? '停止' : '读题'}
                      </button>
                    </div>
                    <h3 className="question-title">{currentBossQ.question}</h3>

                    <div className="options-grid">
                      {shuffledBossOptions.map((optItem, displayIdx) => {
                        let btnStyle = 'option-btn boss-opt';
                        if (bossAns !== null) {
                          if (optItem.isCorrect) {
                            btnStyle += ' correct';
                          } else if (displayIdx === bossAns) {
                            btnStyle += ' wrong';
                          }
                        }
                        return (
                          <button
                            key={displayIdx}
                            className={btnStyle}
                            onClick={() => handleBossAnswer(optItem, displayIdx)}
                            disabled={bossAns !== null}
                          >
                            <span className="opt-letter">
                              {['A', 'B', 'C', 'D'][displayIdx]}
                            </span>
                            <span className="opt-text">{optItem.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {bossShowExp && (
                      <div
                        className={`explanation-card ${
                          shuffledBossOptions[bossAns]?.isCorrect ? 'success' : 'failed'
                        }`}
                      >
                        <div className="exp-status">
                          {shuffledBossOptions[bossAns]?.isCorrect ? (
                            <>
                              <CheckCircle2 size={20} className="text-emerald" />
                              <strong>暴击命中 Boss！Boss 受到 1 点真理伤害！</strong>
                            </>
                          ) : (
                            <>
                              <HelpCircle size={20} className="text-rose" />
                              <strong>被 Boss 防御住了，仔细思考题目解析！</strong>
                            </>
                          )}
                        </div>
                        <p className="exp-body">
                          <strong>名师点拨：</strong>
                          {currentBossQ.explanation}
                        </p>
                        <button className="primary-action-btn next-btn" onClick={nextBossQuestion}>
                          <span>继续进攻！</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="boss-defeat-view">
                  <div className="defeat-crown">👑</div>
                  <h2>🏆 胜利！【{unit.boss.name}】被彻底征服！</h2>
                  <p>你获得了 3 星完美评价，解锁了该岛屿的最高荣誉勋章！</p>

                  <div className="badge-reward-showcase">
                    <span className="badge-big-icon">{unit.boss.badge.icon}</span>
                    <div className="badge-reward-text">
                      <h4>{unit.boss.badge.name}</h4>
                      <p>{unit.boss.badge.desc}</p>
                    </div>
                  </div>

                  {/* 火柴人接力交接仪式入口 */}
                  <div className="victory-relay-action-box mt-3">
                    <button
                      className="relay-ceremony-btn"
                      onClick={() => {
                        sound.playLevelUp();
                        setShowStickmanRelay(true);
                      }}
                    >
                      <Flame size={20} className="text-amber animate-pulse" />
                      <span>启动【火柴人火炬交接与胜利仪式】➔</span>
                    </button>
                  </div>

                  <button
                    className="primary-action-btn mt-3"
                    onClick={() => {
                      sound.playClick();
                      onClose();
                    }}
                  >
                    <span>返回冒险大地图</span>
                    <Sparkles size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 火柴人接力仪式弹窗 */}
      {showStickmanRelay && (
        <StickmanRelayModal
          currentGrade={grade}
          currentSubject={subject}
          onContinue={() => {
            setShowStickmanRelay(false);
            onClose();
          }}
          onClose={() => setShowStickmanRelay(false)}
        />
      )}
    </div>
  );
}
