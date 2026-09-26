import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { feedPet, patPet, switchPetType } from '../utils/storage';
import { Sparkles, Heart, Zap, Volume2, Coins, ChevronDown, ChevronUp, X, Smile } from 'lucide-react';

const PET_TYPES = [
  { id: 'dragon', name: '算术小神龙', emoji: '🐲', title: '数理逻辑守护者', specialty: '数学计算与几何空间' },
  { id: 'cat', name: '智慧魔法猫', emoji: '🐱', title: '博雅文采小书童', specialty: '字词古诗与阅读理解' },
  { id: 'rabbit', name: '机械跳跳兔', emoji: '🐰', title: '万物科学探索先锋', specialty: '自然实验与微观探索' },
  { id: 'canary', name: '双语金丝雀', emoji: '🐥', title: '英语口语留声机', specialty: '自然拼读与日常会话' }
];

const SUBJECT_ENCOURAGEMENTS = {
  math: [
    '把大数拆一拆，口算就像吃布丁一样简单！',
    '多做动手天平与几何割补实验，数学原理一清二楚！',
    '答错了没关系，错题本是最好的进步法宝！',
    '数形结合百般好，割裂分家万事休！',
    '遇到难题在草稿纸上画一画，答案马上浮现出来！'
  ],
  chinese: [
    '学而时习之，不亦说乎！今日多读两首经典古诗吧！',
    '好词好句常积累，写起作文如神助！',
    '不动笔墨不读书，遇到精妙生字圈一圈！',
    '读书破万卷，下笔如有神！',
    '多声朗读课文，语感自然就会越来越好！'
  ],
  english: [
    'Practice makes perfect! 一起大声朗读吧！',
    'Listen carefully! 英文发音最讲究自然流畅！',
    'Every word you learn is a key to the big world!',
    'Great job! 你的发音越来越像纯正英语小学霸啦！',
    '抓住句子里的关键词，听力理解一点也不难！'
  ],
  science: [
    '善于提出“为什么”，你就是未来的小小科学家！',
    '观察电路与生态链，自然界的秘密都在实验里！',
    '科学探索始于好奇，忠于实证！',
    '放大镜下的微观世界，藏着大自然的大智慧！',
    '多动手、勤思考，探究万物运行的奇妙规律！'
  ]
};

export default function PetCompanion({ profile, onFeedPet }) {
  const currentSubject = profile.subject || 'math';
  const currentGrade = profile.grade || 3;

  const encouragements = SUBJECT_ENCOURAGEMENTS[currentSubject] || SUBJECT_ENCOURAGEMENTS.math;

  const [currentSpeech, setCurrentSpeech] = useState(encouragements[0]);
  const [showSpeech, setShowSpeech] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const petData = profile.pet || { name: '算术小神龙', level: 1, exp: 0, type: 'dragon' };
  const currentPetConfig = PET_TYPES.find(p => p.id === petData.type) || PET_TYPES[0];

  // 轮播激励标语
  useEffect(() => {
    const timer = setInterval(() => {
      if (!showDrawer) {
        const randomText = encouragements[Math.floor(Math.random() * encouragements.length)];
        setCurrentSpeech(randomText);
        setShowSpeech(true);
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [encouragements, showDrawer]);

  // 点击朗读小神龙的话
  const handleVoiceSpeak = (e) => {
    e.stopPropagation();
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speech.speak(currentSpeech, () => {
      setIsSpeaking(false);
    });
  };

  // 点击小精灵头像，打开互动抽屉或触发欢呼
  const handlePetAvatarClick = () => {
    sound.playClick();
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 600);
    setShowDrawer(prev => !prev);
  };

  // 喂食灵果（消耗 5 金币）
  const handleFeed = () => {
    if ((profile.coins || 0) < 5) {
      sound.playWrong();
      alert('金币不足 5 枚哦！快去答题闯关赚取金币吧！🪙');
      return;
    }
    sound.playCoin();
    const prevLevel = petData.level || 1;
    feedPet();
    if (onFeedPet) onFeedPet();

    setFloatingHeart(true);
    setTimeout(() => setFloatingHeart(false), 1200);

    // 检查是否升级
    if ((petData.exp || 0) + 25 >= 100) {
      sound.playLevelUp();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.85, x: 0.9 } });
      } catch (e) {}
    }
  };

  // 抚摸互动（免费）
  const handlePat = () => {
    sound.playCorrect();
    patPet();
    if (onFeedPet) onFeedPet();

    setFloatingHeart(true);
    setIsInteracting(true);
    setTimeout(() => {
      setFloatingHeart(false);
      setIsInteracting(false);
    }, 1000);
  };

  // 切换萌宠形态
  const handleSwitchType = (typeId, name) => {
    sound.playClick();
    switchPetType(typeId, name);
    if (onFeedPet) onFeedPet();
  };

  // 最小化模式
  if (isMinimized) {
    return (
      <div
        className="pet-minimized-bubble"
        onClick={() => {
          sound.playClick();
          setIsMinimized(false);
        }}
        title="点击唤醒伴学小精灵"
      >
        <span className="minimized-emoji">{currentPetConfig.emoji}</span>
        <span className="minimized-lv">Lv.{petData.level || 1}</span>
      </div>
    );
  }

  return (
    <div className="pet-companion-widget">
      {/* 伴学小灵兽互动抽屉面板 */}
      {showDrawer && (
        <div className="pet-drawer-card">
          <div className="drawer-header">
            <div className="pet-info-title">
              <span className="drawer-pet-emoji">{currentPetConfig.emoji}</span>
              <div>
                <h4>{petData.name || currentPetConfig.name}</h4>
                <span className="pet-spec-tag">{currentPetConfig.title}</span>
              </div>
            </div>
            <button className="drawer-close-btn" onClick={() => setShowDrawer(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="pet-status-section">
            <div className="pet-exp-row">
              <span className="exp-label">🌟 等级 Lv.{petData.level || 1}</span>
              <span className="exp-val">EXP: {petData.exp || 0} / 100</span>
            </div>
            <div className="pet-progress-track">
              <div
                className="pet-progress-fill"
                style={{ width: `${Math.min(100, petData.exp || 0)}%` }}
              ></div>
            </div>
          </div>

          {/* 互动操作按钮组 */}
          <div className="pet-actions-grid">
            <button className="pet-action-btn feed-btn" onClick={handleFeed}>
              <Coins size={16} className="text-amber inline mr-1" />
              <span>喂食仙果 (-5🪙)</span>
            </button>
            <button className="pet-action-btn pat-btn" onClick={handlePat}>
              <Heart size={16} className="text-rose inline mr-1" />
              <span>抚摸亲昵 (+10经验)</span>
            </button>
          </div>

          {/* 切换形态 */}
          <div className="pet-switch-section">
            <div className="switch-title">🐾 选择你的伴学伙伴：</div>
            <div className="pet-avatars-selector">
              {PET_TYPES.map(p => (
                <button
                  key={p.id}
                  className={`avatar-choice-btn ${petData.type === p.id ? 'active' : ''}`}
                  onClick={() => handleSwitchType(p.id, p.name)}
                  title={`${p.name} · ${p.specialty}`}
                >
                  <span className="choice-emoji">{p.emoji}</span>
                  <span className="choice-name">{p.name.slice(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="drawer-footer-row">
            <button
              className="minimize-btn"
              onClick={() => {
                setShowDrawer(false);
                setIsMinimized(true);
              }}
            >
              最小化收起 ▾
            </button>
          </div>
        </div>
      )}

      {/* 气泡伴读对话框 */}
      {showSpeech && !showDrawer && (
        <div className="pet-speech-bubble">
          <p>{currentSpeech}</p>
          <div className="bubble-footer-actions">
            <button
              className={`bubble-voice-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={handleVoiceSpeak}
              title="点击语音朗读伴学箴言"
            >
              <Volume2 size={13} className="inline mr-1" />
              <span>{isSpeaking ? '播报中' : '听伴读'}</span>
            </button>
            <button className="bubble-close" onClick={() => setShowSpeech(false)}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* 伴学宠物精灵主体 */}
      <div
        className={`pet-avatar-wrapper ${isInteracting ? 'bounce-active' : ''}`}
        onClick={handlePetAvatarClick}
        title="点击打开伴学灵宠互动面板"
      >
        {floatingHeart && <span className="floating-heart-particle">💖 +10 EXP</span>}
        <span className="pet-emoji">{currentPetConfig.emoji}</span>
        <span className="pet-level-badge">Lv.{petData.level || 1}</span>
      </div>

      <div className="pet-name-tag" onClick={handlePetAvatarClick}>
        <Sparkles size={12} className="text-amber inline mr-1" />
        <span>{petData.name || currentPetConfig.name}</span>
      </div>
    </div>
  );
}
